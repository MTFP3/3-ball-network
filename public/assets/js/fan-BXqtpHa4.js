import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js';
import { initializeApp as w } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore as f,
  getDoc as l,
  doc as d,
  getDocs as h,
  query as D,
  collection as I,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
/* empty css                                                                             */ const b =
    {
      apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
      authDomain: 'ball-network-web.firebaseapp.com',
      projectId: 'ball-network-web',
      storageBucket: 'ball-network-web.appspot.com',
      messagingSenderId: '740915998465',
      appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
    },
  k = w(b),
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
for (let e of p) {
  const t = d(o, 'players', e),
    i = await l(t);
  if (!i.exists()) continue;
  const a = i.data();
  (a.highlights || []).forEach(y => {
    (n.push({
      name: a.name || e,
      link: y,
      date: a.updatedAt || new Date().toISOString(),
    }),
      a.updatedAt && new Date(a.updatedAt).toDateString() === c && (g = !0));
  });
}
n.sort((e, t) => new Date(t.date) - new Date(e.date));
n.forEach(e => {
  E.innerHTML += `<a class='highlight-link' href='${e.link}' target='_blank'>🎬 ${e.name}</a>`;
});
g && (document.getElementById('alertHighlights').style.display = 'block');
const v = await h(D(I(o, 'scoutingReports'))),
  r = [];
v.forEach(e => {
  const t = e.data();
  (p.includes(t.playerId) || A.includes(t.teamName)) &&
    (r.push({
      summary: t.summary,
      player: t.playerName || t.teamName,
      date: t.updatedAt || new Date().toISOString(),
    }),
    t.updatedAt && new Date(t.updatedAt).toDateString() === c && (u = !0));
});
r.sort((e, t) => new Date(t.date) - new Date(e.date));
r.forEach(e => {
  B.innerHTML += `<div><strong>${e.player}</strong>: ${e.summary}</div><br>`;
});
u && (document.getElementById('alertReports').style.display = 'block');
//# sourceMappingURL=fan-BXqtpHa4.js.map
