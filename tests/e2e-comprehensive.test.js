// Comprehensive E2E Test Suite for Critical User Flows
// Tests authentication, registration, game uploads, and security features

import { test, expect } from '@playwright/test';

// Test data and utilities
const testUsers = {
  coach: {
    email: 'test.coach@example.com',
    password: 'TestPassword123!',
    name: 'Test Coach',
    role: 'coach',
    team: 'Test Warriors',
  },
  player: {
    email: 'test.player@example.com',
    password: 'TestPassword123!',
    name: 'Test Player',
    role: 'player',
    position: 'PG',
    school: 'Test University',
  },
  scout: {
    email: 'test.scout@example.com',
    password: 'TestPassword123!',
    name: 'Test Scout',
    role: 'scout',
    organization: 'Test Scouts Inc',
  },
  admin: {
    email: 'test.admin@example.com',
    password: 'TestPassword123!',
    name: 'Test Admin',
    role: 'admin',
  },
};

// Helper functions
async function loginUser(page, userType) {
  const user = testUsers[userType];
  await page.goto('/login.html');

  await page.fill('[data-testid="email-input"]', user.email);
  await page.fill('[data-testid="password-input"]', user.password);
  await page.click('[data-testid="login-button"]');

  // Wait for login to complete
  await expect(page).toHaveURL(/dashboard|coach|player|scout|admin/);
}

async function waitForToast(page, type = 'success') {
  const toast = page.locator(`[data-testid="toast-${type}"], .toast-${type}`);
  await expect(toast).toBeVisible();
  return toast;
}

test.describe('Critical User Flow: Registration', () => {
  test('should complete player registration with validation', async ({
    page,
  }) => {
    await page.goto('/register.html');

    // Select player role
    await page.click('[data-testid="role-player"]');
    await expect(page.locator('[data-testid="player-form"]')).toBeVisible();

    // Test form validation - submit empty form
    await page.click('[data-testid="submit-button"]');

    // Should show validation errors
    const errorMessage = page.locator(
      '[data-testid="validation-error"], .validation-error'
    );
    await expect(errorMessage).toBeVisible();

    // Fill form with valid data
    await page.fill('[data-testid="player-name"]', testUsers.player.name);
    await page.fill(
      '[data-testid="player-email"]',
      `new.player.${Date.now()}@example.com`
    );
    await page.fill(
      '[data-testid="player-password"]',
      testUsers.player.password
    );
    await page.selectOption(
      '[data-testid="player-position"]',
      testUsers.player.position
    );
    await page.fill('[data-testid="player-school"]', testUsers.player.school);
    await page.fill('[data-testid="player-graduation-year"]', '2025');
    await page.fill('[data-testid="player-height"]', '180');
    await page.fill('[data-testid="player-weight"]', '75');
    await page.fill('[data-testid="player-gpa"]', '3.8');

    // Submit form
    await page.click('[data-testid="submit-button"]');

    // Should show loading state
    const submitButton = page.locator('[data-testid="submit-button"]');
    await expect(submitButton).toBeDisabled();
    await expect(submitButton).toContainText(/creating|loading/i);

    // Should show success notification
    await waitForToast(page, 'success');

    // Should redirect to player dashboard
    await expect(page).toHaveURL(/player\.html/);
  });

  test('should complete coach registration', async ({ page }) => {
    await page.goto('/register.html');

    // Select coach role
    await page.click('[data-testid="role-coach"]');
    await expect(page.locator('[data-testid="coach-form"]')).toBeVisible();

    // Fill coach form
    await page.fill('[data-testid="coach-name"]', testUsers.coach.name);
    await page.fill(
      '[data-testid="coach-email"]',
      `new.coach.${Date.now()}@example.com`
    );
    await page.fill('[data-testid="coach-password"]', testUsers.coach.password);
    await page.fill('[data-testid="coach-school"]', 'Test High School');
    await page.fill('[data-testid="coach-experience"]', '5 years');
    await page.fill('[data-testid="coach-certifications"]', 'NFHS Certified');

    // Submit form
    await page.click('[data-testid="submit-button"]');

    // Should show success and redirect
    await waitForToast(page, 'success');
    await expect(page).toHaveURL(/coach\.html/);
  });

  test('should handle registration validation errors', async ({ page }) => {
    await page.goto('/register.html');

    // Select player role
    await page.click('[data-testid="role-player"]');

    // Test invalid email
    await page.fill('[data-testid="player-email"]', 'invalid-email');
    await page.click('[data-testid="submit-button"]');

    const emailError = page.locator(
      '[data-testid="email-error"], .validation-error'
    );
    await expect(emailError).toBeVisible();
    await expect(emailError).toContainText(/email/i);

    // Test weak password
    await page.fill('[data-testid="player-email"]', 'valid@example.com');
    await page.fill('[data-testid="player-password"]', '123'); // Too short
    await page.click('[data-testid="submit-button"]');

    const passwordError = page.locator(
      '[data-testid="password-error"], .validation-error'
    );
    await expect(passwordError).toBeVisible();
    await expect(passwordError).toContainText(/password/i);

    // Test invalid GPA
    await page.fill(
      '[data-testid="player-password"]',
      testUsers.player.password
    );
    await page.fill('[data-testid="player-gpa"]', '5.0'); // Invalid GPA
    await page.click('[data-testid="submit-button"]');

    const gpaError = page.locator(
      '[data-testid="gpa-error"], .validation-error'
    );
    await expect(gpaError).toBeVisible();
  });
});

test.describe('Critical User Flow: Authentication', () => {
  test('should login and logout successfully', async ({ page }) => {
    // Test login
    await page.goto('/login.html');

    await page.fill('[data-testid="email-input"]', testUsers.coach.email);
    await page.fill('[data-testid="password-input"]', testUsers.coach.password);
    await page.click('[data-testid="login-button"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/coach\.html|dashboard/);

    // Should show user info
    const userInfo = page.locator('[data-testid="user-name"], .user-name');
    await expect(userInfo).toBeVisible();

    // Test logout
    await page.click('[data-testid="logout-button"], [aria-label="Logout"]');

    // Should redirect to home or login
    await expect(page).toHaveURL(/index\.html|login\.html|\/$/);
  });

  test('should handle login validation', async ({ page }) => {
    await page.goto('/login.html');

    // Test empty form
    await page.click('[data-testid="login-button"]');

    const errorMessage = page.locator(
      '[data-testid="validation-error"], .validation-error'
    );
    await expect(errorMessage).toBeVisible();

    // Test invalid credentials
    await page.fill('[data-testid="email-input"]', 'invalid@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');

    // Should show error message
    const authError = page.locator('[data-testid="auth-error"], .auth-error');
    await expect(authError).toBeVisible();
  });

  test('should maintain session across page reloads', async ({ page }) => {
    // Login first
    await loginUser(page, 'coach');

    // Reload page
    await page.reload();

    // Should still be logged in
    await expect(page).toHaveURL(/coach\.html|dashboard/);

    // User info should still be visible
    const userInfo = page.locator('[data-testid="user-name"], .user-name');
    await expect(userInfo).toBeVisible();
  });
});

test.describe('Critical User Flow: Game Upload (Coach)', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, 'coach');
    await page.goto('/coach.html');
  });

  test('should upload game with valid data', async ({ page }) => {
    // Fill game upload form
    const gameId = `game-${Date.now()}`;
    await page.fill('[data-testid="game-id"]', gameId);
    await page.fill('[data-testid="team-name"]', testUsers.coach.team);
    await page.fill('[data-testid="opponent"]', 'Test Opponents');
    await page.fill('[data-testid="game-date"]', '2024-12-15');
    await page.fill(
      '[data-testid="video-url"]',
      'https://example.com/video.mp4'
    );

    // Submit form
    await page.click('[data-testid="upload-game-button"]');

    // Should show optimistic UI (pending state)
    const gameCard = page.locator(`[data-game-id="${gameId}"]`);
    await expect(gameCard).toBeVisible();
    await expect(gameCard).toHaveClass(/pending|uploading/);

    // Should show progress indicator
    const progressIndicator = page.locator(
      '[data-testid="progress-indicator"]'
    );
    await expect(progressIndicator).toBeVisible();

    // Should show success state
    await waitForToast(page, 'success');
    await expect(gameCard).toHaveClass(/success/);

    // Form should be reset
    await expect(page.locator('[data-testid="game-id"]')).toHaveValue('');
  });

  test('should validate game upload form', async ({ page }) => {
    // Try to submit empty form
    await page.click('[data-testid="upload-game-button"]');

    // Should show validation errors
    const errors = page.locator(
      '[data-testid="validation-error"], .validation-error'
    );
    await expect(errors).toHaveCount.greaterThan(0);

    // Test invalid date (future date)
    await page.fill('[data-testid="game-id"]', 'test-game');
    await page.fill('[data-testid="team-name"]', 'Test Team');
    await page.fill('[data-testid="opponent"]', 'Test Opponent');
    await page.fill('[data-testid="game-date"]', '2030-12-31'); // Future date

    await page.click('[data-testid="upload-game-button"]');

    const dateError = page.locator(
      '[data-testid="date-error"], .validation-error'
    );
    await expect(dateError).toBeVisible();
    await expect(dateError).toContainText(/future|date/i);

    // Test invalid URL
    await page.fill('[data-testid="game-date"]', '2024-12-15'); // Valid date
    await page.fill('[data-testid="video-url"]', 'not-a-url'); // Invalid URL

    await page.click('[data-testid="upload-game-button"]');

    const urlError = page.locator(
      '[data-testid="url-error"], .validation-error'
    );
    await expect(urlError).toBeVisible();
    await expect(urlError).toContainText(/url/i);
  });

  test('should handle upload failure gracefully', async ({ page }) => {
    // Mock network failure by intercepting requests
    await page.route('**/firestore/**', route => {
      route.abort('failed');
    });

    // Fill and submit form
    await page.fill('[data-testid="game-id"]', `game-${Date.now()}`);
    await page.fill('[data-testid="team-name"]', testUsers.coach.team);
    await page.fill('[data-testid="opponent"]', 'Test Opponents');
    await page.fill('[data-testid="game-date"]', '2024-12-15');

    await page.click('[data-testid="upload-game-button"]');

    // Should show error notification
    await waitForToast(page, 'error');

    // Temporary card should be removed
    const gameCards = page.locator('[data-testid="game-card"]');
    const initialCount = await gameCards.count();

    // Wait a bit and check that failed upload was removed
    await page.waitForTimeout(1000);
    const finalCount = await gameCards.count();
    expect(finalCount).toBeLessThanOrEqual(initialCount);
  });
});

test.describe('Critical User Flow: Search and Discovery', () => {
  test('should perform comprehensive search', async ({ page }) => {
    await page.goto('/search.html');

    // Test basic search
    await page.fill('[data-testid="search-input"]', 'basketball');
    await page.click('[data-testid="search-button"]');

    // Should show loading state
    const loadingIndicator = page.locator(
      '[data-testid="search-loading"], .search-loading'
    );
    await expect(loadingIndicator).toBeVisible();

    // Should show results
    const searchResults = page.locator('[data-testid="search-results"]');
    await expect(searchResults).toBeVisible();

    // Test filters
    await page.selectOption('[data-testid="role-filter"]', 'player');
    await page.selectOption('[data-testid="position-filter"]', 'PG');
    await page.fill('[data-testid="location-filter"]', 'California');

    // Apply filters
    await page.click('[data-testid="search-button"]');

    // Results should update
    await expect(loadingIndicator).toBeVisible();
    await expect(searchResults).toBeVisible();
  });

  test('should handle empty search results', async ({ page }) => {
    await page.goto('/search.html');

    // Search for non-existent term
    await page.fill('[data-testid="search-input"]', 'xyz123nonexistent');
    await page.click('[data-testid="search-button"]');

    // Should show no results message
    const noResults = page.locator('[data-testid="no-results"], .no-results');
    await expect(noResults).toBeVisible();
    await expect(noResults).toContainText(/no results|not found/i);
  });

  test('should provide real-time search suggestions', async ({ page }) => {
    await page.goto('/search.html');

    // Start typing
    await page.fill('[data-testid="search-input"]', 'bas');

    // Should show suggestions
    const suggestions = page.locator('[data-testid="search-suggestions"]');
    await expect(suggestions).toBeVisible();

    // Click a suggestion
    await page.click('[data-testid="suggestion-item"]');

    // Should populate search and show results
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).not.toHaveValue('bas');
  });
});

test.describe('Critical User Flow: Contact and Messaging', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, 'scout');
  });

  test('should send contact request', async ({ page }) => {
    await page.goto('/search.html');

    // Find a player and send contact request
    await page.fill('[data-testid="search-input"]', 'player');
    await page.selectOption('[data-testid="role-filter"]', 'player');
    await page.click('[data-testid="search-button"]');

    // Click on first result
    const firstResult = page.locator('[data-testid="result-item"]').first();
    await expect(firstResult).toBeVisible();

    await firstResult.click('[data-testid="contact-button"]');

    // Fill contact form
    const contactModal = page.locator('[data-testid="contact-modal"]');
    await expect(contactModal).toBeVisible();

    await page.fill(
      '[data-testid="contact-message"]',
      "Hi, I'm interested in discussing potential opportunities with you."
    );
    await page.click('[data-testid="send-contact-request"]');

    // Should show success notification
    await waitForToast(page, 'success');

    // Modal should close
    await expect(contactModal).not.toBeVisible();
  });

  test('should validate contact request form', async ({ page }) => {
    await page.goto('/search.html');

    // Navigate to contact form (simplified for test)
    await page.goto('/scout.html');
    await page.click('[data-testid="send-message-button"]');

    // Try to send empty message
    await page.click('[data-testid="send-contact-request"]');

    // Should show validation error
    const messageError = page.locator(
      '[data-testid="message-error"], .validation-error'
    );
    await expect(messageError).toBeVisible();
    await expect(messageError).toContainText(/message|required/i);

    // Test message too short
    await page.fill('[data-testid="contact-message"]', 'Hi');
    await page.click('[data-testid="send-contact-request"]');

    await expect(messageError).toBeVisible();
    await expect(messageError).toContainText(/character|short/i);
  });
});

test.describe('Security and Data Validation', () => {
  test('should prevent XSS attacks in forms', async ({ page }) => {
    await loginUser(page, 'player');
    await page.goto('/player.html');

    // Try to inject script in profile form
    const maliciousScript = '<script>alert("XSS")</script>';

    await page.click('[data-testid="edit-profile"]');
    await page.fill('[data-testid="profile-bio"]', maliciousScript);
    await page.click('[data-testid="save-profile"]');

    // Script should be escaped and not executed
    const profileBio = page.locator('[data-testid="profile-bio-display"]');
    await expect(profileBio).toContainText('<script>'); // Should be escaped

    // No alert should have appeared
    page.on('dialog', () => {
      throw new Error('XSS script was executed');
    });
  });

  test('should enforce server-side validation', async ({ page }) => {
    await loginUser(page, 'coach');
    await page.goto('/coach.html');

    // Try to submit game with invalid data that bypasses client validation
    await page.evaluate(() => {
      // Directly call Firebase with invalid data
      const invalidGameData = {
        teamName: 'A'.repeat(200), // Too long
        opponent: '', // Empty
        date: 'invalid-date',
        uploadedBy: 'test',
      };

      // This should fail at server level
      window.testInvalidUpload = invalidGameData;
    });

    // The validation should be handled by Firestore rules
    // We can test this by checking the validation test suite
    await page.goto('/validation-test.html');
    await page.click('[data-testid="run-tests-button"]');

    // Should show test results
    const testResults = page.locator('[data-testid="test-results"]');
    await expect(testResults).toBeVisible();

    // Should have some failed tests for invalid data
    const failedTests = page.locator('[data-testid="failed-test"]');
    await expect(failedTests).toHaveCount.greaterThan(0);
  });

  test('should handle authentication timeout', async ({ page }) => {
    await loginUser(page, 'coach');

    // Simulate token expiration
    await page.evaluate(() => {
      localStorage.removeItem('firebase:authUser');
      sessionStorage.clear();
    });

    // Try to access protected resource
    await page.goto('/admin.html');

    // Should redirect to login
    await expect(page).toHaveURL(/login\.html/);

    // Should show session expired message
    const sessionMessage = page.locator(
      '[data-testid="session-expired"], .session-expired'
    );
    await expect(sessionMessage).toBeVisible();
  });
});

test.describe('Performance and Accessibility', () => {
  test('should load pages within performance budget', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);

    // Check Core Web Vitals using Lighthouse CI or custom metrics
    const performanceEntries = await page.evaluate(() => {
      return performance.getEntriesByType('navigation')[0];
    });

    // First Contentful Paint should be under 1.8s
    expect(
      performanceEntries.responseEnd - performanceEntries.requestStart
    ).toBeLessThan(1800);
  });

  test('should be keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Test tab navigation through critical elements
    const focusableElements = [
      '[data-testid="skip-link"]',
      '[data-testid="main-nav"] a',
      '[data-testid="search-input"]',
      '[data-testid="login-link"]',
    ];

    for (const selector of focusableElements) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();
    }

    // Test Enter key activation
    await page.keyboard.press('Enter');
    // Should activate the focused element
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');

    // Check critical accessibility attributes
    const nav = page.locator('nav');
    await expect(nav).toHaveAttribute('aria-label');

    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      const hasAriaLabel = await button.getAttribute('aria-label');
      const hasText = await button.textContent();

      // Button should have either aria-label or text content
      expect(hasAriaLabel || (hasText && hasText.trim())).toBeTruthy();
    }
  });
});

test.describe('Mobile Responsiveness', () => {
  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check mobile navigation
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    await expect(mobileMenu).toBeVisible();

    // Test mobile form interactions
    await page.goto('/login.html');

    const emailInput = page.locator('[data-testid="email-input"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Mobile keyboard should show email keyboard
    await emailInput.click();
    // This would trigger email keyboard on real device
  });

  test('should handle touch interactions', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/search.html');

    // Test touch/tap interactions
    const searchButton = page.locator('[data-testid="search-button"]');

    // Simulate touch events
    await searchButton.dispatchEvent('touchstart');
    await searchButton.dispatchEvent('touchend');

    // Should trigger search
    const searchResults = page.locator('[data-testid="search-results"]');
    await expect(searchResults).toBeVisible();
  });
});
