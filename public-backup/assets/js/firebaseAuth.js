// firebaseAuth.js

require('dotenv').config(); // 👈 loads your .env file

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import {
  getFirestore,
  doc,
  setDoc,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { logAnalyticsEvent } from './analyticsLogger.js';

const firebaseConfig = {
  apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
  authDomain: 'ball-network-web.firebaseapp.com',
  projectId: 'ball-network-web',
  storageBucket: 'ball-network-web.appspot.com',
  messagingSenderId: '740915998465',
  appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// REGISTER NEW USER
export async function registerUser(email, password, role, userData) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;

  const data = {
    ...userData,
    uid,
    email,
    role,
    approved: false,
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, role + 's', uid), data);
  return uid;
}

// LOGIN EXISTING USER
export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const user = cred.user;
  const role = localStorage.getItem('role') || 'unknown';
  await logAnalyticsEvent('login', user.uid, role);
  return user;
}

// REDIRECT TO DASHBOARD
function redirectToDashboard(role) {
  window.location.href = `/portals/${role}/dashboard.html`;
}

// Example: Collect profile data from form fields
const profileData = {
  name: document.getElementById('name').value,
  gender: document.getElementById('gender').value,
  height: document.getElementById('height').value,
  weight: document.getElementById('weight').value,
  school: document.getElementById('school').value,
  city: document.getElementById('city').value,
  state: document.getElementById('state').value,
};
