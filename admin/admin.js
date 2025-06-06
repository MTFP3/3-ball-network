import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0",
  authDomain: "ball-network-web.firebaseapp.com",
  projectId: "ball-network-web",
  storageBucket: "ball-network-web.appspot.com", // <-- Corrected!
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

// --- Login Logic (same as before) ---
document.getElementById('login-btn').onclick = function() {
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      console.log("Signed in as:", email); // <-- This line must be here
      if (adminEmails.map(e => e.toLowerCase()).includes(email.toLowerCase())) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        loadPages();
      } else {
        signOut(auth);
        document.getElementById('login-error').textContent = "You are not an admin.";
      }
    })
    .catch(error => {
      document.getElementById('login-error').textContent = error.message;
    });
};

onAuthStateChanged(auth, user => {
  if (user) {
    console.log("Auth state changed, user email:", user.email); // <-- This line must be here
  }
  if (user && adminEmails.map(e => e.toLowerCase()).includes(user.email.toLowerCase())) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    let html = `
      <h2>Welcome to the Admin Panel!</h2>
      <button id="logout-btn">Logout</button>
    `;
    document.getElementById('admin-dashboard').innerHTML = html;
    document.getElementById('logout-btn').onclick = function() {
      signOut(auth);
    };
    loadPages();
  } else {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
  }
});

// --- Page Management Logic ---
async function loadPages() {
  const pagesCol = collection(db, "pages");
  const pageSnapshot = await getDocs(pagesCol);
  let html = "<h3>Pages</h3><ul>";
  pageSnapshot.forEach(docSnap => {
    const data = docSnap.data();
    html += `<li>
      <b>${data.title}</b> (${data.path}) 
      <button onclick="editPage('${docSnap.id}', \`${data.title.replace(/`/g, '\\`')}\`, \`${data.path.replace(/`/g, '\\`')}\`, \`${data.content ? data.content.replace(/`/g, '\\`') : ''}\`)">Edit</button>
      <button onclick="deletePage('${docSnap.id}')">Delete</button>
    </li>`;
  });
  html += "</ul>";
  html += `
    <h3>Add Page</h3>
    <input id="new-title" placeholder="Title">
    <input id="new-path" placeholder="Path (e.g. /about)">
    <textarea id="new-content" placeholder="Content"></textarea>
    <button onclick="addPage()">Add Page</button>
    <div id="page-error" style="color:red;"></div>
  `;
  document.getElementById('admin-dashboard').innerHTML = html;
}

window.addPage = async function() {
  const title = document.getElementById('new-title').value;
  const path = document.getElementById('new-path').value;
  const content = document.getElementById('new-content').value;
  if (!title || !path) {
    document.getElementById('page-error').textContent = "Title and path are required.";
    return;
  }
  await addDoc(collection(db, "pages"), { title, path, content });
  loadPages();
};

window.deletePage = async function(id) {
  await deleteDoc(doc(db, "pages", id));
  loadPages();
};

let editingPageId = null;

window.editPage = function(id, title, path, content) {
  editingPageId = id;
  document.getElementById('edit-title').value = title;
  document.getElementById('edit-path').value = path;
  document.getElementById('edit-content').value = content;
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
  if (!title || !path) {
    document.getElementById('edit-error').textContent = "Title and path are required.";
    return;
  }
  await setDoc(doc(db, "pages", editingPageId), { title, path, content });
  closeEditModal();
  loadPages();
};

<!-- Add this after #admin-dashboard -->
<div id="edit-modal" style="display:none; position:fixed; top:10%; left:50%; transform:translateX(-50%); background:#fff; border:1px solid #ccc; padding:1em; z-index:1000;">
  <h3>Edit Page</h3>
  <input id="edit-title" placeholder="Title"><br>
  <input id="edit-path" placeholder="Path"><br>
  <textarea id="edit-content" placeholder="Content"></textarea><br>
  <button onclick="saveEditPage()">Save</button>
  <button onclick="closeEditModal()">Cancel</button>
  <div id="edit-error" style="color:red;"></div>
</div>
