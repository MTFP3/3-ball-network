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
 * Render the users table.
 * @param {Array} users
 */
function renderUsersTable(users) {
  const list = document.getElementById('users-list');
  if (!list) return;
  if (!users.length) {
    list.innerHTML = `<div class="alert alert-info">No users found.</div>`;
    return;
  }
  list.innerHTML = `
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th><input type="checkbox" id="select-all-users"></th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Avatar</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="users-tbody"></tbody>
    </table>
    <button class="btn btn-danger btn-sm mt-2" id="bulk-delete-users-btn">Delete Selected</button>
  `;
  const tbody = document.getElementById('users-tbody');
  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" class="user-checkbox" value="${user.id}"></td>
      <td>${sanitize(user.name)}</td>
      <td>${sanitize(user.email)}</td>
      <td>${sanitize(user.role || "user")}</td>
      <td>
        ${user.avatarUrl ? `<img src="${sanitize(user.avatarUrl)}" alt="Avatar" style="width:40px;height:40px;object-fit:cover;border-radius:50%;">` : ''}
      </td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="window.openEditUserModal('${user.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="window.deleteUser('${user.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Select all checkbox
  document.getElementById('select-all-users').onclick = function() {
    document.querySelectorAll('.user-checkbox').forEach(cb => cb.checked = this.checked);
  };

  // Bulk delete
  document.getElementById('bulk-delete-users-btn').onclick = function() {
    const ids = Array.from(document.querySelectorAll('.user-checkbox:checked')).map(cb => cb.value);
    bulkDeleteUsers(ids);
  };
}

/**
 * Load users from Firestore and render.
 */
export async function loadUsers() {
  const q = query(collection(db, COLLECTIONS.users), orderBy("name"));
  const snap = await getDocs(q);
  const users = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  renderUsersTable(users);
}

/**
 * Bulk delete users by IDs.
 * @param {string[]} ids
 */
export function bulkDeleteUsers(ids) {
  if (!Array.isArray(ids) || !ids.length) {
    showMessage("No users selected.", "warning");
    return;
  }
  showConfirm(`Delete ${ids.length} users?`, async (confirmed) => {
    if (!confirmed) return;
    for (const id of ids) {
      await deleteUserById(id);
    }
    showMessage("Users deleted!", "success");
    if (typeof loadUsers === 'function') loadUsers();
  });
}

/**
 * Delete a user by ID (and avatar if present)
 */
async function deleteUserById(id) {
  try {
    const docRef = doc(db, COLLECTIONS.users, id);
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
    if (typeof logAudit === 'function') await logAudit("deleteUser", { id });
  } catch (err) {
    showMessage("Failed to delete user.", "danger");
  }
}

// Single user delete for row action
window.deleteUser = function(id) {
  showConfirm('Delete this user?', async (confirmed) => {
    if (!confirmed) return;
    await deleteUserById(id);
    showMessage("User deleted!", "success");
    if (typeof loadUsers === 'function') loadUsers();
  });
};

/**
 * Show modal for adding or editing a user.
 * @param {string|null} id
 */
window.openEditUserModal = async function(id = null) {
  let user = {
    name: "",
    email: "",
    role: "user",
    avatarUrl: ""
  };
  let isEdit = false;
  if (id) {
    const docSnap = await getDoc(doc(db, COLLECTIONS.users, id));
    if (docSnap.exists()) {
      user = { id, ...docSnap.data() };
      isEdit = true;
    }
  }
  // Modal HTML
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal" style="display:block;">
      <div class="modal-dialog">
        <form class="modal-content" id="user-form">
          <div class="modal-header">
            <h5 class="modal-title">${isEdit ? 'Edit User' : 'Add User'}</h5>
            <button type="button" class="btn-close" id="close-modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" name="name" value="${sanitize(user.name)}" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" name="email" value="${sanitize(user.email)}" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Role</label>
              <select class="form-select" name="role">
                <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Avatar</label>
              <input type="file" class="form-control" name="avatar">
              ${user.avatarUrl ? `<img src="${sanitize(user.avatarUrl)}" style="width:60px;height:60px;object-fit:cover;margin-top:8px;border-radius:50%;">` : ''}
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
  modal.querySelector('#user-form').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      role: form.role.value
    };
    let avatarUrl = user.avatarUrl || "";
    const file = form.avatar.files[0];
    if (file) {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `avatars/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        avatarUrl = await getDownloadURL(storageRef);
        // Optionally delete old avatar
        if (isEdit && user.avatarUrl) {
          try {
            const oldRef = ref(storage, user.avatarUrl);
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
        await updateDoc(doc(db, COLLECTIONS.users, id), data);
        if (typeof logAudit === 'function') await logAudit("updateUser", { id, ...data });
        showMessage("User updated!", "success");
      } else {
        await addDoc(collection(db, COLLECTIONS.users), data);
        if (typeof logAudit === 'function') await logAudit("createUser", data);
        showMessage("User created!", "success");
      }
      document.body.removeChild(modal);
      if (typeof loadUsers === 'function') loadUsers();
    } catch (err) {
      showMessage("Failed to save user.", "danger");
    }
  };
};

/**
 * Initialize the Users section.
 */
export function initUsersSection() {
  const section = document.getElementById('users-section');
  section.style.display = '';
  section.innerHTML = `
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Users</h2>
      <button class="btn btn-primary" id="add-user-btn">Add User</button>
    </div>
    <div id="users-list">Loading users...</div>
  `;
  document.getElementById('add-user-btn').onclick = () => window.openEditUserModal();
  loadUsers();
}