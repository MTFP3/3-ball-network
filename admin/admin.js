import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

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
      if (adminEmails.includes(email)) {
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
  if (user && adminEmails.includes(user.email)) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    loadPages();
  } else {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
  }
});

document.getElementById('logout-btn').onclick = function() {
  signOut(auth);
};

// --- Page Management Logic ---
async function loadPages() {
  const pagesCol = collection(db, "pages");
  const pageSnapshot = await getDocs(pagesCol);
  let html = "<h3>Pages</h3><ul>";
  pageSnapshot.forEach(docSnap => {
    const data = docSnap.data();
    html += `<li>
      <b>${data.title}</b> (${data.path}) 
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
