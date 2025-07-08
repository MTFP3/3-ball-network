import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js';
import { initializeApp as m } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore as g,
  doc as d,
  getDoc as u,
  getDocs as y,
  collection as f,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import $ from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
import {
  getStorage as L,
  ref as S,
  getDownloadURL as k,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';
import { F as b } from './teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K.js';
/* empty css                                                                    */ require('dotenv').config();
const x = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  w = m(x),
  c = g(w),
  v = L(w),
  i = localStorage.getItem('scoutId') || 'demoScout';
b('visit', i, 'scout');
const I = document.getElementById('searchBar'),
  l = document.getElementById('playerTable');
I.addEventListener('input', E);
let s = [];
(async function () {
  const o = d(c, 'scouts', i),
    t = await u(o);
  if (!t.exists()) {
    document.body.innerHTML =
      '<h2 style="text-align:center;margin-top:100px;">❌ Scout profile not found.</h2>';
    return;
  }
  if (t.data().approved === !1) {
    document.body.innerHTML =
      '<h2 style="text-align:center;margin-top:100px;">⏳ Your account is pending admin approval.</h2>';
    return;
  }
  C();
})();
async function C() {
  const o = await y(f(c, 'players'));
  ((s = []),
    o.forEach(t => {
      const e = t.data();
      s.push({ id: t.id, ...e });
    }),
    h(s));
}
function h(o) {
  ((l.innerHTML = ''),
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
        l.appendChild(e));
      const r = S(v, `reports/${t.id}/daily.pdf`);
      k(r)
        .then(n => {
          const a = document.getElementById(`reportLink-${t.id}`);
          ((a.href = n), (a.textContent = '📄 Daily Report (PDF)'));
        })
        .catch(() => {
          const n = document.getElementById(`reportLink-${t.id}`);
          n.textContent = 'No report available yet';
        });
    }));
}
function E() {
  const o = I.value.toLowerCase(),
    t = s.filter(
      e =>
        e.name.toLowerCase().includes(o) ||
        (e.position && e.position.toLowerCase().includes(o)) ||
        (e.state && e.state.toLowerCase().includes(o))
    );
  h(t);
}
window.requestContact = async function (o, t) {
  const e = d(c, 'contactRequests', `${i}_${o}`);
  (await setDoc(e, {
    scoutId: i,
    playerId: o,
    coachId: t,
    requestedAt: new Date(),
  }),
    await b('contact', i, 'scout'),
    alert('📩 Contact request sent to coach!'));
};
window.searchReports = async function () {
  const o = document.getElementById('searchPlayerId').value.trim(),
    t = document.getElementById('searchGameId').value.trim(),
    e = document.getElementById('reportList');
  ((e.innerHTML = '<h3>🔍 Results:</h3>'),
    (await y(f(c, 'scoutingReports'))).forEach(r => {
      const n = r.data();
      if ((o && !n.playerId.includes(o)) || (t && !n.gameId.includes(t)))
        return;
      const a = document.createElement('div');
      ((a.innerHTML = `
      <strong>Player:</strong> ${n.playerId}<br>
      <strong>Game:</strong> ${n.gameId}<br>
      <strong>Grade:</strong> ${n.grade}<br>
      <strong>Summary:</strong> ${n.report}<br>
      <strong>Strengths:</strong> ${n.strengths.join(', ')}<br>
      <strong>Needs Work:</strong> ${n.areasForImprovement.join(', ')}<br>
      <button onclick='downloadScoutReport("${n.playerId}", "${n.gameId}", ${JSON.stringify(n).replace(/'/g, "\\'")})'>Download PDF</button>
      <hr>`),
        e.appendChild(a));
    }));
};
window.downloadScoutReport = function (o, t, e) {
  const r = new $();
  (r.text(`Scouting Report - Player ${o}`, 10, 10),
    r.text(`Game: ${t}`, 10, 20),
    r.text(`Grade: ${e.grade}`, 10, 30),
    r.text(`Summary: ${e.report}`, 10, 40),
    r.text(`Strengths: ${e.strengths.join(', ')}`, 10, 50),
    r.text(
      `Areas for Improvement: ${e.areasForImprovement.join(', ')}`,
      10,
      60
    ),
    r.save(`Scouting_Report_${o}_${t}.pdf`));
};
const D = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  R = m(D),
  B = g(R),
  T = localStorage.getItem('playerId') || 'demoPlayer',
  M = d(B, 'players', T),
  p = await u(M),
  j = p.exists() ? p.data() : {},
  P = document.getElementById('smartTags');
P.innerHTML = (j.tags || []).map(o => `<li>${o}</li>`).join('');
//# sourceMappingURL=scout-PP2EHfzg.js.map
