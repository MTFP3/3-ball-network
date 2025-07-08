import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js';
import { initializeApp as d } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore as s,
  getDocs as p,
  collection as u,
  updateDoc as g,
  doc as y,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
/* empty css                                                                                                        */ const I =
    {
      apiKey: 'YOUR_API_KEY',
      authDomain: 'YOUR_APP.firebaseapp.com',
      projectId: 'YOUR_PROJECT_ID',
      storageBucket: 'YOUR_APP.appspot.com',
      messagingSenderId: 'YOUR_SENDER_ID',
      appId: 'YOUR_APP_ID',
    },
  f = d(I),
  n = s(f);
document
  .getElementById('claimForm')
  .addEventListener('submit', async function (r) {
    r.preventDefault();
    const i = document.getElementById('name').value.trim().toLowerCase(),
      l = document.getElementById('school').value.trim().toLowerCase(),
      m = document.getElementById('email').value.trim(),
      c = await p(u(n, 'players'));
    let e = null;
    c.forEach(a => {
      const t = a.data();
      t.name?.toLowerCase() === i &&
        t.school?.toLowerCase() === l &&
        t.placeholder === !0 &&
        (e = { id: a.id, ...t });
    });
    const o = document.getElementById('result');
    e
      ? (await g(y(n, 'players', e.id), {
          placeholder: !1,
          email: m,
          claimedAt: new Date().toISOString(),
        }),
        (o.innerHTML = `<p style='color:green'>✅ Profile found and linked. You are now registered as <strong>${e.name}</strong>.</p>`))
      : (o.innerHTML =
          "<p style='color:red'>❌ No matching profile found. Please double-check your name and school.</p>");
  });
//# sourceMappingURL=claim-profile-D8qU_j8X.js.map
