// Mock auth service
const authService = {
  // Mock user object
  currentUser: null,

  signInWithGoogle: jest.fn(() => {
    const user = { uid: 'google-uid', email: 'google@example.com' };
    authService.currentUser = user;
    return Promise.resolve(user);
  }),

  signInWithEmailAndPassword: jest.fn((email, password) => {
    if (email === 'test@example.com' && password === 'password123') {
      const user = { uid: 'test-uid', email: 'test@example.com' };
      authService.currentUser = user;
      return Promise.resolve(user);
    } else {
      const error = new Error('Invalid credentials');
      error.code = 'auth/invalid-credentials';
      return Promise.reject(error);
    }
  }),

  sendPasswordResetEmail: jest.fn(() => Promise.resolve({ success: true })),

  signOut: jest.fn(() => {
    authService.currentUser = null;
    return Promise.resolve();
  }),

  getCurrentUser: jest.fn(() => authService.currentUser),

  getUserRole: jest.fn(() => Promise.resolve('player')),
};

module.exports = authService;
