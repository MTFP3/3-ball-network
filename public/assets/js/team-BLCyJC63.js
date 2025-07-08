import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js';
import { initializeApp as g } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore as p,
  doc as w,
  getDoc as f,
  getDocs as m,
  query as n,
  collection as i,
  where as r,
  orderBy as y,
  limit as h,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { d as E } from './fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW.js';
/* empty css                                                                                                        */ const $ =
    {
      apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
      authDomain: 'ball-network-web.firebaseapp.com',
      projectId: 'ball-network-web',
      storageBucket: 'ball-network-web.appspot.com',
      messagingSenderId: '740915998465',
      appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
    },
  b = g($),
  o = p(b),
  u = new URLSearchParams(window.location.search),
  t = u.get('team') || 'Demo Team';
document.getElementById('teamTitle').innerText = `🏀 ${t} Profile`;
document.getElementById('followTeam').onclick = () => E('team', t);
const I = w(o, 'teams', t),
  c = await f(I),
  T = c.exists() ? c.data() : {};
document.getElementById('teamTags').innerHTML = (T.tags || [])
  .map(e => `<li>${e}</li>`)
  .join('');
const l = await m(n(i(o, 'games'), r('teamName', '==', t)));
let s = 0;
l.forEach(e => {
  e.data().result === 'win' && s++;
});
document.getElementById('teamRecord').innerText =
  `Wins: ${s} / Games: ${l.size}`;
const B = await m(n(i(o, 'players'), r('team', '==', t))),
  k = document.getElementById('topPlayers');
B.forEach(e => {
  const a = e.data(),
    d = a.name || e.id;
  k.innerHTML += `<li><a href="playerProfile.html?id=${e.id}" target="_blank">${d}</a> - Avg Grade: ${a.avgGrade || 'N/A'}</li>`;
});
const D = await m(
    n(i(o, 'games'), r('teamName', '==', t), y('gameDate', 'desc'), h(3))
  ),
  N = document.getElementById('recentGames');
D.forEach(e => {
  const a = e.data();
  N.innerHTML += `<li><a href="${a.videoUrl}" target="_blank">${a.opponent} - ${a.gameDate}</a></li>`;
});
const L = await m(n(i(o, 'coaches'), r('teamNames', 'array-contains', t)));
L.forEach(e => {
  const a = e.data();
  document.getElementById('coachContact').innerText =
    `${a.firstName || 'Coach'} ${a.lastName || ''} | Email: ${a.email || 'N/A'}`;
});
//# sourceMappingURL=team-BLCyJC63.js.map
