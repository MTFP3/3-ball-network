export default [
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
        setInterval: 'readonly', // <-- Add this line
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'prefer-const': 'warn',
      'no-var': 'warn',
    },
  },
];
