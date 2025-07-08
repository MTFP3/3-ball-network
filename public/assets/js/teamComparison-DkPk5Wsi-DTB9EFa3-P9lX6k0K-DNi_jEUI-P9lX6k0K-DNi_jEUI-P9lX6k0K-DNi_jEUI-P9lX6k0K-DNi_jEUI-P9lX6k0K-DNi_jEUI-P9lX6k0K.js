import { initializeApp as p } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore as b,
  getDoc as m,
  doc as l,
  query as $,
  collection as w,
  where as h,
  getDocs as f,
  addDoc as I,
  serverTimestamp as v,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
require('dotenv').config();
const k = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  L = p(k),
  T = b(L);
async function M(e, a, r) {
  try {
    (await I(w(T, 'analyticsLog'), {
      type: e,
      userId: a,
      role: r,
      timestamp: v(),
    }),
      console.log(`📊 Logged: ${e} from ${r} (${a})`));
  } catch (t) {
    console.error('⚠️ Analytics log error:', t);
  }
}
require('dotenv').config();
const A = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  B = p(A),
  g = b(B);
window.comparePlayers = async function () {
  const e = document.getElementById('compareP1').value.trim(),
    a = document.getElementById('compareP2').value.trim(),
    r = document.getElementById('comparisonResults');
  r.innerHTML = '<h3>🧠 Comparison Result</h3>';
  const t = await Promise.all([
      m(l(g, 'playerProfiles', e)),
      m(l(g, 'playerProfiles', a)),
      m(l(g, 'scoutingReports', `latest_${e}`)),
      m(l(g, 'scoutingReports', `latest_${a}`)),
    ]),
    o = t[0].data() || {},
    s = t[1].data() || {},
    n = t[2].data() || {},
    i = t[3].data() || {},
    d = `
    <table border="1" cellpadding="10">
      <tr><th>Category</th><th>${e}</th><th>${a}</th></tr>
      <tr><td>Rating</td><td>${o.rating || '-'}</td><td>${s.rating || '-'}</td></tr>
      <tr><td>Grade</td><td>${n.grade || '-'}</td><td>${i.grade || '-'}</td></tr>
      <tr><td>Strengths</td><td>${(n.strengths || []).join(', ')}</td><td>${(i.strengths || []).join(', ')}</td></tr>
      <tr><td>Needs Work</td><td>${(n.areasForImprovement || []).join(', ')}</td><td>${(i.areasForImprovement || []).join(', ')}</td></tr>
    </table>`;
  r.innerHTML += d;
};
require('dotenv').config();
const D = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  x = p(D),
  C = b(x);
window.compareTeams = async function () {
  const e = document.getElementById('teamOne').value.trim(),
    a = document.getElementById('teamTwo').value.trim(),
    r = document.getElementById('teamComparisonResults');
  r.innerHTML = '<h3>🏆 Team Comparison</h3>';
  const t = await u(e),
    o = await u(a),
    s = `
    <table border="1" cellpadding="10">
      <tr><th>Category</th><th>${e}</th><th>${a}</th></tr>
      <tr><td>Games</td><td>${t.games}</td><td>${o.games}</td></tr>
      <tr><td>Wins</td><td>${t.wins}</td><td>${o.wins}</td></tr>
      <tr><td>Avg Points</td><td>${t.points}</td><td>${o.points}</td></tr>
      <tr><td>Avg Rebounds</td><td>${t.rebounds}</td><td>${o.rebounds}</td></tr>
      <tr><td>Avg Assists</td><td>${t.assists}</td><td>${o.assists}</td></tr>
      <tr><td>Team Grade</td><td>${t.grade}</td><td>${o.grade}</td></tr>
    </table>`;
  r.innerHTML += s;
};
async function u(e) {
  const a = $(w(C, 'games'), h('teamName', '==', e)),
    r = await f(a);
  let t = 0,
    o = 0,
    s = 0,
    n = 0,
    i = 0;
  for (const y of r.docs) {
    const c = y.data();
    ((t += c.stats?.points || 0),
      (o += c.stats?.assists || 0),
      (s += c.stats?.rebounds || 0),
      (n += c.gradeValue || 0),
      c.result === 'win' && i++);
  }
  const d = r.docs.length || 1;
  return {
    games: d,
    wins: i,
    points: (t / d).toFixed(1),
    rebounds: (s / d).toFixed(1),
    assists: (o / d).toFixed(1),
    grade: (n / d).toFixed(1),
  };
}
export { M as F };
//# sourceMappingURL=teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K.js.map
