const {
  render,
  screen,
  fireEvent,
  waitFor,
} = require('@testing-library/react');
const { act } = require('@testing-library/react');
require('@testing-library/jest-dom');
const { AuthProvider } = require('@/contexts/AuthContext');
const LoginForm = require('@/components/auth/LoginForm');
const { authService } = require('@/services/firebase');

describe('LoginForm Component', () => {
  const mockOnLogin = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderLoginForm = (props = {}) => {
    return render(
      <AuthProvider>
        <LoginForm onLogin={mockOnLogin} onError={mockOnError} {...props} />
      </AuthProvider>
    );
  };

  describe('Rendering', () => {
    test('renders all form elements', () => {
      renderLoginForm();

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /sign in/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /sign in with google/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });

    test('renders role selector when showRoleSelector is true', () => {
      renderLoginForm({ showRoleSelector: true });

      expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
      expect(screen.getByText(/player/i)).toBeInTheDocument();
      expect(screen.getByText(/coach/i)).toBeInTheDocument();
      expect(screen.getByText(/scout/i)).toBeInTheDocument();
    });

    test('displays loading state correctly', () => {
      renderLoginForm({ isLoading: true });

      expect(
        screen.getByRole('button', { name: /signing in/i })
      ).toBeDisabled();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    test('shows error for invalid email format', async () => {
      renderLoginForm();

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/please enter a valid email/i)
        ).toBeInTheDocument();
      });
    });

    test('shows error for short password', async () => {
      renderLoginForm();

      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/password must be at least 6 characters/i)
        ).toBeInTheDocument();
      });
    });

    test('prevents submission with empty fields', async () => {
      renderLoginForm();

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });

      expect(authService.signInWithEmailAndPassword).not.toHaveBeenCalled();
    });
  });

  describe('Authentication Flow', () => {
    test('successfully logs in with valid credentials', async () => {
      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        role: 'player',
      };

      authService.signInWithEmailAndPassword.mockResolvedValue(mockUser);

      renderLoginForm();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      expect(authService.signInWithEmailAndPassword).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
      expect(mockOnLogin).toHaveBeenCalledWith(mockUser);
    });

    test('handles authentication errors', async () => {
      const mockError = new Error('Invalid credentials');
      authService.signInWithEmailAndPassword.mockRejectedValue(mockError);

      renderLoginForm();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
      expect(mockOnError).toHaveBeenCalledWith(mockError);
    });

    test('successfully logs in with Google', async () => {
      const mockUser = {
        uid: 'google-uid',
        email: 'google@example.com',
        role: 'coach',
      };

      authService.signInWithGoogle.mockResolvedValue(mockUser);

      renderLoginForm();

      const googleButton = screen.getByRole('button', {
        name: /sign in with google/i,
      });

      await act(async () => {
        fireEvent.click(googleButton);
      });

      expect(authService.signInWithGoogle).toHaveBeenCalled();
      expect(mockOnLogin).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('Password Reset', () => {
    test('sends password reset email', async () => {
      authService.resetPassword.mockResolvedValue();

      renderLoginForm();

      const forgotPasswordLink = screen.getByText(/forgot password/i);
      fireEvent.click(forgotPasswordLink);

      const emailInput = screen.getByLabelText(/email for password reset/i);
      const resetButton = screen.getByRole('button', {
        name: /send reset email/i,
      });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      await act(async () => {
        fireEvent.click(resetButton);
      });

      expect(authService.resetPassword).toHaveBeenCalledWith(
        'test@example.com'
      );
      expect(
        screen.getByText(/password reset email sent/i)
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels and roles', () => {
      renderLoginForm();

      expect(screen.getByLabelText(/email/i)).toHaveAttribute(
        'aria-required',
        'true'
      );
      expect(screen.getByLabelText(/password/i)).toHaveAttribute(
        'aria-required',
        'true'
      );
      expect(screen.getByRole('form')).toBeInTheDocument();
    });

    test('supports keyboard navigation', () => {
      renderLoginForm();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // Tab navigation
      emailInput.focus();
      fireEvent.keyDown(emailInput, { key: 'Tab' });
      expect(passwordInput).toHaveFocus();

      fireEvent.keyDown(passwordInput, { key: 'Tab' });
      expect(submitButton).toHaveFocus();
    });

    test('announces form errors to screen readers', async () => {
      renderLoginForm();

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/email is required/i);
        expect(errorMessage).toHaveAttribute('aria-live', 'polite');
        expect(errorMessage).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('Security', () => {
    test('masks password input', () => {
      renderLoginForm();

      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('prevents form submission on Enter key with invalid data', async () => {
      renderLoginForm();

      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.keyDown(emailInput, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });

      expect(authService.signInWithEmailAndPassword).not.toHaveBeenCalled();
    });

    test('sanitizes input to prevent XSS', () => {
      renderLoginForm();

      const emailInput = screen.getByLabelText(/email/i);
      const maliciousInput = '<script>alert("xss")</script>@example.com';

      fireEvent.change(emailInput, { target: { value: maliciousInput } });

      expect(emailInput.value).not.toContain('<script>');
    });
  });

  describe('Performance', () => {
    test('debounces validation checks', async () => {
      const mockValidate = jest.fn();
      renderLoginForm({ onValidate: mockValidate });

      const emailInput = screen.getByLabelText(/email/i);

      // Rapid typing simulation
      fireEvent.change(emailInput, { target: { value: 't' } });
      fireEvent.change(emailInput, { target: { value: 'te' } });
      fireEvent.change(emailInput, { target: { value: 'test' } });

      // Wait for debounce
      await waitFor(
        () => {
          expect(mockValidate).toHaveBeenCalledTimes(1);
        },
        { timeout: 1000 }
      );
    });
  });
});
