import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Your web app's Firebase configuration
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

const adminEmails = [
  "marcus@3ballnetwork.com",
  "marcus.toney.2011@gmail.com"
];

// --- Login Logic ---
document.getElementById('login-btn').onclick = function() {
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      console.log("Signed in as:", email);
      if (adminEmails.map(e => e.toLowerCase()).includes(email.toLowerCase())) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        loadPages();
        loadAdminUsers();
      } else {
        signOut(auth);
        document.getElementById('login-error').textContent = "You are not an admin.";
      }
    })
    .catch(error => {
      document.getElementById('login-error').textContent = "Login failed. Please try again.";
      document.getElementById('admin-password').value = "";
    });
};

onAuthStateChanged(auth, user => {
  if (user) {
    console.log("Auth state changed, user email:", user.email);
  }
  if (user && adminEmails.map(e => e.toLowerCase()).includes(user.email.toLowerCase())) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    loadPages();
    loadAdminUsers();
  } else {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
  }
});

function showSpinner(show) {
  document.getElementById('loading-spinner').style.display = show ? 'block' : 'none';
}

// --- Page Management Logic ---
async function loadPages() {
  showSpinner(true);
  const pagesCol = collection(db, "pages");
  const pageSnapshot = await getDocs(pagesCol);
  let html = "<h3>Pages</h3><ul>";
  pageSnapshot.forEach(docSnap => {
    const data = docSnap.data();
    html += `<li>
      <b>${sanitize(data.title)}</b> (${sanitize(data.path)}) 
      <br>Author: ${sanitize(data.author || "")} | Date: ${sanitize(data.date || "")}
      <button onclick="editPage('${docSnap.id}', \`${data.title.replace(/`/g, '\\`')}\`, \`${data.path.replace(/`/g, '\\`')}\`, \`${data.content ? data.content.replace(/`/g, '\\`') : ''}\`, \`${data.author ? data.author.replace(/`/g, '\\`') : ''}\`, \`${data.date ? data.date.replace(/`/g, '\\`') : ''}\`)">Edit</button>
      <button onclick="deletePage('${docSnap.id}')">Delete</button>
    </li>`;
  });
  html += "</ul>";
  html += `
    <h3>Add Page</h3>
    <input id="new-title" placeholder="Title">
    <input id="new-path" placeholder="Path (e.g. /about)">
    <textarea id="new-content" placeholder="Content"></textarea>
    <input id="new-author" placeholder="Author">
    <input id="new-date" type="date" placeholder="Date">
    <button onclick="addPage()">Add Page</button>
    <div id="page-error" style="color:red;"></div>
    <input id="search-pages" placeholder="Search pages..." oninput="filterPages()">
  `;
  document.getElementById('admin-dashboard').innerHTML = html;
  showSpinner(false);
}

window.addPage = async function() {
  const title = document.getElementById('new-title').value;
  const path = document.getElementById('new-path').value;
  const content = document.getElementById('new-content').value;
  const author = document.getElementById('new-author').value;
  const date = document.getElementById('new-date').value;
  if (!title || !path) {
    document.getElementById('page-error').textContent = "Title and path are required.";
    showMessage("Title and path are required.", "red");
    return;
  }
  await addDoc(collection(db, "pages"), { 
    title: sanitize(title), 
    path: sanitize(path), 
    content: sanitize(content),
    author: sanitize(author),
    date: date
  });
  showMessage("Page added!");
  loadPages();
};

window.deletePage = async function(id) {
  if (!confirm("Are you sure you want to delete this page?")) return;
  await deleteDoc(doc(db, "pages", id));
  showMessage("Page deleted!");
  loadPages();
};

let editingPageId = null;

window.editPage = function(id, title, path, content, author = "", date = "") {
  editingPageId = id;
  document.getElementById('edit-title').value = title;
  document.getElementById('edit-path').value = path;
  document.getElementById('edit-content').value = content;
  document.getElementById('edit-author').value = author;
  document.getElementById('edit-date').value = date;
  document.getElementById('edit-modal').style.display = 'block';
};

window.closeEditModal = function() {
  document.getElementById('edit-modal').style.display = 'none';
  editingPageId = null;
};

window.saveEditPage = async function() {
  const title = document.getElementById('edit-title').value;
  const path = document.getElementById('edit-path').value;
  const content = document.getElementById('edit-content').value;
  const author = document.getElementById('edit-author').value;
  const date = document.getElementById('edit-date').value;
  if (!title || !path) {
    document.getElementById('edit-error').textContent = "Title and path are required.";
    showMessage("Title and path are required.", "red");
    return;
  }
  await setDoc(doc(db, "pages", editingPageId), { 
    title: sanitize(title), 
    path: sanitize(path), 
    content: sanitize(content),
    author: sanitize(author),
    date: date
  });
  closeEditModal();
  showMessage("Page updated!");
  loadPages();
};

function sanitize(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

function showMessage(msg, color="green") {
  const el = document.getElementById('admin-message');
  el.textContent = msg;
  el.style.color = color;
  setTimeout(() => { el.textContent = ""; }, 2000);
}

window.filterPages = function() {
  const query = document.getElementById('search-pages').value.toLowerCase();
  const items = document.querySelectorAll('#admin-dashboard ul li');
  items.forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(query) ? '' : 'none';
  });
};

// --- Admin Users Logic ---
async function loadAdminUsers() {
  const usersCol = collection(db, "adminUsers");
  const usersSnapshot = await getDocs(usersCol);
  let html = "";
  usersSnapshot.forEach(docSnap => {
    const data = docSnap.data();
    html += `<li>${sanitize(data.email)} <button onclick="removeAdminUser('${docSnap.id}')">Remove</button></li>`;
  });
  document.getElementById('admin-users-list').innerHTML = html;
  document.getElementById('admin-users-section').style.display = 'block';
}

window.addAdminUser = async function() {
  const email = document.getElementById('new-admin-email').value.trim();
  if (!email) {
    document.getElementById('admin-user-error').textContent = "Email required.";
    return;
  }
  await addDoc(collection(db, "adminUsers"), { email: sanitize(email) });
  document.getElementById('new-admin-email').value = "";
  loadAdminUsers();
};

window.removeAdminUser = async function(id) {
  await deleteDoc(doc(db, "adminUsers", id));
  loadAdminUsers();
};
