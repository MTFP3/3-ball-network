import { db, COLLECTIONS, sanitize, isAdmin, logAudit, showMessage, showConfirm } from './admin.js';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

/**
 * @typedef {Object} Page
 * @property {string} id
 * @property {string} title
 * @property {string} path
 * @property {string} author
 * @property {string} date
 * @property {string} status
 * @property {string} content
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
  const tbody = document.getElementById('pages-content');
  if (!tbody) return;
  tbody.innerHTML = '';
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
        <button class="btn btn-sm btn-primary" onclick="openEditPageModal('${page.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deletePage('${page.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
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

// Optionally, you can add a function to load pages from Firestore
export async function loadPages() {
  const q = query(collection(db, COLLECTIONS.pages), orderBy("title"));
  const snap = await getDocs(q);
  const pages = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  renderPagesTable(pages);
}