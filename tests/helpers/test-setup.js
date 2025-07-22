/**
 * Test setup file for Jest
 * Configures testing environment, mocks, and global test utilities
 */

// Import testing utilities
import '@testing-library/jest-dom';

// Global test configuration
global.console = {
  ...console,
  // Uncomment to ignore specific console outputs during tests
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Mock Firebase if not available
if (typeof global.firebase === 'undefined') {
  global.firebase = {
    auth: jest.fn(() => ({
      currentUser: null,
      signInWithEmailAndPassword: jest.fn(),
      createUserWithEmailAndPassword: jest.fn(),
      signOut: jest.fn(),
    })),
    firestore: jest.fn(() => ({
      collection: jest.fn(),
      doc: jest.fn(),
    })),
    storage: jest.fn(() => ({
      ref: jest.fn(),
    })),
  };
}

// Mock window APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Setup cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});
