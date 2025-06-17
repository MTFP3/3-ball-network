// Handles registration form logic, Firebase Auth, Firestore, and Storage

import { db, auth, storage } from '../../shared/firebase.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// Utility: Hide all registration forms
function hideAllForms() {
  document.getElementById('player-male-form').style.display = 'none';
  document.getElementById('player-female-form').style.display = 'none';
  document.getElementById('coach-form').style.display = 'none';
  document.getElementById('scout-form').style.display = 'none';
  document.getElementById('fan-form').style.display = 'none';
}

// Role selection logic
window.selectRole = function(role) {
  document.getElementById('role-modal').style.display = 'none';
  hideAllForms();
  if (role === 'Player') {
    document.getElementById('gender-modal').style.display = 'block';
  } else if (role === 'Coach') {
    document.getElementById('coach-form').style.display = 'block';
  } else if (role === 'Scout') {
    document.getElementById('scout-form').style.display = 'block';
  } else if (role === 'Fan') {
    document.getElementById('fan-form').style.display = 'block';
  }
};

// Gender selection logic for players
window.selectGender = function(gender) {
  document.getElementById('gender-modal').style.display = 'none';
  hideAllForms();
  if (gender === 'Male') {
    document.getElementById('player-male-form').style.display = 'block';
  } else if (gender === 'Female') {
    document.getElementById('player-female-form').style.display = 'block';
  }
};

// Password show/hide toggle for all forms
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', function() {
      const input = this.parentElement.querySelector('input[type="password"],input[type="text"]');
      if (input.type === "password") {
        input.type = "text";
        this.textContent = "Hide";
      } else {
        input.type = "password";
        this.textContent = "Show";
      }
    });
  });

  // Attach submit handler to all registration forms
  document.querySelectorAll('form[id^="form-"]').forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const loading = form.querySelector('.register-loading');
      const errorDiv = form.querySelector('.reg-error');
      const successDiv = form.querySelector('.reg-success');
      loading.style.display = 'block';
      errorDiv.style.display = 'none';
      successDiv.style.display = 'none';
      errorDiv.textContent = '';
      successDiv.textContent = '';

      // Prevent duplicate submissions
      form.querySelector('button[type="submit"]').disabled = true;

      // Confirm password check
      const pwInput = form.querySelector('input[name="password"]');
      const confirmPwInput = form.querySelector('input[name="confirmPassword"]');
      if (pwInput && confirmPwInput && pwInput.value !== confirmPwInput.value) {
        loading.style.display = 'none';
        errorDiv.textContent = 'Passwords do not match.';
        errorDiv.style.display = 'block';
        form.querySelector('button[type="submit"]').disabled = false;
        pwInput.value = '';
        confirmPwInput.value = '';
        return;
      }

      // Password strength check in JS (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
      const pwVal = pwInput ? pwInput.value : '';
      const pwPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (pwInput && !pwPattern.test(pwVal)) {
        loading.style.display = 'none';
        errorDiv.textContent = 'Password must be at least 8 characters, include uppercase, lowercase, and a number.';
        errorDiv.style.display = 'block';
        form.querySelector('button[type="submit"]').disabled = false;
        pwInput.value = '';
        if (confirmPwInput) confirmPwInput.value = '';
        return;
      }

      // Validate at least one checkbox for positions/levels if present
      if (form.querySelectorAll('input[name="position"]').length) {
        const checked = form.querySelectorAll('input[name="position"]:checked');
        if (checked.length === 0) {
          loading.style.display = 'none';
          errorDiv.textContent = 'Please select at least one position.';
          errorDiv.style.display = 'block';
          form.querySelector('button[type="submit"]').disabled = false;
          return;
        }
      }
      if (form.querySelectorAll('input[name="level"]').length) {
        const checked = form.querySelectorAll('input[name="level"]:checked');
        if (checked.length === 0) {
          loading.style.display = 'none';
          errorDiv.textContent = 'Please select at least one level coached.';
          errorDiv.style.display = 'block';
          form.querySelector('button[type="submit"]').disabled = false;
          return;
        }
      }

      // Collect form data
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        // Always collect as array if multiple values exist for a key
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          if (!Array.isArray(data[key])) data[key] = [data[key]];
          data[key].push(value);
        } else {
          data[key] = value;
        }
      });

      // Capitalize first/last/city/school
      ['first', 'last', 'city', 'school'].forEach(field => {
        if (data[field]) data[field] = data[field].replace(/\b\w/g, c => c.toUpperCase());
      });

      // Get positions/levels as arrays
      if (form.querySelectorAll('input[name="position"]').length) {
        data.positions = Array.from(form.querySelectorAll('input[name="position"]:checked')).map(cb => cb.value);
      }
      if (form.querySelectorAll('input[name="level"]').length) {
        data.coachLevels = Array.from(form.querySelectorAll('input[name="level"]:checked')).map(cb => cb.value);
      }

      // Firebase registration
      try {
        // 1. Create user
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;
        const userId = user.uid;

        // 2. Upload photo with error handling
        const photoFile = form.querySelector('input[type="file"]').files[0];
        let photoURL = "";
        if (photoFile) {
          try {
            const storageRef = ref(storage, `profile_photos/${userId}`);
            await uploadBytes(storageRef, photoFile);
            photoURL = await getDownloadURL(storageRef);
          } catch (uploadErr) {
            loading.style.display = 'none';
            errorDiv.textContent = 'Photo upload failed. Please try again or use a different image.';
            errorDiv.style.display = 'block';
            form.querySelector('button[type="submit"]').disabled = false;
            return;
          }
        } else {
          // Set a default photo URL or handle the absence of a photo
          photoURL = 'default_photo_url'; // Replace with an actual default URL if available
        }

        // 3. Prepare Firestore data
        const userData = {
          userId,
          email: data.email,
          role: form.id.replace('form-', '').replace('-male', '').replace('-female', ''),
          firstName: data.first,
          lastName: data.last,
          state: data.state,
          city: data.city,
          phoneNumber: data.phone,
          school: data.school || '',
          teamId: data.team || '',
          photoURL,
          positions: Array.isArray(data.positions) ? data.positions : (data.positions ? [data.positions] : []),
          coachLevels: Array.isArray(data.coachLevels) ? data.coachLevels : (data.coachLevels ? [data.coachLevels] : []),
          heightFt: data.heightFt || '',
          heightIn: data.heightIn || '',
          weight: data.weight || '',
          gender: data.gender || '',
        };

        await setDoc(doc(db, "users", userId), userData);

        loading.style.display = 'none';
        successDiv.textContent = 'Registration successful! Redirecting to login...';
        successDiv.style.display = 'block';

        // Security: Remove password from memory
        if (pwInput) pwInput.value = '';
        if (confirmPwInput) confirmPwInput.value = '';

        // Await hiding the form before redirect
        await new Promise(res => setTimeout(res, 2000));
        form.reset();
        form.style.display = 'none';
        // Polyfill for window.location.href
        if (window.location.assign) {
          window.location.assign("/users/login.html");
        } else {
          window.location.href = "/users/login.html";
        }

      } catch (err) {
        loading.style.display = 'none';
        // Friendly error messages for common Firebase errors
        let msg = err.message;
        if (err.code === 'auth/email-already-in-use') {
          msg = 'Email already in use. Please use a different email or login.';
        } else if (err.code === 'auth/invalid-email') {
          msg = 'Invalid email address.';
        } else if (err.code === 'auth/weak-password') {
          msg = 'Password is too weak. Please use at least 8 characters, including uppercase, lowercase, and a number.';
        }
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
        form.querySelector('button[type="submit"]').disabled = false;
        if (pwInput) pwInput.value = '';
        if (confirmPwInput) confirmPwInput.value = '';
      }
    });
  });
});