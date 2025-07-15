/**
 * Migration Script: localStorage to Firebase Custom Claims
 *
 * This script helps migrate from insecure localStorage role management
 * to secure Firebase Custom Claims
 */

import { secureAuth } from './secureAuth.js';
import {
  getFunctions,
  httpsCallable,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-functions.js';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { db } from './firebaseConfig.js';

class RoleMigration {
  constructor() {
    this.functions = getFunctions();
    this.assignUserRole = httpsCallable(this.functions, 'assignUserRole');
    this.migrationLog = [];
  }

  /**
   * Admin function: Migrate all users from localStorage-based roles to Custom Claims
   */
  async migrateAllUsers() {
    if (!secureAuth.isAdmin()) {
      throw new Error('Admin privileges required for user migration');
    }

    console.log('🚀 Starting user role migration...');
    this.migrationLog = [];

    try {
      // Get all users from different role collections
      const collections = ['players', 'coaches', 'scouts', 'fans', 'admins'];
      const allUsers = [];

      for (const collectionName of collections) {
        const snapshot = await getDocs(collection(db, collectionName));
        snapshot.forEach(doc => {
          const userData = doc.data();
          allUsers.push({
            uid: doc.id,
            role: collectionName.slice(0, -1), // Remove 's' from collection name
            ...userData,
          });
        });
      }

      console.log(`Found ${allUsers.length} users to migrate`);

      // Migrate each user
      for (const user of allUsers) {
        try {
          await this.migrateUser(user);
          this.migrationLog.push({
            uid: user.uid,
            email: user.email,
            role: user.role,
            status: 'success',
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.error(`Failed to migrate user ${user.uid}:`, error);
          this.migrationLog.push({
            uid: user.uid,
            email: user.email,
            role: user.role,
            status: 'failed',
            error: error.message,
            timestamp: new Date().toISOString(),
          });
        }
      }

      // Generate migration report
      const report = this.generateMigrationReport();
      console.log('📊 Migration completed. Report:', report);

      return report;
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  /**
   * Migrate a single user to Custom Claims
   */
  async migrateUser(user) {
    try {
      // Assign role via Cloud Function (this sets custom claims)
      const result = await this.assignUserRole({
        userId: user.uid,
        role: user.role,
      });

      // Update user document to mark as migrated
      await updateDoc(doc(db, 'users', user.uid), {
        migratedToCustomClaims: true,
        migrationDate: new Date().toISOString(),
        legacyRole: user.role,
      });

      console.log(`✅ Migrated user ${user.email} to role: ${user.role}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to migrate user ${user.email}:`, error);
      throw error;
    }
  }

  /**
   * Generate migration report
   */
  generateMigrationReport() {
    const successful = this.migrationLog.filter(
      log => log.status === 'success'
    );
    const failed = this.migrationLog.filter(log => log.status === 'failed');

    const roleBreakdown = {};
    successful.forEach(log => {
      roleBreakdown[log.role] = (roleBreakdown[log.role] || 0) + 1;
    });

    return {
      total: this.migrationLog.length,
      successful: successful.length,
      failed: failed.length,
      successRate: `${((successful.length / this.migrationLog.length) * 100).toFixed(2)}%`,
      roleBreakdown: roleBreakdown,
      failedUsers: failed,
      completedAt: new Date().toISOString(),
    };
  }

  /**
   * Clean up localStorage-based role data (run after migration)
   */
  cleanupLegacyRoleData() {
    console.log('🧹 Cleaning up legacy localStorage role data...');

    // Remove role from localStorage
    localStorage.removeItem('role');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user_role');

    // Clear any other role-related localStorage items
    const rolePrefixes = ['role_', 'user_role_', 'auth_role_'];
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (rolePrefixes.some(prefix => key?.startsWith(prefix))) {
        localStorage.removeItem(key);
      }
    }

    console.log('✅ Legacy role data cleaned up');
  }

  /**
   * Verify migration was successful
   */
  async verifyMigration() {
    if (!secureAuth.isAuthenticated()) {
      throw new Error('User must be authenticated to verify migration');
    }

    try {
      // Get role from custom claims
      const customClaimsRole = await secureAuth.loadUserRole();

      // Check if user document shows migration completed
      const userProfile = await secureAuth.getUserProfile();

      const verification = {
        customClaimsRole: customClaimsRole,
        migrated: userProfile.migratedToCustomClaims || false,
        migrationDate: userProfile.migrationDate || null,
        legacyRole: userProfile.legacyRole || null,
        isSecure: !!customClaimsRole && userProfile.migratedToCustomClaims,
      };

      console.log('🔍 Migration verification:', verification);
      return verification;
    } catch (error) {
      console.error('Migration verification failed:', error);
      throw error;
    }
  }

  /**
   * Check if current user needs migration
   */
  async checkUserMigrationStatus() {
    if (!secureAuth.isAuthenticated()) {
      return { needsMigration: false, reason: 'Not authenticated' };
    }

    try {
      const userProfile = await secureAuth.getUserProfile();
      const hasCustomClaims = !!secureAuth.getUserRole();
      const isMigrated = userProfile.migratedToCustomClaims || false;

      if (!hasCustomClaims && !isMigrated) {
        return {
          needsMigration: true,
          reason: 'No custom claims and not migrated',
          action: 'Contact admin for role assignment',
        };
      }

      if (hasCustomClaims && !isMigrated) {
        return {
          needsMigration: true,
          reason: 'Has custom claims but migration not marked complete',
          action: 'Update user document migration status',
        };
      }

      return {
        needsMigration: false,
        reason: 'User fully migrated',
        role: secureAuth.getUserRole(),
      };
    } catch (error) {
      console.error('Error checking migration status:', error);
      return {
        needsMigration: true,
        reason: 'Error checking status',
        error: error.message,
      };
    }
  }
}

// Create and export migration instance
const roleMigration = new RoleMigration();

export { roleMigration, RoleMigration };

// Make available globally for admin console
window.roleMigration = roleMigration;

// Auto-check migration status on load
document.addEventListener('DOMContentLoaded', async () => {
  // Wait a moment for auth to initialize
  setTimeout(async () => {
    if (secureAuth.isAuthenticated()) {
      const status = await roleMigration.checkUserMigrationStatus();

      if (status.needsMigration) {
        console.warn('⚠️ User needs migration:', status);

        // Show migration notice to user
        if (window.errorHandler) {
          window.errorHandler.showWarning(
            `Account security update required. ${status.action}`,
            0 // Don't auto-dismiss
          );
        }
      }
    }
  }, 2000);
});
