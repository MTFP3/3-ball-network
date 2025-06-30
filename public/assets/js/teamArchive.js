require('dotenv').config(); // 👈 loads your .env file

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

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

const teamId =
  new URLSearchParams(window.location.search).get('team') || 'demoTeam';
document.getElementById('teamTitle').textContent = `📘 Team Archive: ${teamId}`;

const seasonList = document.getElementById('seasonList');
const seasonsRef = collection(db, `teamArchive/${teamId}/seasons`);

getDocs(seasonsRef).then(snapshot => {
  if (snapshot.empty) {
    seasonList.innerHTML = '<p>No historical data available yet.</p>';
    return;
  }

  snapshot.forEach(doc => {
    const season = doc.data();
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>${season.year} Season</h3>
      <p><strong>Record:</strong> ${season.record}</p>
      <p><strong>Top Players:</strong> ${season.topPlayers?.join(', ') || 'N/A'}</p>
      <p><strong>Tags:</strong> ${season.tags?.join(', ') || 'None'}</p>
      <h4>Game History:</h4>
      <ul>
        ${(season.games || []).map(g => `<li>${g.date}: ${g.opponent} — ${g.score}</li>`).join('')}
      </ul>
    `;
    seasonList.appendChild(div);
  });
});
