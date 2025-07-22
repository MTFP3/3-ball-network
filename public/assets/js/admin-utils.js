/**
 * Admin User Management Script
 * Helper functions for creating and managing admin users
 */

(function() {
  'use strict';

  // Firebase configuration check
  function checkFirebaseConfig() {
    if (typeof firebase === 'undefined') {
      console.error('❌ Firebase not loaded');
      return false;
    }
    
    if (!firebase.apps.length) {
      console.error('❌ Firebase not initialized');
      return false;
    }
    
    console.log('✅ Firebase is configured');
    return true;
  }

  // Create admin user helper
  async function createAdminUser(email, password, adminData = {}) {
    if (!checkFirebaseConfig()) return;

    try {
      console.log('🔄 Creating admin user...');
      
      // Create user with email/password
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      console.log('✅ User created:', user.uid);
      
      // Create user document in Firestore with admin role
      const userData = {
        uid: user.uid,
        email: user.email,
        role: 'admin',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        profile: {
          displayName: adminData.displayName || email.split('@')[0],
          firstName: adminData.firstName || '',
          lastName: adminData.lastName || '',
        },
        permissions: {
          manageUsers: true,
          manageContent: true,
          viewAnalytics: true,
          systemAdmin: true,
        },
        ...adminData
      };

      await firebase.firestore().collection('users').doc(user.uid).set(userData);
      
      console.log('✅ Admin user document created in Firestore');
      console.log('🎉 Admin user setup complete!');
      
      return { user, userData };
      
    } catch (error) {
      console.error('❌ Error creating admin user:', error);
      throw error;
    }
  }

  // Promote existing user to admin
  async function promoteUserToAdmin(userEmail) {
    if (!checkFirebaseConfig()) return;

    try {
      console.log(`🔄 Promoting ${userEmail} to admin...`);
      
      // Query for user by email
      const querySnapshot = await firebase.firestore()
        .collection('users')
        .where('email', '==', userEmail)
        .get();

      if (querySnapshot.empty) {
        throw new Error(`User with email ${userEmail} not found`);
      }

      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;
      
      // Update user role to admin
      await firebase.firestore().collection('users').doc(userId).update({
        role: 'admin',
        permissions: {
          manageUsers: true,
          manageContent: true,
          viewAnalytics: true,
          systemAdmin: true,
        },
        promotedToAdminAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      
      console.log('✅ User promoted to admin successfully');
      console.log(`🎉 ${userEmail} is now an admin!`);
      
      return userId;
      
    } catch (error) {
      console.error('❌ Error promoting user to admin:', error);
      throw error;
    }
  }

  // Check current user's role
  async function checkCurrentUserRole() {
    if (!checkFirebaseConfig()) return;

    const user = firebase.auth().currentUser;
    if (!user) {
      console.log('ℹ️ No user currently signed in');
      return null;
    }

    try {
      const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
      
      if (userDoc.exists) {
        const userData = userDoc.data();
        console.log(`ℹ️ Current user: ${user.email}`);
        console.log(`ℹ️ Role: ${userData.role || 'player'}`);
        console.log(`ℹ️ Permissions:`, userData.permissions || 'none');
        return userData;
      } else {
        console.log('⚠️ User document not found in Firestore');
        return null;
      }
    } catch (error) {
      console.error('❌ Error checking user role:', error);
      return null;
    }
  }

  // List all admin users
  async function listAdminUsers() {
    if (!checkFirebaseConfig()) return;

    try {
      console.log('🔄 Fetching admin users...');
      
      const querySnapshot = await firebase.firestore()
        .collection('users')
        .where('role', '==', 'admin')
        .get();

      if (querySnapshot.empty) {
        console.log('ℹ️ No admin users found');
        return [];
      }

      const admins = [];
      querySnapshot.forEach(doc => {
        const userData = doc.data();
        admins.push({
          id: doc.id,
          email: userData.email,
          displayName: userData.profile?.displayName,
          createdAt: userData.createdAt,
          permissions: userData.permissions
        });
      });

      console.log(`ℹ️ Found ${admins.length} admin user(s):`);
      admins.forEach(admin => {
        console.log(`  - ${admin.email} (${admin.displayName || 'No display name'})`);
      });

      return admins;
      
    } catch (error) {
      console.error('❌ Error listing admin users:', error);
      return [];
    }
  }

  // Export functions for global use
  window.adminUtils = {
    createAdminUser,
    promoteUserToAdmin,
    checkCurrentUserRole,
    listAdminUsers,
    checkFirebaseConfig
  };

  // Auto-check configuration when script loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(checkFirebaseConfig, 1000);
    });
  } else {
    setTimeout(checkFirebaseConfig, 1000);
  }

  console.log('🔧 Admin utilities loaded. Use window.adminUtils for admin management.');
  console.log('📝 Available functions:');
  console.log('  - adminUtils.createAdminUser(email, password, adminData)');
  console.log('  - adminUtils.promoteUserToAdmin(email)');
  console.log('  - adminUtils.checkCurrentUserRole()');
  console.log('  - adminUtils.listAdminUsers()');

})();