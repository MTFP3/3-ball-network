import {
  collection,
  query,
  where,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js';
import { db } from './firebaseConfig.js';

const coachId = localStorage.getItem('coachId') || 'demoCoach';
const q = query(collection(db, 'games'), where('uploadedBy', '==', coachId));
const snap = await getDocs(q);

const labels = [];
const values = [];

snap.forEach(doc => {
  const d = doc.data();
  if (!d.result || !d.gameDate) {
    return;
  }
  const date = new Date(d.gameDate);
  labels.push(date.toISOString().split('T')[0]);
  values.push(d.result.toLowerCase() === 'win' ? 1 : 0);
});

const ctx = document.getElementById('winLossChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels,
    datasets: [
      {
        label: 'Win = 1, Loss = 0',
        data: values,
        borderColor: 'green',
        tension: 0.4,
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: { ticks: { stepSize: 1, min: 0, max: 1 } },
    },
    plugins: {
      legend: { position: 'bottom' },
    },
  },
});
