import {
  collection,
  query,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js';
import { db } from './firebaseConfig.js';

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
