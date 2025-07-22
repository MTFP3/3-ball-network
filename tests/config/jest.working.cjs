module.exports = {
  // Basic configuration
  testEnvironment: 'jsdom',
  rootDir: '../..',

  // Module resolution (FIXED PROPERTY NAME)
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|mp4|mov|avi)$':
      '<rootDir>/tests/mocks/file-mock.js',
  },

  // Test patterns
  testMatch: ['<rootDir>/tests/__tests__/**/*.test.{js,jsx,ts,tsx}'],

  // Coverage
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'public/**/*.js',
    '!src/**/*.d.ts',
    '!**/node_modules/**',
  ],

  // Timeout
  testTimeout: 30000,

  // Transform
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/helpers/test-setup.js'],

  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
