export default [
  // Ignore patterns
  {
    ignores: [
      'dist/**/*',
      'build/**/*',
      'coverage/**/*',
      'node_modules/**/*',
      '**/*.html',
      '**/*.min.js',
      'public/assets/js/firebaseConfig*.js',
    ],
  },

  // Node.js scripts config
  {
    files: ['deploy.js', 'scripts/**/*.js', 'server/**/*.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        console: 'readonly',
        setInterval: 'readonly',
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-undef': 'error',
      'prefer-const': 'warn',
      'no-var': 'warn',
    },
  },
];
