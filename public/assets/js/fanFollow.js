require('dotenv').config(); // 👈 loads your .env file

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getFirestore, doc, updateDoc, arrayUnion, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

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

const fanId = localStorage.getItem("fanId") || "demoFan";
const fanRef = doc(db, "fans", fanId);

export async function follow(type, id) {
  const field = type === "team" ? "teamsFollowing" : "playersFollowing";
  try {
    await updateDoc(fanRef, { [field]: arrayUnion(id) });
    alert(`✅ Now following ${type}: ${id}`);
  } catch (err) {
    console.error("❌ Follow failed:", err);
  }
}

export async function showFollowStatus() {
  const snap = await getDoc(fanRef);
  if (snap.exists()) {
    const data = snap.data();
    console.log("📌 Following: ", data.teamsFollowing || [], data.playersFollowing || []);
  }
}