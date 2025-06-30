require('dotenv').config(); // 👈 loads your .env file

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
  collection,
  query,
  getDocs,
  setDoc,
  doc,
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

const q = query(collection(db, 'hudlStats'));
const snap = await getDocs(q);

for (let stat of snap.docs) {
  const { gameId, playerId, stats } = stat.data();
  const minutes = stats.minutes || 1;
  const fgm = stats.fgm || 0;
  const fga = stats.fga || 1;
  const threePM = stats.threePM || 0;
  const ftm = stats.ftm || 0;
  const fta = stats.fta || 1;
  const turnovers = stats.turnovers || 0;
  const oreb = stats.oreb || 0;
  const dreb = stats.dreb || 0;
  const pts = stats.points || 0;

  const eFG = ((fgm + 0.5 * threePM) / fga).toFixed(2);
  const tovPct = (turnovers / (fga + 0.44 * fta + turnovers)).toFixed(2);
  const orebPct = (oreb / (oreb + dreb)).toFixed(2);
  const drebPct = (dreb / (oreb + dreb)).toFixed(2);
  const ftFactor = (ftm / fga).toFixed(2);
  const pointsPerMin = (pts / minutes).toFixed(2);

  const output = {
    eFG: Number(eFG),
    turnoverPct: Number(tovPct),
    orebPct: Number(orebPct),
    drebPct: Number(drebPct),
    ftFactor: Number(ftFactor),
    pointsPerMin: Number(pointsPerMin),
    gameId,
    playerId,
    timestamp: new Date().toISOString(),
  };

  await setDoc(doc(db, 'advancedMetrics', `${playerId}_${gameId}`), output);
}
