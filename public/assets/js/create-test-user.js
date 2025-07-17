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

console.log(
  'Test user script loaded. Run createTestPlayer() to create a test player account.'
);
