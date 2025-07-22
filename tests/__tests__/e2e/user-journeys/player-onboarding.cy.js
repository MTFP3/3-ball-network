describe('Player Onboarding Journey', () => {
  beforeEach(() => {
    // Reset database state
    cy.task('db:reset');

    // Visit the app
    cy.visit('/');

    // Clear any existing auth state
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('Complete Player Onboarding Flow', () => {
    it('should guide new player through complete registration and first video upload', () => {
      // Step 1: Initial Landing and Signup
      cy.get('[data-testid="get-started-btn"]').click();
      cy.get('[data-testid="signup-tab"]').click();

      // Fill signup form
      cy.get('[data-testid="email-input"]').type('newplayer@test.com');
      cy.get('[data-testid="password-input"]').type('SecurePassword123!');
      cy.get('[data-testid="confirm-password-input"]').type(
        'SecurePassword123!'
      );
      cy.get('[data-testid="role-select"]').select('player');
      cy.get('[data-testid="signup-btn"]').click();

      // Verify email verification prompt
      cy.get('[data-testid="email-verification-notice"]').should('be.visible');
      cy.contains('Check your email for verification link').should(
        'be.visible'
      );

      // Simulate email verification (in real test, would click email link)
      cy.task('auth:verifyEmail', 'newplayer@test.com');
      cy.reload();

      // Step 2: Profile Setup
      cy.url().should('include', '/onboarding/profile');
      cy.get('[data-testid="welcome-message"]').should(
        'contain',
        'Welcome to 3 Ball Network'
      );

      // Fill basic profile information
      cy.get('[data-testid="first-name-input"]').type('John');
      cy.get('[data-testid="last-name-input"]').type('Player');
      cy.get('[data-testid="birth-date-input"]').type('2000-01-15');
      cy.get('[data-testid="height-input"]').type('6\'2"');
      cy.get('[data-testid="weight-input"]').type('180');
      cy.get('[data-testid="position-select"]').select('Guard');

      // Upload profile photo
      cy.get('[data-testid="profile-photo-upload"]').selectFile(
        'tests/fixtures/profile-photo.jpg'
      );
      cy.get('[data-testid="photo-preview"]').should('be.visible');

      cy.get('[data-testid="continue-btn"]').click();

      // Step 3: Athletic Information
      cy.url().should('include', '/onboarding/athletics');

      // Fill athletic background
      cy.get('[data-testid="current-team-input"]').type('Central High School');
      cy.get('[data-testid="jersey-number-input"]').type('23');
      cy.get('[data-testid="years-playing-input"]').type('8');
      cy.get('[data-testid="current-level-select"]').select('High School');

      // Add achievements
      cy.get('[data-testid="add-achievement-btn"]').click();
      cy.get('[data-testid="achievement-title-input"]').type(
        'MVP of Regional Championship'
      );
      cy.get('[data-testid="achievement-year-input"]').type('2024');
      cy.get('[data-testid="save-achievement-btn"]').click();

      // Verify achievement is listed
      cy.get('[data-testid="achievement-list"]').should(
        'contain',
        'MVP of Regional Championship'
      );

      cy.get('[data-testid="continue-btn"]').click();

      // Step 4: Goals and Preferences
      cy.url().should('include', '/onboarding/goals');

      // Set goals
      cy.get('[data-testid="primary-goal-select"]').select(
        'College Recruitment'
      );
      cy.get('[data-testid="target-colleges"]').type('Duke, UNC, UCLA');
      cy.get('[data-testid="improvement-areas"]').check([
        'shooting',
        'defense',
      ]);

      // Privacy settings
      cy.get('[data-testid="profile-visibility-select"]').select(
        'coaches-only'
      );
      cy.get('[data-testid="allow-contact-checkbox"]').check();

      cy.get('[data-testid="complete-profile-btn"]').click();

      // Step 5: Dashboard Introduction
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="onboarding-tour-overlay"]').should('be.visible');

      // Take guided tour
      cy.get('[data-testid="start-tour-btn"]').click();

      // Tour step 1: Navigation
      cy.get('[data-testid="tour-highlight"]').should(
        'highlight',
        '[data-testid="main-navigation"]'
      );
      cy.get('[data-testid="tour-next-btn"]').click();

      // Tour step 2: Upload area
      cy.get('[data-testid="tour-highlight"]').should(
        'highlight',
        '[data-testid="upload-section"]'
      );
      cy.get('[data-testid="tour-next-btn"]').click();

      // Tour step 3: Analytics
      cy.get('[data-testid="tour-highlight"]').should(
        'highlight',
        '[data-testid="analytics-panel"]'
      );
      cy.get('[data-testid="tour-next-btn"]').click();

      // Tour step 4: Resume builder
      cy.get('[data-testid="tour-highlight"]').should(
        'highlight',
        '[data-testid="resume-section"]'
      );
      cy.get('[data-testid="tour-finish-btn"]').click();

      // Verify tour completion
      cy.get('[data-testid="onboarding-tour-overlay"]').should('not.exist');
      cy.get('[data-testid="tour-completion-badge"]').should('be.visible');

      // Step 6: First Video Upload
      cy.get('[data-testid="upload-first-video-btn"]').click();

      // Upload video file
      cy.get('[data-testid="video-upload-dropzone"]').selectFile(
        'tests/fixtures/sample-game.mp4',
        {
          action: 'drag-drop',
        }
      );

      // Verify file is selected
      cy.get('[data-testid="selected-file-name"]').should(
        'contain',
        'sample-game.mp4'
      );
      cy.get('[data-testid="file-size-display"]').should('be.visible');

      // Fill video metadata
      cy.get('[data-testid="video-title-input"]').type('First Game Highlights');
      cy.get('[data-testid="video-description-textarea"]').type(
        'My highlights from the championship game'
      );
      cy.get('[data-testid="game-date-input"]').type('2024-03-15');
      cy.get('[data-testid="opponent-input"]').type('Westside High');
      cy.get('[data-testid="game-type-select"]').select('Championship');

      // Start upload
      cy.get('[data-testid="start-upload-btn"]').click();

      // Monitor upload progress
      cy.get('[data-testid="upload-progress-bar"]').should('be.visible');
      cy.get('[data-testid="upload-status"]').should('contain', 'Uploading...');

      // Wait for upload completion (with timeout)
      cy.get('[data-testid="upload-success-message"]', {
        timeout: 60000,
      }).should('be.visible');
      cy.get('[data-testid="video-processing-status"]').should(
        'contain',
        'Processing for AI analysis'
      );

      // Step 7: AI Analysis Results
      // Wait for AI processing to complete
      cy.get('[data-testid="ai-analysis-complete"]', {
        timeout: 120000,
      }).should('be.visible');

      // Verify analysis results are displayed
      cy.get('[data-testid="highlights-detected"]').should(
        'contain',
        'highlights detected'
      );
      cy.get('[data-testid="stats-extracted"]').should('be.visible');
      cy.get('[data-testid="shots-count"]').should('contain', 'Shots:');
      cy.get('[data-testid="assists-count"]').should('contain', 'Assists:');
      cy.get('[data-testid="rebounds-count"]').should('contain', 'Rebounds:');

      // View generated highlights
      cy.get('[data-testid="view-highlights-btn"]').click();
      cy.get('[data-testid="highlight-clips-grid"]').should('be.visible');
      cy.get('[data-testid="highlight-clip"]').should('have.length.gt', 0);

      // Play a highlight clip
      cy.get('[data-testid="highlight-clip"]').first().click();
      cy.get('[data-testid="video-player"]').should('be.visible');
      cy.get('[data-testid="play-btn"]').click();

      // Verify video plays
      cy.get('[data-testid="video-player"]').should(
        'have.attr',
        'data-playing',
        'true'
      );

      // Step 8: Analytics Dashboard Update
      cy.get('[data-testid="dashboard-tab"]').click();

      // Verify analytics are updated with new video data
      cy.get('[data-testid="total-videos-count"]').should('contain', '1');
      cy.get('[data-testid="total-highlights-count"]').should(
        'contain.text',
        /\d+/
      );
      cy.get('[data-testid="performance-chart"]').should('be.visible');

      // Check shooting chart
      cy.get('[data-testid="shooting-chart"]').should('be.visible');
      cy.get('[data-testid="shot-markers"]').should('have.length.gt', 0);

      // Step 9: Resume Generation
      cy.get('[data-testid="resume-tab"]').click();

      // Generate player resume
      cy.get('[data-testid="generate-resume-btn"]').click();
      cy.get('[data-testid="resume-preview"]').should('be.visible');

      // Verify resume contains profile data
      cy.get('[data-testid="resume-name"]').should('contain', 'John Player');
      cy.get('[data-testid="resume-position"]').should('contain', 'Guard');
      cy.get('[data-testid="resume-team"]').should(
        'contain',
        'Central High School'
      );
      cy.get('[data-testid="resume-achievements"]').should(
        'contain',
        'MVP of Regional Championship'
      );

      // Download resume as PDF
      cy.get('[data-testid="download-resume-btn"]').click();

      // Verify download initiated
      cy.readFile('cypress/downloads/John-Player-Resume.pdf').should('exist');

      // Step 10: Onboarding Completion
      cy.get('[data-testid="onboarding-complete-modal"]').should('be.visible');
      cy.get('[data-testid="congratulations-message"]').should(
        'contain',
        'Congratulations!'
      );
      cy.get('[data-testid="next-steps-list"]').should('be.visible');

      // Mark onboarding as complete
      cy.get('[data-testid="finish-onboarding-btn"]').click();

      // Verify onboarding is marked complete
      cy.get('[data-testid="onboarding-complete-badge"]').should('be.visible');
      cy.get('[data-testid="onboarding-progress"]').should(
        'have.attr',
        'data-progress',
        '100'
      );

      // Step 11: Verify Dashboard State
      cy.url().should('include', '/dashboard');

      // Check all major sections are accessible
      cy.get('[data-testid="videos-section"]').should('be.visible');
      cy.get('[data-testid="analytics-section"]').should('be.visible');
      cy.get('[data-testid="resume-section"]').should('be.visible');
      cy.get('[data-testid="profile-section"]').should('be.visible');

      // Verify user can navigate to different sections
      cy.get('[data-testid="analytics-nav"]').click();
      cy.url().should('include', '/analytics');

      cy.get('[data-testid="videos-nav"]').click();
      cy.url().should('include', '/videos');

      cy.get('[data-testid="profile-nav"]').click();
      cy.url().should('include', '/profile');

      // Step 12: Test Key Features
      // Test search functionality
      cy.get('[data-testid="search-input"]').type('First Game');
      cy.get('[data-testid="search-results"]').should(
        'contain',
        'First Game Highlights'
      );

      // Test filtering
      cy.get('[data-testid="filter-by-date"]').click();
      cy.get('[data-testid="date-range-picker"]').should('be.visible');

      // Test sharing
      cy.get('[data-testid="share-profile-btn"]').click();
      cy.get('[data-testid="share-modal"]').should('be.visible');
      cy.get('[data-testid="copy-profile-link-btn"]').click();
      cy.get('[data-testid="link-copied-toast"]').should('be.visible');

      // Final verification: User onboarding is complete and functional
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="profile-completeness"]').should('contain', '100%');
      cy.get('[data-testid="account-status"]').should('contain', 'Active');
    });

    it('should handle errors gracefully during onboarding', () => {
      // Test network error during signup
      cy.intercept('POST', '/api/auth/signup', { statusCode: 500 }).as(
        'signupError'
      );

      cy.get('[data-testid="get-started-btn"]').click();
      cy.get('[data-testid="signup-tab"]').click();

      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="confirm-password-input"]').type('password123');
      cy.get('[data-testid="signup-btn"]').click();

      cy.wait('@signupError');
      cy.get('[data-testid="error-message"]').should(
        'contain',
        'Registration failed'
      );
      cy.get('[data-testid="retry-btn"]').should('be.visible');

      // Test recovery
      cy.intercept('POST', '/api/auth/signup', { statusCode: 201 }).as(
        'signupSuccess'
      );
      cy.get('[data-testid="retry-btn"]').click();

      cy.wait('@signupSuccess');
      cy.url().should('include', '/onboarding');
    });

    it('should save progress and allow resuming onboarding', () => {
      // Start onboarding
      cy.get('[data-testid="get-started-btn"]').click();
      cy.get('[data-testid="signup-tab"]').click();

      // Complete signup
      cy.get('[data-testid="email-input"]').type('resume@test.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="confirm-password-input"]').type('password123');
      cy.get('[data-testid="role-select"]').select('player');
      cy.get('[data-testid="signup-btn"]').click();

      // Simulate email verification
      cy.task('auth:verifyEmail', 'resume@test.com');
      cy.reload();

      // Fill partial profile
      cy.get('[data-testid="first-name-input"]').type('Resume');
      cy.get('[data-testid="last-name-input"]').type('Test');

      // Close browser (simulate user leaving)
      cy.clearCookies({ domain: null });
      cy.visit('/');

      // Login again
      cy.get('[data-testid="login-btn"]').click();
      cy.get('[data-testid="email-input"]').type('resume@test.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="signin-btn"]').click();

      // Should resume onboarding where left off
      cy.url().should('include', '/onboarding/profile');
      cy.get('[data-testid="first-name-input"]').should('have.value', 'Resume');
      cy.get('[data-testid="last-name-input"]').should('have.value', 'Test');
      cy.get('[data-testid="progress-indicator"]').should('contain', '25%');
    });
  });

  describe('Accessibility During Onboarding', () => {
    it('should be fully navigable via keyboard', () => {
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'get-started-btn');

      cy.focused().type('{enter}');
      cy.url().should('include', '/auth');

      // Navigate through form using tab
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'email-input');

      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'password-input');
    });

    it('should announce progress to screen readers', () => {
      // Complete signup
      cy.task('auth:createUser', { email: 'a11y@test.com', role: 'player' });
      cy.visit('/onboarding/profile');

      // Check ARIA live regions
      cy.get('[data-testid="progress-announcement"]')
        .should('have.attr', 'aria-live', 'polite')
        .should('contain', 'Step 1 of 4: Profile Setup');

      cy.get('[data-testid="continue-btn"]').click();

      cy.get('[data-testid="progress-announcement"]').should(
        'contain',
        'Step 2 of 4: Athletic Information'
      );
    });

    it('should have proper focus management', () => {
      cy.task('auth:createUser', { email: 'focus@test.com', role: 'player' });
      cy.visit('/onboarding/profile');

      // First input should be focused
      cy.get('[data-testid="first-name-input"]').should('have.focus');

      // After form submission, focus should move appropriately
      cy.get('[data-testid="first-name-input"]').type('Focus');
      cy.get('[data-testid="last-name-input"]').type('Test');
      cy.get('[data-testid="continue-btn"]').click();

      // Next page first input should be focused
      cy.get('[data-testid="current-team-input"]').should('have.focus');
    });
  });

  describe('Performance During Onboarding', () => {
    it('should load pages within performance budget', () => {
      cy.visit('/', {
        onBeforeLoad: win => {
          win.performance.mark('pageStart');
        },
      });

      cy.window().then(win => {
        win.performance.mark('pageEnd');
        win.performance.measure('pageLoad', 'pageStart', 'pageEnd');

        const measure = win.performance.getEntriesByName('pageLoad')[0];
        expect(measure.duration).to.be.lessThan(3000); // 3 second budget
      });
    });

    it('should handle large video uploads without blocking UI', () => {
      cy.task('auth:createUser', { email: 'perf@test.com', role: 'player' });
      cy.visit('/dashboard');

      // Start large file upload
      cy.get('[data-testid="video-upload-dropzone"]').selectFile(
        'tests/fixtures/large-video.mp4'
      );
      cy.get('[data-testid="start-upload-btn"]').click();

      // UI should remain responsive during upload
      cy.get('[data-testid="navigation-menu"]').click();
      cy.get('[data-testid="profile-link"]').should('be.visible');

      // Upload progress should be visible
      cy.get('[data-testid="upload-progress-bar"]').should('be.visible');
    });
  });
});
