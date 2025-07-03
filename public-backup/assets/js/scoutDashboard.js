require('dotenv').config(); // 👈 loads your .env file

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import jsPDF from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';
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
const db = getFirestore(app);
const storage = getStorage(app);

const scoutId = localStorage.getItem('scoutId') || 'demoScout';
const isVerified = true;
logAnalyticsEvent('visit', scoutId, 'scout');

const searchBar = document.getElementById('searchBar');
const playerTable = document.getElementById('playerTable');

searchBar.addEventListener('input', filterPlayers);

let allPlayers = [];

(async function checkApproval() {
  const ref = doc(db, 'scouts', scoutId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    document.body.innerHTML =
      '<h2 style="text-align:center;margin-top:100px;">❌ Scout profile not found.</h2>';
    return;
  }
  const data = snap.data();
  if (data.approved === false) {
    document.body.innerHTML =
      '<h2 style="text-align:center;margin-top:100px;">⏳ Your account is pending admin approval.</h2>';
    return;
  }
  loadPlayers();
})();

async function loadPlayers() {
  const snap = await getDocs(collection(db, 'players'));
  allPlayers = [];
  snap.forEach(doc => {
    const data = doc.data();
    allPlayers.push({ id: doc.id, ...data });
  });
  renderTable(allPlayers);
}

function renderTable(players) {
  playerTable.innerHTML = '';
  players.forEach(p => {
    const div = document.createElement('div');
    div.classList.add('player-row');
    div.innerHTML = `
      <strong>${p.name}</strong> — ${p.position} | ${p.state} | Rating: ${p.rating || 'N/A'}
      <br>
      <a href="/public/player.html?id=${p.id}" target="_blank">View Profile</a>
      ${isVerified && p.coachId ? `<button onclick="requestContact('${p.id}', '${p.coachId}')">Request Contact</button>` : ''}
      <br><a id="reportLink-${p.id}" target="_blank">Loading report...</a>
    `;
    playerTable.appendChild(div);

    const reportRef = storageRef(storage, `reports/${p.id}/daily.pdf`);
    getDownloadURL(reportRef)
      .then(url => {
        const link = document.getElementById(`reportLink-${p.id}`);
        link.href = url;
        link.textContent = '📄 Daily Report (PDF)';
      })
      .catch(() => {
        const link = document.getElementById(`reportLink-${p.id}`);
        link.textContent = 'No report available yet';
      });
  });
}

function filterPlayers() {
  const keyword = searchBar.value.toLowerCase();
  const filtered = allPlayers.filter(
    p =>
      p.name.toLowerCase().includes(keyword) ||
      (p.position && p.position.toLowerCase().includes(keyword)) ||
      (p.state && p.state.toLowerCase().includes(keyword))
  );
  renderTable(filtered);
}

window.requestContact = async function (playerId, coachId) {
  const ref = doc(db, 'contactRequests', `${scoutId}_${playerId}`);
  await setDoc(ref, {
    scoutId,
    playerId,
    coachId,
    requestedAt: new Date(),
  });
  await logAnalyticsEvent('contact', scoutId, 'scout');
  alert('📩 Contact request sent to coach!');
};

window.searchReports = async function () {
  const playerQuery = document.getElementById('searchPlayerId').value.trim();
  const gameQuery = document.getElementById('searchGameId').value.trim();
  const list = document.getElementById('reportList');
  list.innerHTML = '<h3>🔍 Results:</h3>';

  const snap = await getDocs(collection(db, 'scoutingReports'));
  snap.forEach(docSnap => {
    const data = docSnap.data();
    if (
      (playerQuery && !data.playerId.includes(playerQuery)) ||
      (gameQuery && !data.gameId.includes(gameQuery))
    )
      return;

    const div = document.createElement('div');
    div.innerHTML = `
      <strong>Player:</strong> ${data.playerId}<br>
      <strong>Game:</strong> ${data.gameId}<br>
      <strong>Grade:</strong> ${data.grade}<br>
      <strong>Summary:</strong> ${data.report}<br>
      <strong>Strengths:</strong> ${data.strengths.join(', ')}<br>
      <strong>Needs Work:</strong> ${data.areasForImprovement.join(', ')}<br>
      <button onclick='downloadScoutReport("${data.playerId}", "${data.gameId}", ${JSON.stringify(data).replace(/'/g, "\\'")})'>Download PDF</button>
      <hr>`;
    list.appendChild(div);
  });
};

window.downloadScoutReport = function (playerId, gameId, data) {
  const docPDF = new jsPDF();
  docPDF.text(`Scouting Report - Player ${playerId}`, 10, 10);
  docPDF.text(`Game: ${gameId}`, 10, 20);
  docPDF.text(`Grade: ${data.grade}`, 10, 30);
  docPDF.text(`Summary: ${data.report}`, 10, 40);
  docPDF.text(`Strengths: ${data.strengths.join(', ')}`, 10, 50);
  docPDF.text(
    `Areas for Improvement: ${data.areasForImprovement.join(', ')}`,
    10,
    60
  );
  docPDF.save(`Scouting_Report_${playerId}_${gameId}.pdf`);
};
