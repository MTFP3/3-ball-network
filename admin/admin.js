import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, addDoc, getDocs, setDoc, deleteDoc, query, orderBy, limit, startAfter, startAt } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, listAll, deleteObject } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

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
const storage = getStorage(app);

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
    document.getElementById('admin-email').textContent = user.email;
    document.getElementById('admin-avatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}`;
    currentUserIsAdmin = await checkIsAdmin(user.email);
    if (currentUserIsAdmin) {
      loginSection.style.display = "none";
      dashboard.style.display = "block";
      showSection('dashboard');
    } else {
      document.getElementById('login-section').style.display = 'block';
      document.getElementById('admin-dashboard').style.display = 'none';
    }
  } else {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
  }
  updateSidebarForRole();
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

    // Only set onclick if buttons exist
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    if (prevBtn) prevBtn.onclick = () => loadPages("prev");
    if (nextBtn) nextBtn.onclick = () => loadPages("next");
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
      <td><input type="checkbox" class="page-checkbox" value="${page.id}"></td>
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
        ${isAdmin() ? `<button onclick="deletePage('${page.id}')">Delete</button>` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });
  // Add a bulk delete button:
  document.getElementById('pages-section').insertAdjacentHTML('beforeend', `
    <button onclick="bulkDeletePages()">Delete Selected</button>
  `);
}

// Filter table by search
window.filterPagesTable = function() {
  const query = document.getElementById('search-pages').value.toLowerCase();
  const status = document.getElementById('filter-status').value;
  const filtered = currentPages.filter(page =>
    (!status || page.status === status) &&
    ((page.title && page.title.toLowerCase().includes(query)) ||
    (page.author && page.author.toLowerCase().includes(query)))
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

// --- Dashboard Loading ---
async function loadDashboard() {
  let statsHtml = '';
  let recentHtml = '';
  try {
    const [pagesSnap, usersSnap, commentsSnap] = await Promise.all([
      getDocs(collection(db, "pages")),
      getDocs(collection(db, "users")),
      getDocs(collection(db, "comments"))
    ]);
    statsHtml += `<div><b>Pages:</b> ${pagesSnap.size}</div>`;
    statsHtml += `<div><b>Users:</b> ${usersSnap.size}</div>`;
    statsHtml += `<div><b>Comments:</b> ${commentsSnap.size}</div>`;
    // Media count (optional, if you want to count files in storage)
    // statsHtml += `<div><b>Media:</b> ...</div>`;
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

// --- Section switching logic ---
window.showSection = function(section) {
  const sections = [
    'dashboard-section', 'pages-section', 'media-section', 'users-section',
    'comments-section', 'settings-section', 'plugins-section', 'audit-section'
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
  if (section === 'audit') loadAuditLog();
};

// --- Media Library with Firebase Storage ---
async function loadMedia() {
  const list = document.getElementById('media-list');
  list.innerHTML = "Loading...";
  try {
    const mediaFolder = storageRef(storage, 'uploads/');
    const res = await listAll(mediaFolder);
    // Fetch all captions
    const metaSnap = await getDocs(collection(db, "mediaMeta"));
    const metaMap = {};
    metaSnap.forEach(doc => { metaMap[doc.data().path] = doc.data().caption; });
    list.innerHTML = "";
    for (const itemRef of res.items) {
      const url = await getDownloadURL(itemRef);
      const caption = metaMap[itemRef.fullPath] || "";
      const div = document.createElement('div');
      div.style.display = "inline-block";
      div.style.margin = "5px";
      div.innerHTML = `
        <img src="${url}" style="max-width:120px;display:block;margin-bottom:4px;">
        <div style="font-size:0.9em;color:#555;">${sanitize(caption)}</div>
        <button onclick="deleteMedia('${itemRef.fullPath}')">Delete</button>
      `;
      list.appendChild(div);
    }
    if (res.items.length === 0) list.innerHTML = "No media uploaded yet.";
  } catch (e) {
    list.innerHTML = "Failed to load media.";
  }
}

document.getElementById('media-upload').onchange = async function(e) {
  const files = Array.from(e.target.files);
  const caption = document.getElementById('media-caption').value;
  if (!files.length) return;
  showSpinner(true);
  try {
    for (const file of files) {
      const fileRef = storageRef(storage, 'uploads/' + Date.now() + '-' + file.name);
      await uploadBytes(fileRef, file);
      // Save metadata
      await addDoc(collection(db, "mediaMeta"), {
        path: fileRef.fullPath,
        caption: caption,
        uploaded: new Date().toISOString()
      });
    }
    showMessage("Upload complete!");
    loadMedia();
  } catch (e) {
    showMessage("Upload failed.", "red");
  }
  showSpinner(false);
};

window.deleteMedia = async function(path) {
  if (!confirm("Delete this file?")) return;
  showSpinner(true);
  try {
    await deleteObject(storageRef(storage, path));
    showMessage("Deleted!");
    loadMedia();
  } catch (e) {
    showMessage("Delete failed.", "red");
  }
  showSpinner(false);
};

// --- User Management ---
window.addUser = async function() {
  const email = document.getElementById('new-user-email').value.trim();
  const role = document.getElementById('new-user-role').value;
  const errorDiv = document.getElementById('user-error');
  errorDiv.textContent = "";
  if (!email) {
    errorDiv.textContent = "Email required.";
    return;
  }
  try {
    await addDoc(collection(db, "users"), { email, role });
    document.getElementById('new-user-email').value = "";
    loadUsers();
    showMessage("User added!");
  } catch (e) {
    errorDiv.textContent = "Failed to add user.";
  }
};

async function loadUsers() {
  const list = document.getElementById('users-list');
  list.innerHTML = "Loading...";
  try {
    const snap = await getDocs(collection(db, "users"));
    list.innerHTML = "";
    snap.forEach(docSnap => {
      const d = docSnap.data();
      const li = document.createElement('li');
      li.innerHTML = `${sanitize(d.email)} (${sanitize(d.role)}) <button onclick="deleteUser('${docSnap.id}')">Remove</button>`;
      list.appendChild(li);
    });
  } catch (e) {
    list.innerHTML = "Failed to load users.";
  }
}

// Use this everywhere you want to check for admin:
function isAdmin() {
  return currentUserIsAdmin;
}

// Example: Only show delete button if admin
function renderPagesTable(pages) {
  const tbody = document.getElementById('pages-table').querySelector('tbody');
  tbody.innerHTML = "";
  pages.forEach(page => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" class="page-checkbox" value="${page.id}"></td>
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
        ${isAdmin() ? `<button onclick="deletePage('${page.id}')">Delete</button>` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// In user management, only admins can remove users
window.deleteUser = async function(id) {
  if (!isAdmin()) {
    showMessage("Only admins can remove users.", "red");
    return;
  }
  if (!confirm("Remove this user?")) return;
  try {
    await deleteDoc(doc(db, "users", id));
    loadUsers();
    showMessage("User removed!");
  } catch (e) {
    showMessage("Failed to remove user.", "red");
  }
};

// --- Comments (stub) ---
function loadComments() {
  const list = document.getElementById('comments-list');
  list.innerHTML = "Loading...";
  try {
    const snap = await getDocs(collection(db, "comments"));
    list.innerHTML = "";
    snap.forEach(docSnap => {
      const d = docSnap.data();
      const li = document.createElement('li');
      li.innerHTML = `<b>${sanitize(d.author || "Anon")}:</b> ${sanitize(d.text)} <button onclick="deleteComment('${docSnap.id}')">Delete</button>`;
      list.appendChild(li);
    });
  } catch (e) {
    list.innerHTML = "Failed to load comments.";
  }
}

window.deleteComment = async function(id) {
  if (!confirm("Delete this comment?")) return;
  try {
    await deleteDoc(doc(db, "comments", id));
    loadComments();
    showMessage("Comment deleted!");
  } catch (e) {
    showMessage("Failed to delete comment.", "red");
  }
};

// --- Settings (stub) ---
window.saveSettings = async function() {
  const title = document.getElementById('site-title').value;
  const logo = document.getElementById('site-logo').value;
  const theme = document.getElementById('site-theme').value;
  try {
    await setDoc(doc(db, "settings", "site"), { title, logo, theme });
    document.getElementById('settings-message').textContent = "Settings saved!";
  } catch (e) {
    document.getElementById('settings-message').textContent = "Failed to save settings.";
  }
};

async function loadSettings() {
  try {
    const snap = await getDoc(doc(db, "settings", "site"));
    if (snap.exists()) {
      const d = snap.data();
      document.getElementById('site-title').value = d.title || '';
      document.getElementById('site-logo').value = d.logo || '';
      document.getElementById('site-theme').value = d.theme || '#007cba';
    }
  } catch (e) {
    // fallback to defaults
    document.getElementById('site-title').value = '3 Ball Network';
    document.getElementById('site-logo').value = '';
    document.getElementById('site-theme').value = '#007cba';
  }
}

// --- Plugins (stub) ---
function loadPlugins() {
  document.getElementById('plugins-list').innerHTML = 'Plugins/widgets coming soon!';
}

// --- UI Utility Functions ---

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  document.getElementById('wp-sidebar').classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}
if (localStorage.getItem('darkMode') === 'true') toggleDarkMode();

function showToast(msg, type = "primary") {
  const toast = document.getElementById('admin-toast');
  const body = document.getElementById('admin-toast-body');
  toast.className = `toast align-items-center text-bg-${type} border-0`;
  body.textContent = msg;
  new bootstrap.Toast(toast).show();
}

function showSpinner(show = true) {
  document.getElementById('loading-overlay').style.display = show ? 'flex' : 'none';
}

function toggleSidebar() {
  document.getElementById('wp-sidebar').classList.toggle('d-none');
}

// --- Section Switching ---

function showSection(section) {
  // Hide all sections
  document.querySelectorAll('#admin-dashboard > div[id$="-section"], #admin-dashboard > div[id$="-section"]').forEach(div => {
    div.style.display = 'none';
  });
  // Remove active from all sidebar links
  document.querySelectorAll('#wp-sidebar ul li a').forEach(a => a.classList.remove('active'));
  // Show selected section
  if (section === 'dashboard') {
    document.getElementById('dashboard-section').style.display = '';
  } else {
    const sec = document.getElementById(section + '-section');
    if
