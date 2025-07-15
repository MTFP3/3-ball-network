// Enhanced Registration Form Handler
import { auth, db } from './firebaseConfig.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import {
  doc,
  setDoc,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import {
  createProgressIndicator,
  createToast,
  createOptimisticElement,
  safeText,
  safeAttr,
} from './uiComponents.js';

class RegistrationHandler {
  constructor() {
    this.pendingRegistrations = new Set();
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupFormSwitching();
  }

  setupEventListeners() {
    // Password toggle functionality
    document.querySelectorAll('.password-toggle').forEach(button => {
      button.addEventListener('click', e => {
        const passwordInput = document.getElementById(e.target.dataset.target);
        if (passwordInput) {
          this.togglePassword(passwordInput, e.target);
        }
      });
    });

    // Role selection
    document.querySelectorAll('input[name="role"]').forEach(radio => {
      radio.addEventListener('change', e => {
        this.switchRole(e.target.value);
      });
    });

    // Form submissions
    document.getElementById('playerForm')?.addEventListener('submit', e => {
      e.preventDefault();
      this.handlePlayerRegistration();
    });

    document.getElementById('coachForm')?.addEventListener('submit', e => {
      e.preventDefault();
      this.handleCoachRegistration();
    });

    document.getElementById('scoutForm')?.addEventListener('submit', e => {
      e.preventDefault();
      this.handleScoutRegistration();
    });

    document.getElementById('fanForm')?.addEventListener('submit', e => {
      e.preventDefault();
      this.handleFanRegistration();
    });
  }

  togglePassword(passwordInput, toggleButton) {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    toggleButton.textContent = isPassword ? 'Hide' : 'Show';
  }

  switchRole(role) {
    // Hide all form sections
    document.querySelectorAll('.form-section').forEach(section => {
      section.classList.remove('active');
    });

    // Show selected role form
    const targetForm = document.getElementById(`${role}FormSection`);
    if (targetForm) {
      targetForm.classList.add('active');
    }
  }

  setupFormSwitching() {
    // Initial role setup
    const checkedRole = document.querySelector('input[name="role"]:checked');
    if (checkedRole) {
      this.switchRole(checkedRole.value);
    }
  }

  async handlePlayerRegistration() {
    const formData = {
      name: document.getElementById('playerName').value,
      email: document.getElementById('playerEmail').value,
      password: document.getElementById('playerPassword').value,
      gender: document.getElementById('playerGender').value,
      school: document.getElementById('playerSchool').value,
      graduationYear: document.getElementById('playerGraduationYear').value,
      position: document.getElementById('playerPosition').value,
      height: document.getElementById('playerHeight').value,
      weight: document.getElementById('playerWeight').value,
      gpa: document.getElementById('playerGPA').value,
      role: 'player',
    };

    await this.registerUser(formData);
  }

  async handleCoachRegistration() {
    const formData = {
      name: document.getElementById('coachName').value,
      email: document.getElementById('coachEmail').value,
      password: document.getElementById('coachPassword').value,
      school: document.getElementById('coachSchool').value,
      experience: document.getElementById('coachExperience').value,
      certifications: document.getElementById('coachCertifications').value,
      role: 'coach',
    };

    await this.registerUser(formData);
  }

  async handleScoutRegistration() {
    const formData = {
      name: document.getElementById('scoutName').value,
      email: document.getElementById('scoutEmail').value,
      password: document.getElementById('scoutPassword').value,
      organization: document.getElementById('scoutOrganization').value,
      experience: document.getElementById('scoutExperience').value,
      region: document.getElementById('scoutRegion').value,
      role: 'scout',
    };

    await this.registerUser(formData);
  }

  async handleFanRegistration() {
    const formData = {
      name: document.getElementById('fanName').value,
      email: document.getElementById('fanEmail').value,
      password: document.getElementById('fanPassword').value,
      favoriteTeam: document.getElementById('fanFavoriteTeam').value,
      location: document.getElementById('fanLocation').value,
      role: 'fan',
    };

    await this.registerUser(formData);
  }

  async registerUser(formData) {
    // Prevent duplicate registrations
    if (this.pendingRegistrations.has(formData.email)) {
      createToast('Registration already in progress...', 'warning');
      return;
    }

    const registrationId = Date.now().toString();
    this.pendingRegistrations.add(formData.email);

    try {
      // Show optimistic loading state
      this.showOptimisticRegistration(formData.role, registrationId);

      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Store additional user data in Firestore
      const userData = { ...formData };
      delete userData.password; // Don't store password in Firestore

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...userData,
        uid: userCredential.user.uid,
        createdAt: new Date().toISOString(),
        emailVerified: false,
        status: 'active',
      });

      // Show success state
      this.showRegistrationSuccess(registrationId, formData.role);
      createToast(
        'Registration successful! Welcome to 3 Ball Network!',
        'success'
      );

      // Redirect based on role
      setTimeout(() => {
        window.location.href = `/${formData.role}.html`;
      }, 2000);
    } catch (error) {
      this.showRegistrationError(registrationId, error);
      createToast(this.getErrorMessage(error), 'error');
    } finally {
      this.pendingRegistrations.delete(formData.email);
    }
  }

  showOptimisticRegistration(role, registrationId) {
    // Disable all submit buttons optimistically
    const submitButtons = document.querySelectorAll('.submit-btn');
    submitButtons.forEach(button => {
      button.disabled = true;
      const originalText = button.textContent;
      safeText(button, 'Creating Account...');

      // Create progress indicator
      const progress = createProgressIndicator();
      progress.setIndeterminate();
      progress.id = `progress-${registrationId}`;

      // Insert progress after button
      button.parentNode.insertBefore(progress, button.nextSibling);

      // Store original text for restoration
      button.dataset.originalText = originalText;
      button.dataset.registrationId = registrationId;
    });
  }

  showRegistrationSuccess(registrationId, role) {
    const buttons = document.querySelectorAll(
      `[data-registration-id="${registrationId}"]`
    );
    const progress = document.getElementById(`progress-${registrationId}`);

    buttons.forEach(button => {
      button.disabled = false;
      safeText(button, 'Account Created! ✓');
      button.style.background = '#28a745';
    });

    if (progress) {
      progress.complete();
    }
  }

  showRegistrationError(registrationId, error) {
    const buttons = document.querySelectorAll(
      `[data-registration-id="${registrationId}"]`
    );
    const progress = document.getElementById(`progress-${registrationId}`);

    buttons.forEach(button => {
      button.disabled = false;
      safeText(button, button.dataset.originalText || 'Create Account');
      button.style.background = '';
      delete button.dataset.registrationId;
      delete button.dataset.originalText;
    });

    if (progress) {
      progress.style.opacity = '0';
      setTimeout(() => progress.remove(), 300);
    }
  }

  getErrorMessage(error) {
    const errorMessages = {
      'auth/email-already-in-use':
        'This email is already registered. Please use a different email or try logging in.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/operation-not-allowed':
        'Registration is currently disabled. Please contact support.',
      'auth/network-request-failed':
        'Network error. Please check your connection and try again.',
    };

    return errorMessages[error.code] || `Registration failed: ${error.message}`;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new RegistrationHandler();
  });
} else {
  new RegistrationHandler();
}
