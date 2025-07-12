// firebaseAuth.js

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import {
  doc,
  setDoc,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { logAnalyticsEvent } from './analyticsLogger.js';
import { auth, db } from './firebaseConfig.js';

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

  await setDoc(doc(db, `${role}s`, uid), data);
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
