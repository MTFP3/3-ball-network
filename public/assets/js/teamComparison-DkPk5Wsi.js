import { initializeApp as g } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore as b,
  addDoc as $,
  collection as f,
  serverTimestamp as y,
  getDoc as p,
  doc as l,
  query as h,
  where as I,
  getDocs as v,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
require('dotenv').config();
const T = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  k = g(T),
  L = b(k);
async function E(e, a, o) {
  try {
    (await $(f(L, 'analyticsLog'), {
      type: e,
      userId: a,
      role: o,
      timestamp: y(),
    }),
      console.log(`📊 Logged: ${e} from ${o} (${a})`));
  } catch (t) {
    console.error('⚠️ Analytics log error:', t);
  }
}
require('dotenv').config();
const C = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  A = g(C),
  m = b(A);
window.comparePlayers = async function () {
  const e = document.getElementById('compareP1').value.trim(),
    a = document.getElementById('compareP2').value.trim(),
    o = document.getElementById('comparisonResults');
  o.innerHTML = '<h3>🧠 Comparison Result</h3>';
  const t = await Promise.all([
      p(l(m, 'playerProfiles', e)),
      p(l(m, 'playerProfiles', a)),
      p(l(m, 'scoutingReports', `latest_${e}`)),
      p(l(m, 'scoutingReports', `latest_${a}`)),
    ]),
    s = t[0].data() || {},
    n = t[1].data() || {},
    d = t[2].data() || {},
    i = t[3].data() || {},
    r = `
    <table border="1" cellpadding="10">
      <tr><th>Category</th><th>${e}</th><th>${a}</th></tr>
      <tr><td>Rating</td><td>${s.rating || '-'}</td><td>${n.rating || '-'}</td></tr>
      <tr><td>Grade</td><td>${d.grade || '-'}</td><td>${i.grade || '-'}</td></tr>
      <tr><td>Strengths</td><td>${(d.strengths || []).join(', ')}</td><td>${(i.strengths || []).join(', ')}</td></tr>
      <tr><td>Needs Work</td><td>${(d.areasForImprovement || []).join(', ')}</td><td>${(i.areasForImprovement || []).join(', ')}</td></tr>
    </table>`;
  o.innerHTML += r;
};
require('dotenv').config();
const B = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  D = g(B),
  x = b(D);
window.compareTeams = async function () {
  const e = document.getElementById('teamOne').value.trim(),
    a = document.getElementById('teamTwo').value.trim(),
    o = document.getElementById('teamComparisonResults');
  o.innerHTML = '<h3>🏆 Team Comparison</h3>';
  const t = await u(e),
    s = await u(a),
    n = `
    <table border="1" cellpadding="10">
      <tr><th>Category</th><th>${e}</th><th>${a}</th></tr>
      <tr><td>Games</td><td>${t.games}</td><td>${s.games}</td></tr>
      <tr><td>Wins</td><td>${t.wins}</td><td>${s.wins}</td></tr>
      <tr><td>Avg Points</td><td>${t.points}</td><td>${s.points}</td></tr>
      <tr><td>Avg Rebounds</td><td>${t.rebounds}</td><td>${s.rebounds}</td></tr>
      <tr><td>Avg Assists</td><td>${t.assists}</td><td>${s.assists}</td></tr>
      <tr><td>Team Grade</td><td>${t.grade}</td><td>${s.grade}</td></tr>
    </table>`;
  o.innerHTML += n;
};
async function u(e) {
  const a = h(f(x, 'games'), I('teamName', '==', e)),
    o = await v(a);
  let t = 0,
    s = 0,
    n = 0,
    d = 0,
    i = 0;
  for (const w of o.docs) {
    const c = w.data();
    ((t += c.stats?.points || 0),
      (s += c.stats?.assists || 0),
      (n += c.stats?.rebounds || 0),
      (d += c.gradeValue || 0),
      c.result === 'win' && i++);
  }
  const r = o.docs.length || 1;
  return {
    games: r,
    wins: i,
    points: (t / r).toFixed(1),
    rebounds: (n / r).toFixed(1),
    assists: (s / r).toFixed(1),
    grade: (d / r).toFixed(1),
  };
}
export { E as l };
//# sourceMappingURL=teamComparison-DkPk5Wsi.js.map
