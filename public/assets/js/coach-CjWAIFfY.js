import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV.js';
import { initializeApp as r } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore as l,
  doc as c,
  getDoc as u,
  getDocs as d,
  query as y,
  collection as m,
  where as f,
  setDoc as N,
  serverTimestamp as z,
  Timestamp as F,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { getStorage as _ } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';
import { F as T } from './teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K.js';
import I from 'https://cdn.jsdelivr.net/npm/chart.js';
/* empty css                                                  */ require('dotenv').config();
const q = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  $ = r(q),
  i = l($);
_($);
const v = localStorage.getItem('coachId') || 'demoCoach',
  B = localStorage.getItem('team') || 'Demo Team';
T('visit', v, 'coach');
(async function () {
  const t = c(i, 'coaches', v),
    e = await u(t);
  if (!e.exists()) {
    document.body.innerHTML =
      '<h2 style="text-align:center;margin-top:100px;">❌ Coach profile not found.</h2>';
    return;
  }
  if (e.data().approved === !1) {
    document.body.innerHTML =
      '<h2 style="text-align:center;margin-top:100px;">⏳ Your account is pending admin approval.</h2>';
    return;
  }
  C();
})();
async function C() {
  const t = await d(y(m(i, 'games'), f('teamName', '==', B))),
    e = document.getElementById('teamGameHistory');
  e &&
    ((e.innerHTML = ''),
    t.forEach(o => {
      const a = o.data(),
        n = o.id,
        s = document.createElement('div');
      (s.classList.add('game-card'),
        (s.innerHTML = `
      <h3>${a.date || 'Unknown'} vs ${a.opponent || 'Opponent'}</h3>
      <p>Final Score: ${a.finalScore || 'TBD'}</p>
      <button onclick="viewPlayerBreakdowns('${n}')">View Player Stats</button>
      <button onclick="viewGameHighlights('${n}')">View Highlights</button>
    `),
        e.appendChild(s));
    }));
}
window.viewGameHighlights = async function (t) {
  const e = document.getElementById('coachPlayerView');
  e &&
    ((e.innerHTML = `<h3>🎬 Highlights for Game: ${t}</h3>`),
    (await d(m(i, `games/${t}/clips`))).forEach(o => {
      const a = o.data(),
        n = document.createElement('div');
      (n.classList.add('clip-box'),
        (n.innerHTML = `
      <p>${a.type || 'Play'}</p>
      <video src="${a.clipUrl}" controls width="320"></video>
    `),
        e.appendChild(n));
    }));
};
window.viewPlayerBreakdowns = async function (t) {
  const e =
    document.getElementById('gameBreakdownView') ||
    document.createElement('div');
  ((e.id = 'gameBreakdownView'),
    (e.innerHTML = `<h3>🧠 AI Player Tags - ${t}</h3>`));
  const o = await d(m(i, `playerStats/${t}/plays`)),
    a = {};
  o.forEach(n => {
    const s = n.data();
    (a[s.playerId] || (a[s.playerId] = []), a[s.playerId].push(s));
  });
  for (const [n, s] of Object.entries(a)) {
    const p = document.createElement('div');
    p.innerHTML = `<strong>${n}</strong><ul>${s.map(g => `<li>${g.type} at ${g.timestamp}s</li>`).join('')}</ul>`;
    const j = c(i, `scoutingReports/${t}_${n}`),
      k = await u(j);
    if (k.exists()) {
      const g = k.data();
      p.innerHTML += `<p><strong>📋 Scouting Report:</strong><br>${g.report}<br><em>Grade: ${g.grade}</em></p>`;
    }
    e.appendChild(p);
  }
  document.body.appendChild(e);
};
const L = document.getElementById('uploadForm');
L &&
  L.addEventListener('submit', async t => {
    t.preventDefault();
    const e = document.getElementById('gameId').value.trim(),
      o = document.getElementById('teamName').value.trim(),
      a = document.getElementById('opponent').value.trim(),
      n = document.getElementById('gameDate').value,
      s = document.getElementById('videoUrl').value.trim(),
      p = c(i, 'games', e);
    (await N(p, {
      teamName: o,
      opponent: a,
      date: n,
      videoUrl: s,
      uploadedBy: B,
      uploadedAt: z(),
      analysisStatus: 'pending',
      taggingStatus: 'pending-tagging',
    }),
      await T('upload', v, 'coach'),
      alert('✅ Game uploaded and sent for AI analysis!'),
      C());
  });
require('dotenv').config();
const J = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  K = r(J),
  V = l(K),
  X = localStorage.getItem('team') || 'Demo Team',
  Z = y(m(V, 'games'), f('teamName', '==', X)),
  U = await d(Z),
  E = [],
  M = [],
  x = [],
  A = [],
  H = [],
  G = [];
U.forEach(t => {
  const e = t.data();
  (E.push(e.gameDate || 'Game'),
    M.push(e.stats?.points || 0),
    x.push(e.stats?.assists || 0),
    A.push(e.stats?.rebounds || 0),
    H.push(e.stats?.steals || 0),
    G.push(e.stats?.blocks || 0));
});
const R = document.getElementById('teamChart').getContext('2d');
new I(R, {
  type: 'line',
  data: {
    labels: E,
    datasets: [
      { label: 'Points', data: M, borderColor: 'blue', fill: !1 },
      { label: 'Assists', data: x, borderColor: 'green', fill: !1 },
      { label: 'Rebounds', data: A, borderColor: 'orange', fill: !1 },
      { label: 'Steals', data: H, borderColor: 'purple', fill: !1 },
      { label: 'Blocks', data: G, borderColor: 'red', fill: !1 },
    ],
  },
  options: { responsive: !0, plugins: { legend: { position: 'bottom' } } },
});
require('dotenv').config();
const Y = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  W = r(Y),
  ee = l(W),
  te = document.getElementById('uploadTrendChart').getContext('2d'),
  ae = m(ee, 'analyticsLog'),
  w = {},
  h = new Date();
h.setDate(h.getDate() - 14);
const oe = F.fromDate(h),
  ne = y(ae, f('timestamp', '>', oe)),
  se = await d(ne);
se.forEach(t => {
  const e = t.data().timestamp.toDate().toLocaleDateString();
  w[e] = (w[e] || 0) + 1;
});
const ie = Object.keys(w),
  re = Object.values(w);
new I(te, {
  type: 'bar',
  data: {
    labels: ie,
    datasets: [
      {
        label: 'Activity Logs (14 days)',
        data: re,
        backgroundColor: '#0071ce',
      },
    ],
  },
  options: {
    responsive: !0,
    scales: { y: { beginAtZero: !0, ticks: { stepSize: 1 } } },
  },
});
require('dotenv').config();
const le = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  ce = r(le),
  de = l(ce),
  me = localStorage.getItem('coachId') || 'demoCoach',
  pe = y(m(de, 'games'), f('uploadedBy', '==', me)),
  ge = await d(pe),
  P = [],
  O = [];
ge.forEach(t => {
  const e = t.data();
  if (!e.result || !e.gameDate) return;
  const o = new Date(e.gameDate);
  (P.push(o.toISOString().split('T')[0]),
    O.push(e.result.toLowerCase() === 'win' ? 1 : 0));
});
const ue = document.getElementById('winLossChart').getContext('2d');
new I(ue, {
  type: 'line',
  data: {
    labels: P,
    datasets: [
      {
        label: 'Win = 1, Loss = 0',
        data: O,
        borderColor: 'green',
        tension: 0.4,
        fill: !1,
      },
    ],
  },
  options: {
    responsive: !0,
    scales: { y: { ticks: { stepSize: 1, min: 0, max: 1 } } },
    plugins: { legend: { position: 'bottom' } },
  },
});
require('dotenv').config();
const be = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  we = r(be),
  ye = l(we),
  fe =
    localStorage.getItem('playerId') ||
    localStorage.getItem('teamId') ||
    'demoPlayer',
  he = c(ye, 'advancedMetrics', fe),
  S = document.getElementById('metricsViewer');
u(he).then(t => {
  if (t.exists()) {
    const e = t.data();
    S.innerHTML = `
      <h4>Advanced Metrics</h4>
      <ul>
        <li>Effective FG%: ${e.eFG}%</li>
        <li>Turnover %: ${e.turnoverPct}%</li>
        <li>Assist/Turnover: ${e.astToTO ?? 'N/A'}</li>
        <li>Points/Possession: ${e.pointsPerPoss ?? 'N/A'}</li>
        <li>Rebounds: ${e.rebounds ?? 'N/A'}</li>
        <li>Plus/Minus: ${e.plusMinus ?? 'N/A'}</li>
        <li><small>Updated: ${e.timestamp?.toDate ? e.timestamp.toDate().toLocaleString() : 'N/A'}</small></li>
      </ul>
    `;
  } else S.textContent = 'No advanced metrics available yet.';
});
const Ie = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  ve = r(Ie),
  Q = l(ve),
  ke = localStorage.getItem('team') || 'Demo Team',
  Le = c(Q, 'teams', ke),
  D = await u(Le),
  Se = D.exists() ? D.data() : {},
  De = document.getElementById('teamTags');
De.innerHTML = (Se.tags || []).map(t => `<li>${t}</li>`).join('');
const Te = localStorage.getItem('playerId') || 'demoPlayer',
  b = document.getElementById('chatBox');
window.sendCoachMessage = async function () {
  const t = document.getElementById('chatInput'),
    e = t.value.trim();
  if (!e) return;
  const o = c(Q, 'players', Te),
    a = await u(o),
    n = a.exists() ? a.data() : {},
    s = await $e(e, n);
  ((b.innerHTML += `<div><strong>You:</strong> ${e}</div>`),
    (b.innerHTML += `<div><strong>Coach:</strong> ${s}</div>`),
    (b.scrollTop = b.scrollHeight),
    (t.value = ''));
};
async function $e(t, e) {
  const o = e.avgGrade || 0,
    a =
      o >= 70
        ? 'Keep up the great work and focus on consistency!'
        : 'Let’s work on defense and shot selection this week.';
  return `Your average grade is ${o}. ${a}`;
}
//# sourceMappingURL=coach-CjWAIFfY.js.map
