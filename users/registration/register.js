import { auth, db } from '../../shared/auth.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const form = document.getElementById('register-form');
const emailInput = document.getElementById('reg-email');
const passwordInput = document.getElementById('reg-password');
const roleSelect = document.getElementById('reg-role');
const errorDiv = document.getElementById('reg-error');
const showPwBtn = document.getElementById('toggle-password');
const loadingDiv = document.getElementById('register-loading');

function setLoading(loading) {
  loadingDiv.style.display = loading ? 'block' : 'none';
  form.querySelector('button[type="submit"]').disabled = loading;
}

form.onsubmit = async (e) => {
  e.preventDefault();
  errorDiv.textContent = "";
  setLoading(true);

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const role = roleSelect.value;

  if (!email || !password || !role) {
    errorDiv.textContent = "All fields are required.";
    setLoading(false);
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      role
    });
    // Redirect to their portal
    window.location.href = `/users/${role}/`;
  } catch (err) {
    errorDiv.textContent = err.message;
  }
  setLoading(false);
};

// Password visibility toggle
showPwBtn.onclick = () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    showPwBtn.textContent = "Hide";
  } else {
    passwordInput.type = "password";
    showPwBtn.textContent = "Show";
  }
};

// Clear error on input
[emailInput, passwordInput, roleSelect].forEach(input => {
  input.addEventListener('input', () => {
    errorDiv.textContent = "";
  });
});