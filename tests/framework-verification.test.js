// Simple E2E test to verify framework functionality
import { test, expect } from '@playwright/test';

test.describe('E2E Framework Verification', () => {
  test('should verify Playwright is working', async ({ page }) => {
    // Test basic Playwright functionality
    await page.goto('https://example.com');

    const title = await page.title();
    expect(title).toContain('Example Domain');

    console.log('✅ Playwright framework is working correctly');
  });

  test('should handle basic page interactions', async ({ page }) => {
    await page.goto('https://example.com');

    // Test basic page interactions
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Example Domain');

    console.log('✅ Page interactions are working correctly');
  });

  test('should support mobile viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://example.com');

    const viewportSize = page.viewportSize();
    expect(viewportSize.width).toBe(375);
    expect(viewportSize.height).toBe(667);

    console.log('✅ Mobile viewport testing is working correctly');
  });
});
