// 🔐 Secure Firebase Configuration using Environment Variables
// No more hardcoded API keys in source control!
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js';

/**
 * Environment-based Firebase Configuration
 * Automatically loads from environment variables set by Vite
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/**
 * Validate Firebase configuration
 * Ensures all required environment variables are present
 */
function validateFirebaseConfig() {
  const requiredKeys = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const missingKeys = requiredKeys.filter(key => !import.meta.env[key]);

  if (missingKeys.length > 0) {
    const errorMessage = `❌ Missing Firebase environment variables: ${missingKeys.join(', ')}`;
    console.error(errorMessage);

    // Show user-friendly error if available
    if (typeof window !== 'undefined' && window.errorHandler) {
      window.errorHandler.showError(
        'Configuration error. Please check environment variables.',
        0 // Don't auto-dismiss
      );
    }

    throw new Error(errorMessage);
  }

  // Validate format of key values
  if (!firebaseConfig.apiKey.startsWith('AIza')) {
    console.warn('⚠️ Firebase API key format may be incorrect');
  }

  if (!firebaseConfig.projectId || firebaseConfig.projectId.length < 3) {
    throw new Error('❌ Invalid Firebase project ID');
  }

  console.log('✅ Firebase configuration validated successfully');

  // Log environment info (without sensitive data)
  console.log(
    `🔧 Environment: ${import.meta.env.VITE_APP_ENV || 'development'}`
  );
  console.log(`📦 Version: ${import.meta.env.VITE_APP_VERSION || 'unknown'}`);
  console.log(`🔥 Firebase Project: ${firebaseConfig.projectId}`);
}

// Validate configuration before initializing Firebase
validateFirebaseConfig();

// Initialize Firebase with environment-based config
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Analytics only if enabled and measurement ID is provided
let analytics = null;
if (
  import.meta.env.VITE_ENABLE_ANALYTICS === 'true' &&
  firebaseConfig.measurementId
) {
  try {
    analytics = getAnalytics(app);
    console.log('📊 Firebase Analytics initialized');
  } catch (error) {
    console.warn('⚠️ Firebase Analytics initialization failed:', error);
  }
}
export { analytics };

// Export configuration info (without sensitive data) for debugging
export const configInfo = {
  environment: import.meta.env.VITE_APP_ENV || 'development',
  version: import.meta.env.VITE_APP_VERSION || 'unknown',
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  debugMode: import.meta.env.VITE_APP_DEBUG === 'true',
  analyticsEnabled: !!analytics,
};

// Development helpers
if (import.meta.env.VITE_APP_DEBUG === 'true') {
  console.log('🔧 Firebase Config Info:', configInfo);

  // Make Firebase services available globally for debugging
  window.firebaseServices = { db, auth, storage, analytics };
  window.firebaseConfig = configInfo;
}

// Export the Firebase app instance
export { app };

// Export initializeFirebase function for compatibility
export const initializeFirebase = () => {
  console.log('Firebase initialized:', app.name);
  return app;
};

// Legacy compatibility exports (for backward compatibility)
export { firebaseConfig as config };
export const firebaseApp = app;

// Export the config for cases where it's needed directly
export { firebaseConfig };
