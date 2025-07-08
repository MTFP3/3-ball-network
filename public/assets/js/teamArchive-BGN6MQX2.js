import './modulepreload-polyfill-B5Qt9EMX.js';
/* empty css              */ import { initializeApp as i } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore as c,
  collection as p,
  getDocs as m,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
require('dotenv').config();
const l = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  d = i(l),
  g = c(d),
  s = new URLSearchParams(window.location.search).get('team') || 'demoTeam';
document.getElementById('teamTitle').textContent = `📘 Team Archive: ${s}`;
const n = document.getElementById('seasonList'),
  h = p(g, `teamArchive/${s}/seasons`);
m(h).then(a => {
  if (a.empty) {
    n.innerHTML = '<p>No historical data available yet.</p>';
    return;
  }
  a.forEach(r => {
    const e = r.data(),
      t = document.createElement('div');
    ((t.className = 'card'),
      (t.innerHTML = `
      <h3>${e.year} Season</h3>
      <p><strong>Record:</strong> ${e.record}</p>
      <p><strong>Top Players:</strong> ${e.topPlayers?.join(', ') || 'N/A'}</p>
      <p><strong>Tags:</strong> ${e.tags?.join(', ') || 'None'}</p>
      <h4>Game History:</h4>
      <ul>
        ${(e.games || []).map(o => `<li>${o.date}: ${o.opponent} — ${o.score}</li>`).join('')}
      </ul>
    `),
      n.appendChild(t));
  });
});
//# sourceMappingURL=teamArchive-BGN6MQX2.js.map
