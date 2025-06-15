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
 * Render the fans table.
 * @param {Array} fans
 */
function renderFansTable(fans) {
  const list = document.getElementById('fans-list');
  if (!list) return;
  if (!fans.length) {
    list.innerHTML = `<div class="alert alert-info">No fans found.</div>`;
    return;
  }
  list.innerHTML = `
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th><input type="checkbox" id="select-all-fans"></th>
          <th>Name</th>
          <th>Email</th>
          <th>Favorite Team</th>
          <th>Avatar</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="fans-tbody"></tbody>
    </table>
    <button class="btn btn-danger btn-sm mt-2" id="bulk-delete-fans-btn">Delete Selected</button>
  `;
  const tbody = document.getElementById('fans-tbody');
  fans.forEach(fan => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" class="fan-checkbox" value="${fan.id}"></td>
      <td>${sanitize(fan.name)}</td>
      <td>${sanitize(fan.email || "")}</td>
      <td>${sanitize(fan.favoriteTeam || "")}</td>
      <td>
        ${fan.avatarUrl ? `<img src="${sanitize(fan.avatarUrl)}" alt="Avatar" style="width:40px;height:40px;object-fit:cover;border-radius:50%;">` : ''}
      </td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="window.openEditFanModal('${fan.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="window.deleteFan('${fan.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Select all checkbox
  document.getElementById('select-all-fans').onclick = function() {
    document.querySelectorAll('.fan-checkbox').forEach(cb => cb.checked = this.checked);
  };

  // Bulk delete
  document.getElementById('bulk-delete-fans-btn').onclick = function() {
    const ids = Array.from(document.querySelectorAll('.fan-checkbox:checked')).map(cb => cb.value);
    bulkDeleteFans(ids);
  };
}

/**
 * Load fans from Firestore and render.
 */
export async function loadFans() {
  const q = query(collection(db, COLLECTIONS.fans), orderBy("name"));
  const snap = await getDocs(q);
  const fans = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  renderFansTable(fans);
}

/**
 * Bulk delete fans by IDs.
 * @param {string[]} ids
 */
export function bulkDeleteFans(ids) {
  if (!Array.isArray(ids) || !ids.length) {
    showMessage("No fans selected.", "warning");
    return;
  }
  showConfirm(`Delete ${ids.length} fans?`, async (confirmed) => {
    if (!confirmed) return;
    for (const id of ids) {
      await deleteFanById(id);
    }
    showMessage("Fans deleted!", "success");
    if (typeof loadFans === 'function') loadFans();
  });
}

/**
 * Delete a fan by ID (and avatar if present)
 */
async function deleteFanById(id) {
  try {
    const docRef = doc(db, COLLECTIONS.fans, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.avatarUrl) {
        try {
          const storage = getStorage();
          const avatarRef = ref(storage, data.avatarUrl);
          await deleteObject(avatarRef);
        } catch {}
      }
    }
    await deleteDoc(docRef);
    if (typeof logAudit === 'function') await logAudit("deleteFan", { id });
  } catch (err) {
    showMessage("Failed to delete fan.", "danger");
  }
}

// Single fan delete for row action
window.deleteFan = function(id) {
  showConfirm('Delete this fan?', async (confirmed) => {
    if (!confirmed) return;
    await deleteFanById(id);
    showMessage("Fan deleted!", "success");
    if (typeof loadFans === 'function') loadFans();
  });
};

/**
 * Show modal for adding or editing a fan.
 * @param {string|null} id
 */
window.openEditFanModal = async function(id = null) {
  let fan = {
    name: "",
    email: "",
    favoriteTeam: "",
    avatarUrl: ""
  };
  let isEdit = false;
  if (id) {
    const docSnap = await getDoc(doc(db, COLLECTIONS.fans, id));
    if (docSnap.exists()) {
      fan = { id, ...docSnap.data() };
      isEdit = true;
    }
  }
  // Modal HTML
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal" style="display:block;">
      <div class="modal-dialog">
        <form class="modal-content" id="fan-form">
          <div class="modal-header">
            <h5 class="modal-title">${isEdit ? 'Edit Fan' : 'Add Fan'}</h5>
            <button type="button" class="btn-close" id="close-modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" name="name" value="${sanitize(fan.name)}" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" name="email" value="${sanitize(fan.email)}">
            </div>
            <div class="mb-3">
              <label class="form-label">Favorite Team</label>
              <input type="text" class="form-control" name="favoriteTeam" value="${sanitize(fan.favoriteTeam)}">
            </div>
            <div class="mb-3">
              <label class="form-label">Avatar</label>
              <input type="file" class="form-control" name="avatar">
              ${fan.avatarUrl ? `<img src="${sanitize(fan.avatarUrl)}" style="width:60px;height:60px;object-fit:cover;margin-top:8px;border-radius:50%;">` : ''}
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
  modal.querySelector('#fan-form').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      favoriteTeam: form.favoriteTeam.value.trim()
    };
    let avatarUrl = fan.avatarUrl || "";
    const file = form.avatar.files[0];
    if (file) {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `fans/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        avatarUrl = await getDownloadURL(storageRef);
        // Optionally delete old avatar
        if (isEdit && fan.avatarUrl) {
          try {
            const oldRef = ref(storage, fan.avatarUrl);
            await deleteObject(oldRef);
          } catch {}
        }
      } catch (err) {
        showMessage("Avatar upload failed.", "danger");
        return;
      }
    }
    data.avatarUrl = avatarUrl;

    try {
      if (isEdit) {
        await updateDoc(doc(db, COLLECTIONS.fans, id), data);
        if (typeof logAudit === 'function') await logAudit("updateFan", { id, ...data });
        showMessage("Fan updated!", "success");
      } else {
        await addDoc(collection(db, COLLECTIONS.fans), data);
        if (typeof logAudit === 'function') await logAudit("createFan", data);
        showMessage("Fan added!", "success");
      }
      document.body.removeChild(modal);
      if (typeof loadFans === 'function') loadFans();
    } catch (err) {
      showMessage("Failed to save fan.", "danger");
    }
  };
};

/**
 * Initialize the Fans section.
 */
export function initFansSection() {
  const section = document.getElementById('fans-section');
  section.style.display = '';
  section.innerHTML = `
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Fans</h2>
      <button class="btn btn-primary" id="add-fan-btn">Add Fan</button>
    </div>
    <div id="fans-list">Loading fans...</div>
  `;
  document.getElementById('add-fan-btn').onclick = () => window.openEditFanModal();
  loadFans();
}