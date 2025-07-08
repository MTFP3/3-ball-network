#!/usr/bin/env node

/**
 * Performance monitoring script for 3 Ball Network
 */

import { execSync } from 'child_process';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

const log = {
  info: msg => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: msg => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: msg =>
    console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: msg => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
};

class PerformanceMonitor {
  constructor() {
    this.baseUrl = 'https://3ballnetwork.com';
    this.pages = [
      '/',
      '/player.html',
      '/coach.html',
      '/scout.html',
      '/fan.html',
      '/admin.html',
    ];
  }

  async testPagePerformance(page) {
    const url = `${this.baseUrl}${page}`;

    try {
      const curlOutput = execSync(
        `curl -w "time_total:%{time_total}\\nsize_download:%{size_download}\\nspeed_download:%{speed_download}" -o /dev/null -s "${url}"`,
        { encoding: 'utf8' }
      );

      const metrics = {};
      curlOutput.split('\\n').forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
          metrics[key] = parseFloat(value);
        }
      });

      return {
        page,
        loadTime: metrics.time_total,
        size: metrics.size_download,
        speed: metrics.speed_download,
      };
    } catch (error) {
      log.error(`Failed to test ${page}: ${error.message}`);
      return null;
    }
  }

  async runPerformanceTest() {
    log.info('🚀 Running performance test on 3 Ball Network...');
    log.info('==================================================');

    const results = [];

    for (const page of this.pages) {
      const result = await this.testPagePerformance(page);
      if (result) {
        results.push(result);

        const sizeKB = (result.size / 1024).toFixed(1);
        const speedKBps = (result.speed / 1024).toFixed(0);

        let status = '✅';
        if (result.loadTime > 1.0) status = '⚠️';
        if (result.loadTime > 2.0) status = '❌';

        console.log(
          `${status} ${page.padEnd(20)} | ${result.loadTime.toFixed(3)}s | ${sizeKB.padStart(6)}KB | ${speedKBps.padStart(6)}KB/s`
        );
      }
    }

    this.generateReport(results);
  }

  generateReport(results) {
    if (results.length === 0) return;

    const avgLoadTime =
      results.reduce((sum, r) => sum + r.loadTime, 0) / results.length;
    const totalSize = results.reduce((sum, r) => sum + r.size, 0);
    const avgSpeed =
      results.reduce((sum, r) => sum + r.speed, 0) / results.length;

    log.info('');
    log.info('📊 Performance Summary:');
    log.info(`   Average load time: ${avgLoadTime.toFixed(3)}s`);
    log.info(`   Total content size: ${(totalSize / 1024).toFixed(1)}KB`);
    log.info(`   Average speed: ${(avgSpeed / 1024).toFixed(0)}KB/s`);

    const slowPages = results.filter(r => r.loadTime > 1.0);
    const largePages = results.filter(r => r.size > 150000); // 150KB

    if (slowPages.length > 0) {
      log.warning(
        `   Slow pages (>1s): ${slowPages.map(p => p.page).join(', ')}`
      );
    }

    if (largePages.length > 0) {
      log.warning(
        `   Large pages (>150KB): ${largePages.map(p => p.page).join(', ')}`
      );
    }

    if (avgLoadTime < 0.5) {
      log.success('🚀 Excellent performance! All pages load very fast.');
    } else if (avgLoadTime < 1.0) {
      log.success('✅ Good performance! Pages load reasonably fast.');
    } else {
      log.warning('⚠️  Some pages are slow. Consider further optimization.');
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new PerformanceMonitor();
  monitor.runPerformanceTest().catch(console.error);
}

export default PerformanceMonitor;
