// // Firebase Configuration for Compatibility Mode
// This is compatible with Firebase v1.7.0 compat scripts used in admin.html

/**
 * Firebase Configuration for Compatibility Mode
 * Uses fallback configuration for admin portal
 */
function getFirebaseConfig() {
  // Using the actual Firebase project configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    databaseURL: 'https://ball-network-web-default-rtdb.firebaseio.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.firebasestorage.app',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
    measurementId: 'G-ZS07SKSRRL',
  };

  // Validate configuration
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket'];
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

  if (missingKeys.length > 0) {
    console.error('❌ Missing Firebase configuration keys:', missingKeys);

    // Show user-friendly error
    if (typeof window !== 'undefined') {
      const errorDiv = document.createElement('div');
      errorDiv.innerHTML = `
        <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin: 10px;">
          <h4>Configuration Error</h4>
          <p>Firebase configuration is incomplete. Please check the setup.</p>
        </div>
      `;
      document.body.insertBefore(errorDiv, document.body.firstChild);
    }

    return null;
  }

  console.log('✅ Firebase configuration loaded successfully');
  return firebaseConfig;
}

// Export for global use
window.getFirebaseConfig = getFirebaseConfig;
