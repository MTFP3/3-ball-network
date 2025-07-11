require('dotenv').config(); // 👈 loads your .env file

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
  collection,
  query,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase.js';
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js';

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

const playerId = localStorage.getItem('playerId') || 'demoPlayer';
const gameRef = collection(db, `players/${playerId}/games`);
const q = query(gameRef);
const snap = await getDocs(q);

const labels = [];
const points = [];
const assists = [];
const rebounds = [];

snap.forEach(doc => {
  const d = doc.data();
  labels.push(d.date || 'Game');
  points.push(d.stats?.points || 0);
  assists.push(d.stats?.assists || 0);
  rebounds.push(d.stats?.rebounds || 0);
});

const ctx = document.getElementById('playerChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels,
    datasets: [
      {
        label: 'Points',
        data: points,
        borderColor: 'blue',
        fill: false,
      },
      {
        label: 'Assists',
        data: assists,
        borderColor: 'green',
        fill: false,
      },
      {
        label: 'Rebounds',
        data: rebounds,
        borderColor: 'orange',
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  },
});
