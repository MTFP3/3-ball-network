module.exports = {
  // Test environment setup - use node environment for simplicity
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    '<rootDir>/tests/helpers/test-setup.js',
    '<rootDir>/tests/helpers/custom-matchers.js',
  ],

  // Module resolution (CORRECT JEST PROPERTY)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|mp4|mov|avi)$':
      '<rootDir>/tests/mocks/file-mock.js',
  },

  // Test patterns
  testMatch: [
    '<rootDir>/tests/__tests__/unit/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/tests/__tests__/integration/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/tests/__tests__/security/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/tests/__tests__/accessibility/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/tests/__tests__/ai/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/tests/__tests__/performance/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/tests/__tests__/chaos/**/*.test.{js,jsx,ts,tsx}',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/index.js',
    '!src/serviceWorker.js',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],

  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    // Specific thresholds for critical modules
    './src/services/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './src/components/auth/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './src/utils/security/': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },

  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],

  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '^.+\\.css$': '<rootDir>/tests/mocks/css-transform.js',
  },

  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],

  // Test timeout
  testTimeout: 30000,

  // Globals
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },

  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Error handling
  errorOnDeprecated: true,
  verbose: true,

  // Test results processing
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './tests/reports',
        filename: 'jest-report.html',
        expand: true,
      },
    ],
    [
      'jest-junit',
      {
        outputDirectory: './tests/reports',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
  ],

  // Watch mode configuration
  watchPathIgnorePatterns: [
    '/node_modules/',
    '/tests/reports/',
    '/coverage/',
    '/build/',
    '/dist/',
  ],

  // Snapshot configuration
  snapshotSerializers: ['enzyme-to-json/serializer'],

  // Test sequencer for optimal test order
  testSequencer: '<rootDir>/tests/config/test-sequencer.js',

  // Custom test runner for performance tests
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/__tests__/unit/**/*.test.{js,jsx,ts,tsx}'],
      testEnvironment: 'jsdom',
    },
    {
      displayName: 'integration',
      testMatch: [
        '<rootDir>/tests/__tests__/integration/**/*.test.{js,jsx,ts,tsx}',
      ],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/helpers/firebase-setup.js'],
    },
    {
      displayName: 'security',
      testMatch: [
        '<rootDir>/tests/__tests__/security/**/*.test.{js,jsx,ts,tsx}',
      ],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/helpers/security-setup.js'],
    },
    {
      displayName: 'accessibility',
      testMatch: [
        '<rootDir>/tests/__tests__/accessibility/**/*.test.{js,jsx,ts,tsx}',
      ],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: [
        '<rootDir>/tests/helpers/test-setup.js',
        '<rootDir>/tests/helpers/a11y-setup.js',
      ],
    },
    {
      displayName: 'ai',
      testMatch: ['<rootDir>/tests/__tests__/ai/**/*.test.{js,jsx,ts,tsx}'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/helpers/ai-mock-setup.js'],
      testTimeout: 60000, // AI tests may take longer
    },
    {
      displayName: 'performance',
      testMatch: [
        '<rootDir>/tests/__tests__/performance/**/*.test.{js,jsx,ts,tsx}',
      ],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/helpers/performance-setup.js'],
      testTimeout: 120000, // Performance tests need more time
    },
    {
      displayName: 'chaos',
      testMatch: ['<rootDir>/tests/__tests__/chaos/**/*.test.{js,jsx,ts,tsx}'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/helpers/chaos-setup.js'],
      testTimeout: 180000, // Chaos tests can be very slow
    },
  ],

  // Memory management
  maxWorkers: '50%',
  workerIdleMemoryLimit: '512MB',

  // Cache configuration
  cacheDirectory: '<rootDir>/node_modules/.cache/jest',

  // Notify on test results
  notify: true,
  notifyMode: 'failure-change',

  // Bail on test failures in CI
  bail: process.env.CI ? 1 : 0,

  // Collect coverage only in CI or when explicitly requested
  collectCoverage: Boolean(process.env.CI || process.env.COVERAGE === 'true'),

  // Test retry configuration for flaky tests
  // retryTimes: process.env.CI ? 3 : 0, // Disabled for now

  // Global test setup and teardown
  globalSetup: '<rootDir>/tests/config/global-setup.js',
  globalTeardown: '<rootDir>/tests/config/global-teardown.js',
};
