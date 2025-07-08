import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-CYcforwy-CYcforwy.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js';
import { initializeApp as w } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore as f,
  getDoc as l,
  doc as d,
  getDocs as h,
  query as D,
  collection as b,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
/* empty css                       */ const I = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  k = w(I),
  o = f(k),
  S = localStorage.getItem('fanId') || 'demoFan',
  s = await l(d(o, 'fans', S)),
  m = s.exists() ? s.data() : {},
  p = m.playersFollowing || [],
  A = m.teamsFollowing || [],
  E = document.getElementById('fanHighlights'),
  B = document.getElementById('fanReports'),
  c = new Date().toDateString();
let g = !1,
  u = !1;
const n = [];
for (let t of p) {
  const e = d(o, 'players', t),
    i = await l(e);
  if (!i.exists()) continue;
  const a = i.data();
  (a.highlights || []).forEach(y => {
    (n.push({
      name: a.name || t,
      link: y,
      date: a.updatedAt || new Date().toISOString(),
    }),
      a.updatedAt && new Date(a.updatedAt).toDateString() === c && (g = !0));
  });
}
n.sort((t, e) => new Date(e.date) - new Date(t.date));
n.forEach(t => {
  E.innerHTML += `<a class='highlight-link' href='${t.link}' target='_blank'>🎬 ${t.name}</a>`;
});
g && (document.getElementById('alertHighlights').style.display = 'block');
const v = await h(D(b(o, 'scoutingReports'))),
  r = [];
v.forEach(t => {
  const e = t.data();
  (p.includes(e.playerId) || A.includes(e.teamName)) &&
    (r.push({
      summary: e.summary,
      player: e.playerName || e.teamName,
      date: e.updatedAt || new Date().toISOString(),
    }),
    e.updatedAt && new Date(e.updatedAt).toDateString() === c && (u = !0));
});
r.sort((t, e) => new Date(e.date) - new Date(t.date));
r.forEach(t => {
  B.innerHTML += `<div><strong>${t.player}</strong>: ${t.summary}</div><br>`;
});
u && (document.getElementById('alertReports').style.display = 'block');
//# sourceMappingURL=fan-CDDkrCv_.js.map
