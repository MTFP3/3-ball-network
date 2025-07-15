// Global setup for E2E tests
// Initializes test environment and creates test data

import { chromium } from '@playwright/test';

async function globalSetup() {
  console.log('🚀 Starting E2E Test Environment Setup...');

  // Create test users in Firebase (if needed)
  await setupTestUsers();

  // Verify test environment is ready
  await verifyTestEnvironment();

  console.log('✅ E2E Test Environment Ready');
}

async function setupTestUsers() {
  console.log('👥 Setting up test users...');

  // Test users are created during the test runs to avoid
  // state dependencies between test runs

  // For now, we'll use dynamic user creation in tests
  // This could be extended to pre-create stable test users

  console.log('✅ Test user setup complete');
}

async function verifyTestEnvironment() {
  console.log('🔍 Verifying test environment...');

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Test basic connectivity
    const response = await page.goto(
      process.env.TEST_BASE_URL || 'http://localhost:5173'
    );

    if (!response.ok()) {
      throw new Error(`Test server not responding: ${response.status()}`);
    }

    // Test Firebase connectivity
    await page.evaluate(() => {
      if (!window.firebase || !window.firebaseConfig) {
        throw new Error('Firebase not initialized');
      }
    });

    await browser.close();
    console.log('✅ Environment verification complete');
  } catch (error) {
    console.error('❌ Environment verification failed:', error.message);
    throw error;
  }
}

module.exports = globalSetup;

// ES module export for compatibility
export default globalSetup;
