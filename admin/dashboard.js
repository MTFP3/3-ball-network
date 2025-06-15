import { db, storage, COLLECTIONS, showMessage, showConfirm, logAudit } from './admin.js';
import { collection, getDocs, query, orderBy, limit, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
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
 * Load dashboard stats, recent activity, and chart.
 */
export async function loadDashboard() {
  const statsDiv = document.getElementById('dashboard-stats');
  const recentDiv = document.getElementById('recent-activity');
  const chartCanvas = document.getElementById('dashboard-chart');
  if (!statsDiv || !recentDiv || !chartCanvas) return;

  let pageCounts = { published: 0, draft: 0 };
  let statsHtml = '';
  let recentHtml = '';
  let auditHtml = '';

  try {
    // Fetch data in parallel
    const [pagesSnap, usersSnap, commentsSnap, auditSnap] = await Promise.all([
      getDocs(collection(db, COLLECTIONS.pages)),
      getDocs(collection(db, COLLECTIONS.users)),
      getDocs(collection(db, COLLECTIONS.comments)),
      getDocs(query(collection(db, COLLECTIONS.auditLogs), orderBy("timestamp", "desc"), limit(5)))
    ]);

    // Count published/draft pages
    pagesSnap.forEach(docSnap => {
      const d = docSnap.data();
      if (d.status === 'published') pageCounts.published++;
      else pageCounts.draft++;
    });

    statsHtml = `
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div class="dashboard-card"><b>Pages</b><div>${pagesSnap.size}</div></div>
        <div class="dashboard-card"><b>Users</b><div>${usersSnap.size}</div></div>
        <div class="dashboard-card"><b>Comments</b><div>${commentsSnap.size}</div></div>
      </div>
    `;

    recentHtml = `<h4>Recent Pages</h4><ul>`;
    pagesSnap.docs.slice(-5).reverse().forEach(docSnap => {
      const d = docSnap.data();
      recentHtml += `<li><b>${sanitize(d.title)}</b> <span style="color:#888;">(${sanitize(d.path)})</span></li>`;
    });
    recentHtml += `</ul>`;

    auditHtml = `<h4 class="mt-4">Recent Admin Actions</h4><ul>`;
    auditSnap.forEach(docSnap => {
      const d = docSnap.data();
      auditHtml += `<li><b>${sanitize(d.action)}</b> by ${sanitize(d.user)} <span style="color:#888;">@ ${sanitize(d.timestamp)}</span></li>`;
    });
    auditHtml += `</ul>`;

  } catch (e) {
    statsHtml = "Failed to load stats.";
    recentHtml = "";
    auditHtml = "";
    if (window && typeof window.reportError === 'function') {
      window.reportError(e, { section: "dashboard" });
    }
  }

  statsDiv.innerHTML = statsHtml;
  recentDiv.innerHTML = recentHtml + auditHtml;

  // Lazy-load Chart.js if not present, with error handling
  try {
    if (!window.Chart) {
      await import('https://cdn.jsdelivr.net/npm/chart.js');
    }
    const ctx = chartCanvas.getContext('2d');
    if (window.dashboardChart) window.dashboardChart.destroy();
    window.dashboardChart = new window.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Published', 'Draft'],
        datasets: [{
          data: [pageCounts.published, pageCounts.draft],
          backgroundColor: ['#28a745', '#6c757d']
        }]
      },
      options: {
        plugins: {
          legend: { display: true, position: 'bottom' }
        }
      }
    });
  } catch (err) {
    if (window && typeof window.showMessage === 'function') {
      window.showMessage("Failed to load dashboard chart.", "danger");
    }
    if (window && typeof window.reportError === 'function') {
      window.reportError(err, { section: "dashboard-chart" });
    }
  }
}

/**
 * CRUD: Add a new page (with optional image upload)
 */
export async function addDashboardPage(data, file) {
  try {
    let imageUrl = "";
    if (file) {
      const storage = getStorage();
      const storageRef = ref(storage, `pages/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }
    const docRef = await addDoc(collection(db, COLLECTIONS.pages), { ...data, imageUrl });
    if (typeof logAudit === 'function') await logAudit("createPage", { id: docRef.id, ...data });
    showMessage("Page created!", "success");
    return docRef.id;
  } catch (err) {
    showMessage("Failed to create page.", "danger");
    throw err;
  }
}

/**
 * CRUD: Update a page (with optional image upload)
 */
export async function updateDashboardPage(id, data, file, oldImageUrl = "") {
  try {
    let imageUrl = oldImageUrl;
    if (file) {
      const storage = getStorage();
      const storageRef = ref(storage, `pages/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
      // Optionally delete old image
      if (oldImageUrl) {
        try {
          const oldRef = ref(storage, oldImageUrl);
          await deleteObject(oldRef);
        } catch {}
      }
    }
    await updateDoc(doc(db, COLLECTIONS.pages, id), { ...data, imageUrl });
    if (typeof logAudit === 'function') await logAudit("updatePage", { id, ...data });
    showMessage("Page updated!", "success");
  } catch (err) {
    showMessage("Failed to update page.", "danger");
    throw err;
  }
}

/**
 * CRUD: Delete a page (and its image)
 */
export async function deleteDashboardPage(id) {
  try {
    const docRef = doc(db, COLLECTIONS.pages, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.imageUrl) {
        try {
          const storage = getStorage();
          const imgRef = ref(storage, data.imageUrl);
          await deleteObject(imgRef);
        } catch {}
      }
    }
    await deleteDoc(docRef);
    if (typeof logAudit === 'function') await logAudit("deletePage", { id });
    showMessage("Page deleted!", "success");
  } catch (err) {
    showMessage("Failed to delete page.", "danger");
    throw err;
  }
}

/**
 * Show modal for adding or editing a page from dashboard
 */
window.openDashboardPageModal = async function(id = null) {
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
        <form class="modal-content" id="dashboard-page-form">
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
  modal.querySelector('#dashboard-page-form').onsubmit = async function(e) {
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
    const file = form.image.files[0];
    try {
      if (isEdit) {
        await updateDashboardPage(id, data, file, page.imageUrl);
      } else {
        await addDashboardPage(data, file);
      }
      document.body.removeChild(modal);
      if (typeof loadDashboard === 'function') loadDashboard();
    } catch {}
  };
};

/**
 * Show dashboard section
 */
export function initDashboardSection() {
  document.getElementById('dashboard-content').innerHTML = `
    <div class="alert alert-info">Welcome to the 3 Ball Network Admin Dashboard!</div>
    <div id="dashboard-stats" class="mb-4"></div>
    <div style="display:flex;gap:32px;flex-wrap:wrap;">
      <div style="flex:2;">
        <canvas id="dashboard-chart" width="320" height="180"></canvas>
      </div>
      <div id="recent-activity" style="flex:3;"></div>
    </div>
    <div class="mt-4">
      <button class="btn btn-primary" id="add-dashboard-page-btn">Add Page</button>
    </div>
  `;
  document.getElementById('add-dashboard-page-btn').onclick = () => window.openDashboardPageModal();
  loadDashboard();
}