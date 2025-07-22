/**
 * 🔥 Shared Firebase Initialization Utility
 * Prevents duplicate Firebase app initialization across multiple pages
 */

// Global Firebase initialization tracker
window.firebaseInitialized = window.firebaseInitialized || false;
window.firebaseApp = window.firebaseApp || null;

/**
 * Initialize Firebase safely (prevents duplicate initialization)
 * @param {Object} config - Firebase configuration
 * @param {string} appName - Optional app name (defaults to 'default')
 * @returns {Object} Firebase app instance
 */
function initializeFirebaseSafely(config, appName = '[DEFAULT]') {
  // Check if already initialized
  if (window.firebaseInitialized && window.firebaseApp) {
    console.log('🔄 Using existing Firebase app instance');
    return window.firebaseApp;
  }

  try {
    // Check if Firebase is available
    if (typeof firebase === 'undefined') {
      throw new Error('Firebase SDK not loaded');
    }

    // Check if app already exists
    let app;
    try {
      app = firebase.app(appName);
      console.log('🔄 Found existing Firebase app:', appName);
    } catch (error) {
      // App doesn't exist, create new one
      app = firebase.initializeApp(config, appName);
      console.log('🆕 Created new Firebase app:', appName);
    }

    // Store globally
    window.firebaseApp = app;
    window.firebaseInitialized = true;

    return app;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    throw error;
  }
}

/**
 * Get Firebase services safely
 * @returns {Object} Firebase services (auth, firestore, storage)
 */
function getFirebaseServices() {
  if (!window.firebaseApp) {
    throw new Error(
      'Firebase not initialized. Call initializeFirebaseSafely first.'
    );
  }

  return {
    auth: firebase.auth(),
    firestore: firebase.firestore(),
    storage: firebase.storage(),
    app: window.firebaseApp,
  };
}

/**
 * Reset Firebase initialization (for testing)
 */
function resetFirebaseInitialization() {
  window.firebaseInitialized = false;
  window.firebaseApp = null;
  console.log('🔄 Firebase initialization reset');
}

// Export for global use
window.initializeFirebaseSafely = initializeFirebaseSafely;
window.getFirebaseServices = getFirebaseServices;
window.resetFirebaseInitialization = resetFirebaseInitialization;

console.log('🔥 Firebase initialization utility loaded');
