const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

/**
 * Cloud Function to securely assign user roles
 * This function can only be called by authenticated admin users
 */
exports.assignUserRole = functions.https.onCall(async (data, context) => {
  // Verify the caller is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to assign roles.'
    );
  }

  // Verify the caller has admin privileges
  const callerToken = await admin.auth().getUser(context.auth.uid);
  const callerClaims = callerToken.customClaims;

  if (!callerClaims || callerClaims.role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can assign user roles.'
    );
  }

  const { userId, role } = data;

  // Validate input
  const validRoles = ['player', 'coach', 'scout', 'fan', 'admin'];
  if (!validRoles.includes(role)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `Invalid role. Must be one of: ${validRoles.join(', ')}`
    );
  }

  if (!userId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'User ID is required.'
    );
  }

  try {
    // Set custom claims for the user
    await admin.auth().setCustomUserClaims(userId, {
      role: role,
      assignedAt: new Date().toISOString(),
      assignedBy: context.auth.uid,
    });

    // Update user document in Firestore
    await admin.firestore().doc(`users/${userId}`).set(
      {
        role: role,
        roleAssignedAt: new Date().toISOString(),
        roleAssignedBy: context.auth.uid,
      },
      { merge: true }
    );

    // Log the role assignment for audit trail
    await admin.firestore().collection('roleAssignments').add({
      userId: userId,
      role: role,
      assignedBy: context.auth.uid,
      assignedAt: new Date().toISOString(),
      ip: context.rawRequest.ip,
    });

    return {
      success: true,
      message: `Successfully assigned role '${role}' to user ${userId}`,
    };
  } catch (error) {
    console.error('Error assigning user role:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to assign user role.'
    );
  }
});

/**
 * Cloud Function to get user role securely
 * This returns the role from custom claims, not localStorage
 */
exports.getUserRole = functions.https.onCall(async (data, context) => {
  // Verify the caller is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to get role.'
    );
  }

  try {
    const userRecord = await admin.auth().getUser(context.auth.uid);
    const customClaims = userRecord.customClaims || {};

    return {
      role: customClaims.role || 'fan', // Default to 'fan' if no role set
      assignedAt: customClaims.assignedAt || null,
      verified: true,
    };
  } catch (error) {
    console.error('Error getting user role:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to get user role.'
    );
  }
});

/**
 * Trigger function to assign default role when user signs up
 */
exports.assignDefaultRole = functions.auth.user().onCreate(async user => {
  try {
    // Default new users to 'fan' role
    await admin.auth().setCustomUserClaims(user.uid, {
      role: 'fan',
      assignedAt: new Date().toISOString(),
      assignedBy: 'system',
    });

    // Create user document in Firestore
    await admin.firestore().doc(`users/${user.uid}`).set({
      uid: user.uid,
      email: user.email,
      role: 'fan',
      roleAssignedAt: new Date().toISOString(),
      roleAssignedBy: 'system',
      createdAt: new Date().toISOString(),
    });

    console.log(`Assigned default role 'fan' to new user: ${user.uid}`);
  } catch (error) {
    console.error('Error assigning default role:', error);
  }
});

/**
 * Cloud Function to verify user permissions for specific actions
 */
exports.verifyUserPermissions = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated.'
      );
    }

    const { requiredRole, action } = data;

    try {
      const userRecord = await admin.auth().getUser(context.auth.uid);
      const userRole = userRecord.customClaims?.role || 'fan';

      // Define role hierarchy
      const roleHierarchy = {
        fan: 0,
        player: 1,
        scout: 2,
        coach: 3,
        admin: 4,
      };

      const userLevel = roleHierarchy[userRole] || 0;
      const requiredLevel = roleHierarchy[requiredRole] || 0;

      const hasPermission = userLevel >= requiredLevel;

      // Log permission check for audit
      await admin.firestore().collection('permissionChecks').add({
        userId: context.auth.uid,
        userRole: userRole,
        requiredRole: requiredRole,
        action: action,
        granted: hasPermission,
        timestamp: new Date().toISOString(),
        ip: context.rawRequest.ip,
      });

      return {
        hasPermission: hasPermission,
        userRole: userRole,
        requiredRole: requiredRole,
      };
    } catch (error) {
      console.error('Error verifying permissions:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to verify permissions.'
      );
    }
  }
);

/**
 * Cloud Function to list users with their roles (admin only)
 */
exports.listUsersWithRoles = functions.https.onCall(async (data, context) => {
  // Verify admin access
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Authentication required.'
    );
  }

  const callerToken = await admin.auth().getUser(context.auth.uid);
  const callerClaims = callerToken.customClaims;

  if (!callerClaims || callerClaims.role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Admin access required.'
    );
  }

  try {
    const listUsersResult = await admin.auth().listUsers(1000);
    const users = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      role: user.customClaims?.role || 'fan',
      assignedAt: user.customClaims?.assignedAt || null,
      createdAt: user.metadata.creationTime,
      lastSignIn: user.metadata.lastSignInTime,
    }));

    return { users };
  } catch (error) {
    console.error('Error listing users:', error);
    throw new functions.https.HttpsError('internal', 'Failed to list users.');
  }
});
