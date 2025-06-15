import { db, COLLECTIONS, isAdmin, logAudit, showMessage, showConfirm } from './admin.js';
import { collection, getDocs, query, orderBy, deleteDoc, doc, addDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

/**
 * @typedef {Object} Page
 * @property {string} id
 * @property {string} title
 * @property {string} path
 * @property {string} author
 * @property {string} date
 * @property {string} status
 * @property {string} content
 * @property {string} [imageUrl]
 */

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
 * Render the pages table.
 * @param {Page[]} pages
 */
export function renderPagesTable(pages) {
  const list = document.getElementById('pages-list');
  if (!list) return;
  if (!pages.length) {
    list.innerHTML = `<div class="alert alert-info">No pages found.</div>`;
    return;
  }
  list.innerHTML = `
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th><input type="checkbox" id="select-all-pages"></th>
          <th>Title</th>
          <th>Author</th>
          <th>Date</th>
          <th>Status</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="pages-tbody"></tbody>
    </table>
    <button class="btn btn-danger btn-sm mt-2" id="bulk-delete-btn">Delete Selected</button>
  `;
  const tbody = document.getElementById('pages-tbody');
  pages.forEach(page => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" class="page-checkbox" value="${page.id}"></td>
      <td>${sanitize(page.title)}</td>
      <td>${sanitize(page.author || "")}</td>
      <td>${sanitize(page.date || "")}</td>
      <td>
        <span class="status-badge ${page.status === 'published' ? 'published' : 'draft'}">
          ${page.status ? page.status.charAt(0).toUpperCase() + page.status.slice(1) : 'Draft'}
        </span>
      </td>
      <td>
        ${page.imageUrl ? `<img src="${sanitize(page.imageUrl)}" alt="Page Image" style="width:40px;height:40px;object-fit:cover;border-radius:4px;">` : ''}
      </td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="window.openEditPageModal('${page.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="window.deletePage('${page.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Select all checkbox
  document.getElementById('select-all-pages').onclick = function() {
    document.querySelectorAll('.page-checkbox').forEach(cb => cb.checked = this.checked);
  };

  // Bulk delete
  document.getElementById('bulk-delete-btn').onclick = function() {
    const ids = Array.from(document.querySelectorAll('.page-checkbox:checked')).map(cb => cb.value);
    bulkDeletePages(ids);
  };
}

/**
 * Bulk delete pages by IDs.
 * @param {string[]} ids
 */
export function bulkDeletePages(ids) {
  if (!Array.isArray(ids) || !ids.length) {
    showMessage("No pages selected.", "warning");
    return;
  }
  showConfirm(`Delete ${ids.length} pages?`, async (confirmed) => {
    if (!confirmed) return;
    for (const id of ids) {
      await deleteDoc(doc(db, COLLECTIONS.pages, id));
      if (typeof logAudit === 'function') {
        await logAudit("deletePage", { id });
      }
    }
    showMessage("Pages deleted!", "success");
    if (typeof loadPages === 'function') loadPages();
  });
}

// Single page delete for row action
window.deletePage = function(id) {
  showConfirm('Delete this page?', async (confirmed) => {
    if (!confirmed) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.pages, id));
      if (typeof logAudit === 'function') {
        await logAudit("deletePage", { id });
      }
      showMessage("Page deleted!", "success");
      if (typeof loadPages === 'function') loadPages();
    } catch (e) {
      showMessage("Failed to delete page.", "danger");
      if (window && typeof window.reportError === 'function') {
        window.reportError(e, { action: 'deletePage', id });
      }
    }
  });
};

/**
 * Load pages from Firestore and render.
 */
export async function loadPages() {
  const q = query(collection(db, COLLECTIONS.pages), orderBy("title"));
  const snap = await getDocs(q);
  const pages = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  renderPagesTable(pages);
}

/**
 * Show modal for adding or editing a page.
 * @param {string|null} id
 */
window.openEditPageModal = async function(id = null) {
  let page = {
    title: "",
    path: "",
    author: "",
    date: "",
    status: "draft",
    content: "",
    imageUrl: ""
  };
  let isEdit = false;
  if (id) {
    const docSnap = await getDoc(doc(db, COLLECTIONS.pages, id));
    if (docSnap.exists()) {
      page = { id, ...docSnap.data() };
      isEdit = true;
    }
  }
  // Modal HTML
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal" style="display:block;">
      <div class="modal-dialog">
        <form class="modal-content" id="page-form">
          <div class="modal-header">
            <h5 class="modal-title">${isEdit ? 'Edit Page' : 'Add Page'}</h5>
            <button type="button" class="btn-close" id="close-modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Title</label>
              <input type="text" class="form-control" name="title" value="${sanitize(page.title)}" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Path</label>
              <input type="text" class="form-control" name="path" value="${sanitize(page.path)}" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Author</label>
              <input type="text" class="form-control" name="author" value="${sanitize(page.author)}">
            </div>
            <div class="mb-3">
              <label class="form-label">Date</label>
              <input type="date" class="form-control" name="date" value="${sanitize(page.date)}">
            </div>
            <div class="mb-3">
              <label class="form-label">Status</label>
              <select class="form-select" name="status">
                <option value="draft" ${page.status === 'draft' ? 'selected' : ''}>Draft</option>
                <option value="published" ${page.status === 'published' ? 'selected' : ''}>Published</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Content</label>
              <textarea class="form-control" name="content" rows="4">${sanitize(page.content)}</textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Image</label>
              <input type="file" class="form-control" name="image">
              ${page.imageUrl ? `<img src="${sanitize(page.imageUrl)}" style="width:60px;height:60px;object-fit:cover;margin-top:8px;border-radius:4px;">` : ''}
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
  modal.querySelector('#page-form').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      title: form.title.value.trim(),
      path: form.path.value.trim(),
      author: form.author.value.trim(),
      date: form.date.value,
      status: form.status.value,
      content: form.content.value.trim()
    };
    let imageUrl = page.imageUrl || "";
    const file = form.image.files[0];
    if (file) {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `pages/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
        // Optionally delete old image
        if (isEdit && page.imageUrl) {
          try {
            const oldRef = ref(storage, page.imageUrl);
            await deleteObject(oldRef);
          } catch {}
        }
      } catch (err) {
        showMessage("Image upload failed.", "danger");
        return;
      }
    }
    data.imageUrl = imageUrl;

    try {
      if (isEdit) {
        await updateDoc(doc(db, COLLECTIONS.pages, id), data);
        if (typeof logAudit === 'function') await logAudit("updatePage", { id, ...data });
        showMessage("Page updated!", "success");
      } else {
        await addDoc(collection(db, COLLECTIONS.pages), data);
        if (typeof logAudit === 'function') await logAudit("createPage", data);
        showMessage("Page created!", "success");
      }
      document.body.removeChild(modal);
      if (typeof loadPages === 'function') loadPages();
    } catch (err) {
      showMessage("Failed to save page.", "danger");
    }
  };
};

/**
 * Initialize the Pages section.
 */
export function initPagesSection() {
  const content = document.getElementById('pages-content');
  content.innerHTML = `
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Pages</h2>
      <button class="btn btn-primary" id="add-page-btn">Add Page</button>
    </div>
    <div id="pages-list">Loading pages...</div>
  `;
  document.getElementById('add-page-btn').onclick = () => window.openEditPageModal();
  loadPages();
}