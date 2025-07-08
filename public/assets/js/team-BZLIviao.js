import './modulepreload-polyfill-B5Qt9EMX.js';
/* empty css              */ import { initializeApp as g } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore as p,
  doc as f,
  getDoc as w,
  getDocs as n,
  query as m,
  collection as c,
  where as i,
  orderBy as y,
  limit as h,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { f as b } from './fanFollow-Bh7dTXqa.js';
const $ = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  E = g($),
  o = p(E),
  u = new URLSearchParams(window.location.search),
  t = u.get('team') || 'Demo Team';
document.getElementById('teamTitle').innerText = `🏀 ${t} Profile`;
document.getElementById('followTeam').onclick = () => b('team', t);
const I = f(o, 'teams', t),
  r = await w(I),
  T = r.exists() ? r.data() : {};
document.getElementById('teamTags').innerHTML = (T.tags || [])
  .map(e => `<li>${e}</li>`)
  .join('');
const s = await n(m(c(o, 'games'), i('teamName', '==', t)));
let l = 0;
s.forEach(e => {
  e.data().result === 'win' && l++;
});
document.getElementById('teamRecord').innerText =
  `Wins: ${l} / Games: ${s.size}`;
const B = await n(m(c(o, 'players'), i('team', '==', t))),
  N = document.getElementById('topPlayers');
B.forEach(e => {
  const a = e.data(),
    d = a.name || e.id;
  N.innerHTML += `<li><a href="playerProfile.html?id=${e.id}" target="_blank">${d}</a> - Avg Grade: ${a.avgGrade || 'N/A'}</li>`;
});
const D = await n(
    m(c(o, 'games'), i('teamName', '==', t), y('gameDate', 'desc'), h(3))
  ),
  k = document.getElementById('recentGames');
D.forEach(e => {
  const a = e.data();
  k.innerHTML += `<li><a href="${a.videoUrl}" target="_blank">${a.opponent} - ${a.gameDate}</a></li>`;
});
const L = await n(m(c(o, 'coaches'), i('teamNames', 'array-contains', t)));
L.forEach(e => {
  const a = e.data();
  document.getElementById('coachContact').innerText =
    `${a.firstName || 'Coach'} ${a.lastName || ''} | Email: ${a.email || 'N/A'}`;
});
//# sourceMappingURL=team-BZLIviao.js.map
