require('dotenv').config(); // 👈 loads your .env file

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
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

const teamName = localStorage.getItem('team') || 'Demo Team';
const q = query(collection(db, 'games'), where('teamName', '==', teamName));
const snap = await getDocs(q);

const labels = [];
const points = [];
const assists = [];
const rebounds = [];
const steals = [];
const blocks = [];

snap.forEach(doc => {
  const d = doc.data();
  labels.push(d.gameDate || 'Game');
  points.push(d.stats?.points || 0);
  assists.push(d.stats?.assists || 0);
  rebounds.push(d.stats?.rebounds || 0);
  steals.push(d.stats?.steals || 0);
  blocks.push(d.stats?.blocks || 0);
});

const ctx = document.getElementById('teamChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels,
    datasets: [
      { label: 'Points', data: points, borderColor: 'blue', fill: false },
      { label: 'Assists', data: assists, borderColor: 'green', fill: false },
      { label: 'Rebounds', data: rebounds, borderColor: 'orange', fill: false },
      { label: 'Steals', data: steals, borderColor: 'purple', fill: false },
      { label: 'Blocks', data: blocks, borderColor: 'red', fill: false },
    ],
  },
  options: {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  },
});
