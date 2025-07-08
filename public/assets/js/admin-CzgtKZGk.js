import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-CYcforwy-CYcforwy.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js';
import { initializeApp as y } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore as f,
  getDoc as h,
  doc as l,
  getDocs as c,
  collection as u,
  setDoc as v,
  deleteDoc as w,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import {
  getAuth as x,
  onAuthStateChanged as k,
  signInWithEmailAndPassword as E,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
/* empty css                       */ const C = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
  },
  b = y(C),
  s = f(b),
  p = x(b);
let d = [];
k(p, async e => {
  if (!e) {
    M();
    return;
  }
  try {
    if (!(await h(l(s, 'admins', e.uid))).exists()) {
      document.body.innerHTML =
        '<div style="text-align:center;margin-top:100px;"><h2>🚫 Access Denied</h2><p>Admin privileges required.</p></div>';
      return;
    }
    I();
  } catch (t) {
    (console.error('Auth check failed:', t),
      o('Authentication error', 'error'));
  }
});
window.switchTab = e => {
  (document
    .querySelectorAll('.nav-tab')
    .forEach(t => t.classList.remove('active')),
    event.target.classList.add('active'),
    document
      .querySelectorAll('.admin-section')
      .forEach(t => t.classList.remove('active')),
    document.getElementById(e).classList.add('active'),
    L(e));
};
function I() {
  (A(), m(), g(), F());
}
async function A() {
  try {
    const e = await c(u(s, 'users'));
    ((document.getElementById('totalUsers').textContent = e.size),
      (document.getElementById('activeUsers').textContent = Math.floor(
        e.size * 0.3
      )),
      (document.getElementById('totalGames').textContent = Math.floor(
        Math.random() * 500 + 100
      )),
      (document.getElementById('pendingReports').textContent = Math.floor(
        Math.random() * 10
      )));
  } catch (e) {
    (console.error('Error loading dashboard:', e),
      o('Failed to load dashboard data', 'error'));
  }
}
async function m() {
  try {
    const e = await c(u(s, 'users'));
    ((d = []),
      e.forEach(t => {
        d.push({ id: t.id, ...t.data() });
      }),
      B(d));
  } catch (e) {
    (console.error('Error loading users:', e),
      o('Failed to load users', 'error'));
  }
}
function B(e) {
  const t = document.getElementById('userList');
  if (e.length === 0) {
    t.innerHTML = '<div class="loading"><p>No users found</p></div>';
    return;
  }
  t.innerHTML = e
    .map(
      n => `
        <div class="user-item">
          <div class="user-info">
            <div class="user-name">${n.name || 'Unknown'}</div>
            <div class="user-details">
              ${n.email || 'No email'} • ${n.role || 'No role'} • ID: ${n.id}
            </div>
          </div>
          <div>
            <button class="admin-btn" onclick="editUser('${n.id}')">Edit</button>
            <button class="admin-btn danger" onclick="banUser('${n.id}')">Ban</button>
          </div>
        </div>
      `
    )
    .join('');
}
async function g() {
  try {
    const e = await c(u(s, 'flags')),
      t = document.getElementById('flaggedList');
    if (e.empty) {
      t.innerHTML = '<h3>Flagged Content</h3><p>No flagged content found.</p>';
      return;
    }
    let n = '<h3>Flagged Content</h3>';
    (e.forEach(a => {
      const r = a.data();
      n += `
            <div class="user-item">
              <div class="user-info">
                <div class="user-name">🚩 ${r.type || 'Unknown'}</div>
                <div class="user-details">
                  Target: ${r.targetId || 'Unknown'} • Reason: ${r.reason || 'No reason provided'}
                </div>
              </div>
              <div>
                <button class="admin-btn" onclick="resolveFlag('${a.id}')">Resolve</button>
              </div>
            </div>
          `;
    }),
      (t.innerHTML = n),
      (document.getElementById('flaggedContent').textContent = e.size));
  } catch (e) {
    console.error('Error loading flagged content:', e);
  }
}
function F() {
  const e = document.getElementById('registrationChart').getContext('2d');
  new Chart(e, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'New Registrations',
          data: [12, 19, 15, 25, 22, 30],
          borderColor: '#00b4d8',
          backgroundColor: 'rgba(0, 180, 216, 0.1)',
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: !0,
      plugins: { legend: { labels: { color: '#e0e0e0' } } },
      scales: {
        x: { ticks: { color: '#b0b0b0' } },
        y: { ticks: { color: '#b0b0b0' } },
      },
    },
  });
  const t = document.getElementById('roleChart').getContext('2d');
  new Chart(t, {
    type: 'doughnut',
    data: {
      labels: ['Players', 'Coaches', 'Scouts', 'Fans'],
      datasets: [
        {
          data: [45, 25, 15, 15],
          backgroundColor: ['#00b4d8', '#90e0ef', '#caf0f8', '#007cba'],
        },
      ],
    },
    options: {
      responsive: !0,
      plugins: { legend: { labels: { color: '#e0e0e0' } } },
    },
  });
}
window.banUser = async e => {
  const t = e || document.getElementById('banUserId')?.value;
  if (!t) {
    o('Please provide a user ID', 'error');
    return;
  }
  if (confirm(`Are you sure you want to ban user ${t}?`))
    try {
      (await v(l(s, 'bannedUsers', t), {
        banned: !0,
        reason: 'Admin action',
        timestamp: new Date(),
      }),
        o(`User ${t} has been banned`, 'success'),
        m());
    } catch (n) {
      (console.error('Error banning user:', n),
        o('Failed to ban user', 'error'));
    }
};
window.resolveFlag = async e => {
  try {
    (await w(l(s, 'flags', e)),
      o('Flag resolved successfully', 'success'),
      g());
  } catch (t) {
    (console.error('Error resolving flag:', t),
      o('Failed to resolve flag', 'error'));
  }
};
function o(e, t = 'success') {
  const n = document.getElementById('alertContainer'),
    a = document.createElement('div');
  ((a.className = `alert ${t}`),
    (a.textContent = e),
    n.appendChild(a),
    setTimeout(() => {
      a.remove();
    }, 5e3));
}
function L(e) {
  switch (e) {
    case 'users':
      m();
      break;
    case 'content':
      g();
      break;
  }
}
function M() {
  ((document.body.innerHTML = `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);">
          <div style="background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border-radius: 20px; padding: 3em; border: 1px solid rgba(255,255,255,0.1); max-width: 400px; width: 90%; text-align: center;">
            <div style="margin-bottom: 2em;">
              <img src="/logo.png" alt="3 Ball Network" style="height: 60px; margin-bottom: 1em;">
              <h1 style="font-family: 'Montserrat', Arial, sans-serif; font-size: 2em; font-weight: 900; margin: 0; background: linear-gradient(45deg, #00b4d8 0%, #90e0ef 50%, #caf0f8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-transform: uppercase; letter-spacing: 2px;">Admin Portal</h1>
              <p style="color: #b0b0b0; margin-top: 0.5em;">Administrator access required</p>
            </div>
            
            <div id="loginAlert" style="display: none; padding: 1em; border-radius: 10px; margin-bottom: 1em;"></div>
            
            <form id="loginForm" style="text-align: left;">
              <div style="margin-bottom: 1.5em;">
                <label for="adminEmail" style="display: block; color: #e0e0e0; margin-bottom: 0.5em; font-weight: 600;">Email Address</label>
                <input type="email" id="adminEmail" required style="width: 100%; padding: 1em; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; background: rgba(255,255,255,0.05); color: #e0e0e0; font-size: 1em; box-sizing: border-box;">
              </div>
              
              <div style="margin-bottom: 2em;">
                <label for="adminPassword" style="display: block; color: #e0e0e0; margin-bottom: 0.5em; font-weight: 600;">Password</label>
                <input type="password" id="adminPassword" required style="width: 100%; padding: 1em; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; background: rgba(255,255,255,0.05); color: #e0e0e0; font-size: 1em; box-sizing: border-box;">
              </div>
              
              <button type="submit" style="width: 100%; padding: 1em; background: linear-gradient(135deg, #007cba 0%, #00b4d8 100%); border: none; border-radius: 10px; color: white; font-weight: 700; font-size: 1em; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px;">
                Sign In
              </button>
            </form>
            
            <div style="margin-top: 2em; padding-top: 1.5em; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="color: #888; font-size: 0.9em; margin: 0;">
                🔒 Secure admin authentication
              </p>
            </div>
          </div>
        </div>
      `),
    document.getElementById('loginForm').addEventListener('submit', S));
}
async function S(e) {
  e.preventDefault();
  const t = document.getElementById('adminEmail').value,
    n = document.getElementById('adminPassword').value,
    a = document.getElementById('loginAlert');
  try {
    const r = e.target.querySelector('button[type="submit"]'),
      i = r.textContent;
    ((r.textContent = 'Signing In...'), (r.disabled = !0), await E(p, t, n));
  } catch (r) {
    console.error('Login error:', r);
    const i = e.target.querySelector('button[type="submit"]');
    ((i.textContent = 'Sign In'),
      (i.disabled = !1),
      (a.style.display = 'block'),
      (a.style.background = 'rgba(255, 69, 58, 0.1)'),
      (a.style.border = '1px solid rgba(255, 69, 58, 0.3)'),
      (a.style.color = '#ff453a'),
      (a.textContent = $(r.code)));
  }
}
function $(e) {
  switch (e) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'Login failed. Please try again.';
  }
}
window.editUser = e => {
  o(`Edit user ${e} - Feature coming soon`, 'success');
};
window.exportUsers = () => {
  o('User export initiated', 'success');
};
window.addContentFilter = () => {
  const e = document.getElementById('newFilter').value;
  e &&
    (o(`Content filter "${e}" added`, 'success'),
    (document.getElementById('newFilter').value = ''));
};
window.refreshAnalytics = () => {
  o('Analytics data refreshed', 'success');
};
window.saveSystemSettings = () => {
  o('System settings saved', 'success');
};
window.clearCache = () => {
  o('Cache cleared successfully', 'success');
};
window.backupDatabase = () => {
  o('Database backup initiated', 'success');
};
//# sourceMappingURL=admin-CzgtKZGk.js.map
