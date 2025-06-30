// /assets/js/playerDashboard.js
require('dotenv').config(); // 👈 loads your .env file

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';
import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js';
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

const playerId = localStorage.getItem('playerId') || 'demoPlayer';
logAnalyticsEvent('visit', playerId, 'player');

async function loadPlayerData() {
  const ref = doc(db, 'players', playerId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  if (data.approved === false) {
    document.body.innerHTML =
      '<h2 style="text-align:center;margin-top:100px;">⏳ Your account is pending approval by an admin.</h2>';
    return;
  }

  document.getElementById('playerName').textContent = data.name;
  document.getElementById('name').textContent = data.name;
  document.getElementById('position').textContent = data.position;
  document.getElementById('height').textContent = data.height;
  document.getElementById('weight').textContent = data.weight;
  document.getElementById('school').textContent = data.school;
  document.getElementById('state').textContent = data.state;
  document.getElementById('rating').textContent = data.rating || 'TBD';
  document.getElementById('profilePic').src =
    data.photoUrl || '/assets/images/default-avatar.png';

  document.getElementById('avgGrade').textContent =
    data.avgGameGrade?.letter || '-';
  document.getElementById('resumePreview').src =
    data.resumeUrl || 'https://example.com/sample-resume.pdf';
  document.getElementById('highlightVideo').src = data.highlightUrl || '';

  const stats = data.stats || {};
  const statsList = document.getElementById('statsList');
  if (statsList) {
    statsList.innerHTML = Object.entries(stats)
      .map(([k, v]) => `<li>${k}: ${v}</li>`)
      .join('');
  }

  const grades = data.recentGrades || [70, 65, 62, 80, 50];
  const labels = ['G1', 'G2', 'G3', 'G4', 'G5'];
  if (document.getElementById('gradeChart')) {
    new Chart(document.getElementById('gradeChart'), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Game Grades',
            data: grades,
            borderWidth: 2,
            fill: false,
          },
        ],
      },
    });
  }

  if (data.heatmap && data.heatmap.shotLocations) {
    renderHeatmap(data.heatmap.shotLocations);
  }

  loadClassProgress();
  loadGameBreakdowns();
  loadHighlights();
  loadDailyReport();
}

async function loadDailyReport() {
  const link = document.getElementById('dailyReportLink');
  try {
    const url = await getDownloadURL(
      storageRef(storage, `reports/${playerId}/daily.pdf`)
    );
    link.href = url;
    link.textContent = '📄 Download Daily Report (PDF)';
    link.style.display = 'inline-block';
  } catch (e) {
    link.textContent = 'Report not available yet.';
    link.style.display = 'block';
  }
}

function renderHeatmap(locations) {
  const ctx = document.getElementById('shotChart').getContext('2d');
  const made = locations
    .filter(s => s.result === 'made')
    .map(p => ({ x: p.x, y: p.y }));
  const missed = locations
    .filter(s => s.result === 'missed')
    .map(p => ({ x: p.x, y: p.y }));

  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Made Shots',
          data: made,
          pointStyle: 'circle',
          backgroundColor: 'green',
        },
        {
          label: 'Missed Shots',
          data: missed,
          pointStyle: 'x',
          backgroundColor: 'red',
        },
      ],
    },
    options: {
      scales: {
        x: { min: 0, max: 100 },
        y: { min: 0, max: 100 },
      },
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  });
}

async function loadHighlights() {
  const snap = await getDocs(collection(db, `players/${playerId}/highlights`));
  const gallery = document.getElementById('highlightGallery');
  if (!gallery) return;
  gallery.innerHTML = '';

  snap.forEach(doc => {
    const clip = doc.data();
    const div = document.createElement('div');
    div.classList.add('clip-card');
    div.innerHTML = `
      <p>${clip.type || 'Play'}</p>
      <video src="${clip.clipUrl}" controls width="300"></video>
    `;
    gallery.appendChild(div);
  });
}

async function loadClassProgress() {
  const classList = [
    { id: 'financial', label: 'Financial Literacy' },
    { id: 'nil', label: 'NIL Training' },
    { id: 'leadership', label: 'Leadership' },
    { id: 'social', label: 'Social Media Etiquette' },
  ];

  const wrapper = document.getElementById('classList');
  if (!wrapper) return;
  wrapper.innerHTML = '';

  for (const cls of classList) {
    const ref = doc(db, `players/${playerId}/classes/${cls.id}`);
    const snap = await getDoc(ref);
    const status = snap.exists() ? snap.data().status : 'Not Started';

    const li = document.createElement('li');
    li.innerHTML = `${cls.label} — <strong>${status}</strong> <button onclick="startClass('${cls.id}')">Start</button>`;
    wrapper.appendChild(li);
  }
}

async function loadGameBreakdowns() {
  const breakdownDiv = document.getElementById('gameBreakdowns');
  if (!breakdownDiv) return;
  breakdownDiv.innerHTML = '<h3>🧠 Game Breakdown</h3>';

  const gameRefs = await getDocs(collection(db, 'games'));
  for (const game of gameRefs.docs) {
    const gameId = game.id;
    const playsRef = collection(db, `playerStats/${gameId}/plays`);
    const snap = await getDocs(playsRef);

    const tagged = [];
    snap.forEach(doc => {
      const d = doc.data();
      if (d.playerId === playerId) tagged.push(d);
    });

    if (tagged.length > 0) {
      const block = document.createElement('div');
      block.innerHTML = `<strong>Game: ${gameId}</strong><ul>${tagged.map(p => `<li>${p.type} at ${p.timestamp}s</li>`).join('')}</ul>`;

      // Scouting report
      const reportRef = doc(db, `scoutingReports/${gameId}_${playerId}`);
      const reportSnap = await getDoc(reportRef);
      if (reportSnap.exists()) {
        const rpt = reportSnap.data();
        block.innerHTML += `<p><strong>📋 Scouting Report:</strong><br>${rpt.report}<br><em>Grade: ${rpt.grade}</em></p>`;
      }

      breakdownDiv.appendChild(block);
    }
  }
}

window.startClass = async function (classId) {
  const ref = doc(db, `players/${playerId}/classes/${classId}`);
  await setDoc(
    ref,
    {
      status: 'In Progress',
      startedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  alert(`📘 Class started: ${classId}`);
  loadClassProgress();
};

window.downloadResume = function () {
  const iframe = document.getElementById('resumePreview');
  const link = document.createElement('a');
  link.href = iframe.src;
  link.download = 'Player_Resume.pdf';
  link.click();
};

loadPlayerData();
