import { db, storage, COLLECTIONS, sanitize, showMessage, showConfirm } from './admin.js';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

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

export function initDashboardSection() {
  document.getElementById('dashboard-section').style.display = '';
}