/**
 * Cypress custom commands and setup
 */

// Custom command for login
Cypress.Commands.add(
  'login',
  (email = 'test@example.com', password = 'password123') => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('not.include', '/login');
  }
);

// Custom command for logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-menu"]').click();
  cy.get('[data-testid="logout-button"]').click();
  cy.url().should('include', '/');
});

// Custom command for uploading video
Cypress.Commands.add('uploadVideo', (filename = 'sample-video.mp4') => {
  cy.get('[data-testid="video-upload"]').selectFile(
    `tests/fixtures/videos/${filename}`,
    { force: true }
  );
  cy.get('[data-testid="upload-button"]').click();
});

// Custom command for waiting for video processing
Cypress.Commands.add('waitForVideoProcessing', (timeout = 30000) => {
  cy.get('[data-testid="processing-status"]', { timeout }).should(
    'contain',
    'Complete'
  );
});

// Custom command for checking accessibility
Cypress.Commands.add('checkA11y', (context = null, options = {}) => {
  cy.injectAxe();
  cy.checkA11y(context, options);
});

// Custom command for testing mobile viewport
Cypress.Commands.add('setMobileViewport', () => {
  cy.viewport(375, 667);
});

// Custom command for testing tablet viewport
Cypress.Commands.add('setTabletViewport', () => {
  cy.viewport(768, 1024);
});

// Custom command for testing desktop viewport
Cypress.Commands.add('setDesktopViewport', () => {
  cy.viewport(1280, 720);
});
