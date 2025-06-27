require('dotenv').config(); // 👈 loads your .env file

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0",
  authDomain: "ball-network-web.firebaseapp.com",
  projectId: "ball-network-web",
  storageBucket: "ball-network-web.appspot.com",
  messagingSenderId: "740915998465",
  appId: "1:740915998465:web:59ac026f3f4c2ec5da3500"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function notifyAdmin(message, type = 'admin') {
  try {
    await addDoc(collection(db, 'adminNotifications'), {
      message,
      type,
      createdAt: serverTimestamp()
    });
    console.log(`🔔 Notification: ${message}`);
  } catch (err) {
    console.error('❌ Notification error:', err);
  }
}