import './modulepreload-polyfill-B5Qt9EMX.js';
/* empty css              */ import { a } from './firebaseConfig-DCH0t8Yd.js';
import {
  getAuth as u,
  signInWithEmailAndPassword as l,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import {
  getFirestore as p,
  getDoc as c,
  doc as i,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
const d = u(a),
  m = p(a);
document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const o = document.getElementById('email').value,
    n = document.getElementById('password').value,
    t = document.getElementById('loginError');
  t.textContent = '';
  try {
    const s = (await l(d, o, n)).user.uid;
    (await c(i(m, 'players', s))).exists()
      ? (window.location.href = '/portals/player/dashboard.html')
      : (t.textContent = 'Role not found. Please contact support.');
  } catch (r) {
    t.textContent = r.message;
  }
});
document.getElementById('loginBtn').addEventListener('click', function () {
  const e = document.getElementById('email').value,
    o = document.getElementById('password').value;
  g(e, o);
});
function g(e, o) {
  const n = document.getElementById('loginError');
  ((n.textContent = ''),
    l(d, e, o)
      .then(async t => {
        const r = t.user.uid;
        (await c(i(m, 'players', r))).exists()
          ? (window.location.href = '/portals/player/dashboard.html')
          : (n.textContent = 'Role not found. Please contact support.');
      })
      .catch(t => {
        n.textContent = t.message;
      }));
}
//# sourceMappingURL=login-f83E5zIv.js.map
