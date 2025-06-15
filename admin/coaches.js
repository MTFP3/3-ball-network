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
 * Render the coaches table.
 * @param {Array} coaches
 */
function renderCoachesTable(coaches) {
  const list = document.getElementById('coaches-list');
  if (!list) return;
  if (!coaches.length) {
    list.innerHTML = `<div class="alert alert-info">No coaches found.</div>`;
    return;
  }
  list.innerHTML = `
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th><input type="checkbox" id="select-all-coaches"></th>
          <th>Name</th>
          <th>Team</th>
          <th>Role</th>
          <th>Photo</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="coaches-tbody"></tbody>
    </table>
    <button class="btn btn-danger btn-sm mt-2" id="bulk-delete-coaches-btn">Delete Selected</button>
  `;
  const tbody = document.getElementById('coaches-tbody');
  coaches.forEach(coach => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" class="coach-checkbox" value="${coach.id}"></td>
      <td>${sanitize(coach.name)}</td>
      <td>${sanitize(coach.team || "")}</td>
      <td>${sanitize(coach.role || "")}</td>
      <td>
        ${coach.photoUrl ? `<img src="${sanitize(coach.photoUrl)}" alt="Photo" style="width:40px;height:40px;object-fit:cover;border-radius:50%;">` : ''}
      </td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="window.openEditCoachModal('${coach.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="window.deleteCoach('${coach.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Select all checkbox
  document.getElementById('select-all-coaches').onclick = function() {
    document.querySelectorAll('.coach-checkbox').forEach(cb => cb.checked = this.checked);
  };

  // Bulk delete
  document.getElementById('bulk-delete-coaches-btn').onclick = function() {
    const ids = Array.from(document.querySelectorAll('.coach-checkbox:checked')).map(cb => cb.value);
    bulkDeleteCoaches(ids);
  };
}

/**
 * Load coaches from Firestore and render.
 */
export async function loadCoaches() {
  const q = query(collection(db, COLLECTIONS.coaches), orderBy("name"));
  const snap = await getDocs(q);
  const coaches = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  renderCoachesTable(coaches);
}

/**
 * Bulk delete coaches by IDs.
 * @param {string[]} ids
 */
export function bulkDeleteCoaches(ids) {
  if (!Array.isArray(ids) || !ids.length) {
    showMessage("No coaches selected.", "warning");
    return;
  }
  showConfirm(`Delete ${ids.length} coaches?`, async (confirmed) => {
    if (!confirmed) return;
    for (const id of ids) {
      await deleteCoachById(id);
    }
    showMessage("Coaches deleted!", "success");
    if (typeof loadCoaches === 'function') loadCoaches();
  });
}

/**
 * Delete a coach by ID (and photo if present)
 */
async function deleteCoachById(id) {
  try {
    const docRef = doc(db, COLLECTIONS.coaches, id);
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
    if (typeof logAudit === 'function') await logAudit("deleteCoach", { id });
  } catch (err) {
    showMessage("Failed to delete coach.", "danger");
  }
}

// Single coach delete for row action
window.deleteCoach = function(id) {
  showConfirm('Delete this coach?', async (confirmed) => {
    if (!confirmed) return;
    await deleteCoachById(id);
    showMessage("Coach deleted!", "success");
    if (typeof loadCoaches === 'function') loadCoaches();
  });
};

/**
 * Show modal for adding or editing a coach.
 * @param {string|null} id
 */
window.openEditCoachModal = async function(id = null) {
  let coach = {
    name: "",
    team: "",
    role: "",
    photoUrl: ""
  };
  let isEdit = false;
  if (id) {
    const docSnap = await getDoc(doc(db, COLLECTIONS.coaches, id));
    if (docSnap.exists()) {
      coach = { id, ...docSnap.data() };
      isEdit = true;
    }
  }
  // Modal HTML
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal" style="display:block;">
      <div class="modal-dialog">
        <form class="modal-content" id="coach-form">
          <div class="modal-header">
            <h5 class="modal-title">${isEdit ? 'Edit Coach' : 'Add Coach'}</h5>
            <button type="button" class="btn-close" id="close-modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" name="name" value="${sanitize(coach.name)}" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Team</label>
              <input type="text" class="form-control" name="team" value="${sanitize(coach.team)}">
            </div>
            <div class="mb-3">
              <label class="form-label">Role</label>
              <input type="text" class="form-control" name="role" value="${sanitize(coach.role)}">
            </div>
            <div class="mb-3">
              <label class="form-label">Photo</label>
              <input type="file" class="form-control" name="photo">
              ${coach.photoUrl ? `<img src="${sanitize(coach.photoUrl)}" style="width:60px;height:60px;object-fit:cover;margin-top:8px;border-radius:50%;">` : ''}
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
  modal.querySelector('#coach-form').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value.trim(),
      team: form.team.value.trim(),
      role: form.role.value.trim()
    };
    let photoUrl = coach.photoUrl || "";
    const file = form.photo.files[0];
    if (file) {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `coaches/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        photoUrl = await getDownloadURL(storageRef);
        // Optionally delete old photo
        if (isEdit && coach.photoUrl) {
          try {
            const oldRef = ref(storage, coach.photoUrl);
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
        await updateDoc(doc(db, COLLECTIONS.coaches, id), data);
        if (typeof logAudit === 'function') await logAudit("updateCoach", { id, ...data });
        showMessage("Coach updated!", "success");
      } else {
        await addDoc(collection(db, COLLECTIONS.coaches), data);
        if (typeof logAudit === 'function') await logAudit("createCoach", data);
        showMessage("Coach added!", "success");
      }
      document.body.removeChild(modal);
      if (typeof loadCoaches === 'function') loadCoaches();
    } catch (err) {
      showMessage("Failed to save coach.", "danger");
    }
  };
};

/**
 * Initialize the Coaches section.
 */
export function initCoachesSection() {
  const section = document.getElementById('coaches-section');
  section.style.display = '';
  section.innerHTML = `
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Coaches</h2>
      <button class="btn btn-primary" id="add-coach-btn">Add Coach</button>
    </div>
    <div id="coaches-list">Loading coaches...</div>
  `;
  document.getElementById('add-coach-btn').onclick = () => window.openEditCoachModal();
  loadCoaches();
}