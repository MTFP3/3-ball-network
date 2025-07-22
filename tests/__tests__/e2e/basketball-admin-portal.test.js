/**
 * End-to-End tests for Basketball Data Admin Portal
 * Tests the complete user workflow for basketball data management
 */

const { test, expect } = require('@playwright/test');

test.describe('Basketball Data Admin Portal', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin portal
    await page.goto('/admin.html');
    
    // Mock successful login for testing
    await page.evaluate(() => {
      // Mock Firebase auth
      window.firebase = {
        auth: () => ({
          currentUser: { uid: 'admin123', email: 'admin@3ballnetwork.com' },
          signInWithEmailAndPassword: () => Promise.resolve(),
        }),
        firestore: () => ({
          collection: () => ({
            doc: () => ({
              get: () => Promise.resolve({ data: () => ({}) }),
              set: () => Promise.resolve(),
            }),
            get: () => Promise.resolve({ docs: [] }),
          }),
        }),
      };
      
      // Mock basketball data services
      window.basketballData = {
        getPlayers: () => Promise.resolve([]),
        getTeams: () => Promise.resolve([]),
        getGames: () => Promise.resolve([]),
        createPlayer: () => Promise.resolve({ id: 'player123' }),
        createTeam: () => Promise.resolve({ id: 'team123' }),
        createGame: () => Promise.resolve({ id: 'game123' }),
      };
      
      window.dataSeeder = {
        seedAllData: () => Promise.resolve({
          players: 50,
          teams: 16,
          games: 100,
          reports: 25,
        }),
      };
    });

    // Wait for admin portal to load
    await page.waitForSelector('.admin-container', { timeout: 10000 });
  });

  test('should display basketball data tab in navigation', async ({ page }) => {
    // Check that basketball data tab exists
    const basketballTab = page.locator('.nav-tab:has-text("🏀 Basketball Data")');
    await expect(basketballTab).toBeVisible();
  });

  test('should switch to basketball data section', async ({ page }) => {
    // Click on basketball data tab
    await page.click('.nav-tab:has-text("🏀 Basketball Data")');
    
    // Wait for basketball section to load
    await page.waitForSelector('#basketball.admin-section.active');
    
    // Check that basketball section is active
    const basketballSection = page.locator('#basketball.admin-section.active');
    await expect(basketballSection).toBeVisible();
    
    // Check for basketball statistics cards
    await expect(page.locator('#totalPlayers')).toBeVisible();
    await expect(page.locator('#totalTeams')).toBeVisible();
    await expect(page.locator('#totalGames')).toBeVisible();
  });

  test('should display basketball management tabs', async ({ page }) => {
    // Navigate to basketball section
    await page.click('.nav-tab:has-text("🏀 Basketball Data")');
    await page.waitForSelector('#basketball.admin-section.active');
    
    // Check for sub-tabs
    await expect(page.locator('.tab-btn:has-text("👤 Players")')).toBeVisible();
    await expect(page.locator('.tab-btn:has-text("🏆 Teams")')).toBeVisible();
    await expect(page.locator('.tab-btn:has-text("🎮 Games")')).toBeVisible();
    await expect(page.locator('.tab-btn:has-text("📊 Scouting")')).toBeVisible();
    await expect(page.locator('.tab-btn:has-text("📹 Highlights")')).toBeVisible();
  });

  test('should show players tab by default', async ({ page }) => {
    // Navigate to basketball section
    await page.click('.nav-tab:has-text("🏀 Basketball Data")');
    await page.waitForSelector('#basketball.admin-section.active');
    
    // Check that players tab is active
    const playersTab = page.locator('.tab-btn:has-text("👤 Players").active');
    await expect(playersTab).toBeVisible();
    
    // Check that players panel is active
    const playersPanel = page.locator('#players-tab.basketball-panel.active');
    await expect(playersPanel).toBeVisible();
    
    // Check for players table
    await expect(page.locator('#playersTable')).toBeVisible();
    await expect(page.locator('#playersTableBody')).toBeVisible();
  });

  test('should switch between basketball data tabs', async ({ page }) => {
    // Navigate to basketball section
    await page.click('.nav-tab:has-text("🏀 Basketball Data")');
    await page.waitForSelector('#basketball.admin-section.active');
    
    // Click on teams tab
    await page.click('.tab-btn:has-text("🏆 Teams")');
    
    // Check that teams panel is now active
    const teamsPanel = page.locator('#teams-tab.basketball-panel.active');
    await expect(teamsPanel).toBeVisible();
    
    // Check that players panel is no longer active
    const playersPanel = page.locator('#players-tab.basketball-panel.active');
    await expect(playersPanel).not.toBeVisible();
    
    // Check for teams table
    await expect(page.locator('#teamsTable')).toBeVisible();
  });

  test('should have functional search and filter controls', async ({ page }) => {
    // Navigate to basketball section and players tab
    await page.click('.nav-tab:has-text("🏀 Basketball Data")');
    await page.waitForSelector('#basketball.admin-section.active');
    
    // Check for search controls
    await expect(page.locator('#playerSearch')).toBeVisible();
    await expect(page.locator('#positionFilter')).toBeVisible();
    await expect(page.locator('#schoolFilter')).toBeVisible();
    
    // Test search input
    await page.fill('#playerSearch', 'LeBron');
    const searchValue = await page.inputValue('#playerSearch');
    expect(searchValue).toBe('LeBron');
    
    // Test position filter
    await page.selectOption('#positionFilter', 'PG');
    const selectedPosition = await page.inputValue('#positionFilter');
    expect(selectedPosition).toBe('PG');
  });

  test('should display data seeding controls', async ({ page }) => {
    // Navigate to basketball section
    await page.click('.nav-tab:has-text("🏀 Basketball Data")');
    await page.waitForSelector('#basketball.admin-section.active');
    
    // Check for seeding button
    const seedButton = page.locator('button:has-text("🌱 Seed Sample Data")');
    await expect(seedButton).toBeVisible();
    
    // Check for export button
    const exportButton = page.locator('button:has-text("📤 Export Data")');
    await expect(exportButton).toBeVisible();
    
    // Check for refresh button
    const refreshButton = page.locator('button:has-text("🔄 Refresh")');
    await expect(refreshButton).toBeVisible();
  });

  test('should seed sample data successfully', async ({ page }) => {
    // Navigate to basketball section
    await page.click('.nav-tab:has-text("🏀 Basketball Data")');
    await page.waitForSelector('#basketball.admin-section.active');
    
    // Click seed data button
    await page.click('button:has-text("🌱 Seed Sample Data")');
    
    // Wait for seeding status panel to appear
    await page.waitForSelector('#seedingStatus', { state: 'visible' });
    
    // Check that seeding progress is shown
    await expect(page.locator('#seedingProgressBar')).toBeVisible();
    await expect(page.locator('#seedingProgressText')).toBeVisible();
    await expect(page.locator('#seedingLog')).toBeVisible();
    
    // Wait for completion (mock should resolve quickly)
    await page.waitForFunction(() => {
      const progressText = document.querySelector('#seedingProgressText');
      return progressText && progressText.textContent.includes('completed');
    }, { timeout: 5000 });
  });

  test('should handle add player button', async ({ page }) => {
    // Navigate to basketball section and players tab
    await page.click('.nav-tab:has-text("🏀 Basketball Data")');
    await page.waitForSelector('#basketball.admin-section.active');
    
    // Check for add player button
    const addPlayerButton = page.locator('button:has-text("➕ Add Player")');
    await expect(addPlayerButton).toBeVisible();
    
    // Click add player button (should show modal or alert for now)
    await addPlayerButton.click();
    
    // Note: In real implementation, this would open a modal
    // For now, it shows an alert which we can't easily test
  });

  test('should handle add team button', async ({ page }) => {
    // Navigate to basketball section and teams tab
    await page.click('.nav-tab:has-text("🏀 Basketball Data")');
    await page.waitForSelector('#basketball.admin-section.active');
    await page.click('.tab-btn:has-text("🏆 Teams")');
    
    // Check for add team button
    const addTeamButton = page.locator('button:has-text("➕ Add Team")');
    await expect(addTeamButton).toBeVisible();
    
    // Click add team button
    await addTeamButton.click();
  });

  test('should handle add game button', async ({ page }) => {
    // Navigate to basketball section and games tab
    await page.click('.nav-tab:has-text("🏀 Basketball Data")');
    await page.waitForSelector('#basketball.admin-section.active');
    await page.click('.tab-btn:has-text("🎮 Games")');
    
    // Check for add game button
    const addGameButton = page.locator('button:has-text("➕ Add Game")');
    await expect(addGameButton).toBeVisible();
    
    // Click add game button
    await addGameButton.click();
  });

  test('should display appropriate loading states', async ({ page }) => {
    // Navigate to basketball section
    await page.click('.nav-tab:has-text("🏀 Basketball Data")');
    await page.waitForSelector('#basketball.admin-section.active');
    
    // Check that loading cells are displayed initially
    const loadingCells = page.locator('.loading-cell');
    await expect(loadingCells.first()).toBeVisible();
  });

  test('should display no data message when appropriate', async ({ page }) => {
    // Navigate to basketball section
    await page.click('.nav-tab:has-text("🏀 Basketball Data")');
    await page.waitForSelector('#basketball.admin-section.active');
    
    // Switch to scouting tab (which shows "coming soon" message)
    await page.click('.tab-btn:has-text("📊 Scouting")');
    
    // Check for coming soon message
    const scoutingPanel = page.locator('#scouting-tab.basketball-panel.active');
    await expect(scoutingPanel).toBeVisible();
    await expect(page.locator('text=Scouting reports feature coming soon')).toBeVisible();
  });

  test('should display highlights upload interface', async ({ page }) => {
    // Navigate to basketball section and highlights tab
    await page.click('.nav-tab:has-text("🏀 Basketball Data")');
    await page.waitForSelector('#basketball.admin-section.active');
    await page.click('.tab-btn:has-text("📹 Highlights")');
    
    // Check for highlights panel
    const highlightsPanel = page.locator('#highlights-tab.basketball-panel.active');
    await expect(highlightsPanel).toBeVisible();
    
    // Check for upload button
    const uploadButton = page.locator('button:has-text("📤 Upload Highlight")');
    await expect(uploadButton).toBeVisible();
    
    // Check for search input
    await expect(page.locator('#highlightSearch')).toBeVisible();
  });

  test('should maintain responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to basketball section
    await page.click('.nav-tab:has-text("🏀 Basketball Data")');
    await page.waitForSelector('#basketball.admin-section.active');
    
    // Check that elements are still visible and functional
    await expect(page.locator('#totalPlayers')).toBeVisible();
    await expect(page.locator('.tab-btn:has-text("👤 Players")')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Elements should still be visible
    await expect(page.locator('#basketball.admin-section.active')).toBeVisible();
    await expect(page.locator('#playersTable')).toBeVisible();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Mock error in basketball data service
    await page.evaluate(() => {
      window.basketballData.getPlayers = () => Promise.reject(new Error('Network error'));
    });
    
    // Navigate to basketball section
    await page.click('.nav-tab:has-text("🏀 Basketball Data")');
    await page.waitForSelector('#basketball.admin-section.active');
    
    // Should handle the error gracefully
    // Note: Actual error handling would show error messages
    await expect(page.locator('#basketball.admin-section.active')).toBeVisible();
  });

  test('should export data successfully', async ({ page }) => {
    // Navigate to basketball section
    await page.click('.nav-tab:has-text("🏀 Basketball Data")');
    await page.waitForSelector('#basketball.admin-section.active');
    
    // Set up download promise before clicking
    const downloadPromise = page.waitForEvent('download');
    
    // Click export button
    await page.click('button:has-text("📤 Export Data")');
    
    // Wait for download to start
    const download = await downloadPromise;
    
    // Check that download has correct filename pattern
    expect(download.suggestedFilename()).toMatch(/basketball-data-\d{4}-\d{2}-\d{2}\.json/);
  });

  test('should maintain admin authentication', async ({ page }) => {
    // Check that admin user info is displayed
    await expect(page.locator('.user-name')).toBeVisible();
    await expect(page.locator('.role-badge')).toBeVisible();
    
    // Navigate to basketball section
    await page.click('.nav-tab:has-text("🏀 Basketball Data")');
    
    // Admin features should still be accessible
    await expect(page.locator('button:has-text("🌱 Seed Sample Data")')).toBeVisible();
    await expect(page.locator('button:has-text("📤 Export Data")')).toBeVisible();
  });
});
