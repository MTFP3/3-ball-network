// 🧪 Firebase Functions Test Script
// Test the deployed Cloud Functions for role management
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getAuth,
  signInAnonymously,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import {
  getFunctions,
  httpsCallable,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-functions.js';
import { firebaseConfig } from './firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);

// Test Functions
const assignUserRole = httpsCallable(functions, 'assignUserRole');
const getUserRole = httpsCallable(functions, 'getUserRole');
const verifyUserPermissions = httpsCallable(functions, 'verifyUserPermissions');
const listUsersWithRoles = httpsCallable(functions, 'listUsersWithRoles');

/**
 * Test Firebase Functions connectivity
 */
async function testFunctions() {
  const results = {
    connectivity: '❌ Not tested',
    authentication: '❌ Not tested',
    roleRetrieval: '❌ Not tested',
    permissionVerification: '❌ Not tested',
    userListing: '❌ Not tested',
  };

  const logDiv = document.getElementById('function-test-log');

  function log(message) {
    console.log(message);
    if (logDiv) {
      const logEntry = document.createElement('div');
      logEntry.textContent = message;
      logDiv.appendChild(logEntry);
    }
  }

  try {
    log('🧪 Starting Firebase Functions Tests...');

    // Test 1: Basic connectivity
    try {
      const testResult = await getUserRole({ userId: 'test' });
      results.connectivity = '✅ Functions accessible';
      log('✅ Firebase Functions are accessible');
    } catch (error) {
      if (error.code === 'unauthenticated') {
        results.connectivity = '✅ Functions accessible (auth required)';
        log('✅ Firebase Functions are accessible (authentication required)');
      } else {
        throw error;
      }
    }

    // Test 2: Authentication (sign in anonymously for testing)
    try {
      log('🔐 Testing authentication...');
      const userCredential = await signInAnonymously(auth);
      results.authentication = '✅ Anonymous auth successful';
      log(`✅ Authenticated as: ${userCredential.user.uid}`);

      // Test 3: Get user role
      try {
        const roleResult = await getUserRole({
          userId: userCredential.user.uid,
        });
        results.roleRetrieval = `✅ Role: ${roleResult.data.role || 'No role assigned'}`;
        log(
          `✅ User role retrieved: ${roleResult.data.role || 'No role assigned'}`
        );
      } catch (error) {
        results.roleRetrieval = `⚠️ ${error.message}`;
        log(`⚠️ Role retrieval: ${error.message}`);
      }

      // Test 4: Verify permissions
      try {
        const permResult = await verifyUserPermissions({
          userId: userCredential.user.uid,
          requiredRole: 'fan',
        });
        results.permissionVerification = `✅ Permission check: ${permResult.data.hasPermission}`;
        log(`✅ Permission verification: ${permResult.data.hasPermission}`);
      } catch (error) {
        results.permissionVerification = `⚠️ ${error.message}`;
        log(`⚠️ Permission verification: ${error.message}`);
      }
    } catch (error) {
      results.authentication = `❌ ${error.message}`;
      log(`❌ Authentication failed: ${error.message}`);
    }
  } catch (error) {
    results.connectivity = `❌ ${error.message}`;
    log(`❌ Connection error: ${error.message}`);
  }

  // Display results
  log('\n📊 Test Results Summary:');
  Object.entries(results).forEach(([test, result]) => {
    log(`${test}: ${result}`);
  });

  return results;
}

// Export for global access
window.testFirebaseFunctions = testFunctions;

// Auto-run if on test page
if (
  window.location.pathname.includes('test') ||
  window.location.search.includes('test')
) {
  document.addEventListener('DOMContentLoaded', testFunctions);
}

console.log(
  '🧪 Firebase Functions test module loaded. Run testFirebaseFunctions() to test.'
);
console.log('📋 Available functions:', {
  assignUserRole: 'Assign roles to users (admin only)',
  getUserRole: 'Get user role information',
  verifyUserPermissions: 'Check user permissions',
  listUsersWithRoles: 'List all users and roles (admin only)',
});
