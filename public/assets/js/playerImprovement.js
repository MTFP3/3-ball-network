require('dotenv').config(); // 👈 loads your .env file

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
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

const playerId = localStorage.getItem('playerId') || 'demoPlayer';
const container = document.getElementById('improvementTips');

async function loadImprovementPlan() {
  const docRef = doc(db, 'playerImprovement', playerId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const { plan, timestamp } = docSnap.data();
    container.innerHTML = `<pre>${plan}</pre><small>Last updated: ${timestamp && timestamp.toDate ? timestamp.toDate().toLocaleString() : 'N/A'}</small>`;
  } else {
    container.textContent = 'Improvement plan not available yet.';
  }
}

loadImprovementPlan();
