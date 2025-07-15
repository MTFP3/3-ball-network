/**
 * Secure Authentication System
 * Uses Firebase Custom Claims for tamper-proof role management
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdTokenResult,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import {
  doc,
  setDoc,
  getDoc,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import {
  getFunctions,
  httpsCallable,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-functions.js';
import { auth, db } from './firebaseConfig.js';
import { logAnalyticsEvent } from './analyticsLogger.js';

// Initialize Firebase Functions
const functions = getFunctions();

// Cloud Functions references
const assignUserRoleFunction = httpsCallable(functions, 'assignUserRole');
const getUserRoleFunction = httpsCallable(functions, 'getUserRole');
const verifyUserPermissionsFunction = httpsCallable(
  functions,
  'verifyUserPermissions'
);

class SecureAuth {
  constructor() {
    this.currentUser = null;
    this.userRole = null;
    this.userPermissions = {};
    this.initializeAuthStateListener();
  }

  /**
   * Initialize authentication state listener
   */
  initializeAuthStateListener() {
    onAuthStateChanged(auth, async user => {
      if (user) {
        this.currentUser = user;
        await this.loadUserRole();
        await this.loadUserPermissions();
        this.notifyAuthStateChange(true);
      } else {
        this.currentUser = null;
        this.userRole = null;
        this.userPermissions = {};
        this.notifyAuthStateChange(false);
      }
    });
  }

  /**
   * Load user role from secure Firebase Custom Claims
   */
  async loadUserRole() {
    try {
      if (!this.currentUser) return null;

      // Get the user's ID token which contains custom claims
      const idTokenResult = await getIdTokenResult(this.currentUser);
      const customClaims = idTokenResult.claims;

      this.userRole = customClaims.role || 'fan';

      // Verify with server-side function for extra security
      const result = await getUserRoleFunction();

      if (result.data.role !== this.userRole) {
        console.warn('Role mismatch detected, using server-verified role');
        this.userRole = result.data.role;
      }

      return this.userRole;
    } catch (error) {
      console.error('Error loading user role:', error);
      this.userRole = 'fan'; // Fail safe to lowest privilege
      return this.userRole;
    }
  }

  /**
   * Load user permissions based on role
   */
  async loadUserPermissions() {
    if (!this.userRole) return;

    // Define permissions for each role
    const rolePermissions = {
      fan: {
        viewPublicProfiles: true,
        viewPublicStats: true,
        followPlayers: true,
      },
      player: {
        ...this.getPermissions('fan'),
        editOwnProfile: true,
        viewTeamStats: true,
        accessPlayerPortal: true,
      },
      scout: {
        ...this.getPermissions('player'),
        viewAdvancedStats: true,
        accessScoutingTools: true,
        exportReports: true,
      },
      coach: {
        ...this.getPermissions('scout'),
        manageTeam: true,
        accessCoachPortal: true,
        viewLiveGameTools: true,
        uploadRoster: true,
      },
      admin: {
        ...this.getPermissions('coach'),
        manageUsers: true,
        accessAdminPortal: true,
        viewSystemStats: true,
        assignRoles: true,
      },
    };

    this.userPermissions =
      rolePermissions[this.userRole] || rolePermissions['fan'];
  }

  /**
   * Helper method to get permissions for a role
   */
  getPermissions(role) {
    const basePermissions = {
      fan: {
        viewPublicProfiles: true,
        viewPublicStats: true,
        followPlayers: true,
      },
    };

    return basePermissions[role] || {};
  }

  /**
   * Register new user with secure role assignment
   */
  async registerUser(email, password, requestedRole, userData) {
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store user data in Firestore
      const userDocData = {
        ...userData,
        uid: user.uid,
        email: user.email,
        requestedRole: requestedRole,
        approved: false,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), userDocData);

      // Note: Role assignment will be handled by admin approval process
      // Default role 'fan' is assigned automatically by Cloud Function

      await logAnalyticsEvent('user_registration', user.uid, requestedRole);

      return {
        success: true,
        uid: user.uid,
        message:
          'Account created successfully. Role assignment pending approval.',
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Secure user login
   */
  async loginUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Role will be loaded automatically by auth state listener
      await logAnalyticsEvent('user_login', user.uid, this.userRole);

      return {
        success: true,
        user: user,
        role: this.userRole,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Secure logout
   */
  async logoutUser() {
    try {
      await logAnalyticsEvent(
        'user_logout',
        this.currentUser?.uid,
        this.userRole
      );
      await signOut(auth);

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission) {
    return this.userPermissions[permission] || false;
  }

  /**
   * Verify user can perform specific action (server-side verification)
   */
  async verifyPermission(requiredRole, action) {
    try {
      const result = await verifyUserPermissionsFunction({
        requiredRole: requiredRole,
        action: action,
      });

      return result.data.hasPermission;
    } catch (error) {
      console.error('Permission verification error:', error);
      return false; // Fail secure - deny access on error
    }
  }

  /**
   * Get current user role
   */
  getUserRole() {
    return this.userRole;
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.currentUser;
  }

  /**
   * Check if user has admin privileges
   */
  isAdmin() {
    return this.userRole === 'admin';
  }

  /**
   * Check if user has coach privileges
   */
  isCoach() {
    return ['admin', 'coach'].includes(this.userRole);
  }

  /**
   * Check if user has scout privileges
   */
  isScout() {
    return ['admin', 'coach', 'scout'].includes(this.userRole);
  }

  /**
   * Notify components of authentication state changes
   */
  notifyAuthStateChange(isAuthenticated) {
    const event = new CustomEvent('authStateChanged', {
      detail: {
        isAuthenticated: isAuthenticated,
        user: this.currentUser,
        role: this.userRole,
        permissions: this.userPermissions,
      },
    });

    document.dispatchEvent(event);
  }

  /**
   * Admin function: Assign role to user
   */
  async assignUserRole(userId, role) {
    if (!this.isAdmin()) {
      throw new Error('Admin privileges required to assign roles');
    }

    try {
      const result = await assignUserRoleFunction({
        userId: userId,
        role: role,
      });

      return result.data;
    } catch (error) {
      console.error('Role assignment error:', error);
      throw new Error(`Failed to assign role: ${error.message}`);
    }
  }

  /**
   * Get user profile with secure role information
   */
  async getUserProfile(userId = null) {
    const targetUserId = userId || this.currentUser?.uid;

    if (!targetUserId) {
      throw new Error('No user specified');
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', targetUserId));

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      return userDoc.data();
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }
}

// Create and export singleton instance
const secureAuth = new SecureAuth();

export { secureAuth, SecureAuth };

// Legacy compatibility - gradually phase out
window.secureAuth = secureAuth;

// Expose commonly used methods globally for backward compatibility
window.getUserRole = () => secureAuth.getUserRole();
window.hasPermission = permission => secureAuth.hasPermission(permission);
window.isAuthenticated = () => secureAuth.isAuthenticated();
window.isAdmin = () => secureAuth.isAdmin();
