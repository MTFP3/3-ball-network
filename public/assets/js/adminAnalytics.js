import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase.js';
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js';
import { firebaseConfig } from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ctx = document.getElementById('adminAnalyticsChart').getContext('2d');

const logRef = collection(db, 'analyticsLog');
const logsByDate = {};

const start = new Date();
start.setDate(start.getDate() - 14);
const cutoff = Timestamp.fromDate(start);

const q = query(logRef, where('timestamp', '>', cutoff));
const snapshot = await getDocs(q);

snapshot.forEach(doc => {
  const data = doc.data();
  const date = data.timestamp.toDate().toLocaleDateString();
  logsByDate[date] = (logsByDate[date] || 0) + 1;
});

const labels = Object.keys(logsByDate);
const values = Object.values(logsByDate);

new Chart(ctx, {
  type: 'line',
  data: {
    labels,
    datasets: [
      {
        label: 'Platform Activity (14 days)',
        data: values,
        backgroundColor: 'rgba(0,113,206,0.2)',
        borderColor: '#0071ce',
        borderWidth: 2,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  },
});
