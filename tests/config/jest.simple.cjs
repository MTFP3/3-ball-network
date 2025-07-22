module.exports = {
  // Test environment setup
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/tests/helpers/test-setup.js',
    '<rootDir>/tests/helpers/custom-matchers.js',
  ],

  // Module resolution
  moduleNameMapper: {
    // Specific service mocks must come first
    '^@/services/firebase$': '<rootDir>/tests/mocks/firebase.js',
    '^@/services/video-upload$': '<rootDir>/tests/mocks/video-upload.js',
    '^@/services/video-service$': '<rootDir>/tests/mocks/video-service.js',
    '^@/services/ai-analysis$': '<rootDir>/tests/mocks/ai-analysis.js',
    '^@/services/ai-service$': '<rootDir>/tests/mocks/ai-service.js',
    '^@/services/auth-service$': '<rootDir>/tests/mocks/auth-service.js',
    '^@/hooks/useAuth$': '<rootDir>/tests/mocks/useAuth.js',
    '^@/contexts/AuthContext$': '<rootDir>/tests/mocks/AuthContext.js',
    '^@/components/auth/LoginForm$': '<rootDir>/tests/mocks/LoginForm.js',
    '^@/components/video/VideoUpload$': '<rootDir>/tests/mocks/VideoUpload.js',
    // General patterns come after
    '^@/(.*)$': '<rootDir>/public/assets/js/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@public/(.*)$': '<rootDir>/public/$1',
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
    'public/assets/js/**/*.js',
    'public/**/*.js',
    '!public/sw.js',
    '!public/**/*.min.js',
    '!public/**/vendor/**',
    '!**/node_modules/**',
  ],

  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },

  // Reporting - simplified
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './test-results/reports',
        filename: 'jest-report.html',
        expand: true,
        hideIcon: false,
        pageTitle: '3 Ball Network Test Report',
        logoImgPath: undefined,
        inlineSource: false,
      },
    ],
  ],

  // Test timeout
  testTimeout: 30000,

  // Verbose output
  verbose: true,

  // Transform ignore patterns
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$))'],

  // Mock warnings
  clearMocks: true,
  restoreMocks: true,
};
