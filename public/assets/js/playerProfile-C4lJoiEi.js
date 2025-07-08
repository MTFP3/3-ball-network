import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r.js';
import { initializeApp as r } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore as i,
  doc as o,
  getDoc as n,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { b as g } from './fanFollow-Bh7dTXqa-BOIUMshn.js';
/* empty css                       */ const l = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  m = r(l),
  p = i(m),
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
document.getElementById('followPlayer').onclick = () => g('player', t);
//# sourceMappingURL=playerProfile-C4lJoiEi.js.map
