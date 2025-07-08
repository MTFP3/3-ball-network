import './modulepreload-polyfill-B5Qt9EMX.js';
/* empty css              */ import { initializeApp as l } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore as p,
  addDoc as g,
  collection as c,
  serverTimestamp as y,
  getDocs as d,
  setDoc as w,
  doc as u,
  deleteDoc as b,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
require('dotenv').config();
const v = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  $ = l(v),
  h = p($);
async function f(e, t = 'admin') {
  try {
    (await g(c(h, 'adminNotifications'), {
      message: e,
      type: t,
      createdAt: y(),
    }),
      console.log(`🔔 Notification: ${e}`));
  } catch (n) {
    console.error('❌ Notification error:', n);
  }
}
require('dotenv').config();
const L = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  A = l(L),
  i = p(A);
I();
E();
T();
m();
k();
async function I() {
  const e = ['players', 'coaches', 'scouts', 'fans'],
    t = document.getElementById('userList');
  t.innerHTML = '';
  for (const n of e)
    (await d(c(i, n))).forEach(o => {
      const s = o.data(),
        r = document.createElement('div');
      (r.classList.add('admin-user'),
        (r.innerHTML = `
        <strong>${s.name || 'Unnamed'}</strong> — ${n}
        ${n === 'scouts' ? `<button onclick="verifyScout('${n}','${o.id}')">${s.verified ? '✅ Verified' : 'Verify Now'}</button>` : ''}
        ${s.approved === !1 ? `<button onclick="approveUser('${n}','${o.id}')">Approve ✅</button>` : ''}
      `),
        t.appendChild(r));
    });
}
async function E() {
  const e = await d(c(i, 'games')),
    t = document.getElementById('gameList');
  ((t.innerHTML = ''),
    e.forEach(n => {
      const a = n.data(),
        o = document.createElement('div');
      ((o.innerHTML = `<strong>${a.teamName} vs ${a.opponent}</strong> — ${a.date} <br> Status: ${a.analysisStatus}`),
        t.appendChild(o));
    }));
}
async function T() {
  const e = await d(c(i, 'contactRequests')),
    t = document.getElementById('requestList');
  ((t.innerHTML = ''),
    e.forEach(n => {
      const a = n.data(),
        o = document.createElement('li');
      ((o.textContent = `Scout ${a.scoutId} requested contact for Player ${a.playerId} (Coach: ${a.coachId})`),
        t.appendChild(o));
    }));
}
async function m() {
  const e = document.getElementById('adminList');
  ((e.innerHTML = ''),
    (await d(c(i, 'admins'))).forEach(n => {
      const a = n.data(),
        o = document.createElement('div');
      ((o.innerHTML = `✅ <strong>${a.name || n.id}</strong> <button onclick="removeAdmin('${n.id}')">Remove ❌</button>`),
        e.appendChild(o));
    }));
}
window.addAdmin = async function () {
  const e = document.getElementById('newAdminUid').value.trim(),
    t = document.getElementById('newAdminName').value.trim();
  if (!e || !t) return alert('Fill in both fields.');
  (await w(u(i, 'admins', e), { name: t }),
    await f(`➕ Added new admin: ${t}`, 'admin'),
    alert('✅ New admin added!'),
    m());
};
window.removeAdmin = async function (e) {
  (await b(u(i, 'admins', e)),
    await f(`❌ Removed admin ${e}`, 'admin'),
    alert('❌ Admin removed.'),
    m());
};
async function k() {
  const e = await d(c(i, 'adminNotifications')),
    t =
      document.getElementById('adminActivity') || document.createElement('div');
  ((t.id = 'adminActivity'), (t.innerHTML = '<h3>🔔 Admin Activity Log</h3>'));
  const n = [];
  (e.forEach(a => {
    const o = a.data(),
      s = o.createdAt?.toDate().toLocaleString() || '(no date)';
    n.push(`<div>[${s}] ${o.message}</div>`);
  }),
    n.sort().reverse(),
    (t.innerHTML += n.join('')),
    document.body.appendChild(t));
}
//# sourceMappingURL=player-DlWGw8c-.js.map
