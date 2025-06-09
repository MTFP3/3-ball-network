import { auth } from '../../shared/auth.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "/users/registration.html";
  } else {
    document.getElementById('scout-content').textContent = `Logged in as ${user.email}`;
  }
});

window.logout = async function() {
  await signOut(auth);
  window.location.href = "/users/registration.html";
};