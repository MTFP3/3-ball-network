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

window.comparePlayers = async function () {
  const p1 = document.getElementById("compareP1").value.trim();
  const p2 = document.getElementById("compareP2").value.trim();
  const output = document.getElementById("comparisonResults");
  output.innerHTML = "<h3>🧠 Comparison Result</h3>";

  const reports = await Promise.all([
    getDoc(doc(db, "playerProfiles", p1)),
    getDoc(doc(db, "playerProfiles", p2)),
    getDoc(doc(db, "scoutingReports", `latest_${p1}`)),
    getDoc(doc(db, "scoutingReports", `latest_${p2}`))
  ]);

  const profile1 = reports[0].data() || {};
  const profile2 = reports[1].data() || {};
  const report1 = reports[2].data() || {};
  const report2 = reports[3].data() || {};

  const html = `
    <table border="1" cellpadding="10">
      <tr><th>Category</th><th>${p1}</th><th>${p2}</th></tr>
      <tr><td>Rating</td><td>${profile1.rating || '-'}</td><td>${profile2.rating || '-'}</td></tr>
      <tr><td>Grade</td><td>${report1.grade || '-'}</td><td>${report2.grade || '-'}</td></tr>
      <tr><td>Strengths</td><td>${(report1.strengths || []).join(', ')}</td><td>${(report2.strengths || []).join(', ')}</td></tr>
      <tr><td>Needs Work</td><td>${(report1.areasForImprovement || []).join(', ')}</td><td>${(report2.areasForImprovement || []).join(', ')}</td></tr>
    </table>`;

  output.innerHTML += html;
};