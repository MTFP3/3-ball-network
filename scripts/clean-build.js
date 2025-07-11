#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * 3 Ball Network - Clean Build Script
 * Removes build artifacts and hashed files
 */

import fs from 'fs-extra';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
};

const log = {
  info: msg => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: msg => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
};

async function cleanBuild() {
  try {
    log.info('🧹 Cleaning build artifacts...');

    // Remove dist directory
    if (await fs.pathExists('dist')) {
      await fs.remove('dist');
      log.success('Removed dist/ directory');
    }

    // Remove generated CSS files
    const cssFiles = [
      'public/assets/css/style.min.css',
      'public/assets/css/style.min.css.map',
    ];

    for (const file of cssFiles) {
      if (await fs.pathExists(file)) {
        await fs.remove(file);
        log.success(`Removed ${file}`);
      }
    }

    // Remove asset manifest if it exists
    if (await fs.pathExists('public/asset-manifest.json')) {
      await fs.remove('public/asset-manifest.json');
      log.success('Removed asset manifest');
    }

    // Clean up old hashed JavaScript files
    const { glob } = await import('glob');
    const jsFiles = await glob(
      'public/assets/js/*-[A-Za-z0-9_]*-[A-Za-z0-9_]*.js'
    );
    for (const file of jsFiles) {
      await fs.remove(file);
      // Also remove corresponding .map file
      const mapFile = `${file}.map`;
      if (await fs.pathExists(mapFile)) {
        await fs.remove(mapFile);
      }
    }
    if (jsFiles.length > 0) {
      log.success(`Removed ${jsFiles.length} old hashed JS files`);
    }

    log.success('✨ Build cleanup completed');
  } catch (error) {
    console.error(`❌ Clean failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanBuild();
}

export default cleanBuild;
