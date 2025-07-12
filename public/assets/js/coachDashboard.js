import {
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  query,
  where,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { logAnalyticsEvent } from './analyticsLogger.js';
import { db } from './firebaseConfig.js';

const coachId = localStorage.getItem('coachId') || 'demoCoach';
const coachTeamName = localStorage.getItem('team') || 'Demo Team';
logAnalyticsEvent('visit', coachId, 'coach');

(async function checkApproval() {
  const ref = doc(db, 'coaches', coachId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    document.body.innerHTML =
      '<h2 style="text-align:center;margin-top:100px;">❌ Coach profile not found.</h2>';
    return;
  }
  const data = snap.data();
  if (data.approved === false) {
    document.body.innerHTML =
      '<h2 style="text-align:center;margin-top:100px;">⏳ Your account is pending admin approval.</h2>';
    return;
  }
  loadTeamGames();
})();

async function loadTeamGames() {
  const gameSnap = await getDocs(
    query(collection(db, 'games'), where('teamName', '==', coachTeamName))
  );
  const historyContainer = document.getElementById('teamGameHistory');
  if (!historyContainer) {
    return;
  }
  historyContainer.innerHTML = '';

  gameSnap.forEach(doc => {
    const game = doc.data();
    const gameId = doc.id;
    const div = document.createElement('div');
    div.classList.add('game-card');
    div.innerHTML = `
      <h3>${game.date || 'Unknown'} vs ${game.opponent || 'Opponent'}</h3>
      <p>Final Score: ${game.finalScore || 'TBD'}</p>
      <button onclick="viewPlayerBreakdowns('${gameId}')">View Player Stats</button>
      <button onclick="viewGameHighlights('${gameId}')">View Highlights</button>
    `;
    historyContainer.appendChild(div);
  });
}

window.viewGameHighlights = async function (gameId) {
  const container = document.getElementById('coachPlayerView');
  if (!container) {
    return;
  }
  container.innerHTML = `<h3>🎬 Highlights for Game: ${gameId}</h3>`;
  const clipsSnap = await getDocs(collection(db, `games/${gameId}/clips`));
  clipsSnap.forEach(doc => {
    const clip = doc.data();
    const clipDiv = document.createElement('div');
    clipDiv.classList.add('clip-box');
    clipDiv.innerHTML = `
      <p>${clip.type || 'Play'}</p>
      <video src="${clip.clipUrl}" controls width="320"></video>
    `;
    container.appendChild(clipDiv);
  });
};

window.viewPlayerBreakdowns = async function (gameId) {
  const breakdown =
    document.getElementById('gameBreakdownView') ||
    document.createElement('div');
  breakdown.id = 'gameBreakdownView';
  breakdown.innerHTML = `<h3>🧠 AI Player Tags - ${gameId}</h3>`;

  const snap = await getDocs(collection(db, `playerStats/${gameId}/plays`));
  const byPlayer = {};

  snap.forEach(doc => {
    const d = doc.data();
    if (!byPlayer[d.playerId]) {
      byPlayer[d.playerId] = [];
    }
    byPlayer[d.playerId].push(d);
  });

  for (const [pid, actions] of Object.entries(byPlayer)) {
    const block = document.createElement('div');
    block.innerHTML = `<strong>${pid}</strong><ul>${actions.map(p => `<li>${p.type} at ${p.timestamp}s</li>`).join('')}</ul>`;

    // Scouting report
    const rptRef = doc(db, `scoutingReports/${gameId}_${pid}`);
    const rptSnap = await getDoc(rptRef);
    if (rptSnap.exists()) {
      const rpt = rptSnap.data();
      block.innerHTML += `<p><strong>📋 Scouting Report:</strong><br>${rpt.report}<br><em>Grade: ${rpt.grade}</em></p>`;
    }

    breakdown.appendChild(block);
  }

  document.body.appendChild(breakdown);
};

const uploadForm = document.getElementById('uploadForm');
if (uploadForm) {
  uploadForm.addEventListener('submit', async e => {
    e.preventDefault();
    const gameId = document.getElementById('gameId').value.trim();
    const teamName = document.getElementById('teamName').value.trim();
    const opponent = document.getElementById('opponent').value.trim();
    const gameDate = document.getElementById('gameDate').value;
    const videoUrl = document.getElementById('videoUrl').value.trim();

    const gameRef = doc(db, 'games', gameId);
    await setDoc(gameRef, {
      teamName,
      opponent,
      date: gameDate,
      videoUrl,
      uploadedBy: coachTeamName,
      uploadedAt: serverTimestamp(),
      analysisStatus: 'pending',
      taggingStatus: 'pending-tagging',
    });

    await logAnalyticsEvent('upload', coachId, 'coach');
    alert('✅ Game uploaded and sent for AI analysis!');
    loadTeamGames();
  });
}
