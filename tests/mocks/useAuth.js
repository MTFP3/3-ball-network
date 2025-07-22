// Mock useAuth hook
export const useAuth = jest.fn(() => ({
  user: null,
  isLoading: false,
  error: null,
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

export default useAuth;
