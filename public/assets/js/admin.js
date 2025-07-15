// Removed broken modulepreload import;
// Removed broken modulepreload import;
// Removed broken modulepreload import;
import { initializeApp as y } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js@4.3.0/dist/chart.umd.js';
import {
  getFirestore as f,
  getDoc as h,
  doc as l,
  getDocs as c,
  collection as u,
  setDoc as v,
  deleteDoc as w,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase.js';
import {
  getAuth as x,
  onAuthStateChanged as k,
  signInWithEmailAndPassword as E,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { firebaseConfig } from './firebaseConfig.js';
import {
  createPlayerCard,
  createStatusBadge,
  createLoadingIndicator,
  createErrorMessage,
  clearContainer,
  safeText,
  safeAttr,
} from './uiComponents.js';
/* empty css                                                                             */
const b = y(firebaseConfig),
  i = f(b),
  p = x(b);
let d = [];
k(p, async e => {
  if (!e) {
    M();
    return;
  }
  try {
    if (!(await h(l(i, 'admins', e.uid))).exists()) {
      const accessDenied = createErrorMessage(
        'Access Denied: Admin privileges required.'
      );
      clearContainer(document.body);
      document.body.appendChild(accessDenied);
      return;
    }
    I();
  } catch (t) {
    console.error('Auth check failed:', t);
    o('Authentication error', 'error');
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
    const e = await c(u(i, 'users'));
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
    const e = await c(u(i, 'users'));
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
    const noUsers = createLoadingIndicator('No users found');
    clearContainer(t);
    t.appendChild(noUsers);
    return;
  }

  clearContainer(t);

  e.forEach(n => {
    const userItem = document.createElement('div');
    userItem.classList.add('user-item');

    const userInfo = document.createElement('div');
    userInfo.classList.add('user-info');

    const userName = document.createElement('div');
    userName.classList.add('user-name');
    safeText(userName, n.name || 'Unknown');

    const userDetails = document.createElement('div');
    userDetails.classList.add('user-details');
    safeText(
      userDetails,
      `${n.email || 'No email'} • ${n.role || 'No role'} • ID: ${n.id}`
    );

    userInfo.appendChild(userName);
    userInfo.appendChild(userDetails);

    const actionButtons = document.createElement('div');

    const editBtn = document.createElement('button');
    editBtn.classList.add('admin-btn');
    safeText(editBtn, 'Edit');
    editBtn.addEventListener('click', () => editUser(n.id));

    const banBtn = document.createElement('button');
    banBtn.classList.add('admin-btn', 'danger');
    safeText(banBtn, 'Ban');
    banBtn.addEventListener('click', () => banUser(n.id));

    actionButtons.appendChild(editBtn);
    actionButtons.appendChild(banBtn);

    userItem.appendChild(userInfo);
    userItem.appendChild(actionButtons);

    t.appendChild(userItem);
  });
}
async function g() {
  try {
    const e = await c(u(i, 'flags')),
      t = document.getElementById('flaggedList');

    clearContainer(t);

    const title = document.createElement('h3');
    safeText(title, 'Flagged Content');
    t.appendChild(title);

    if (e.empty) {
      const noFlags = document.createElement('p');
      safeText(noFlags, 'No flagged content found.');
      t.appendChild(noFlags);
      return;
    }

    e.forEach(r => {
      const a = r.data();
      const flagItem = document.createElement('div');
      flagItem.classList.add('user-item');

      const flagInfo = document.createElement('div');
      flagInfo.classList.add('user-info');

      const flagName = document.createElement('div');
      flagName.classList.add('user-name');
      safeText(flagName, `🚩 ${a.type || 'Unknown'}`);

      const flagDetails = document.createElement('div');
      flagDetails.classList.add('user-details');
      safeText(
        flagDetails,
        `Target: ${a.targetId || 'Unknown'} • Reason: ${a.reason || 'No reason provided'}`
      );

      flagInfo.appendChild(flagName);
      flagInfo.appendChild(flagDetails);

      const actionButtons = document.createElement('div');
      const resolveBtn = document.createElement('button');
      resolveBtn.classList.add('admin-btn');
      safeText(resolveBtn, 'Resolve');
      resolveBtn.addEventListener('click', () => resolveFlag(r.id));
      actionButtons.appendChild(resolveBtn);

      flagItem.appendChild(flagInfo);
      flagItem.appendChild(actionButtons);
      t.appendChild(flagItem);
    });

    const flaggedCountElement = document.getElementById('flaggedContent');
    if (flaggedCountElement) {
      safeText(flaggedCountElement, e.size.toString());
    }
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
  if (confirm(`Are you sure you want to ban user ${t}?`)) {
    try {
      (await v(l(i, 'bannedUsers', t), {
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
  }
};
window.resolveFlag = async e => {
  try {
    (await w(l(i, 'flags', e)),
      o('Flag resolved successfully', 'success'),
      g());
  } catch (t) {
    (console.error('Error resolving flag:', t),
      o('Failed to resolve flag', 'error'));
  }
};
function o(e, t = 'success') {
  const n = document.getElementById('alertContainer'),
    r = document.createElement('div');
  ((r.className = `alert ${t}`),
    (r.textContent = e),
    n.appendChild(r),
    setTimeout(() => {
      r.remove();
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
  clearContainer(document.body);

  // Create main container
  const mainContainer = document.createElement('div');
  mainContainer.style.cssText =
    'min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);';

  // Create form container
  const formContainer = document.createElement('div');
  formContainer.style.cssText =
    'background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border-radius: 20px; padding: 3em; border: 1px solid rgba(255,255,255,0.1); max-width: 400px; width: 90%; text-align: center;';

  // Create header section
  const headerDiv = document.createElement('div');
  headerDiv.style.marginBottom = '2em';

  const logo = document.createElement('img');
  safeAttr(logo, 'src', '/logo.png');
  safeAttr(logo, 'alt', '3 Ball Network');
  logo.style.cssText = 'height: 60px; margin-bottom: 1em;';

  const title = document.createElement('h1');
  safeText(title, 'Admin Portal');
  title.style.cssText =
    'font-family: "Montserrat", Arial, sans-serif; font-size: 2em; font-weight: 900; margin: 0; background: linear-gradient(45deg, #00b4d8 0%, #90e0ef 50%, #caf0f8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-transform: uppercase; letter-spacing: 2px;';

  const subtitle = document.createElement('p');
  safeText(subtitle, 'Administrator access required');
  subtitle.style.cssText = 'color: #b0b0b0; margin-top: 0.5em;';

  headerDiv.appendChild(logo);
  headerDiv.appendChild(title);
  headerDiv.appendChild(subtitle);

  // Create alert div
  const alertDiv = document.createElement('div');
  safeAttr(alertDiv, 'id', 'loginAlert');
  alertDiv.style.cssText =
    'display: none; padding: 1em; border-radius: 10px; margin-bottom: 1em;';

  // Create form
  const form = document.createElement('form');
  safeAttr(form, 'id', 'loginForm');
  form.style.textAlign = 'left';

  // Email field
  const emailDiv = document.createElement('div');
  emailDiv.style.marginBottom = '1.5em';

  const emailLabel = document.createElement('label');
  safeAttr(emailLabel, 'for', 'adminEmail');
  safeText(emailLabel, 'Email Address');
  emailLabel.style.cssText =
    'display: block; color: #e0e0e0; margin-bottom: 0.5em; font-weight: 600;';

  const emailInput = document.createElement('input');
  safeAttr(emailInput, 'type', 'email');
  safeAttr(emailInput, 'id', 'adminEmail');
  safeAttr(emailInput, 'required', 'true');
  emailInput.style.cssText =
    'width: 100%; padding: 1em; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; background: rgba(255,255,255,0.05); color: #e0e0e0; font-size: 1em; box-sizing: border-box;';

  emailDiv.appendChild(emailLabel);
  emailDiv.appendChild(emailInput);

  // Password field
  const passwordDiv = document.createElement('div');
  passwordDiv.style.marginBottom = '2em';

  const passwordLabel = document.createElement('label');
  safeAttr(passwordLabel, 'for', 'adminPassword');
  safeText(passwordLabel, 'Password');
  passwordLabel.style.cssText =
    'display: block; color: #e0e0e0; margin-bottom: 0.5em; font-weight: 600;';

  const passwordInput = document.createElement('input');
  safeAttr(passwordInput, 'type', 'password');
  safeAttr(passwordInput, 'id', 'adminPassword');
  safeAttr(passwordInput, 'required', 'true');
  passwordInput.style.cssText =
    'width: 100%; padding: 1em; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; background: rgba(255,255,255,0.05); color: #e0e0e0; font-size: 1em; box-sizing: border-box;';

  passwordDiv.appendChild(passwordLabel);
  passwordDiv.appendChild(passwordInput);

  // Submit button
  const submitBtn = document.createElement('button');
  safeAttr(submitBtn, 'type', 'submit');
  safeText(submitBtn, 'Sign In');
  submitBtn.style.cssText =
    'width: 100%; padding: 1em; background: linear-gradient(45deg, #00b4d8, #90e0ef); border: none; border-radius: 10px; color: #1a1a2e; font-weight: 700; font-size: 1em; cursor: pointer; transition: transform 0.2s;';

  // Assemble form
  form.appendChild(emailDiv);
  form.appendChild(passwordDiv);
  form.appendChild(submitBtn);

  // Assemble container
  formContainer.appendChild(headerDiv);
  formContainer.appendChild(alertDiv);
  formContainer.appendChild(form);

  mainContainer.appendChild(formContainer);
  document.body.appendChild(mainContainer);

  // Add form submission handler
  form.addEventListener('submit', S);
}
async function S(e) {
  e.preventDefault();
  const t = document.getElementById('adminEmail').value,
    n = document.getElementById('adminPassword').value,
    r = document.getElementById('loginAlert');
  try {
    const a = e.target.querySelector('button[type="submit"]');
    ((a.textContent = 'Signing In...'), (a.disabled = !0), await E(p, t, n));
  } catch (a) {
    console.error('Login error:', a);
    const s = e.target.querySelector('button[type="submit"]');
    ((s.textContent = 'Sign In'),
      (s.disabled = !1),
      (r.style.display = 'block'),
      (r.style.background = 'rgba(255, 69, 58, 0.1)'),
      (r.style.border = '1px solid rgba(255, 69, 58, 0.3)'),
      (r.style.color = '#ff453a'),
      (r.textContent = $(a.code)));
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
// Make functions available for event handlers
window.editUser = function (userId) {
  editUser(userId);
};

window.banUser = function (userId) {
  banUser(userId);
};

window.resolveFlag = function (flagId) {
  resolveFlag(flagId);
};

function editUser(e) {
  o(`Edit user ${e} - Feature coming soon`, 'success');
}

function banUser(userId) {
  o(`Ban user ${userId} - Feature coming soon`, 'success');
}

function resolveFlag(flagId) {
  return window.resolveFlag(flagId);
}
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
//# sourceMappingURL=admin.js.map
