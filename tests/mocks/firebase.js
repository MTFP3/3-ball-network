// Mock Firebase service
export const authService = {
  signInWithEmailAndPassword: jest.fn(),
  signInWithGoogle: jest.fn(),
  signOut: jest.fn(),
  getCurrentUser: jest.fn(),
  onAuthStateChanged: jest.fn(),
};

export const firebaseConfig = {
  apiKey: 'mock-api-key',
  authDomain: 'mock-domain',
  projectId: 'mock-project',
};

export default {
  authService,
  firebaseConfig,
};
