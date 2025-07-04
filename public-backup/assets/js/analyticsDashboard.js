require('dotenv').config(); // 👈 loads your .env file

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
  collection,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js';

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

const chartData = {
  login: {},
  visit: {},
  upload: {},
  contact: {},
};

function formatDate(ts) {
  const date = ts.toDate();
  return date.toISOString().split('T')[0];
}

async function loadAnalyticsData() {
  const snap = await getDocs(collection(db, 'analyticsLog'));
  snap.forEach(doc => {
    const data = doc.data();
    if (!data.timestamp) return;
    const dateKey = formatDate(data.timestamp);
    if (!chartData[data.type][dateKey]) {
      chartData[data.type][dateKey] = 0;
    }
    chartData[data.type][dateKey]++;
  });
  renderCharts();
}

function renderCharts() {
  const labels = [
    ...new Set(Object.values(chartData).flatMap(obj => Object.keys(obj))),
  ].sort();

  const types = ['login', 'visit', 'upload', 'contact'];
  types.forEach(type => {
    const ctx = document.getElementById(`${type}Chart`);
    if (!ctx) return;
    const values = labels.map(l => chartData[type][l] || 0);
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: `${type.toUpperCase()} Events`,
            data: values,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: `${type.toUpperCase()} Analytics` },
        },
      },
    });
  });
}

loadAnalyticsData();
