#!/usr/bin/env node

// Simple test runner for E2E tests
// Handles ES module compatibility issues

const { spawn } = require('child_process');

// Configuration for different test types
const testConfigs = {
  comprehensive: {
    file: 'e2e-comprehensive.test.js',
    projects: ['critical-flows-chrome'],
    description: 'Comprehensive E2E test suite',
  },
  critical: {
    file: 'e2e-comprehensive.test.js',
    grep: 'Critical User Flow',
    projects: ['critical-flows-chrome', 'critical-flows-firefox'],
    description: 'Critical user flow tests',
  },
  security: {
    file: 'e2e-comprehensive.test.js',
    grep: 'Security and Data Validation',
    projects: ['critical-flows-chrome'],
    description: 'Security validation tests',
  },
  mobile: {
    file: 'e2e-comprehensive.test.js',
    projects: ['mobile-android', 'mobile-ios'],
    description: 'Mobile responsiveness tests',
  },
};

// Get test type from command line
const testType = process.argv[2] || 'comprehensive';
const config = testConfigs[testType];

if (!config) {
  console.error(`Unknown test type: ${testType}`);
  console.log('Available test types:', Object.keys(testConfigs).join(', '));
  process.exit(1);
}

console.log(`🚀 Running ${config.description}...`);

// Build Playwright command
const playwrightArgs = ['test', '--config=playwright.config.cjs', config.file];

// Add project filters
if (config.projects) {
  config.projects.forEach(project => {
    playwrightArgs.push(`--project=${project}`);
  });
}

// Add grep filter
if (config.grep) {
  playwrightArgs.push(`--grep=${config.grep}`);
}

// Add any additional args from command line
if (process.argv.length > 3) {
  playwrightArgs.push(...process.argv.slice(3));
}

// Run Playwright
const playwright = spawn('npx', ['playwright', ...playwrightArgs], {
  stdio: 'inherit',
  cwd: process.cwd(),
});

playwright.on('close', code => {
  if (code === 0) {
    console.log('✅ Tests completed successfully');
  } else {
    console.error(`❌ Tests failed with exit code ${code}`);
  }
  process.exit(code);
});

playwright.on('error', error => {
  console.error('❌ Failed to start tests:', error.message);
  process.exit(1);
});
