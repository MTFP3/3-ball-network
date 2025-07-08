import './modulepreload-polyfill-B5Qt9EMX.js';
/* empty css              */ import { initializeApp as m } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore as u,
  doc as d,
  getDoc as y,
  getDocs as f,
  collection as b,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import L from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
import {
  getStorage as k,
  ref as v,
  getDownloadURL as S,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';
import { l as w } from './teamComparison-DkPk5Wsi.js';
require('dotenv').config();
const x = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  $ = m(x),
  i = u($),
  C = k($),
  s = localStorage.getItem('scoutId') || 'demoScout';
w('visit', s, 'scout');
const h = document.getElementById('searchBar'),
  p = document.getElementById('playerTable');
h.addEventListener('input', E);
let c = [];
(async function () {
  const t = d(i, 'scouts', s),
    e = await y(t);
  if (!e.exists()) {
    document.body.innerHTML =
      '<h2 style="text-align:center;margin-top:100px;">❌ Scout profile not found.</h2>';
    return;
  }
  if (e.data().approved === !1) {
    document.body.innerHTML =
      '<h2 style="text-align:center;margin-top:100px;">⏳ Your account is pending admin approval.</h2>';
    return;
  }
  D();
})();
async function D() {
  const o = await f(b(i, 'players'));
  ((c = []),
    o.forEach(t => {
      const e = t.data();
      c.push({ id: t.id, ...e });
    }),
    I(c));
}
function I(o) {
  ((p.innerHTML = ''),
    o.forEach(t => {
      const e = document.createElement('div');
      (e.classList.add('player-row'),
        (e.innerHTML = `
      <strong>${t.name}</strong> — ${t.position} | ${t.state} | Rating: ${t.rating || 'N/A'}
      <br>
      <a href="/public/player.html?id=${t.id}" target="_blank">View Profile</a>
      ${t.coachId ? `<button onclick="requestContact('${t.id}', '${t.coachId}')">Request Contact</button>` : ''}
      <br><a id="reportLink-${t.id}" target="_blank">Loading report...</a>
    `),
        p.appendChild(e));
      const a = v(C, `reports/${t.id}/daily.pdf`);
      S(a)
        .then(r => {
          const n = document.getElementById(`reportLink-${t.id}`);
          ((n.href = r), (n.textContent = '📄 Daily Report (PDF)'));
        })
        .catch(() => {
          const r = document.getElementById(`reportLink-${t.id}`);
          r.textContent = 'No report available yet';
        });
    }));
}
function E() {
  const o = h.value.toLowerCase(),
    t = c.filter(
      e =>
        e.name.toLowerCase().includes(o) ||
        (e.position && e.position.toLowerCase().includes(o)) ||
        (e.state && e.state.toLowerCase().includes(o))
    );
  I(t);
}
window.requestContact = async function (o, t) {
  const e = d(i, 'contactRequests', `${s}_${o}`);
  (await setDoc(e, {
    scoutId: s,
    playerId: o,
    coachId: t,
    requestedAt: new Date(),
  }),
    await w('contact', s, 'scout'),
    alert('📩 Contact request sent to coach!'));
};
window.searchReports = async function () {
  const o = document.getElementById('searchPlayerId').value.trim(),
    t = document.getElementById('searchGameId').value.trim(),
    e = document.getElementById('reportList');
  ((e.innerHTML = '<h3>🔍 Results:</h3>'),
    (await f(b(i, 'scoutingReports'))).forEach(r => {
      const n = r.data();
      if ((o && !n.playerId.includes(o)) || (t && !n.gameId.includes(t)))
        return;
      const l = document.createElement('div');
      ((l.innerHTML = `
      <strong>Player:</strong> ${n.playerId}<br>
      <strong>Game:</strong> ${n.gameId}<br>
      <strong>Grade:</strong> ${n.grade}<br>
      <strong>Summary:</strong> ${n.report}<br>
      <strong>Strengths:</strong> ${n.strengths.join(', ')}<br>
      <strong>Needs Work:</strong> ${n.areasForImprovement.join(', ')}<br>
      <button onclick='downloadScoutReport("${n.playerId}", "${n.gameId}", ${JSON.stringify(n).replace(/'/g, "\\'")})'>Download PDF</button>
      <hr>`),
        e.appendChild(l));
    }));
};
window.downloadScoutReport = function (o, t, e) {
  const a = new L();
  (a.text(`Scouting Report - Player ${o}`, 10, 10),
    a.text(`Game: ${t}`, 10, 20),
    a.text(`Grade: ${e.grade}`, 10, 30),
    a.text(`Summary: ${e.report}`, 10, 40),
    a.text(`Strengths: ${e.strengths.join(', ')}`, 10, 50),
    a.text(
      `Areas for Improvement: ${e.areasForImprovement.join(', ')}`,
      10,
      60
    ),
    a.save(`Scouting_Report_${o}_${t}.pdf`));
};
const R = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  T = m(R),
  B = u(T),
  P = localStorage.getItem('playerId') || 'demoPlayer',
  M = d(B, 'players', P),
  g = await y(M),
  j = g.exists() ? g.data() : {},
  A = document.getElementById('smartTags');
A.innerHTML = (j.tags || []).map(o => `<li>${o}</li>`).join('');
//# sourceMappingURL=scout-DLJ3OhQS.js.map
