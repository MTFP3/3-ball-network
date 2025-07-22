const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

describe('Performance Tests - Load Testing', () => {
  let chrome;
  let browser;

  beforeAll(async () => {
    // Launch Chrome for Lighthouse
    chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

    // Launch Puppeteer browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  afterAll(async () => {
    if (browser) await browser.close();
    if (chrome) await chrome.kill();
  });

  describe('Page Load Performance', () => {
    test('landing page loads within performance budget', async () => {
      const options = {
        logLevel: 'info',
        output: 'json',
        onlyCategories: ['performance'],
        port: chrome.port,
      };

      const runnerResult = await lighthouse('http://localhost:3000', options);
      const { lhr } = runnerResult;

      // Performance score should be above 90
      expect(lhr.categories.performance.score * 100).toBeGreaterThan(90);

      // Core Web Vitals
      expect(lhr.audits['largest-contentful-paint'].numericValue).toBeLessThan(
        2500
      ); // 2.5s
      expect(lhr.audits['first-input-delay'].numericValue).toBeLessThan(100); // 100ms
      expect(lhr.audits['cumulative-layout-shift'].numericValue).toBeLessThan(
        0.1
      ); // 0.1

      // Other important metrics
      expect(lhr.audits['first-contentful-paint'].numericValue).toBeLessThan(
        1800
      ); // 1.8s
      expect(lhr.audits['speed-index'].numericValue).toBeLessThan(3000); // 3s
    });

    test('dashboard loads efficiently with data', async () => {
      const page = await browser.newPage();

      // Login first
      await page.goto('http://localhost:3000/login');
      await page.type('[data-testid="email-input"]', 'perf-test@example.com');
      await page.type('[data-testid="password-input"]', 'password123');
      await page.click('[data-testid="login-btn"]');
      await page.waitForNavigation();

      // Measure dashboard load
      const startTime = Date.now();
      await page.goto('http://localhost:3000/dashboard');

      // Wait for key elements to load
      await page.waitForSelector('[data-testid="stats-chart"]');
      await page.waitForSelector('[data-testid="video-grid"]');
      await page.waitForSelector('[data-testid="recent-activity"]');

      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000); // 3 second budget

      await page.close();
    });

    test('video upload page handles large files efficiently', async () => {
      const page = await browser.newPage();

      // Monitor memory usage
      await page.evaluateOnNewDocument(() => {
        window.performanceMonitor = {
          initialMemory: performance.memory.usedJSHeapSize,
          memoryPeaks: [],
        };

        setInterval(() => {
          window.performanceMonitor.memoryPeaks.push(
            performance.memory.usedJSHeapSize
          );
        }, 1000);
      });

      await page.goto('http://localhost:3000/upload');

      // Simulate large file selection (without actual upload)
      await page.evaluate(() => {
        const input = document.querySelector(
          '[data-testid="video-file-input"]'
        );
        const largeFile = new File(
          ['x'.repeat(100 * 1024 * 1024)],
          'large-video.mp4',
          {
            type: 'video/mp4',
          }
        );

        const dt = new DataTransfer();
        dt.items.add(largeFile);
        input.files = dt.files;

        input.dispatchEvent(new Event('change', { bubbles: true }));
      });

      // Wait for file processing
      await page.waitForTimeout(5000);

      // Check memory usage
      const memoryStats = await page.evaluate(() => window.performanceMonitor);
      const maxMemory = Math.max(...memoryStats.memoryPeaks);
      const memoryIncrease = maxMemory - memoryStats.initialMemory;

      // Memory increase should be reasonable (less than 150MB)
      expect(memoryIncrease).toBeLessThan(150 * 1024 * 1024);

      await page.close();
    });
  });

  describe('Concurrent User Load', () => {
    test('handles 50 concurrent users viewing dashboards', async () => {
      const concurrentUsers = 50;
      const promises = [];

      for (let i = 0; i < concurrentUsers; i++) {
        promises.push(simulateUserSession(i));
      }

      const startTime = Date.now();
      const results = await Promise.allSettled(promises);
      const totalTime = Date.now() - startTime;

      const successfulSessions = results.filter(
        r => r.status === 'fulfilled'
      ).length;
      const failedSessions = results.filter(
        r => r.status === 'rejected'
      ).length;

      // At least 95% of sessions should succeed
      expect(successfulSessions / concurrentUsers).toBeGreaterThan(0.95);

      // Average response time should be reasonable
      const avgResponseTime = totalTime / concurrentUsers;
      expect(avgResponseTime).toBeLessThan(5000); // 5 seconds average

      console.log(
        `Concurrent test: ${successfulSessions}/${concurrentUsers} successful, ${failedSessions} failed`
      );
    });

    test('handles concurrent video uploads without degradation', async () => {
      const concurrentUploads = 10;
      const promises = [];

      for (let i = 0; i < concurrentUploads; i++) {
        promises.push(simulateVideoUpload(i));
      }

      const results = await Promise.allSettled(promises);
      const successfulUploads = results.filter(
        r => r.status === 'fulfilled'
      ).length;

      // All uploads should succeed (server should queue them properly)
      expect(successfulUploads).toBe(concurrentUploads);
    });

    async function simulateUserSession(userId) {
      const page = await browser.newPage();

      try {
        // Login
        await page.goto('http://localhost:3000/login');
        await page.type(
          '[data-testid="email-input"]',
          `user${userId}@test.com`
        );
        await page.type('[data-testid="password-input"]', 'password123');
        await page.click('[data-testid="login-btn"]');
        await page.waitForNavigation({ timeout: 10000 });

        // Navigate through app
        await page.goto('http://localhost:3000/dashboard');
        await page.waitForSelector('[data-testid="stats-chart"]', {
          timeout: 5000,
        });

        await page.goto('http://localhost:3000/videos');
        await page.waitForSelector('[data-testid="video-grid"]', {
          timeout: 5000,
        });

        await page.goto('http://localhost:3000/analytics');
        await page.waitForSelector('[data-testid="analytics-dashboard"]', {
          timeout: 5000,
        });

        return { userId, status: 'success' };
      } catch (error) {
        throw new Error(`User ${userId} session failed: ${error.message}`);
      } finally {
        await page.close();
      }
    }

    async function simulateVideoUpload(uploadId) {
      const page = await browser.newPage();

      try {
        await page.goto('http://localhost:3000/upload');

        // Simulate file selection
        await page.evaluate(() => {
          const input = document.querySelector(
            '[data-testid="video-file-input"]'
          );
          const file = new File(
            ['video content'],
            `test-video-${Date.now()}.mp4`,
            {
              type: 'video/mp4',
            }
          );

          const dt = new DataTransfer();
          dt.items.add(file);
          input.files = dt.files;

          input.dispatchEvent(new Event('change', { bubbles: true }));
        });

        // Wait for upload to initialize
        await page.waitForSelector('[data-testid="upload-progress"]', {
          timeout: 5000,
        });

        return { uploadId, status: 'success' };
      } catch (error) {
        throw new Error(`Upload ${uploadId} failed: ${error.message}`);
      } finally {
        await page.close();
      }
    }
  });

  describe('Database Performance', () => {
    test('queries respond within acceptable limits', async () => {
      const page = await browser.newPage();

      // Monitor network requests
      const requests = [];
      page.on('response', response => {
        if (response.url().includes('/api/')) {
          requests.push({
            url: response.url(),
            status: response.status(),
            timing: response.timing(),
          });
        }
      });

      await page.goto('http://localhost:3000/dashboard');
      await page.waitForSelector('[data-testid="stats-chart"]');

      // Wait for all API calls to complete
      await page.waitForTimeout(3000);

      // Check API response times
      const slowRequests = requests.filter(req => {
        const responseTime = req.timing ? req.timing.receiveHeadersEnd : 0;
        return responseTime > 1000; // Slower than 1 second
      });

      expect(slowRequests.length).toBe(0);

      // Check that all requests succeeded
      const failedRequests = requests.filter(req => req.status >= 400);
      expect(failedRequests.length).toBe(0);

      await page.close();
    });

    test('handles complex analytics queries efficiently', async () => {
      const page = await browser.newPage();

      await page.goto('http://localhost:3000/analytics');

      const startTime = Date.now();

      // Trigger complex analytics query
      await page.click('[data-testid="generate-advanced-report"]');
      await page.waitForSelector('[data-testid="advanced-report-results"]', {
        timeout: 10000,
      });

      const queryTime = Date.now() - startTime;

      // Complex analytics should complete within 8 seconds
      expect(queryTime).toBeLessThan(8000);

      await page.close();
    });
  });

  describe('Memory and Resource Management', () => {
    test('prevents memory leaks during navigation', async () => {
      const page = await browser.newPage();

      await page.evaluateOnNewDocument(() => {
        window.memoryTracker = {
          samples: [],
          interval: setInterval(() => {
            window.memoryTracker.samples.push({
              timestamp: Date.now(),
              memory: performance.memory.usedJSHeapSize,
            });
          }, 1000),
        };
      });

      // Navigate through multiple pages
      const pages = [
        '/dashboard',
        '/videos',
        '/analytics',
        '/profile',
        '/upload',
        '/dashboard', // Return to start
      ];

      for (const path of pages) {
        await page.goto(`http://localhost:3000${path}`);
        await page.waitForTimeout(2000); // Wait for page to settle
      }

      const memoryData = await page.evaluate(() => {
        clearInterval(window.memoryTracker.interval);
        return window.memoryTracker.samples;
      });

      // Check for memory growth trend
      const initialMemory = memoryData[0].memory;
      const finalMemory = memoryData[memoryData.length - 1].memory;
      const memoryGrowth = (finalMemory - initialMemory) / initialMemory;

      // Memory growth should be less than 50% over the session
      expect(memoryGrowth).toBeLessThan(0.5);

      await page.close();
    });

    test('efficiently handles large datasets', async () => {
      const page = await browser.newPage();

      // Mock large dataset
      await page.evaluateOnNewDocument(() => {
        // Override fetch to return large dataset
        const originalFetch = window.fetch;
        window.fetch = function (url, options) {
          if (url.includes('/api/analytics/stats')) {
            return Promise.resolve({
              ok: true,
              json: () =>
                Promise.resolve({
                  games: Array.from({ length: 1000 }, (_, i) => ({
                    id: i,
                    date: `2024-01-${(i % 30) + 1}`,
                    points: Math.floor(Math.random() * 30),
                    assists: Math.floor(Math.random() * 15),
                    rebounds: Math.floor(Math.random() * 20),
                  })),
                }),
            });
          }
          return originalFetch(url, options);
        };
      });

      const startTime = Date.now();
      await page.goto('http://localhost:3000/analytics');
      await page.waitForSelector('[data-testid="stats-table"]');

      // Check that table renders efficiently
      const renderTime = Date.now() - startTime;
      expect(renderTime).toBeLessThan(5000);

      // Check that table is virtualized (not all rows in DOM)
      const rowCount = await page.$$eval(
        '[data-testid="stats-row"]',
        rows => rows.length
      );
      expect(rowCount).toBeLessThan(100); // Should virtualize large dataset

      await page.close();
    });
  });

  describe('Network Performance', () => {
    test('handles slow network conditions gracefully', async () => {
      const page = await browser.newPage();

      // Simulate slow 3G
      await page.emulateNetworkConditions({
        offline: false,
        downloadThroughput: (1.5 * 1024 * 1024) / 8, // 1.5 Mbps
        uploadThroughput: (750 * 1024) / 8, // 750 Kbps
        latency: 300, // 300ms
      });

      const startTime = Date.now();
      await page.goto('http://localhost:3000/dashboard');

      // Should show loading states
      await page.waitForSelector('[data-testid="loading-skeleton"]');

      // Eventually load content
      await page.waitForSelector('[data-testid="stats-chart"]', {
        timeout: 15000,
      });

      const loadTime = Date.now() - startTime;

      // Should load within reasonable time even on slow network
      expect(loadTime).toBeLessThan(15000);

      await page.close();
    });

    test('implements proper caching strategies', async () => {
      const page = await browser.newPage();

      // First visit
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForSelector('[data-testid="stats-chart"]');

      // Monitor cache hits on second visit
      const cacheHits = [];
      page.on('response', response => {
        const cacheHeader = response.headers()['cache-control'];
        if (cacheHeader && response.fromCache()) {
          cacheHits.push(response.url());
        }
      });

      // Second visit
      await page.reload();
      await page.waitForSelector('[data-testid="stats-chart"]');

      // Should have cache hits for static assets
      expect(cacheHits.length).toBeGreaterThan(0);

      await page.close();
    });

    test('handles network failures gracefully', async () => {
      const page = await browser.newPage();

      await page.goto('http://localhost:3000/dashboard');
      await page.waitForSelector('[data-testid="stats-chart"]');

      // Simulate network failure
      await page.setOfflineMode(true);

      // Try to navigate
      await page.click('[data-testid="videos-nav"]');

      // Should show offline message
      await page.waitForSelector('[data-testid="offline-notice"]');
      expect(
        await page.textContent('[data-testid="offline-notice"]')
      ).toContain('offline');

      // Restore network
      await page.setOfflineMode(false);

      // Should recover
      await page.click('[data-testid="retry-btn"]');
      await page.waitForSelector('[data-testid="video-grid"]');

      await page.close();
    });
  });

  describe('Mobile Performance', () => {
    test('performs well on mobile devices', async () => {
      const page = await browser.newPage();

      // Emulate mobile device
      await page.emulate(puppeteer.devices['iPhone 12']);

      const startTime = Date.now();
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForSelector('[data-testid="mobile-nav"]');

      const loadTime = Date.now() - startTime;

      // Mobile should load within 4 seconds
      expect(loadTime).toBeLessThan(4000);

      // Check mobile-specific optimizations
      const hasLazyImages = await page.$('[data-testid="lazy-image"]');
      expect(hasLazyImages).toBeTruthy();

      await page.close();
    });

    test('handles touch interactions efficiently', async () => {
      const page = await browser.newPage();
      await page.emulate(puppeteer.devices['iPhone 12']);

      await page.goto('http://localhost:3000/videos');
      await page.waitForSelector('[data-testid="video-grid"]');

      // Test touch scrolling performance
      const startTime = Date.now();

      for (let i = 0; i < 10; i++) {
        await page.touchscreen.tap(200, 400);
        await page.evaluate(() => window.scrollBy(0, 100));
        await page.waitForTimeout(100);
      }

      const scrollTime = Date.now() - startTime;

      // Touch interactions should be responsive
      expect(scrollTime).toBeLessThan(2000);

      await page.close();
    });
  });
});
