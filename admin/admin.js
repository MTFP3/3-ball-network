import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, addDoc, getDocs, setDoc, deleteDoc, query, orderBy, limit, startAfter, startAt } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0",
  authDomain: "ball-network-web.firebaseapp.com",
  projectId: "ball-network-web",
  storageBucket: "ball-network-web.appspot.com",
  messagingSenderId: "740915998465",
  appId: "1:740915998465:web:59ac026f3f4c2ec5da3500",
  measurementId: "G-ZS07SKSRRL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginSection = document.getElementById("login-section");
const dashboard = document.getElementById("admin-dashboard");
const loginBtn = document.getElementById("login-btn");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");

let currentUserIsAdmin = false;

// --- Admin Check using Array in admin/adminUsers ---
async function checkIsAdmin(email) {
  const adminDocRef = doc(db, "admin", "adminUsers");
  const adminDocSnap = await getDoc(adminDocRef);
  if (adminDocSnap.exists()) {
    const adminData = adminDocSnap.data();
    const adminEmails = adminData.email;
    console.log("Admin emails in Firestore:", adminEmails, "User email:", email);
    return Array.isArray(adminEmails) && adminEmails.map(e => e.toLowerCase()).includes(email.toLowerCase());
  }
  return false;
}

// --- Login Logic ---
loginBtn.onclick = async () => {
  loginError.textContent = "";
  const email = document.getElementById("admin-email").value.trim();
  const password = document.getElementById("admin-password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    currentUserIsAdmin = await checkIsAdmin(user.email);
    if (currentUserIsAdmin) {
      loginSection.style.display = "none";
      dashboard.style.display = "block";
      loadPages();
      // Hide admin user management UI
      document.getElementById('admin-users-section').style.display = 'none';
      document.getElementById('audit-log-section').style.display = 'none';
      // After successful login or onAuthStateChanged
      loadDashboard();
      showSection('dashboard');
    } else {
      loginError.textContent = "You are not an admin.";
      await signOut(auth);
    }
  } catch (error) {
    loginError.textContent = "Login failed. Please try again.";
    document.getElementById('admin-password').value = "";
  }
};

logoutBtn.onclick = async () => {
  await signOut(auth);
  dashboard.style.display = "none";
  loginSection.style.display = "block";
};

onAuthStateChanged(auth, async user => {
  if (user) {
    currentUserIsAdmin = await checkIsAdmin(user.email);
    if (currentUserIsAdmin) {
      loginSection.style.display = "none";
      dashboard.style.display = "block";
      loadPages();
      // Hide admin user management UI
      document.getElementById('admin-users-section').style.display = 'none';
      document.getElementById('audit-log-section').style.display = 'none';
      // After successful login or onAuthStateChanged
      loadDashboard();
      showSection('dashboard');
    } else {
      document.getElementById('login-section').style.display = 'block';
      document.getElementById('admin-dashboard').style.display = 'none';
    }
  } else {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
  }
});

// --- Pages Table Logic ---
let lastVisible = null;
let firstVisible = null;
let pageSize = 5;
let pageStack = [];
let currentPages = [];
let editingPageId = null;
let quillModal = null;

// Load pages as table
async function loadPages(direction = "next") {
  showSpinner(true);
  try {
    let q = query(collection(db, "pages"), orderBy("title"), limit(pageSize));
    if (direction === "next" && lastVisible) {
      q = query(collection(db, "pages"), orderBy("title"), startAfter(lastVisible), limit(pageSize));
    } else if (direction === "prev" && pageStack.length > 1) {
      pageStack.pop();
      const prev = pageStack[pageStack.length - 1];
      q = query(collection(db, "pages"), orderBy("title"), startAt(prev), limit(pageSize));
    }
    const pageSnapshot = await getDocs(q);
    currentPages = pageSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));

    renderPagesTable(currentPages);

    // Pagination state
    firstVisible = pageSnapshot.docs[0];
    lastVisible = pageSnapshot.docs[pageSnapshot.docs.length - 1];
    if (direction === "next" && firstVisible) pageStack.push(firstVisible);

    document.getElementById('prev-page-btn').onclick = () => loadPages("prev");
    document.getElementById('next-page-btn').onclick = () => loadPages("next");
  } catch (e) {
    showMessage("Failed to load pages.", "red");
  }
  showSpinner(false);
}

// Render table
function renderPagesTable(pages) {
  const tbody = document.getElementById('pages-table').querySelector('tbody');
  tbody.innerHTML = "";
  pages.forEach(page => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${sanitize(page.title)}</td>
      <td>${sanitize(page.author || "")}</td>
      <td>${sanitize(page.date || "")}</td>
      <td>
        <span class="status-badge ${page.status === 'published' ? 'published' : 'draft'}">
          ${page.status ? capitalize(page.status) : 'Draft'}
        </span>
      </td>
      <td>
        <button onclick="openEditPageModal('${page.id}')">Edit</button>
        <button onclick="deletePage('${page.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Filter table by search
window.filterPagesTable = function() {
  const query = document.getElementById('search-pages').value.toLowerCase();
  const filtered = currentPages.filter(page =>
    (page.title && page.title.toLowerCase().includes(query)) ||
    (page.author && page.author.toLowerCase().includes(query))
  );
  renderPagesTable(filtered);
};

// Open Add Page Modal
window.openAddPageModal = function() {
  editingPageId = null;
  document.getElementById('page-modal-title').textContent = "Add Page";
  document.getElementById('modal-title').value = "";
  document.getElementById('modal-path').value = "";
  document.getElementById('modal-author').value = "";
  document.getElementById('modal-date').value = "";
  document.getElementById('modal-status').value = "published";
  document.getElementById('modal-error').textContent = "";
  document.getElementById('page-modal').style.display = 'block';
  setTimeout(() => {
    if (!quillModal && document.getElementById('modal-content-editor')) {
      quillModal = new Quill('#modal-content-editor', { theme: 'snow' });
    }
    if (quillModal) quillModal.setContents([]);
  }, 0);
};

// Open Edit Page Modal
window.openEditPageModal = async function(id) {
  editingPageId = id;
  const docRef = doc(db, "pages", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return;
  const data = docSnap.data();
  document.getElementById('page-modal-title').textContent = "Edit Page";
  document.getElementById('modal-title').value = data.title || "";
  document.getElementById('modal-path').value = data.path || "";
  document.getElementById('modal-author').value = data.author || "";
  document.getElementById('modal-date').value = data.date || "";
  document.getElementById('modal-status').value = data.status || "draft";
  document.getElementById('modal-error').textContent = "";
  document.getElementById('page-modal').style.display = 'block';
  setTimeout(() => {
    if (!quillModal && document.getElementById('modal-content-editor')) {
      quillModal = new Quill('#modal-content-editor', { theme: 'snow' });
    }
    if (quillModal) quillModal.root.innerHTML = data.content || "";
  }, 0);
};

// Save (add or edit) page
window.saveModalPage = async function() {
  showSpinner(true);
  const title = document.getElementById('modal-title').value;
  const path = document.getElementById('modal-path').value;
  const author = document.getElementById('modal-author').value;
  const date = document.getElementById('modal-date').value;
  const status = document.getElementById('modal-status').value;
  const content = quillModal ? quillModal.root.innerHTML : "";
  if (!title || !path) {
    document.getElementById('modal-error').textContent = "Title and path are required.";
    showSpinner(false);
    return;
  }
  try {
    if (editingPageId) {
      await setDoc(doc(db, "pages", editingPageId), {
        title: sanitize(title),
        path: sanitize(path),
        content: sanitize(content),
        author: sanitize(author),
        date: date,
        status: status
      });
      await logAudit("editPage", { id: editingPageId, title, path });
      showMessage("Page updated!");
    } else {
      await addDoc(collection(db, "pages"), {
        title: sanitize(title),
        path: sanitize(path),
        content: sanitize(content),
        author: sanitize(author),
        date: date,
        status: status
      });
      await logAudit("addPage", { title, path });
      showMessage("Page added!");
    }
    closePageModal();
    loadPages();
  } catch (e) {
    document.getElementById('modal-error').textContent = "Failed to save page.";
  }
  showSpinner(false);
};

// Close modal
window.closePageModal = function() {
  document.getElementById('page-modal').style.display = 'none';
  editingPageId = null;
  if (quillModal) quillModal.setContents([]);
};

// Delete page
window.deletePage = async function(id) {
  if (!currentUserIsAdmin) return;
  if (!confirm("Are you sure you want to delete this page?")) return;
  showSpinner(true);
  try {
    await deleteDoc(doc(db, "pages", id));
    await logAudit("deletePage", { id });
    showMessage("Page deleted!");
    loadPages();
  } catch (e) {
    showMessage("Failed to delete page.", "red");
  }
  showSpinner(false);
};

// Utility for status badge
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Add this CSS to your <style> for status badges:
`
.status-badge {
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 0.9em;
  color: #fff;
}
.status-badge.published { background: #28a745; }
.status-badge.draft { background: #6c757d; }
`

// --- Audit Log ---
async function logAudit(action, details) {
  try {
    await addDoc(collection(db, "auditLogs"), {
      action,
      details,
      user: auth.currentUser ? auth.currentUser.email : "unknown",
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    // Optionally handle audit log errors
  }
}

// --- Audit Log Viewing ---
async function loadAuditLog() {
  if (!currentUserIsAdmin) return;
  const logsCol = collection(db, "auditLogs");
  const logsSnapshot = await getDocs(logsCol);
  let html = "";
  logsSnapshot.forEach(docSnap => {
    const data = docSnap.data();
    html += `<li>${sanitize(data.timestamp)} - ${sanitize(data.user)}: ${sanitize(data.action)}</li>`;
  });
  document.getElementById('audit-log-list').innerHTML = html;
  document.getElementById('audit-log-section').style.display = 'block';
}

// --- Dashboard Loading ---
async function loadDashboard() {
  // Example: count pages, users, recent activity
  let statsHtml = '';
  let recentHtml = '';
  try {
    // Pages count
    const pagesSnap = await getDocs(collection(db, "pages"));
    statsHtml += `<div><b>Pages:</b> ${pagesSnap.size}</div>`;
    // Users count (stub, replace with real user count if using Firebase Auth)
    statsHtml += `<div><b>Users:</b> (coming soon)</div>`;
    // Recent activity (stub, replace with audit log or recent pages)
    recentHtml += `<h3>Recent Activity</h3><ul>`;
    pagesSnap.docs.slice(-5).forEach(docSnap => {
      const d = docSnap.data();
      recentHtml += `<li>${d.title} (${d.path})</li>`;
    });
    recentHtml += `</ul>`;
  } catch (e) {
    statsHtml = "Failed to load stats.";
    recentHtml = "";
  }
  document.getElementById('dashboard-stats').innerHTML = statsHtml;
  document.getElementById('recent-activity').innerHTML = recentHtml;
}

// --- Dark Mode ---
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

// --- Utility ---
function showSpinner(show) {
  document.getElementById('loading-spinner').style.display = show ? 'block' : 'none';
}
function showMessage(msg, color = "green") {
  const el = document.getElementById('admin-message');
  el.textContent = msg;
  el.style.color = color;
  setTimeout(() => { el.textContent = ""; }, 3000);
}
function sanitize(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Section switching logic
window.showSection = function(section) {
  const sections = [
    'dashboard-section', 'pages-section', 'media-section', 'users-section',
    'comments-section', 'settings-section', 'plugins-section'
  ];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const showEl = document.getElementById(section + '-section');
  if (showEl) showEl.style.display = 'block';

  // Call loaders
  if (section === 'dashboard') loadDashboard();
  if (section === 'media') loadMedia();
  if (section === 'users') loadUsers();
  if (section === 'comments') loadComments();
  if (section === 'settings') loadSettings();
  if (section === 'plugins') loadPlugins();
  if (section === 'pages') loadPages();
};

// Media Library (stub)
document.getElementById('media-upload').onchange = function() {
  alert('Media upload coming soon!');
};
function loadMedia() {
  document.getElementById('media-list').innerHTML = 'Media library coming soon!';
}

// User Management (stub)
function addUser() {
  alert('User management coming soon!');
}
function loadUsers() {
  document.getElementById('users-list').innerHTML = 'User list coming soon!';
}

// Comments (stub)
function loadComments() {
  document.getElementById('comments-list').innerHTML = 'Comments moderation coming soon!';
}

// Settings (stub)
function saveSettings() {
  document.getElementById('settings-message').textContent = 'Settings saved (not really, just a stub)!';
}
function loadSettings() {
  document.getElementById('site-title').value = '3 Ball Network';
  document.getElementById('site-logo').value = '';
  document.getElementById('site-theme').value = '#007cba';
}

// Plugins (stub)
function loadPlugins() {
  document.getElementById('plugins-list').innerHTML = 'Plugins/widgets coming soon!';
}

// Initialize Quill when the modal is opened for the first time
window.onload = function() {
  window.initQuill && window.initQuill();
};
