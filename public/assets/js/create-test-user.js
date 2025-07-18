// Test User Creation Script
// Run this in browser console to create a test player account

async function createTestPlayer() {
  try {
    // Firebase config
    const config = getFirebaseConfig();
    if (!config) {
      throw new Error('Firebase config not found');
    }

    // Initialize Firebase if not already done
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    const auth = firebase.auth();
    const db = firebase.firestore();

    // Test player credentials
    const testEmail = 'player@test.com';
    const testPassword = 'testpassword123';

    console.log('Creating test player account...');

    // Create the user account
    const userCredential = await auth.createUserWithEmailAndPassword(
      testEmail,
      testPassword
    );
    const user = userCredential.user;

    console.log('User created:', user.uid);

    // Create user profile in Firestore
    const playerData = {
      uid: user.uid,
      email: testEmail,
      role: 'player',
      name: 'Test Player',
      position: 'Point Guard',
      height: '6\'2"',
      weight: '185 lbs',
      school: 'Test High School',
      approved: true,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('users').doc(user.uid).set(playerData);

    console.log('✅ Test player created successfully!');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
    console.log('You can now log in with these credentials');

    // Sign out the test user
    await auth.signOut();
  } catch (error) {
    console.error('Error creating test player:', error);

    if (error.code === 'auth/email-already-in-use') {
      console.log('Test player already exists. Use:');
      console.log('Email: player@test.com');
      console.log('Password: testpassword123');
    }
  }
}

// Export function for manual execution
window.createTestPlayer = createTestPlayer;

// Function to check and fix user role
async function checkUserRole(email = 'player@test.com') {
  try {
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Sign in to get the user
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      'testpassword123'
    );
    const user = userCredential.user;

    console.log('Checking user role for:', user.uid);

    // Get user document
    const userDoc = await db.collection('users').doc(user.uid).get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log('Current user data:', userData);
      console.log('Current role:', userData.role);

      if (userData.role !== 'player') {
        console.log('🔧 Fixing user role from', userData.role, 'to player');

        // Update role to player
        await db.collection('users').doc(user.uid).update({
          role: 'player',
          position: 'Point Guard',
          height: '6\'2"',
          weight: '185 lbs',
          school: 'Test High School',
          approved: true,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        console.log('✅ User role updated to player');
      } else {
        console.log('✅ User role is already correct');
      }
    } else {
      console.log('❌ User document not found');
    }

    // Sign out
    await auth.signOut();
    console.log('✅ Check complete. You can now log in again.');
  } catch (error) {
    console.error('Error checking user role:', error);
  }
}

// Function to delete and recreate test user
async function recreateTestPlayer() {
  try {
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Sign in to get the user
    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        'player@test.com',
        'testpassword123'
      );
      const user = userCredential.user;

      console.log('Deleting existing user...');

      // Delete user document
      await db.collection('users').doc(user.uid).delete();

      // Delete user account
      await user.delete();

      console.log('✅ Old user deleted');
    } catch (deleteError) {
      console.log('No existing user to delete or error:', deleteError.message);
    }

    // Create new user
    await createTestPlayer();
  } catch (error) {
    console.error('Error recreating test player:', error);
  }
}

window.checkUserRole = checkUserRole;
window.recreateTestPlayer = recreateTestPlayer;

console.log(
  'Test user script loaded. Run createTestPlayer() to create a test player account.'
);
