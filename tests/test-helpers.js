// Test helpers and utilities for E2E tests
// Common functions used across multiple test suites

class TestHelpers {
  constructor(page) {
    this.page = page;
  }

  // Authentication helpers
  async loginAs(userType) {
    const testUsers = {
      coach: {
        email: 'test.coach@example.com',
        password: 'TestPassword123!',
        name: 'Test Coach',
        role: 'coach',
      },
      player: {
        email: 'test.player@example.com',
        password: 'TestPassword123!',
        name: 'Test Player',
        role: 'player',
      },
      scout: {
        email: 'test.scout@example.com',
        password: 'TestPassword123!',
        name: 'Test Scout',
        role: 'scout',
      },
      admin: {
        email: 'test.admin@example.com',
        password: 'TestPassword123!',
        name: 'Test Admin',
        role: 'admin',
      },
    };

    const user = testUsers[userType];
    if (!user) {
      throw new Error(`Unknown user type: ${userType}`);
    }

    await this.page.goto('/login.html');
    await this.fillForm({
      '[data-testid="email-input"]': user.email,
      '[data-testid="password-input"]': user.password,
    });

    await this.page.click('[data-testid="login-button"]');

    // Wait for redirect to dashboard
    await this.page.waitForURL(/dashboard|coach|player|scout|admin/);

    return user;
  }

  // Form helpers
  async fillForm(fieldMap) {
    for (const [selector, value] of Object.entries(fieldMap)) {
      if (value !== null && value !== undefined) {
        await this.page.fill(selector, String(value));
      }
    }
  }

  async submitForm(submitSelector = '[data-testid="submit-button"]') {
    await this.page.click(submitSelector);
  }

  // Validation helpers
  async expectValidationError(
    errorSelector = '[data-testid="validation-error"]',
    errorText = null
  ) {
    const errorElement = this.page.locator(errorSelector);
    await expect(errorElement).toBeVisible();

    if (errorText) {
      await expect(errorElement).toContainText(errorText);
    }

    return errorElement;
  }

  async expectToast(type = 'success', message = null) {
    const toast = this.page.locator(
      `[data-testid="toast-${type}"], .toast-${type}`
    );
    await expect(toast).toBeVisible();

    if (message) {
      await expect(toast).toContainText(message);
    }

    return toast;
  }

  // Upload helpers
  async uploadGame(gameData) {
    const defaultData = {
      gameId: `test-game-${Date.now()}`,
      teamName: 'Test Team',
      opponent: 'Test Opponent',
      date: '2024-12-15',
      videoUrl: 'https://example.com/video.mp4',
    };

    const data = { ...defaultData, ...gameData };

    await this.fillForm({
      '[data-testid="game-id"]': data.gameId,
      '[data-testid="team-name"]': data.teamName,
      '[data-testid="opponent"]': data.opponent,
      '[data-testid="game-date"]': data.date,
      '[data-testid="video-url"]': data.videoUrl,
    });

    await this.page.click('[data-testid="upload-game-button"]');

    return data;
  }

  // Search helpers
  async performSearch(query, filters = {}) {
    await this.page.goto('/search.html');

    if (query) {
      await this.page.fill('[data-testid="search-input"]', query);
    }

    // Apply filters
    for (const [filterName, filterValue] of Object.entries(filters)) {
      const filterSelector = `[data-testid="${filterName}-filter"]`;
      await this.page.selectOption(filterSelector, filterValue);
    }

    await this.page.click('[data-testid="search-button"]');

    // Wait for results
    await this.page.waitForSelector(
      '[data-testid="search-results"], [data-testid="no-results"]'
    );
  }

  // Wait helpers
  async waitForLoadingToComplete(
    loadingSelector = '[data-testid="loading"], .loading'
  ) {
    // Wait for loading to appear
    try {
      await this.page.waitForSelector(loadingSelector, { timeout: 2000 });
    } catch (e) {
      // Loading might be too fast to catch
    }

    // Wait for loading to disappear
    await this.page.waitForSelector(loadingSelector, {
      state: 'hidden',
      timeout: 30000,
    });
  }

  async waitForElement(selector, options = {}) {
    return await this.page.waitForSelector(selector, {
      timeout: 10000,
      ...options,
    });
  }

  // User registration helper
  async registerUser(userData) {
    await this.page.goto('/register.html');

    // Select role
    await this.page.click(`[data-testid="role-${userData.role}"]`);

    // Wait for role-specific form
    await this.page.waitForSelector(`[data-testid="${userData.role}-form"]`);

    // Fill common fields
    const formFields = {
      [`[data-testid="${userData.role}-name"]`]: userData.name,
      [`[data-testid="${userData.role}-email"]`]:
        userData.email || `test.${Date.now()}@example.com`,
      [`[data-testid="${userData.role}-password"]`]:
        userData.password || 'TestPassword123!',
    };

    // Add role-specific fields
    if (userData.role === 'player') {
      Object.assign(formFields, {
        '[data-testid="player-position"]': userData.position || 'PG',
        '[data-testid="player-school"]': userData.school || 'Test University',
        '[data-testid="player-graduation-year"]':
          userData.graduationYear || '2025',
        '[data-testid="player-height"]': userData.height || '180',
        '[data-testid="player-weight"]': userData.weight || '75',
        '[data-testid="player-gpa"]': userData.gpa || '3.5',
      });
    } else if (userData.role === 'coach') {
      Object.assign(formFields, {
        '[data-testid="coach-school"]': userData.school || 'Test High School',
        '[data-testid="coach-experience"]': userData.experience || '5 years',
        '[data-testid="coach-certifications"]':
          userData.certifications || 'NFHS Certified',
      });
    } else if (userData.role === 'scout') {
      Object.assign(formFields, {
        '[data-testid="scout-organization"]':
          userData.organization || 'Test Scouts Inc',
        '[data-testid="scout-experience"]': userData.experience || '3 years',
      });
    }

    await this.fillForm(formFields);
    await this.page.click('[data-testid="submit-button"]');

    return userData;
  }

  // Security testing helpers
  async testXSSPrevention(inputSelector, displaySelector) {
    const xssPayload = '<script>window.xssDetected = true;</script>';

    await this.page.fill(inputSelector, xssPayload);
    await this.page.click('[data-testid="submit-button"], [type="submit"]');

    // Check that script wasn't executed
    const xssExecuted = await this.page.evaluate(() => window.xssDetected);
    expect(xssExecuted).toBeFalsy();

    // Check that content is properly escaped
    if (displaySelector) {
      const displayElement = this.page.locator(displaySelector);
      await expect(displayElement).toContainText('<script>'); // Should be escaped
    }
  }

  // Performance helpers
  async measurePageLoadTime(url) {
    const startTime = Date.now();
    await this.page.goto(url);
    const loadTime = Date.now() - startTime;

    const performanceMetrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        firstContentfulPaint:
          performance.getEntriesByName('first-contentful-paint')[0]
            ?.startTime || 0,
        totalLoadTime: navigation.loadEventEnd - navigation.navigationStart,
      };
    });

    return {
      clientLoadTime: loadTime,
      ...performanceMetrics,
    };
  }

  // Accessibility helpers
  async checkKeyboardNavigation(selectors) {
    for (const selector of selectors) {
      await this.page.keyboard.press('Tab');
      const focused = this.page.locator(':focus');

      // Verify element is focusable and visible
      await expect(focused).toBeVisible();

      // Verify it matches one of our expected selectors
      const matchesSelector = await focused.evaluate((el, selectors) => {
        return selectors.some(sel => el.matches(sel));
      }, selectors);

      expect(matchesSelector).toBeTruthy();
    }
  }

  async checkAriaAttributes(elementSelector) {
    const element = this.page.locator(elementSelector);

    const attributes = await element.evaluate(el => ({
      hasAriaLabel: el.hasAttribute('aria-label'),
      hasAriaLabelledBy: el.hasAttribute('aria-labelledby'),
      hasAriaDescribedBy: el.hasAttribute('aria-describedby'),
      role: el.getAttribute('role'),
      textContent: el.textContent?.trim(),
    }));

    // Element should have proper labeling
    const hasProperLabeling =
      attributes.hasAriaLabel ||
      attributes.hasAriaLabelledBy ||
      attributes.textContent;

    expect(hasProperLabeling).toBeTruthy();

    return attributes;
  }

  // Mobile testing helpers
  async setMobileViewport() {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }

  async testTouchInteraction(selector) {
    const element = this.page.locator(selector);

    // Simulate touch events
    await element.dispatchEvent('touchstart');
    await element.dispatchEvent('touchend');

    // Element should respond to touch
    return element;
  }

  // Data generation helpers
  generateTestEmail() {
    return `test.user.${Date.now()}@example.com`;
  }

  generateTestData(type) {
    const timestamp = Date.now();

    const testDataTemplates = {
      player: {
        name: `Test Player ${timestamp}`,
        email: this.generateTestEmail(),
        password: 'TestPassword123!',
        role: 'player',
        position: 'PG',
        school: 'Test University',
        graduationYear: '2025',
        height: '180',
        weight: '75',
        gpa: '3.5',
      },
      coach: {
        name: `Test Coach ${timestamp}`,
        email: this.generateTestEmail(),
        password: 'TestPassword123!',
        role: 'coach',
        school: 'Test High School',
        experience: '5 years',
        certifications: 'NFHS Certified',
      },
      game: {
        gameId: `game-${timestamp}`,
        teamName: 'Test Warriors',
        opponent: 'Test Opponents',
        date: '2024-12-15',
        videoUrl: 'https://example.com/video.mp4',
      },
    };

    return testDataTemplates[type] || {};
  }
}

module.exports = { TestHelpers };

// ES module export for compatibility
export { TestHelpers };
