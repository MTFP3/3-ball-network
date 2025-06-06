import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Your web app's Firebase configuration (from Firebase Console)
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

const adminEmails = [
  "your-admin-email@gmail.com" // <-- Replace with your real admin email!
];

document.getElementById('login-btn').onclick = function() {
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      if (adminEmails.includes(email)) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
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
  } else {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
  }
});
