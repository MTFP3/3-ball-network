// --- Firebase Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
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

// --- Module Imports ---
import './pages.js';
import './media.js';
import './users.js';
import './comments.js';
import './dashboard.js';
import './utils.js';

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