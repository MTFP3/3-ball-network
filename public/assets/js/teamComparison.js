require('dotenv').config(); // 👈 loads your .env file

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where
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

window.compareTeams = async function () {
  const t1 = document.getElementById("teamOne").value.trim();
  const t2 = document.getElementById("teamTwo").value.trim();
  const out = document.getElementById("teamComparisonResults");
  out.innerHTML = "<h3>🏆 Team Comparison</h3>";

  const data1 = await fetchTeamStats(t1);
  const data2 = await fetchTeamStats(t2);

  const table = `
    <table border="1" cellpadding="10">
      <tr><th>Category</th><th>${t1}</th><th>${t2}</th></tr>
      <tr><td>Games</td><td>${data1.games}</td><td>${data2.games}</td></tr>
      <tr><td>Wins</td><td>${data1.wins}</td><td>${data2.wins}</td></tr>
      <tr><td>Avg Points</td><td>${data1.points}</td><td>${data2.points}</td></tr>
      <tr><td>Avg Rebounds</td><td>${data1.rebounds}</td><td>${data2.rebounds}</td></tr>
      <tr><td>Avg Assists</td><td>${data1.assists}</td><td>${data2.assists}</td></tr>
      <tr><td>Team Grade</td><td>${data1.grade}</td><td>${data2.grade}</td></tr>
    </table>`;

  out.innerHTML += table;
};

async function fetchTeamStats(team) {
  const q = query(collection(db, "games"), where("teamName", "==", team));
  const snap = await getDocs(q);
  let points = 0, assists = 0, rebounds = 0, gradeTotal = 0, wins = 0;

  for (const doc of snap.docs) {
    const g = doc.data();
    points += g.stats?.points || 0;
    assists += g.stats?.assists || 0;
    rebounds += g.stats?.rebounds || 0;
    gradeTotal += g.gradeValue || 0;
    if (g.result === "win") wins++;
  }

  const count = snap.docs.length || 1;
  return {
    games: count,
    wins,
    points: (points / count).toFixed(1),
    rebounds: (rebounds / count).toFixed(1),
    assists: (assists / count).toFixed(1),
    grade: (gradeTotal / count).toFixed(1)
  };
}