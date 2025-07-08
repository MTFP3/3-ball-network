import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js';
import { initializeApp as r } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore as i,
  doc as o,
  getDoc as n,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { d as l } from './fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW.js';
/* empty css                                                                                                        */ const m =
    {
      apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
      authDomain: 'ball-network-web.firebaseapp.com',
      projectId: 'ball-network-web',
      storageBucket: 'ball-network-web.appspot.com',
      messagingSenderId: '740915998465',
      appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
    },
  g = r(m),
  p = i(g),
  d = new URLSearchParams(window.location.search),
  t = d.get('id') || 'demoPlayer',
  c = o(p, 'players', t),
  h = await n(c),
  e = h.data() || {};
document.getElementById('playerName').innerText = e.name || 'Unnamed Player';
document.getElementById('playerStats').innerText =
  `Avg Grade: ${e.avgGrade || 'N/A'} | GPA: ${e.gpa || 'N/A'} | Height: ${e.height || 'N/A'} | Weight: ${e.weight || 'N/A'}`;
document.getElementById('playerHighlights').innerHTML = (e.highlights || [])
  .map(a => `<a href="${a}" target="_blank">🎬 Highlight</a><br>`)
  .join('');
document.getElementById('followPlayer').onclick = () => l('player', t);
//# sourceMappingURL=playerProfile-CfpWj8Gl.js.map
