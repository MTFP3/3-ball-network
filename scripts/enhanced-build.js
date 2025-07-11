#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * 3 Ball Network - Enhanced Build Script
 * Prevents hash chain accumulation and maintains clean builds
 */

import fs from 'fs-extra';
import { execSync } from 'child_process';
import enhancedClean from './consolidate-assets.js';

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

async function enhancedBuild() {
  try {
    log.step('🏗️ Starting Enhanced Build Process...');

    // Step 1: Clean existing builds
    log.info('1. Cleaning previous builds...');
    execSync('node scripts/clean-build.js', { stdio: 'inherit' });

    // Step 2: Consolidate any remaining duplicates
    log.info('2. Consolidating assets...');
    await enhancedClean();

    // Step 3: Run Vite build
    log.info('3. Building with Vite...');
    execSync('npx vite build', { stdio: 'inherit' });

    // Step 4: Final cleanup and optimization
    log.info('4. Final optimizations...');

    // Ensure no hash chains in the build output
    const distJs = 'dist/assets/js';
    if (await fs.pathExists(distJs)) {
      await enhancedClean(); // Clean any chains that might have formed
    }

    log.success('✨ Enhanced build completed successfully!');
  } catch (error) {
    log.error(`Build failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  enhancedBuild();
}

export default enhancedBuild;
