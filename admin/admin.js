// --- Firebase Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0",
  authDomain: "ball-network-web.firebaseapp.com",
  projectId: "ball-network-web",
  storageBucket: "ball-network-web.appspot.com",
  messagingSenderId: "740915998465",
  appId: "1:740915998465:web:59ac026f3f4c2ec5da3500",
  measurementId: "G-ZS07SKSRRL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const COLLECTIONS = {
  pages: "pages",
  users: "users",
  comments: "comments",
  auditLogs: "auditLogs",
  mediaMeta: "mediaMeta",
  settings: "settings"
};
const STATUS = {
  published: "published",
  draft: "draft"
};

// --- Utility: Sanitization ---
function sanitize(str) {
  if (typeof DOMPurify !== "undefined") {
    return DOMPurify.sanitize(str);
  }
  if (typeof str !== "string") return "";
  return str.replace(/[&<>"'`=\/]/g, function (s) {
    return ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "`": "&#96;",
      "=": "&#61;",
      "/": "&#47;"
    })[s];
  });
}

// --- Utility: Is Admin (stub, implement in users.js or auth.js) ---
let currentUserIsAdmin = false;
function isAdmin() {
  return currentUserIsAdmin;
}

// --- Utility: Audit Logging (stub, implement in audit.js) ---
async function logAudit(action, details) {
  // Implement in audit.js if needed
}

// --- Utility: Show Message (stub, implement in utils.js) ---
function showMessage(msg, type = "primary") {
  // Implement in utils.js if needed
}

// --- Utility: Show Confirm (stub, implement in utils.js) ---
function showConfirm(message, onConfirm) {
  // Implement in utils.js if needed
}

// --- Section Loader Map ---
const sectionLoaders = {
  "dashboard-section": () => import('./dashboard.js').then(m => m.initDashboardSection()),
  "pages-section": () => import('./pages.js').then(m => m.initPagesSection()),
  "media-section": () => import('./media.js').then(m => m.initMediaSection()),
  "users-section": () => import('./users.js').then(m => m.initUsersSection()),
  "comments-section": () => import('./comments.js').then(m => m.initCommentsSection()),
  "settings-section": () => import('./settings.js').then(m => m.initSettingsSection()),
  "plugins-section": () => import('./plugins.js').then(m => m.initPluginsSection()),
  "audit-section": () => import('./audit.js').then(m => m.initAuditSection()),
  "players-section": () => import('./players.js').then(m => m.initPlayersSection()),
  "coaches-section": () => import('./coaches.js').then(m => m.initCoachesSection()),
  "scouts-section": () => import('./scouts.js').then(m => m.initScoutsSection()),
  "fans-section": () => import('./fans.js').then(m => m.initFansSection())
};

// --- UI Helpers ---
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  const section = document.getElementById(sectionId);
  if (section) section.classList.add('active');
  // Load section logic if available
  if (sectionLoaders[sectionId]) sectionLoaders[sectionId]();
}

// --- Auth State ---
onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById('wp-sidebar').style.display = '';
    showSection('dashboard-section');
  } else {
    document.getElementById('wp-sidebar').style.display = '';
    showSection('admin-login');
  }
});

// --- Login Form ---
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorDiv = document.getElementById('login-error');
  errorDiv.textContent = '';
  try {
    await signInWithEmailAndPassword(auth, email, password);
    showSection('dashboard-section');
  } catch (err) {
    errorDiv.textContent = err.message;
  }
});

// --- Logout ---
document.getElementById('logout-link').addEventListener('click', async (e) => {
  e.preventDefault();
  await signOut(auth);
  showSection('admin-login');
});

// --- Sidebar Navigation ---
[
  'dashboard-link', 'pages-link', 'media-link', 'users-link', 'comments-link',
  'settings-link', 'plugins-link', 'audit-link', 'players-link', 'coaches-link', 'scouts-link', 'fans-link'
].forEach(linkId => {
  const link = document.getElementById(linkId);
  if (link) {
    link.addEventListener('click', e => {
      e.preventDefault();
      const sectionId = linkId.replace('-link', '-section');
      showSection(sectionId);
    });
  }
});

// Hide sidebar until auth state is known
document.getElementById('wp-sidebar').style.display = 'none';

export {
  db,
  storage,
  auth,
  COLLECTIONS,
  STATUS,
  sanitize,
  isAdmin,
  logAudit,
  showMessage,
  showConfirm
};