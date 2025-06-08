import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, setDoc, query, orderBy, limit, startAfter, startAt } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0",
  authDomain: "ball-network-web.firebaseapp.com",
  projectId: "ball-network-web",
  storageBucket: "ball-network-web.appspot.com",
  messagingSenderId: "740915998465",
  appId: "1:740915998465:web:59ac026f3f4c2ec5da3500",
  measurementId: "G-ZS07SKSRRL"
};

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

let currentUserRole = null;

// --- Roles ---
async function getUserRole(email) {
  const usersCol = collection(db, "adminUsers");
  const usersSnapshot = await getDocs(usersCol);
  let role = null;
  usersSnapshot.forEach(docSnap => {
    const data = docSnap.data();
    if (data.email && data.email.toLowerCase() === email.toLowerCase()) {
      role = data.role || "admin";
    }
  });
  return role;
}

async function isAdmin(email) {
  return (await getUserRole(email)) === "admin";
}
async function isEditor(email) {
  const role = await getUserRole(email);
  return role === "admin" || role === "editor";
}
async function isViewer(email) {
  const role = await getUserRole(email);
  return role === "viewer";
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

// --- Login Logic ---
document.getElementById('login-btn').onclick = async function() {
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    currentUserRole = await getUserRole(email);
    if (currentUserRole) {
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('admin-dashboard').style.display = 'block';
      loadPages();
      loadAdminUsers();
      if (currentUserRole === "admin") loadAuditLog();
      document.getElementById('add-page-section').style.display = (currentUserRole === "viewer") ? "none" : "block";
      document.getElementById('admin-users-section').style.display = (currentUserRole === "admin") ? "block" : "none";
    } else {
      signOut(auth);
      document.getElementById('login-error').textContent = "You are not an admin.";
    }
  } catch (error) {
    document.getElementById('login-error').textContent = "Login failed. Please try again.";
    document.getElementById('admin-password').value = "";
  }
};

onAuthStateChanged(auth, async user => {
  if (user) {
    currentUserRole = await getUserRole(user.email);
    if (currentUserRole) {
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('admin-dashboard').style.display = 'block';
      loadPages();
      loadAdminUsers();
      if (currentUserRole === "admin") loadAuditLog();
      document.getElementById('add-page-section').style.display = (currentUserRole === "viewer") ? "none" : "block";
      document.getElementById('admin-users-section').style.display = (currentUserRole === "admin") ? "block" : "none";
    } else {
      document.getElementById('login-section').style.display = 'block';
      document.getElementById('admin-dashboard').style.display = 'none';
    }
  } else {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
  }
});

function showSpinner(show) {
  document.getElementById('loading-spinner').style.display = show ? 'block' : 'none';
}

function showMessage(msg, color="green") {
  const el = document.getElementById('admin-message');
  el.textContent = msg;
  el.style.color = color;
  setTimeout(() => { el.textContent = ""; }, 2000);
}

function sanitize(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

// --- Quill Editors ---
let quillEdit = null;
let quillAdd = null;

// --- Pagination State ---
let lastVisible = null;
let firstVisible = null;
let pageSize = 5;
let pageStack = [];

// --- Page Management Logic with Pagination ---
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
    let html = "<h3>Pages</h3><ul>";
    pageSnapshot.forEach(docSnap => {
      const data = docSnap.data();
      html += `<li>
        <b>${sanitize(data.title)}</b> (${sanitize(data.path)}) 
        <br>Author: ${sanitize(data.author || "")} | Date: ${sanitize(data.date || "")}`;
      if (currentUserRole !== "viewer") {
        html += `
        <button onclick="editPage('${docSnap.id}', \`${data.title.replace(/`/g, '\\`')}\`, \`${data.path.replace(/`/g, '\\`')}\`, \`${data.content ? data.content.replace(/`/g, '\\`') : ''}\`, \`${data.author ? data.author.replace(/`/g, '\\`') : ''}\`, \`${data.date ? data.date.replace(/`/g, '\\`') : ''}\`)">Edit</button>
        <button onclick="deletePage('${docSnap.id}')">Delete</button>`;
      }
      html += `</li>`;
    });
    html += "</ul>";
    html += `
      <button id="prev-page-btn">Previous</button>
      <button id="next-page-btn">Next</button>
    `;
    document.getElementById('pages-section').innerHTML = html;

    // Pagination state
    firstVisible = pageSnapshot.docs[0];
    lastVisible = pageSnapshot.docs[pageSnapshot.docs.length - 1];
    if (direction === "next" && firstVisible) pageStack.push(firstVisible);

    document.getElementById('prev-page-btn').onclick = () => loadPages("prev");
    document.getElementById('next-page-btn').onclick = () => loadPages("next");

    // Re-initialize Add Page Quill after rendering
    if (quillAdd) { quillAdd = null; }
    setTimeout(() => {
      if (!quillAdd && document.getElementById('new-content-editor')) {
        quillAdd = new Quill('#new-content-editor', { theme: 'snow' });
      }
    }, 0);

    // Re-attach logout and other events
    document.getElementById('logout-btn').onclick = function() {
      signOut(auth);
    };
    document.getElementById('export-pages-btn').onclick = exportPages;
    document.getElementById('import-pages-btn').onclick = function() {
      document.getElementById('import-pages-file').click();
    };
    document.getElementById('import-pages-file').onchange = importPages;
    document.getElementById('toggle-dark-mode').onclick = toggleDarkMode;
  } catch (e) {
    showMessage("Failed to load pages.", "red");
  }
  showSpinner(false);
}

window.addPage = async function() {
  if (currentUserRole === "viewer") return;
  showSpinner(true);
  const title = document.getElementById('new-title').value;
  const path = document.getElementById('new-path').value;
  const content = quillAdd ? quillAdd.root.innerHTML : "";
  const author = document.getElementById('new-author').value;
  const date = document.getElementById('new-date').value;
  if (!title || !path) {
    document.getElementById('page-error').textContent = "Title and path are required.";
    showMessage("Title and path are required.", "red");
    showSpinner(false);
    return;
  }
  try {
    await addDoc(collection(db, "pages"), { 
      title: sanitize(title), 
      path: sanitize(path), 
      content: sanitize(content),
      author: sanitize(author),
      date: date
    });
    await logAudit("addPage", { title, path });
    showMessage("Page added!");
    loadPages();
    if (quillAdd) quillAdd.setContents([]);
  } catch (e) {
    showMessage("Failed to add page.", "red");
  }
  showSpinner(false);
};

window.deletePage = async function(id) {
  if (currentUserRole === "viewer") return;
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

let editingPageId = null;

window.editPage = function(id, title, path, content, author = "", date = "") {
  if (currentUserRole === "viewer") return;
  editingPageId = id;
  document.getElementById('edit-title').value = title;
  document.getElementById('edit-path').value = path;
  document.getElementById('edit-author').value = author;
  document.getElementById('edit-date').value = date;
  document.getElementById('edit-modal').style.display = 'block';
  setTimeout(() => {
    if (!quillEdit && document.getElementById('edit-content-editor')) {
      quillEdit = new Quill('#edit-content-editor', { theme: 'snow' });
    }
    if (quillEdit) quillEdit.root.innerHTML = content || "";
  }, 0);
  document.getElementById('page-preview').style.display = 'none';
};

window.closeEditModal = function() {
  document.getElementById('edit-modal').style.display = 'none';
  editingPageId = null;
  if (quillEdit) quillEdit.setContents([]);
};

window.saveEditPage = async function() {
  if (currentUserRole === "viewer") return;
  showSpinner(true);
  const content = quillEdit ? quillEdit.root.innerHTML : "";
  const title = document.getElementById('edit-title').value;
  const path = document.getElementById('edit-path').value;
  const author = document.getElementById('edit-author').value;
  const date = document.getElementById('edit-date').value;
  if (!title || !path) {
    document.getElementById('edit-error').textContent = "Title and path are required.";
    showMessage("Title and path are required.", "red");
    showSpinner(false);
    return;
  }
  try {
    await setDoc(doc(db, "pages", editingPageId), { 
      title: sanitize(title), 
      path: sanitize(path), 
      content: sanitize(content),
      author: sanitize(author),
      date: date
    });
    await logAudit("editPage", { id: editingPageId, title, path });
    closeEditModal();
    showMessage("Page updated!");
    loadPages();
  } catch (e) {
    showMessage("Failed to update page.", "red");
  }
  showSpinner(false);
};

window.previewPage = function() {
  const content = quillEdit ? quillEdit.root.innerHTML : "";
  const previewDiv = document.getElementById('page-preview');
  previewDiv.innerHTML = content;
  previewDiv.style.display = 'block';
};

window.filterPages = function() {
  const query = document.getElementById('search-pages').value.toLowerCase();
  const items = document.querySelectorAll('#pages-section ul li');
  items.forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(query) ? '' : 'none';
  });
};

// --- Export/Import Pages ---
async function exportPages() {
  showSpinner(true);
  try {
    const pagesCol = collection(db, "pages");
    const pageSnapshot = await getDocs(pagesCol);
    const pages = [];
    pageSnapshot.forEach(docSnap => {
      pages.push({ id: docSnap.id, ...docSnap.data() });
    });
    const blob = new Blob([JSON.stringify(pages, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "pages.json";
    a.click();
    URL.revokeObjectURL(url);
    showMessage("Exported pages as JSON!");
    await logAudit("exportPages", {});
  } catch (e) {
    showMessage("Failed to export pages.", "red");
  }
  showSpinner(false);
}

async function importPages(e) {
  const file = e.target.files[0];
  if (!file) return;
  showSpinner(true);
  try {
    const text = await file.text();
    const pages = JSON.parse(text);
    for (const page of pages) {
      await addDoc(collection(db, "pages"), {
        title: sanitize(page.title),
        path: sanitize(page.path),
        content: sanitize(page.content),
        author: sanitize(page.author),
        date: page.date
      });
    }
    showMessage("Imported pages!");
    await logAudit("importPages", { count: pages.length });
    loadPages();
  } catch (e) {
    showMessage("Failed to import pages.", "red");
  }
  showSpinner(false);
}

// --- Admin Users Logic ---
async function loadAdminUsers() {
  if (currentUserRole !== "admin") {
    document.getElementById('admin-users-section').style.display = 'none';
    return;
  }
  showSpinner(true);
  try {
    const usersCol = collection(db, "adminUsers");
    const usersSnapshot = await getDocs(usersCol);
    let html = "";
    const currentUser = auth.currentUser ? auth.currentUser.email : "";
    usersSnapshot.forEach(docSnap => {
      const data = docSnap.data();
      const isSelf = data.email && data.email.toLowerCase() === currentUser.toLowerCase();
      html += `<li>${sanitize(data.email)} (${sanitize(data.role || "admin")}) <button onclick="removeAdminUser('${docSnap.id}')" ${isSelf ? "disabled" : ""}>Remove</button></li>`;
    });
    document.getElementById('admin-users-list').innerHTML = html;
    document.getElementById('admin-users-section').style.display = 'block';
  } catch (e) {
    showMessage("Failed to load admin users.", "red");
  }
  showSpinner(false);
}

window.addAdminUser = async function() {
  if (currentUserRole !== "admin") return;
  showSpinner(true);
  const email = document.getElementById('new-admin-email').value.trim();
  const role = document.getElementById('new-admin-role').value;
  if (!email) {
    document.getElementById('admin-user-error').textContent = "Email required.";
    showSpinner(false);
    return;
  }
  try {
    await addDoc(collection(db, "adminUsers"), { email: sanitize(email), role: sanitize(role) });
    await logAudit("addAdminUser", { email, role });
    document.getElementById('new-admin-email').value = "";
    loadAdminUsers();
  } catch (e) {
    showMessage("Failed to add admin.", "red");
  }
  showSpinner(false);
};

window.removeAdminUser = async function(id) {
  if (currentUserRole !== "admin") return;
  showSpinner(true);
  try {
    await deleteDoc(doc(db, "adminUsers", id));
    await logAudit("removeAdminUser", { id });
    loadAdminUsers();
  } catch (e) {
    showMessage("Failed to remove admin.", "red");
  }
  showSpinner(false);
};

// --- Audit Log Viewing ---
async function loadAuditLog() {
  if (currentUserRole !== "admin") return;
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

// --- Dark Mode ---
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

// Initialize Quill when the modal is opened for the first time
window.onload = function() {
  window.initQuill();
};
