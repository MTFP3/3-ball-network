require('dotenv').config(); // 👈 loads your .env file

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
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

const topPlayersDiv = document.getElementById('topPlayers');
const highlightGallery = document.getElementById('highlightGallery');
const leaderboard = document.getElementById('leaderboard');

async function loadFanData() {
  const q = query(
    collection(db, 'players'),
    orderBy('rating', 'desc'),
    limit(10)
  );
  const snap = await getDocs(q);

  const topPlayers = [];
  snap.forEach(doc => {
    const data = doc.data();
    topPlayers.push({ id: doc.id, ...data });
  });

  renderTopPlayers(topPlayers);
  renderHighlights(topPlayers);
  renderLeaderboard(topPlayers);
}

function renderTopPlayers(players) {
  topPlayersDiv.innerHTML = players
    .map(
      p => `
    <div class="fan-player-box">
      <strong>${p.name}</strong> — ${p.position || '-'} | Rating: ${p.rating || '-'}
      <br>
      <a href="/public/player.html?id=${p.id}" target="_blank">View Profile</a>
    </div>
  `
    )
    .join('');
}

function renderHighlights(players) {
  highlightGallery.innerHTML = players
    .map(p => {
      return p.highlightUrl
        ? `
      <div class="highlight-card">
        <p><strong>${p.name}</strong></p>
        <video src="${p.highlightUrl}" width="250" controls></video>
      </div>
    `
        : '';
    })
    .join('');
}

function renderLeaderboard(players) {
  leaderboard.innerHTML = players
    .map(
      p => `
    <li>${p.name} — ${p.rating || 0}</li>
  `
    )
    .join('');
}

loadFanData();
