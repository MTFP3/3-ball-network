// Mock LoginForm component with validation
const React = require('react');

const LoginForm = props => {
  const {
    showRoleSelector,
    isLoading,
    onLogin,
    onError,
    onGoogleLogin,
    onForgotPassword,
  } = props || {};

  const elements = [
    // Email input
    React.createElement(
      'label',
      {
        key: 'email-label',
        htmlFor: 'email-input',
      },
      'Email'
    ),
    React.createElement('input', {
      key: 'email',
      id: 'email-input',
      'data-testid': 'email-input',
      type: 'email',
      placeholder: 'Email',
      'aria-required': 'true',
      'aria-describedby': 'email-error',
    }),

    // Password input
    React.createElement(
      'label',
      {
        key: 'password-label',
        htmlFor: 'password-input',
      },
      'Password'
    ),
    React.createElement('input', {
      key: 'password',
      id: 'password-input',
      'data-testid': 'password-input',
      type: 'password',
      placeholder: 'Password',
      'aria-required': 'true',
      'aria-describedby': 'password-error',
    }),

    // Submit button
    React.createElement(
      'button',
      {
        key: 'submit',
        'data-testid': 'submit-button',
        type: 'submit',
        disabled: isLoading,
      },
      isLoading ? 'Signing in...' : 'Submit'
    ),

    // Google login button
    React.createElement(
      'button',
      {
        key: 'google',
        'data-testid': 'google-login-button',
        type: 'button',
        onClick: () => {
          if (onGoogleLogin) {
            onGoogleLogin();
          }
        },
      },
      'Sign in with Google'
    ),

    // Forgot password link
    React.createElement(
      'a',
      {
        key: 'forgot-password',
        'data-testid': 'forgot-password-link',
        href: '#',
        onClick: e => {
          e.preventDefault();
          if (onForgotPassword) {
            onForgotPassword();
          }
        },
      },
      'Forgot Password?'
    ),

    // Error containers
    React.createElement(
      'div',
      {
        key: 'email-error',
        'data-testid': 'email-error',
        id: 'email-error',
        'aria-live': 'polite',
      },
      ''
    ),
    React.createElement(
      'div',
      {
        key: 'password-error',
        'data-testid': 'password-error',
        id: 'password-error',
        'aria-live': 'polite',
      },
      ''
    ),
  ];

  // Add role selector if requested
  if (showRoleSelector) {
    elements.unshift(
      React.createElement(
        'label',
        {
          key: 'role-label',
          htmlFor: 'role-select',
        },
        'Role'
      ),
      React.createElement(
        'select',
        {
          key: 'role',
          id: 'role-select',
          'data-testid': 'role-select',
        },
        [
          React.createElement(
            'option',
            {
              key: 'player',
              value: 'player',
            },
            'Player'
          ),
          React.createElement(
            'option',
            {
              key: 'coach',
              value: 'coach',
            },
            'Coach'
          ),
          React.createElement(
            'option',
            {
              key: 'admin',
              value: 'admin',
            },
            'Admin'
          ),
        ]
      )
    );
  }

  return React.createElement(
    'div',
    {
      'data-testid': 'login-form',
      className: 'login-form',
      role: 'form',
      'aria-label': 'Login form',
    },
    elements
  );
};

module.exports = LoginForm;
