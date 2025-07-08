import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-CYcforwy-CYcforwy-CYcforwy.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js';
import { C as r } from './firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_.js';
import {
  getAuth as c,
  signInWithEmailAndPassword as s,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import {
  getFirestore as u,
  getDoc as i,
  doc as l,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import './sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js';
/* empty css                                */ const m = c(r),
  d = u(r);
document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const o = document.getElementById('email').value,
    n = document.getElementById('password').value,
    t = document.getElementById('loginError');
  t.textContent = '';
  try {
    const a = (await s(m, o, n)).user.uid;
    (await i(l(d, 'players', a))).exists()
      ? (window.location.href = '/portals/player/dashboard.html')
      : (t.textContent = 'Role not found. Please contact support.');
  } catch (a) {
    t.textContent = a.message;
  }
});
document.getElementById('loginBtn').addEventListener('click', function () {
  const e = document.getElementById('email').value,
    o = document.getElementById('password').value;
  p(e, o);
});
function p(e, o) {
  const n = document.getElementById('loginError');
  ((n.textContent = ''),
    s(m, e, o)
      .then(async t => {
        const a = t.user.uid;
        (await i(l(d, 'players', a))).exists()
          ? (window.location.href = '/portals/player/dashboard.html')
          : (n.textContent = 'Role not found. Please contact support.');
      })
      .catch(t => {
        n.textContent = t.message;
      }));
}
//# sourceMappingURL=login-c1y_jzdt.js.map
