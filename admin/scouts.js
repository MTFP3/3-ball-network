import { db, COLLECTIONS, showMessage, showConfirm, logAudit } from './admin.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
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
 * Render the scouts table.
 * @param {Array} scouts
 */
function renderScoutsTable(scouts) {
  const list = document.getElementById('scouts-list');
  if (!list) return;
  if (!scouts.length) {
    list.innerHTML = `<div class="alert alert-info">No scouts found.</div>`;
    return;
  }
  list.innerHTML = `
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th><input type="checkbox" id="select-all-scouts"></th>
          <th>Name</th>
          <th>Organization</th>
          <th>Region</th>
          <th>Photo</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="scouts-tbody"></tbody>
    </table>
    <button class="btn btn-danger btn-sm mt-2" id="bulk-delete-scouts-btn">Delete Selected</button>
  `;
  const tbody = document.getElementById('scouts-tbody');
  scouts.forEach(scout => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" class="scout-checkbox" value="${scout.id}"></td>
      <td>${sanitize(scout.name)}</td>
      <td>${sanitize(scout.organization || "")}</td>
      <td>${sanitize(scout.region || "")}</td>
      <td>
        ${scout.photoUrl ? `<img src="${sanitize(scout.photoUrl)}" alt="Photo" style="width:40px;height:40px;object-fit:cover;border-radius:50%;">` : ''}
      </td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="window.openEditScoutModal('${scout.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="window.deleteScout('${scout.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Select all checkbox
  document.getElementById('select-all-scouts').onclick = function() {
    document.querySelectorAll('.scout-checkbox').forEach(cb => cb.checked = this.checked);
  };

  // Bulk delete
  document.getElementById('bulk-delete-scouts-btn').onclick = function() {
    const ids = Array.from(document.querySelectorAll('.scout-checkbox:checked')).map(cb => cb.value);
    bulkDeleteScouts(ids);
  };
}

/**
 * Load scouts from Firestore and render.
 */
export async function loadScouts() {
  const q = query(collection(db, COLLECTIONS.scouts), orderBy("name"));
  const snap = await getDocs(q);
  const scouts = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  renderScoutsTable(scouts);
}

/**
 * Bulk delete scouts by IDs.
 * @param {string[]} ids
 */
export function bulkDeleteScouts(ids) {
  if (!Array.isArray(ids) || !ids.length) {
    showMessage("No scouts selected.", "warning");
    return;
  }
  showConfirm(`Delete ${ids.length} scouts?`, async (confirmed) => {
    if (!confirmed) return;
    for (const id of ids) {
      await deleteScoutById(id);
    }
    showMessage("Scouts deleted!", "success");
    if (typeof loadScouts === 'function') loadScouts();
  });
}

/**
 * Delete a scout by ID (and photo if present)
 */
async function deleteScoutById(id) {
  try {
    const docRef = doc(db, COLLECTIONS.scouts, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.photoUrl) {
        try {
          const storage = getStorage();
          const photoRef = ref(storage, data.photoUrl);
          await deleteObject(photoRef);
        } catch {}
      }
    }
    await deleteDoc(docRef);
    if (typeof logAudit === 'function') await logAudit("deleteScout", { id });
  } catch (err) {
    showMessage("Failed to delete scout.", "danger");
  }
}

// Single scout delete for row action
window.deleteScout = function(id) {
  showConfirm('Delete this scout?', async (confirmed) => {
    if (!confirmed) return;
    await deleteScoutById(id);
    showMessage("Scout deleted!", "success");
    if (typeof loadScouts === 'function') loadScouts();
  });
};

/**
 * Show modal for adding or editing a scout.
 * @param {string|null} id
 */
window.openEditScoutModal = async function(id = null) {
  let scout = {
    name: "",
    organization: "",
    region: "",
    photoUrl: ""
  };
  let isEdit = false;
  if (id) {
    const docSnap = await getDoc(doc(db, COLLECTIONS.scouts, id));
    if (docSnap.exists()) {
      scout = { id, ...docSnap.data() };
      isEdit = true;
    }
  }
  // Modal HTML
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal" style="display:block;">
      <div class="modal-dialog">
        <form class="modal-content" id="scout-form">
          <div class="modal-header">
            <h5 class="modal-title">${isEdit ? 'Edit Scout' : 'Add Scout'}</h5>
            <button type="button" class="btn-close" id="close-modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" name="name" value="${sanitize(scout.name)}" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Organization</label>
              <input type="text" class="form-control" name="organization" value="${sanitize(scout.organization)}">
            </div>
            <div class="mb-3">
              <label class="form-label">Region</label>
              <input type="text" class="form-control" name="region" value="${sanitize(scout.region)}">
            </div>
            <div class="mb-3">
              <label class="form-label">Photo</label>
              <input type="file" class="form-control" name="photo">
              ${scout.photoUrl ? `<img src="${sanitize(scout.photoUrl)}" style="width:60px;height:60px;object-fit:cover;margin-top:8px;border-radius:50%;">` : ''}
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
  modal.querySelector('#scout-form').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value.trim(),
      organization: form.organization.value.trim(),
      region: form.region.value.trim()
    };
    let photoUrl = scout.photoUrl || "";
    const file = form.photo.files[0];
    if (file) {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `scouts/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        photoUrl = await getDownloadURL(storageRef);
        // Optionally delete old photo
        if (isEdit && scout.photoUrl) {
          try {
            const oldRef = ref(storage, scout.photoUrl);
            await deleteObject(oldRef);
          } catch {}
        }
      } catch (err) {
        showMessage("Photo upload failed.", "danger");
        return;
      }
    }
    data.photoUrl = photoUrl;

    try {
      if (isEdit) {
        await updateDoc(doc(db, COLLECTIONS.scouts, id), data);
        if (typeof logAudit === 'function') await logAudit("updateScout", { id, ...data });
        showMessage("Scout updated!", "success");
      } else {
        await addDoc(collection(db, COLLECTIONS.scouts), data);
        if (typeof logAudit === 'function') await logAudit("createScout", data);
        showMessage("Scout added!", "success");
      }
      document.body.removeChild(modal);
      if (typeof loadScouts === 'function') loadScouts();
    } catch (err) {
      showMessage("Failed to save scout.", "danger");
    }
  };
};

/**
 * Initialize the Scouts section.
 */
export function initScoutsSection() {
  const section = document.getElementById('scouts-section');
  section.style.display = '';
  section.innerHTML = `
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Scouts</h2>
      <button class="btn btn-primary" id="add-scout-btn">Add Scout</button>
    </div>
    <div id="scouts-list">Loading scouts...</div>
  `;
  document.getElementById('add-scout-btn').onclick = () => window.openEditScoutModal();
  loadScouts();
}