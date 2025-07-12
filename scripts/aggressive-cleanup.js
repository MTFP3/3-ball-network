#!/usr/bin/env node

/**
 * 3 Ball Network - Aggressive Asset Cleanup
 * Removes all orphaned source maps and simplifies the file structure
 */

import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

const log = {
  info: msg => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: msg => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: msg =>
    console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: msg => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  step: msg => console.log(`${colors.magenta}[STEP]${colors.reset} ${msg}`),
};

class AggressiveCleanup {
  constructor() {
    this.jsDir = 'public/assets/js';
    this.deletedCount = 0;
    this.keptCount = 0;
  }

  // Check if a JS file has corresponding source map and vice versa
  async cleanOrphanedSourceMaps() {
    log.step('🗑️ Removing orphaned source map files...');

    const mapFiles = await glob(`${this.jsDir}/*.js.map`);

    for (const mapFile of mapFiles) {
      const jsFile = mapFile.replace('.js.map', '.js');

      if (!(await fs.pathExists(jsFile))) {
        await fs.remove(mapFile);
        this.deletedCount++;
        log.warning(`Removed orphaned: ${path.basename(mapFile)}`);
      }
    }
  }

  // Remove files that are clearly hashed chains
  async removeHashChains() {
    log.step('⛓️ Removing hash chain files...');

    // Look for files with multiple hash patterns
    const chainPatterns = [
      `${this.jsDir}/*-*-*-*-*-*.js`, // 5+ hashes
      `${this.jsDir}/*-*-*-*-*.js`, // 4+ hashes
      `${this.jsDir}/*-*-*-*.js`, // 3+ hashes
    ];

    for (const pattern of chainPatterns) {
      const files = await glob(pattern);

      for (const file of files) {
        const filename = path.basename(file);

        // Skip if it's a simple legitimate hash (like just one hash)
        const hashSegments = filename
          .replace('.js', '')
          .split('-')
          .filter(part => /^[A-Za-z0-9_]{6,}$/.test(part));

        if (hashSegments.length >= 3) {
          // Multiple hash segments
          await fs.remove(file);

          // Remove corresponding map file
          const mapFile = `${file}.map`;
          if (await fs.pathExists(mapFile)) {
            await fs.remove(mapFile);
          }

          this.deletedCount++;
          log.warning(`Removed hash chain: ${filename}`);
        }
      }
    }
  }

  // Keep only essential files - remove redundant hashed versions
  async keepOnlyEssential() {
    log.step('✨ Keeping only essential files...');

    // Files that should always be kept (no hash versions)
    const essentialFiles = [
      'adminAnalytics.js',
      'adminDashboard.js',
      'advancedAnalytics.js',
      'advancedMetrics.js',
      'ai-chat-interface.js',
      'ai-game-tracker.js',
      'analyticsDashboard.js',
      'analyticsLogger.js',
      'coachAnalytics.js',
      'coachChat.js',
      'coachDashboard.js',
      'compression.js',
      'dashboardManager.js',
      'demoMode.js',
      'dev-env.js',
      'fanDashboard.js',
      'firebaseAuth.js',
      'game-grade.js',
      'image-optimization.js',
      'live-coaching.js',
      'messagingSystem.js',
      'notifyAdmin.js',
      'player2kRating.js',
      'playerCharts.js',
      'playerComparison.js',
      'playerDashboard.js',
      'publicPlayer.js',
      'scoutDashboard.js',
      'searchEngine.js',
      'sw-manager.js',
      'teamCharts.js',
      'winLossChart.js',
    ];

    const allFiles = await glob(`${this.jsDir}/*.js`);

    for (const file of allFiles) {
      const filename = path.basename(file);
      const baseName = filename.replace('.js', '').split('-')[0];

      // If this is a hashed version of an essential file, check if non-hashed exists
      if (
        essentialFiles.includes(`${baseName}.js`) &&
        filename !== `${baseName}.js`
      ) {
        const nonHashedVersion = path.join(this.jsDir, `${baseName}.js`);

        if (await fs.pathExists(nonHashedVersion)) {
          await fs.remove(file);

          const mapFile = `${file}.map`;
          if (await fs.pathExists(mapFile)) {
            await fs.remove(mapFile);
          }

          this.deletedCount++;
          log.warning(
            `Removed redundant: ${filename} (keeping ${baseName}.js)`
          );
        }
      }
    }
  }

  // Remove all source maps if not needed
  async removeAllSourceMaps() {
    log.step('🗺️ Removing all source map files...');

    const mapFiles = await glob(`${this.jsDir}/*.js.map`);

    for (const mapFile of mapFiles) {
      await fs.remove(mapFile);
      this.deletedCount++;
    }

    if (mapFiles.length > 0) {
      log.success(`Removed ${mapFiles.length} source map files`);
    }
  }

  // Count remaining files
  async countRemaining() {
    const jsFiles = await glob(`${this.jsDir}/*.js`);
    this.keptCount = jsFiles.length;
  }

  // Main cleanup process
  async cleanup() {
    try {
      log.step('🚀 Starting Aggressive Cleanup...');

      await this.cleanOrphanedSourceMaps();
      await this.removeHashChains();
      await this.keepOnlyEssential();
      await this.removeAllSourceMaps(); // Remove all maps for minimal files
      await this.countRemaining();

      log.step('📊 Cleanup Summary:');
      log.success(`Files remaining: ${this.keptCount}`);
      log.warning(`Files removed: ${this.deletedCount}`);
      log.success('✨ Aggressive cleanup completed!');
    } catch (error) {
      log.error(`Cleanup failed: ${error.message}`);
      throw error;
    }
  }
}

// Run cleanup
async function aggressiveCleanup() {
  const cleaner = new AggressiveCleanup();

  try {
    await cleaner.cleanup();
  } catch (error) {
    log.error(`Cleanup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  aggressiveCleanup();
}

export default aggressiveCleanup;
