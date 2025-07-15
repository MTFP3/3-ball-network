/**
 * 🛡️ Server-Side Validation Test Suite
 * Tests the comprehensive Firestore security rules and validation
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  connectFirestoreEmulator,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

class ValidationTestSuite {
  constructor() {
    this.testResults = [];
    this.currentUser = null;
  }

  // Helper method to run a test and capture results
  async runTest(testName, testFunction) {
    try {
      console.log(`🧪 Running test: ${testName}`);
      await testFunction();
      this.testResults.push({ name: testName, status: 'PASS', error: null });
      console.log(`✅ PASS: ${testName}`);
    } catch (error) {
      this.testResults.push({
        name: testName,
        status: 'FAIL',
        error: error.message,
      });
      console.log(`❌ FAIL: ${testName} - ${error.message}`);
    }
  }

  // Test game data validation
  async testGameValidation() {
    await this.runTest('Valid game data should succeed', async () => {
      const validGameData = {
        teamName: 'Warriors',
        opponent: 'Lakers',
        date: '2024-12-15',
        videoUrl: 'https://example.com/video.mp4',
        uploadedBy: 'Warriors Coach',
        analysisStatus: 'pending',
        taggingStatus: 'pending-tagging',
        score: '95-88',
        location: 'Oracle Arena',
        notes: 'Great defensive effort in the fourth quarter.',
        duration: 7200, // 2 hours
      };

      await setDoc(doc(db, 'games', 'test-game-1'), validGameData);
    });

    await this.runTest(
      'Game with missing required field should fail',
      async () => {
        const invalidGameData = {
          // Missing teamName (required)
          opponent: 'Lakers',
          date: '2024-12-15',
          uploadedBy: 'Warriors Coach',
          analysisStatus: 'pending',
          taggingStatus: 'pending-tagging',
        };

        try {
          await setDoc(doc(db, 'games', 'test-game-2'), invalidGameData);
          throw new Error('Expected validation to fail');
        } catch (error) {
          if (error.code !== 'permission-denied') {
            throw error;
          }
        }
      }
    );

    await this.runTest(
      'Game with invalid date format should fail',
      async () => {
        const invalidGameData = {
          teamName: 'Warriors',
          opponent: 'Lakers',
          date: '12/15/2024', // Invalid format
          uploadedBy: 'Warriors Coach',
          analysisStatus: 'pending',
          taggingStatus: 'pending-tagging',
        };

        try {
          await setDoc(doc(db, 'games', 'test-game-3'), invalidGameData);
          throw new Error('Expected validation to fail');
        } catch (error) {
          if (error.code !== 'permission-denied') {
            throw error;
          }
        }
      }
    );

    await this.runTest('Game with invalid URL should fail', async () => {
      const invalidGameData = {
        teamName: 'Warriors',
        opponent: 'Lakers',
        date: '2024-12-15',
        videoUrl: 'not-a-valid-url', // Invalid URL
        uploadedBy: 'Warriors Coach',
        analysisStatus: 'pending',
        taggingStatus: 'pending-tagging',
      };

      try {
        await setDoc(doc(db, 'games', 'test-game-4'), invalidGameData);
        throw new Error('Expected validation to fail');
      } catch (error) {
        if (error.code !== 'permission-denied') {
          throw error;
        }
      }
    });

    await this.runTest(
      'Game with excessively long string should fail',
      async () => {
        const invalidGameData = {
          teamName: 'A'.repeat(150), // Too long (max 100)
          opponent: 'Lakers',
          date: '2024-12-15',
          uploadedBy: 'Warriors Coach',
          analysisStatus: 'pending',
          taggingStatus: 'pending-tagging',
        };

        try {
          await setDoc(doc(db, 'games', 'test-game-5'), invalidGameData);
          throw new Error('Expected validation to fail');
        } catch (error) {
          if (error.code !== 'permission-denied') {
            throw error;
          }
        }
      }
    );

    await this.runTest(
      'Game with invalid analysis status should fail',
      async () => {
        const invalidGameData = {
          teamName: 'Warriors',
          opponent: 'Lakers',
          date: '2024-12-15',
          uploadedBy: 'Warriors Coach',
          analysisStatus: 'invalid-status', // Invalid status
          taggingStatus: 'pending-tagging',
        };

        try {
          await setDoc(doc(db, 'games', 'test-game-6'), invalidGameData);
          throw new Error('Expected validation to fail');
        } catch (error) {
          if (error.code !== 'permission-denied') {
            throw error;
          }
        }
      }
    );
  }

  // Test user data validation
  async testUserValidation() {
    await this.runTest('Valid user data should succeed', async () => {
      const validUserData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'player',
        uid: 'test-user-1',
        createdAt: new Date().toISOString(),
        status: 'active',
        bio: 'Passionate basketball player with 10 years of experience.',
        location: 'Los Angeles, CA',
        school: 'UCLA',
        position: 'PG',
        skillLevel: 'advanced',
        height: 180,
        weight: 75,
        gpa: 3.8,
        graduationYear: 2025,
      };

      await setDoc(doc(db, 'users', 'test-user-1'), validUserData);
    });

    await this.runTest('User with invalid email should fail', async () => {
      const invalidUserData = {
        name: 'John Doe',
        email: 'not-an-email', // Invalid email
        role: 'player',
        uid: 'test-user-2',
        createdAt: new Date().toISOString(),
        status: 'active',
      };

      try {
        await setDoc(doc(db, 'users', 'test-user-2'), invalidUserData);
        throw new Error('Expected validation to fail');
      } catch (error) {
        if (error.code !== 'permission-denied') {
          throw error;
        }
      }
    });

    await this.runTest('User with invalid role should fail', async () => {
      const invalidUserData = {
        name: 'John Doe',
        email: 'john2@example.com',
        role: 'invalid-role', // Invalid role
        uid: 'test-user-3',
        createdAt: new Date().toISOString(),
        status: 'active',
      };

      try {
        await setDoc(doc(db, 'users', 'test-user-3'), invalidUserData);
        throw new Error('Expected validation to fail');
      } catch (error) {
        if (error.code !== 'permission-denied') {
          throw error;
        }
      }
    });

    await this.runTest('User with invalid position should fail', async () => {
      const invalidUserData = {
        name: 'John Doe',
        email: 'john3@example.com',
        role: 'player',
        uid: 'test-user-4',
        createdAt: new Date().toISOString(),
        status: 'active',
        position: 'INVALID', // Invalid position
      };

      try {
        await setDoc(doc(db, 'users', 'test-user-4'), invalidUserData);
        throw new Error('Expected validation to fail');
      } catch (error) {
        if (error.code !== 'permission-denied') {
          throw error;
        }
      }
    });

    await this.runTest('User with invalid GPA should fail', async () => {
      const invalidUserData = {
        name: 'John Doe',
        email: 'john4@example.com',
        role: 'player',
        uid: 'test-user-5',
        createdAt: new Date().toISOString(),
        status: 'active',
        gpa: 5.0, // Invalid GPA (max 4.0)
      };

      try {
        await setDoc(doc(db, 'users', 'test-user-5'), invalidUserData);
        throw new Error('Expected validation to fail');
      } catch (error) {
        if (error.code !== 'permission-denied') {
          throw error;
        }
      }
    });
  }

  // Test contact request validation
  async testContactRequestValidation() {
    await this.runTest('Valid contact request should succeed', async () => {
      const validRequestData = {
        from: 'test-user-1',
        to: 'test-user-2',
        message:
          'Hi, I would like to connect with you regarding basketball opportunities.',
        status: 'pending',
      };

      await addDoc(collection(db, 'contactRequests'), validRequestData);
    });

    await this.runTest(
      'Contact request with short message should fail',
      async () => {
        const invalidRequestData = {
          from: 'test-user-1',
          to: 'test-user-2',
          message: '', // Too short
          status: 'pending',
        };

        try {
          await addDoc(collection(db, 'contactRequests'), invalidRequestData);
          throw new Error('Expected validation to fail');
        } catch (error) {
          if (error.code !== 'permission-denied') {
            throw error;
          }
        }
      }
    );

    await this.runTest(
      'Contact request with invalid status should fail',
      async () => {
        const invalidRequestData = {
          from: 'test-user-1',
          to: 'test-user-2',
          message: 'Hi, I would like to connect with you.',
          status: 'invalid-status', // Invalid status
        };

        try {
          await addDoc(collection(db, 'contactRequests'), invalidRequestData);
          throw new Error('Expected validation to fail');
        } catch (error) {
          if (error.code !== 'permission-denied') {
            throw error;
          }
        }
      }
    );
  }

  // Generate test report
  generateReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(
      test => test.status === 'PASS'
    ).length;
    const failedTests = totalTests - passedTests;

    const reportContainer = document.getElementById('validation-test-results');
    if (!reportContainer) return;

    reportContainer.innerHTML = `
      <div class="test-summary">
        <h2>🛡️ Server-Side Validation Test Results</h2>
        <div class="test-stats">
          <div class="stat">
            <strong>Total Tests:</strong> ${totalTests}
          </div>
          <div class="stat success">
            <strong>Passed:</strong> ${passedTests}
          </div>
          <div class="stat error">
            <strong>Failed:</strong> ${failedTests}
          </div>
          <div class="stat">
            <strong>Success Rate:</strong> ${((passedTests / totalTests) * 100).toFixed(1)}%
          </div>
        </div>
      </div>
      
      <div class="test-details">
        ${this.testResults
          .map(
            test => `
          <div class="test-result ${test.status.toLowerCase()}">
            <div class="test-name">
              ${test.status === 'PASS' ? '✅' : '❌'} ${test.name}
            </div>
            ${test.error ? `<div class="test-error">${test.error}</div>` : ''}
          </div>
        `
          )
          .join('')}
      </div>
      
      <style>
        .test-summary {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .test-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        .stat {
          padding: 10px;
          background: white;
          border-radius: 6px;
          border-left: 4px solid #007cba;
        }
        .stat.success {
          border-left-color: #28a745;
        }
        .stat.error {
          border-left-color: #dc3545;
        }
        .test-result {
          padding: 12px;
          margin: 8px 0;
          border-radius: 6px;
          border-left: 4px solid #007cba;
        }
        .test-result.pass {
          background: #d4edda;
          border-left-color: #28a745;
        }
        .test-result.fail {
          background: #f8d7da;
          border-left-color: #dc3545;
        }
        .test-name {
          font-weight: 600;
          margin-bottom: 4px;
        }
        .test-error {
          font-size: 0.9em;
          color: #721c24;
          font-family: monospace;
        }
      </style>
    `;
  }

  // Run all validation tests
  async runAllTests() {
    console.log('🚀 Starting Server-Side Validation Test Suite...');

    try {
      await this.testGameValidation();
      await this.testUserValidation();
      await this.testContactRequestValidation();

      console.log('📊 Generating test report...');
      this.generateReport();

      const passedTests = this.testResults.filter(
        test => test.status === 'PASS'
      ).length;
      const totalTests = this.testResults.length;

      if (passedTests === totalTests) {
        console.log(
          '🎉 All validation tests passed! Server-side security is working correctly.'
        );
      } else {
        console.log(
          `⚠️ ${totalTests - passedTests} tests failed. Please review the Firestore rules.`
        );
      }
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }
}

// Initialize and run tests when page loads
document.addEventListener('DOMContentLoaded', () => {
  const testSuite = new ValidationTestSuite();

  // Add test button to page
  const testButton = document.createElement('button');
  testButton.textContent = '🧪 Run Server-Side Validation Tests';
  testButton.style.cssText = `
    background: #007cba;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    margin: 20px 0;
  `;

  testButton.addEventListener('click', () => {
    testButton.disabled = true;
    testButton.textContent = '🔄 Running Tests...';

    testSuite.runAllTests().finally(() => {
      testButton.disabled = false;
      testButton.textContent = '🧪 Run Server-Side Validation Tests';
    });
  });

  // Add results container
  const resultsContainer = document.createElement('div');
  resultsContainer.id = 'validation-test-results';

  document.body.appendChild(testButton);
  document.body.appendChild(resultsContainer);
});

export default ValidationTestSuite;
