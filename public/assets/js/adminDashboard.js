import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { notifyAdmin } from './notifyAdmin.js';
import { db } from './firebaseConfig.js';

loadUsers();
loadGames();
loadRequests();
loadAdmins();
loadAdminNotifications();

async function loadUsers() {
  const collections = ['players', 'coaches', 'scouts', 'fans'];
  const userList = document.getElementById('userList');
  userList.innerHTML = '';
  for (const role of collections) {
    const snap = await getDocs(collection(db, role));
    snap.forEach(docSnap => {
      const user = docSnap.data();
      const div = document.createElement('div');
      div.classList.add('admin-user');
      div.innerHTML = `
        <strong>${user.name || 'Unnamed'}</strong> — ${role}
        ${role === 'scouts' ? `<button onclick="verifyScout('${role}','${docSnap.id}')">${user.verified ? '✅ Verified' : 'Verify Now'}</button>` : ''}
        ${user.approved === false ? `<button onclick="approveUser('${role}','${docSnap.id}')">Approve ✅</button>` : ''}
      `;
      userList.appendChild(div);
    });
  }
}

async function loadGames() {
  const snap = await getDocs(collection(db, 'games'));
  const list = document.getElementById('gameList');
  list.innerHTML = '';
  snap.forEach(docSnap => {
    const game = docSnap.data();
    const div = document.createElement('div');
    div.innerHTML = `<strong>${game.teamName} vs ${game.opponent}</strong> — ${game.date} <br> Status: ${game.analysisStatus}`;
    list.appendChild(div);
  });
}

async function loadRequests() {
  const snap = await getDocs(collection(db, 'contactRequests'));
  const list = document.getElementById('requestList');
  list.innerHTML = '';
  snap.forEach(docSnap => {
    const r = docSnap.data();
    const li = document.createElement('li');
    li.textContent = `Scout ${r.scoutId} requested contact for Player ${r.playerId} (Coach: ${r.coachId})`;
    list.appendChild(li);
  });
}

async function loadAdmins() {
  const list = document.getElementById('adminList');
  list.innerHTML = '';
  const snap = await getDocs(collection(db, 'admins'));
  snap.forEach(docSnap => {
    const admin = docSnap.data();
    const div = document.createElement('div');
    div.innerHTML = `✅ <strong>${admin.name || docSnap.id}</strong> <button onclick="removeAdmin('${docSnap.id}')">Remove ❌</button>`;
    list.appendChild(div);
  });
}

window.addAdmin = async function () {
  const uid = document.getElementById('newAdminUid').value.trim();
  const name = document.getElementById('newAdminName').value.trim();
  if (!uid || !name) {
    return alert('Fill in both fields.');
  }
  await setDoc(doc(db, 'admins', uid), { name });
  await notifyAdmin(`➕ Added new admin: ${name}`, 'admin');
  alert('✅ New admin added!');
  loadAdmins();
};

window.removeAdmin = async function (uid) {
  await deleteDoc(doc(db, 'admins', uid));
  await notifyAdmin(`❌ Removed admin ${uid}`, 'admin');
  alert('❌ Admin removed.');
  loadAdmins();
};

async function loadAdminNotifications() {
  const snap = await getDocs(collection(db, 'adminNotifications'));
  const div =
    document.getElementById('adminActivity') || document.createElement('div');
  div.id = 'adminActivity';
  div.innerHTML = '<h3>🔔 Admin Activity Log</h3>';

  const entries = [];
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const time = d.createdAt?.toDate().toLocaleString() || '(no date)';
    entries.push(`<div>[${time}] ${d.message}</div>`);
  });

  entries.sort().reverse();
  div.innerHTML += entries.join('');
  document.body.appendChild(div);
}
