// End-to-end tests using Playwright
const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/3-Ball Network/);

    // Check main navigation
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Check hero section
    const hero = page.locator('[data-testid="hero-section"]');
    await expect(hero).toBeVisible();
  });

  test('should navigate to player portal', async ({ page }) => {
    await page.goto('/');

    // Click player portal link
    await page.click('a[href*="player"]');

    // Check we're on player page
    await expect(page).toHaveURL(/player/);
    await expect(page.locator('h1')).toContainText('Player');
  });

  test('should handle responsive design', async ({ page }) => {
    await page.goto('/');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Mobile menu should be visible
    const mobileMenu = page.locator('[data-testid="mobile-menu-toggle"]');
    await expect(mobileMenu).toBeVisible();

    // Desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Desktop navigation should be visible
    const desktopNav = page.locator('[data-testid="desktop-nav"]');
    await expect(desktopNav).toBeVisible();
  });
});

test.describe('Authentication', () => {
  test('should show login form', async ({ page }) => {
    await page.goto('/login.html');

    // Check login form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should validate form inputs', async ({ page }) => {
    await page.goto('/login.html');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Check validation messages
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
  });

  test('should handle login process', async ({ page }) => {
    await page.goto('/login.html');

    // Fill login form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Check for loading state
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toHaveAttribute('aria-busy', 'true');
  });
});

test.describe('Player Portal', () => {
  test('should display player dashboard', async ({ page }) => {
    await page.goto('/player.html');

    // Check dashboard components
    await expect(page.locator('[data-testid="player-stats"]')).toBeVisible();
    await expect(page.locator('[data-testid="recent-games"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="training-schedule"]')
    ).toBeVisible();
  });

  test('should handle profile editing', async ({ page }) => {
    await page.goto('/player.html');

    // Click edit profile button
    await page.click('[data-testid="edit-profile"]');

    // Check edit form appears
    await expect(page.locator('[data-testid="profile-form"]')).toBeVisible();

    // Fill form
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="position"]', 'Forward');

    // Save changes
    await page.click('[data-testid="save-profile"]');

    // Check success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });
});

test.describe('Search Functionality', () => {
  test('should perform player search', async ({ page }) => {
    await page.goto('/search.html');

    // Enter search query
    await page.fill('input[type="search"]', 'basketball');
    await page.press('input[type="search"]', 'Enter');

    // Check search results
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
    await expect(page.locator('[data-testid="result-item"]')).toHaveCount(1);
  });

  test('should handle empty search results', async ({ page }) => {
    await page.goto('/search.html');

    // Search for non-existent term
    await page.fill('input[type="search"]', 'nonexistentterm123');
    await page.press('input[type="search"]', 'Enter');

    // Check no results message
    await expect(page.locator('[data-testid="no-results"]')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Test Tab navigation
    await page.keyboard.press('Tab');

    // Check focus indicators
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');

    // Check navigation has proper labels
    const nav = page.locator('nav');
    await expect(nav).toHaveAttribute('aria-label');

    // Check buttons have labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const hasLabel = await button.getAttribute('aria-label');
      const hasText = await button.textContent();

      expect(hasLabel || hasText).toBeTruthy();
    }
  });
});

test.describe('Performance', () => {
  test('should load within performance budget', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    // Check page loaded within 3 seconds
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have optimized images', async ({ page }) => {
    await page.goto('/');

    // Check images have proper attributes
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      await expect(image).toHaveAttribute('alt');
      await expect(image).toHaveAttribute('loading', 'lazy');
    }
  });
});
