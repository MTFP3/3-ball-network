import { auth, db } from '../shared/auth.js';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const form = document.getElementById('login-form');
const emailInput = document.getElementById('login-email');
const passwordInput = document.getElementById('login-password');
const errorDiv = document.getElementById('login-error');
const showPwBtn = document.getElementById('toggle-password');
const resetPwBtn = document.getElementById('reset-password');
const loadingDiv = document.getElementById('login-loading');

let failedAttempts = 0;
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 60 * 1000; // 1 minute
let lockoutUntil = 0;

function setLoading(loading) {
  if (loadingDiv) loadingDiv.style.display = loading ? 'block' : 'none';
  form.querySelector('button[type="submit"]').disabled = loading;
}

form.onsubmit = async (e) => {
  e.preventDefault();
  errorDiv.textContent = "";

  if (Date.now() < lockoutUntil) {
    errorDiv.textContent = "Too many failed attempts. Please wait a minute and try again.";
    return;
  }

  setLoading(true);
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Get user role from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      errorDiv.textContent = "No user profile found.";
      setLoading(false);
      return;
    }
    const role = userDoc.data().role;
    if (["player", "coach", "scout", "fan"].includes(role)) {
      window.location.href = `/users/${role}/`;
    } else {
      errorDiv.textContent = "Unknown user role.";
    }
    failedAttempts = 0;
  } catch (err) {
    failedAttempts++;
    if (failedAttempts >= MAX_ATTEMPTS) {
      lockoutUntil = Date.now() + LOCKOUT_TIME;
      errorDiv.textContent = "Too many failed attempts. Please wait a minute and try again.";
    } else {
      errorDiv.textContent = err.message;
    }
  }
  setLoading(false);
};

// Password visibility toggle
if (showPwBtn) {
  showPwBtn.onclick = () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      showPwBtn.textContent = "Hide";
    } else {
      passwordInput.type = "password";
      showPwBtn.textContent = "Show";
    }
  };
}

// Password reset
if (resetPwBtn) {
  resetPwBtn.onclick = async () => {
    const email = emailInput.value.trim();
    if (!email) {
      errorDiv.textContent = "Enter your email to reset password.";
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      errorDiv.style.color = "green";
      errorDiv.textContent = "Password reset email sent!";
    } catch (err) {
      errorDiv.style.color = "red";
      errorDiv.textContent = err.message;
    }
    setLoading(false);
  };
}

// Clear error on input
[emailInput, passwordInput].forEach(input => {
  input.addEventListener('input', () => {
    errorDiv.textContent = "";
    errorDiv.style.color = "red";
  });
});

// HTML structure modification
const passwordContainer = document.createElement('div');
passwordContainer.className = 'password-container';
passwordInput.parentNode.insertBefore(passwordContainer, passwordInput);
passwordContainer.appendChild(passwordInput);
passwordContainer.appendChild(showPwBtn);

const resetButton = document.createElement('button');
resetButton.type = 'button';
resetButton.id = 'reset-password';
resetButton.textContent = 'Forgot Password?';
passwordContainer.appendChild(resetButton);

const loadingIndicator = document.createElement('div');
loadingIndicator.id = 'login-loading';
loadingIndicator.style.display = 'none';
loadingIndicator.textContent = 'Loading...';
form.appendChild(loadingIndicator);