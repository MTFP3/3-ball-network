// 🔐 Firebase Configuration for Testing
// This is a demo/testing configuration that doesn't require environment variables
import {
  initializeApp,
  getApps,
  getApp,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';

console.log('🚀 Loading demo Firebase configuration for testing...');

// Demo Firebase configuration (safe to use for testing)
const demoFirebaseConfig = {
  apiKey: 'demo-key',
  authDomain: 'demo.firebaseapp.com',
  projectId: 'ball-network-demo',
  storageBucket: 'ball-network-demo.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:demo',
};

// Initialize Firebase with demo config (check if already exists)
let app;
try {
  // Check if Firebase app already exists
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = getApp(); // Use existing app
    console.log('🔄 Using existing Firebase app instance');
  } else {
    app = initializeApp(demoFirebaseConfig, 'demo-app');
    console.log('🆕 Created new Firebase demo app instance');
  }
} catch (error) {
  console.warn('⚠️ Firebase initialization warning:', error.message);
  // Try to get existing app if initialization fails
  try {
    app = getApp();
  } catch {
    // If all else fails, create with unique name
    app = initializeApp(demoFirebaseConfig, `demo-${Date.now()}`);
  }
}

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

console.log('✅ Demo Firebase services initialized for testing');
console.log(
  '📝 Note: This is using demo configuration - videos will not persist'
);

// Export for compatibility
export { app };
export const configInfo = {
  environment: 'demo',
  version: 'test',
  projectId: demoFirebaseConfig.projectId,
  authDomain: demoFirebaseConfig.authDomain,
  debugMode: true,
  analyticsEnabled: false,
};

// Make services available globally for testing
window.firebaseServices = { db, auth, storage };
window.firebaseConfig = configInfo;

export default app;
