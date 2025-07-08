import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV.js';
import { C as r } from './firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI.js';
import {
  getAuth as c,
  signInWithEmailAndPassword as s,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import {
  getFirestore as u,
  getDoc as m,
  doc as d,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import './sw-manager--CjsvoUl--CjsvoUl--CjsvoUl.js';
/* empty css                                                  */ const i = c(r),
  l = u(r);
document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const n = document.getElementById('email').value,
    o = document.getElementById('password').value,
    t = document.getElementById('loginError');
  t.textContent = '';
  try {
    const a = (await s(i, n, o)).user.uid;
    (await m(d(l, 'players', a))).exists()
      ? (window.location.href = '/portals/player/dashboard.html')
      : (t.textContent = 'Role not found. Please contact support.');
  } catch (a) {
    t.textContent = a.message;
  }
});
document.getElementById('loginBtn').addEventListener('click', function () {
  const e = document.getElementById('email').value,
    n = document.getElementById('password').value;
  p(e, n);
});
function p(e, n) {
  const o = document.getElementById('loginError');
  ((o.textContent = ''),
    s(i, e, n)
      .then(async t => {
        const a = t.user.uid;
        (await m(d(l, 'players', a))).exists()
          ? (window.location.href = '/portals/player/dashboard.html')
          : (o.textContent = 'Role not found. Please contact support.');
      })
      .catch(t => {
        o.textContent = t.message;
      }));
}
//# sourceMappingURL=login-DiNSx3Qm.js.map
