import { db, COLLECTIONS, showMessage, showConfirm, logAudit } from './admin.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// Utility to sanitize output
function sanitize(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"'`=\/]/g, s => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "`": "&#96;",
    "=": "&#61;",
    "/": "&#47;"
  })[s] || s);
}

/**
 * Render the audits table.
 * @param {Array} audits
 */
function renderAuditsTable(audits) {
  const list = document.getElementById('audits-list');
  if (!list) return;
  if (!audits.length) {
    list.innerHTML = `<div class="alert alert-info">No audit logs found.</div>`;
    return;
  }
  list.innerHTML = `
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th><input type="checkbox" id="select-all-audits"></th>
          <th>Action</th>
          <th>User</th>
          <th>Timestamp</th>
          <th>Details</th>
          <th>Attachment</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="audits-tbody"></tbody>
    </table>
    <button class="btn btn-danger btn-sm mt-2" id="bulk-delete-audits-btn">Delete Selected</button>
  `;
  const tbody = document.getElementById('audits-tbody');
  audits.forEach(audit => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" class="audit-checkbox" value="${audit.id}"></td>
      <td>${sanitize(audit.action)}</td>
      <td>${sanitize(audit.user || '')}</td>
      <td>${audit.timestamp ? sanitize(new Date(audit.timestamp).toLocaleString()) : ''}</td>
      <td><pre style="white-space:pre-wrap;font-size:0.95em;">${sanitize(JSON.stringify(audit.details || {}, null, 2))}</pre></td>
      <td>
        ${audit.attachmentUrl ? `<a href="${sanitize(audit.attachmentUrl)}" target="_blank" class="badge bg-info text-dark">Attachment</a>` : ''}
      </td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="window.openEditAuditModal('${audit.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="window.deleteAudit('${audit.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Select all checkbox
  document.getElementById('select-all-audits').onclick = function() {
    document.querySelectorAll('.audit-checkbox').forEach(cb => cb.checked = this.checked);
  };

  // Bulk delete
  document.getElementById('bulk-delete-audits-btn').onclick = function() {
    const ids = Array.from(document.querySelectorAll('.audit-checkbox:checked')).map(cb => cb.value);
    bulkDeleteAudits(ids);
  };
}

/**
 * Load audits from Firestore and render.
 */
export async function loadAudits() {
  const q = query(collection(db, COLLECTIONS.auditLogs), orderBy("timestamp", "desc"), limit(100));
  const snap = await getDocs(q);
  const audits = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  renderAuditsTable(audits);
}

/**
 * Bulk delete audits by IDs.
 * @param {string[]} ids
 */
export function bulkDeleteAudits(ids) {
  if (!Array.isArray(ids) || !ids.length) {
    showMessage("No audits selected.", "warning");
    return;
  }
  showConfirm(`Delete ${ids.length} audit logs?`, async (confirmed) => {
    if (!confirmed) return;
    for (const id of ids) {
      await deleteAuditById(id);
    }
    showMessage("Audit logs deleted!", "success");
    if (typeof loadAudits === 'function') loadAudits();
  });
}

/**
 * Delete an audit log by ID (and attachment if present)
 */
async function deleteAuditById(id) {
  try {
    const docRef = doc(db, COLLECTIONS.auditLogs, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.attachmentUrl) {
        try {
          const storage = getStorage();
          const attRef = ref(storage, data.attachmentUrl);
          await deleteObject(attRef);
        } catch {}
      }
    }
    await deleteDoc(docRef);
    if (typeof logAudit === 'function') await logAudit("deleteAudit", { id });
  } catch (err) {
    showMessage("Failed to delete audit log.", "danger");
  }
}

// Single audit delete for row action
window.deleteAudit = function(id) {
  showConfirm('Delete this audit log?', async (confirmed) => {
    if (!confirmed) return;
    await deleteAuditById(id);
    showMessage("Audit log deleted!", "success");
    if (typeof loadAudits === 'function') loadAudits();
  });
};

/**
 * Show modal for adding or editing an audit log.
 * @param {string|null} id
 */
window.openEditAuditModal = async function(id = null) {
  let audit = {
    action: "",
    user: "",
    timestamp: new Date().toISOString(),
    details: {},
    attachmentUrl: ""
  };
  let isEdit = false;
  if (id) {
    const docSnap = await getDoc(doc(db, COLLECTIONS.auditLogs, id));
    if (docSnap.exists()) {
      audit = { id, ...docSnap.data() };
      isEdit = true;
    }
  }
  // Modal HTML
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal" style="display:block;">
      <div class="modal-dialog">
        <form class="modal-content" id="audit-form">
          <div class="modal-header">
            <h5 class="modal-title">${isEdit ? 'Edit Audit Log' : 'Add Audit Log'}</h5>
            <button type="button" class="btn-close" id="close-modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Action</label>
              <input type="text" class="form-control" name="action" value="${sanitize(audit.action)}" required>
            </div>
            <div class="mb-3">
              <label class="form-label">User</label>
              <input type="text" class="form-control" name="user" value="${sanitize(audit.user)}">
            </div>
            <div class="mb-3">
              <label class="form-label">Timestamp</label>
              <input type="datetime-local" class="form-control" name="timestamp" value="${audit.timestamp ? sanitize(audit.timestamp).slice(0,16) : ''}">
            </div>
            <div class="mb-3">
              <label class="form-label">Details (JSON)</label>
              <textarea class="form-control" name="details" rows="3">${audit.details ? sanitize(JSON.stringify(audit.details, null, 2)) : ''}</textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Attachment</label>
              <input type="file" class="form-control" name="attachment">
              ${audit.attachmentUrl ? `<a href="${sanitize(audit.attachmentUrl)}" target="_blank" class="badge bg-info text-dark mt-1">Current Attachment</a>` : ''}
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-success">${isEdit ? 'Update' : 'Create'}</button>
            <button type="button" class="btn btn-secondary" id="close-modal2">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Close modal
  modal.querySelectorAll('#close-modal, #close-modal2').forEach(btn => {
    btn.onclick = () => document.body.removeChild(modal);
  });

  // Form submit
  modal.querySelector('#audit-form').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    let detailsObj = {};
    try {
      detailsObj = form.details.value.trim() ? JSON.parse(form.details.value) : {};
    } catch {
      showMessage("Details must be valid JSON.", "danger");
      return;
    }
    const data = {
      action: form.action.value.trim(),
      user: form.user.value.trim(),
      timestamp: form.timestamp.value,
      details: detailsObj
    };
    let attachmentUrl = audit.attachmentUrl || "";
    const file = form.attachment.files[0];
    if (file) {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `audits/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        attachmentUrl = await getDownloadURL(storageRef);
        // Optionally delete old attachment
        if (isEdit && audit.attachmentUrl) {
          try {
            const oldRef = ref(storage, audit.attachmentUrl);
            await deleteObject(oldRef);
          } catch {}
        }
      } catch (err) {
        showMessage("Attachment upload failed.", "danger");
        return;
      }
    }
    data.attachmentUrl = attachmentUrl;

    try {
      if (isEdit) {
        await updateDoc(doc(db, COLLECTIONS.auditLogs, id), data);
        if (typeof logAudit === 'function') await logAudit("updateAudit", { id, ...data });
        showMessage("Audit log updated!", "success");
      } else {
        await addDoc(collection(db, COLLECTIONS.auditLogs), data);
        if (typeof logAudit === 'function') await logAudit("createAudit", data);
        showMessage("Audit log added!", "success");
      }
      document.body.removeChild(modal);
      if (typeof loadAudits === 'function') loadAudits();
    } catch (err) {
      showMessage("Failed to save audit log.", "danger");
    }
  };
};

/**
 * Initialize the Audits section.
 */
export function initAuditsSection() {
  const section = document.getElementById('audits-section');
  section.style.display = '';
  section.innerHTML = `
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Audit Logs</h2>
      <button class="btn btn-primary" id="add-audit-btn">Add Audit Log</button>
    </div>
    <div id="audits-list">Loading audit logs...</div>
  `;
  document.getElementById('add-audit-btn').onclick = () => window.openEditAuditModal();
  loadAudits();
}