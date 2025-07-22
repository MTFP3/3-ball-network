const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Base configuration
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,

    // Test file patterns
    specPattern: [
      'tests/__tests__/e2e/**/*.cy.{js,jsx,ts,tsx}',
      'tests/__tests__/accessibility/**/*.cy.{js,jsx,ts,tsx}',
    ],

    // Support file
    supportFile: 'tests/helpers/cypress-commands.js',

    // Fixtures
    fixturesFolder: 'tests/fixtures',

    // Screenshots and videos
    screenshotsFolder: 'tests/reports/cypress/screenshots',
    videosFolder: 'tests/reports/cypress/videos',
    video: true,
    screenshotOnRunFailure: true,

    // Timeouts
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    taskTimeout: 60000,

    // Retry configuration
    retries: {
      runMode: 2,
      openMode: 0,
    },

    // Browser configuration
    chromeWebSecurity: false,
    experimentalStudio: true,
    experimentalSessionAndOrigin: true,

    // Environment variables
    env: {
      // Test environment
      NODE_ENV: 'test',

      // Firebase configuration
      FIREBASE_PROJECT_ID: 'test-3ball-network',
      FIREBASE_AUTH_EMULATOR_HOST: 'localhost:9099',
      FIRESTORE_EMULATOR_HOST: 'localhost:8080',
      FIREBASE_STORAGE_EMULATOR_HOST: 'localhost:9199',

      // API endpoints
      API_BASE_URL: 'http://localhost:3001/api',
      AI_SERVICE_URL: 'http://localhost:8080',

      // Test data
      TEST_USER_EMAIL: 'cypress-test@example.com',
      TEST_USER_PASSWORD: 'CypressTest123!',
      TEST_ADMIN_EMAIL: 'cypress-admin@example.com',
      TEST_ADMIN_PASSWORD: 'CypressAdmin123!',

      // Feature flags
      ENABLE_AI_ANALYSIS: true,
      ENABLE_OFFLINE_MODE: true,
      ENABLE_VIDEO_UPLOAD: true,

      // Coverage
      coverage: true,
      codeCoverage: {
        url: 'http://localhost:3001/__coverage__',
      },
    },

    // Setup and teardown
    setupNodeEvents(on, config) {
      // Code coverage
      require('@cypress/code-coverage/task')(on, config);

      // Custom tasks
      on('task', {
        // Database reset
        'db:reset': () => {
          return require('../helpers/db-reset')();
        },

        // User creation
        'auth:createUser': userData => {
          return require('../helpers/auth-helpers').createTestUser(userData);
        },

        // Email verification
        'auth:verifyEmail': email => {
          return require('../helpers/auth-helpers').verifyEmail(email);
        },

        // File system operations
        'fs:readFile': filePath => {
          return require('fs').readFileSync(filePath, 'utf8');
        },

        'fs:writeFile': ({ filePath, content }) => {
          require('fs').writeFileSync(filePath, content);
          return null;
        },

        // Performance monitoring
        'performance:startMonitoring': () => {
          return require('../helpers/performance-monitor').start();
        },

        'performance:stopMonitoring': () => {
          return require('../helpers/performance-monitor').stop();
        },

        // Video processing simulation
        'video:processUpload': videoData => {
          return require('../helpers/video-helpers').simulateProcessing(
            videoData
          );
        },

        // AI analysis simulation
        'ai:simulateAnalysis': videoId => {
          return require('../helpers/ai-helpers').simulateAnalysis(videoId);
        },

        // Network simulation
        'network:simulate': conditions => {
          return require('../helpers/network-helpers').simulate(conditions);
        },

        // Chaos engineering
        'chaos:injectFailure': failureType => {
          return require('../helpers/chaos-helpers').injectFailure(failureType);
        },

        // Log collection
        'logs:collect': () => {
          return require('../helpers/log-collector').collectLogs();
        },
      });

      // Browser launch options
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-setuid-sandbox');

          // Enable accessibility testing
          launchOptions.args.push('--force-prefers-reduced-motion');
          launchOptions.args.push(
            '--enable-experimental-accessibility-features'
          );
        }

        if (browser.name === 'electron') {
          launchOptions.preferences.webSecurity = false;
        }

        return launchOptions;
      });

      // Test result processing
      on('after:run', results => {
        // Generate test report
        require('../helpers/report-generator').generateReport(results);

        // Upload results to dashboard (if configured)
        if (process.env.DASHBOARD_URL) {
          require('../helpers/dashboard-uploader').upload(results);
        }
      });

      // Screenshot processing
      on('after:screenshot', details => {
        // Optimize screenshot file size
        require('../helpers/image-optimizer').optimize(details.path);
      });

      // Video processing
      on('after:spec', (spec, results) => {
        // Compress video files
        if (results.video) {
          require('../helpers/video-compressor').compress(results.video);
        }
      });

      return config;
    },
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
    specPattern: 'tests/__tests__/unit/components/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'tests/helpers/cypress-component-commands.js',
  },

  // Accessibility testing configuration
  a11y: {
    // axe-core configuration
    axeConfig: {
      rules: {
        'color-contrast': { enabled: true },
        'focus-order-semantics': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'aria-labels': { enabled: true },
      },
    },

    // Include accessibility tests in all specs
    includeA11yTests: true,

    // Accessibility violation handling
    violationHandler: 'fail', // 'fail', 'warn', or 'log'
  },

  // Performance testing configuration
  performance: {
    // Lighthouse configuration
    lighthouse: {
      thresholds: {
        performance: 90,
        accessibility: 100,
        'best-practices': 90,
        seo: 80,
      },
    },

    // Web Vitals thresholds
    webVitals: {
      lcp: 2500, // Largest Contentful Paint
      fid: 100, // First Input Delay
      cls: 0.1, // Cumulative Layout Shift
    },
  },

  // Security testing configuration
  security: {
    // Headers to check
    securityHeaders: [
      'strict-transport-security',
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'content-security-policy',
    ],

    // Vulnerability scanning
    enableVulnerabilityScanning: true,

    // XSS testing
    xssPayloads: [
      '<script>alert("xss")</script>',
      '<img src="x" onerror="alert(1)">',
      'javascript:alert(document.cookie)',
    ],
  },

  // Cross-browser testing
  browsers: [
    {
      name: 'chrome',
      family: 'chromium',
      channel: 'stable',
    },
    {
      name: 'firefox',
      family: 'firefox',
      channel: 'stable',
    },
    {
      name: 'edge',
      family: 'chromium',
      channel: 'stable',
    },
  ],

  // Mobile testing configuration
  mobile: {
    devices: ['iPhone 12', 'iPhone SE', 'Samsung Galaxy S21', 'iPad Pro'],

    // Mobile-specific timeouts
    mobileCommandTimeout: 15000,
    mobilePageLoadTimeout: 45000,
  },

  // Visual regression testing
  visualRegression: {
    threshold: 0.1, // 10% difference threshold
    thresholdType: 'percent',
    screenshotConfig: {
      blackout: ['.dynamic-timestamp', '.user-avatar'],
      clip: { x: 0, y: 0, width: 1280, height: 720 },
    },
  },
});
