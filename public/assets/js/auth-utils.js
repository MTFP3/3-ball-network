/**
 * Authentication Utilities for 3 Ball Network
 * Provides common authentication functions for all portal pages
 */

// Initialize Firebase
const config = getFirebaseConfig();
if (config) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Global variables for current user
let currentUser = null;
let currentUserData = null;

/**
 * Check if user is authenticated and has the correct role for the page
 * @param {string} requiredRole - The role required to access this page
 * @param {string} redirectPath - Where to redirect if user doesn't have correct role
 */
function checkAuth(requiredRole, redirectPath = '/') {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async function (user) {
      if (user) {
        // User is logged in
        currentUser = user;

        try {
          // Get user data from Firestore
          const userDoc = await db.collection('users').doc(user.uid).get();

          if (userDoc.exists) {
            currentUserData = userDoc.data();

            // Check if user has the required role
            if (currentUserData.role !== requiredRole) {
              // Redirect to appropriate portal based on role
              switch (currentUserData.role) {
                case 'player':
                  window.location.href = '/player.html';
                  break;
                case 'coach':
                  window.location.href = '/coach.html';
                  break;
                case 'scout':
                  window.location.href = '/scout.html';
                  break;
                case 'fan':
                  window.location.href = '/fan.html';
                  break;
                case 'admin':
                  window.location.href = '/admin.html';
                  break;
                default:
                  window.location.href = redirectPath;
              }
              return;
            }

            // User has correct role, store user info and resolve
            localStorage.setItem(
              'currentUser',
              JSON.stringify({
                uid: user.uid,
                email: user.email,
                role: currentUserData.role,
                firstName: currentUserData.firstName,
                lastName: currentUserData.lastName,
              })
            );

            resolve(currentUserData);
          } else {
            // User document doesn't exist, redirect to registration
            console.error('User document not found');
            window.location.href = '/register.html';
            reject('User document not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          window.location.href = '/login.html';
          reject(error);
        }
      } else {
        // User is not logged in, redirect to login
        window.location.href = '/login.html';
        reject('User not authenticated');
      }
    });
  });
}

/**
 * Logout function
 */
function logout() {
  if (confirm('Are you sure you want to log out?')) {
    auth
      .signOut()
      .then(() => {
        localStorage.removeItem('currentUser');
        window.location.href = '/login.html';
      })
      .catch(error => {
        console.error('Error signing out:', error);
        alert('Error logging out. Please try again.');
      });
  }
}

/**
 * Get current user data
 */
function getCurrentUser() {
  return currentUser;
}

/**
 * Get current user data from Firestore
 */
function getCurrentUserData() {
  return currentUserData;
}

/**
 * Update user data in Firestore
 * @param {Object} updates - The data to update
 */
async function updateUserData(updates) {
  if (!currentUser) {
    throw new Error('No user logged in');
  }

  try {
    await db
      .collection('users')
      .doc(currentUser.uid)
      .update({
        ...updates,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

    // Update local user data
    currentUserData = { ...currentUserData, ...updates };

    // Update localStorage
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          ...storedUser,
          ...updates,
        })
      );
    }

    return true;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
}

/**
 * Get user statistics (for players)
 * @param {string} uid - User ID (optional, defaults to current user)
 */
async function getUserStats(uid = null) {
  const userId = uid || (currentUser ? currentUser.uid : null);

  if (!userId) {
    throw new Error('No user ID provided');
  }

  try {
    const statsDoc = await db.collection('playerStats').doc(userId).get();

    if (statsDoc.exists) {
      return statsDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
}

/**
 * Update user statistics (for players)
 * @param {Object} stats - The statistics to update
 * @param {string} uid - User ID (optional, defaults to current user)
 */
async function updateUserStats(stats, uid = null) {
  const userId = uid || (currentUser ? currentUser.uid : null);

  if (!userId) {
    throw new Error('No user ID provided');
  }

  try {
    await db
      .collection('playerStats')
      .doc(userId)
      .set(
        {
          ...stats,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

    return true;
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
}

// Export functions for global use
window.checkAuth = checkAuth;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.getCurrentUserData = getCurrentUserData;
window.updateUserData = updateUserData;
window.getUserStats = getUserStats;
window.updateUserStats = updateUserStats;
