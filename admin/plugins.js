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
 * Render the plugins table.
 * @param {Array} plugins
 */
function renderPluginsTable(plugins) {
  const list = document.getElementById('plugins-list');
  if (!list) return;
  if (!plugins.length) {
    list.innerHTML = `<div class="alert alert-info">No plugins found.</div>`;
    return;
  }
  list.innerHTML = `
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th><input type="checkbox" id="select-all-plugins"></th>
          <th>Name</th>
          <th>Description</th>
          <th>Version</th>
          <th>File</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="plugins-tbody"></tbody>
    </table>
    <button class="btn btn-danger btn-sm mt-2" id="bulk-delete-plugins-btn">Delete Selected</button>
  `;
  const tbody = document.getElementById('plugins-tbody');
  plugins.forEach(plugin => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" class="plugin-checkbox" value="${plugin.id}"></td>
      <td>${sanitize(plugin.name)}</td>
      <td>${sanitize(plugin.description)}</td>
      <td>${sanitize(plugin.version)}</td>
      <td>
        ${plugin.fileUrl ? `<a href="${sanitize(plugin.fileUrl)}" target="_blank" class="badge bg-info text-dark">Download</a>` : ''}
      </td>
      <td>
        <span class="status-badge ${plugin.enabled ? 'published' : 'draft'}">
          ${plugin.enabled ? 'Enabled' : 'Disabled'}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="window.openEditPluginModal('${plugin.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="window.deletePlugin('${plugin.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Select all checkbox
  document.getElementById('select-all-plugins').onclick = function() {
    document.querySelectorAll('.plugin-checkbox').forEach(cb => cb.checked = this.checked);
  };

  // Bulk delete
  document.getElementById('bulk-delete-plugins-btn').onclick = function() {
    const ids = Array.from(document.querySelectorAll('.plugin-checkbox:checked')).map(cb => cb.value);
    bulkDeletePlugins(ids);
  };
}

/**
 * Load plugins from Firestore and render.
 */
export async function loadPlugins() {
  const q = query(collection(db, COLLECTIONS.plugins), orderBy("name"));
  const snap = await getDocs(q);
  const plugins = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  renderPluginsTable(plugins);
}

/**
 * Bulk delete plugins by IDs.
 * @param {string[]} ids
 */
export function bulkDeletePlugins(ids) {
  if (!Array.isArray(ids) || !ids.length) {
    showMessage("No plugins selected.", "warning");
    return;
  }
  showConfirm(`Delete ${ids.length} plugins?`, async (confirmed) => {
    if (!confirmed) return;
    for (const id of ids) {
      await deletePluginById(id);
    }
    showMessage("Plugins deleted!", "success");
    if (typeof loadPlugins === 'function') loadPlugins();
  });
}

/**
 * Delete a plugin by ID (and file if present)
 */
async function deletePluginById(id) {
  try {
    const docRef = doc(db, COLLECTIONS.plugins, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.fileUrl) {
        try {
          const storage = getStorage();
          const fileRef = ref(storage, data.fileUrl);
          await deleteObject(fileRef);
        } catch {}
      }
    }
    await deleteDoc(docRef);
    if (typeof logAudit === 'function') await logAudit("deletePlugin", { id });
  } catch (err) {
    showMessage("Failed to delete plugin.", "danger");
  }
}

// Single plugin delete for row action
window.deletePlugin = function(id) {
  showConfirm('Delete this plugin?', async (confirmed) => {
    if (!confirmed) return;
    await deletePluginById(id);
    showMessage("Plugin deleted!", "success");
    if (typeof loadPlugins === 'function') loadPlugins();
  });
};

/**
 * Show modal for adding or editing a plugin.
 * @param {string|null} id
 */
window.openEditPluginModal = async function(id = null) {
  let plugin = {
    name: "",
    description: "",
    version: "",
    enabled: false,
    fileUrl: ""
  };
  let isEdit = false;
  if (id) {
    const docSnap = await getDoc(doc(db, COLLECTIONS.plugins, id));
    if (docSnap.exists()) {
      plugin = { id, ...docSnap.data() };
      isEdit = true;
    }
  }
  // Modal HTML
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal" style="display:block;">
      <div class="modal-dialog">
        <form class="modal-content" id="plugin-form">
          <div class="modal-header">
            <h5 class="modal-title">${isEdit ? 'Edit Plugin' : 'Add Plugin'}</h5>
            <button type="button" class="btn-close" id="close-modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" name="name" value="${sanitize(plugin.name)}" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea class="form-control" name="description" rows="2">${sanitize(plugin.description)}</textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Version</label>
              <input type="text" class="form-control" name="version" value="${sanitize(plugin.version)}">
            </div>
            <div class="mb-3">
              <label class="form-label">Enabled</label>
              <select class="form-select" name="enabled">
                <option value="true" ${plugin.enabled ? 'selected' : ''}>Enabled</option>
                <option value="false" ${!plugin.enabled ? 'selected' : ''}>Disabled</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Plugin File</label>
              <input type="file" class="form-control" name="file">
              ${plugin.fileUrl ? `<a href="${sanitize(plugin.fileUrl)}" target="_blank" class="badge bg-info text-dark mt-1">Current File</a>` : ''}
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
  modal.querySelector('#plugin-form').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value.trim(),
      description: form.description.value.trim(),
      version: form.version.value.trim(),
      enabled: form.enabled.value === "true"
    };
    let fileUrl = plugin.fileUrl || "";
    const file = form.file.files[0];
    if (file) {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `plugins/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(storageRef);
        // Optionally delete old file
        if (isEdit && plugin.fileUrl) {
          try {
            const oldRef = ref(storage, plugin.fileUrl);
            await deleteObject(oldRef);
          } catch {}
        }
      } catch (err) {
        showMessage("Plugin file upload failed.", "danger");
        return;
      }
    }
    data.fileUrl = fileUrl;

    try {
      if (isEdit) {
        await updateDoc(doc(db, COLLECTIONS.plugins, id), data);
        if (typeof logAudit === 'function') await logAudit("updatePlugin", { id, ...data });
        showMessage("Plugin updated!", "success");
      } else {
        await addDoc(collection(db, COLLECTIONS.plugins), data);
        if (typeof logAudit === 'function') await logAudit("createPlugin", data);
        showMessage("Plugin added!", "success");
      }
      document.body.removeChild(modal);
      if (typeof loadPlugins === 'function') loadPlugins();
    } catch (err) {
      showMessage("Failed to save plugin.", "danger");
    }
  };
};

/**
 * Initialize the Plugins section.
 */
export function initPluginsSection() {
  const section = document.getElementById('plugins-section');
  section.style.display = '';
  section.innerHTML = `
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Plugins</h2>
      <button class="btn btn-primary" id="add-plugin-btn">Add Plugin</button>
    </div>
    <div id="plugins-list">Loading plugins...</div>
  `;
  document.getElementById('add-plugin-btn').onclick = () => window.openEditPluginModal();
  loadPlugins();
}