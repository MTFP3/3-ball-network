// Mock AuthContext
const React = require('react');

const AuthContext = React.createContext({
  user: null,
  isLoading: false,
  error: null,
  signIn: jest.fn(),
  signOut: jest.fn(),
});

const AuthProvider = ({ children }) => {
  const mockValue = {
    user: null,
    isLoading: false,
    error: null,
    signIn: jest.fn(),
    signOut: jest.fn(),
  };

  return React.createElement(
    AuthContext.Provider,
    { value: mockValue },
    children
  );
};

module.exports = {
  AuthContext,
  AuthProvider,
};
