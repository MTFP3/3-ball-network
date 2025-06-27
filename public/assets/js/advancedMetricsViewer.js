require('dotenv').config(); // 👈 loads your .env file

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
  doc,
  getDoc
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

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

const uid = localStorage.getItem("playerId") || localStorage.getItem("teamId") || "demoPlayer";
const metricsRef = doc(db, "advancedMetrics", uid);
const container = document.getElementById("metricsViewer");

getDoc(metricsRef).then(docSnap => {
  if (docSnap.exists()) {
    const m = docSnap.data();
    container.innerHTML = `
      <h4>Advanced Metrics</h4>
      <ul>
        <li>Effective FG%: ${m.eFG}%</li>
        <li>Turnover %: ${m.turnoverPct}%</li>
        <li>Assist/Turnover: ${m.astToTO ?? "N/A"}</li>
        <li>Points/Possession: ${m.pointsPerPoss ?? "N/A"}</li>
        <li>Rebounds: ${m.rebounds ?? "N/A"}</li>
        <li>Plus/Minus: ${m.plusMinus ?? "N/A"}</li>
        <li><small>Updated: ${m.timestamp?.toDate ? m.timestamp.toDate().toLocaleString() : "N/A"}</small></li>
      </ul>
    `;
  } else {
    container.textContent = "No advanced metrics available yet.";
  }
});