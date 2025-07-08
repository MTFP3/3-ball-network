import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js';
import { initializeApp as o } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore as i,
  doc as s,
  getDoc as r,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import {
  getAuth as p,
  onAuthStateChanged as c,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
const m = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  n = o(m),
  d = i(n),
  l = p(n);
c(l, async t => {
  if (!t) {
    document.body.innerHTML =
      '<h2 style="text-align:center;margin-top:100px;">🔒 You must be signed in as an admin to view this page.</h2>';
    return;
  }
  const a = s(d, 'admins', t.uid);
  if (!(await r(a)).exists())
    document.body.innerHTML =
      '<h2 style="text-align:center;margin-top:100px;">🚫 Access denied: Admins only.</h2>';
  else {
    const e = document.createElement('script');
    ((e.type = 'module'),
      (e.src = '/assets/js/analyticsDashboard.js'),
      document.body.appendChild(e));
  }
});
//# sourceMappingURL=analytics-CiavzH3j.js.map
