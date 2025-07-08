#!/usr/bin/env node

/**
 * 3 Ball Network - Simple Build System
 * Clean, fast build without broken file hashing
 */

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.dirname(__dirname);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  info: msg => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: msg => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: msg =>
    console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: msg => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  step: msg => console.log(`${colors.magenta}[STEP]${colors.reset} ${msg}`),
};

class SimpleBuildSystem {
  constructor() {
    this.publicDir = path.join(projectRoot, 'public');
    this.distDir = path.join(projectRoot, 'dist');
  }

  // Clean build directory
  async clean() {
    log.step('Cleaning build directory...');
    try {
      await fs.remove(this.distDir);
      await fs.ensureDir(this.distDir);
      log.success('Build directory cleaned');
    } catch (error) {
      log.error(`Failed to clean build: ${error.message}`);
      throw error;
    }
  }

  // Copy all files from public to dist
  async copyFiles() {
    log.step('Copying files to dist directory...');
    try {
      await fs.copy(this.publicDir, this.distDir);
      log.success('Files copied successfully');
    } catch (error) {
      log.error(`Failed to copy files: ${error.message}`);
      throw error;
    }
  }

  // Build CSS (if needed)
  async buildCSS() {
    log.step('Building CSS assets...');
    try {
      // Only build CSS if there are source files
      const cssExists = await fs.pathExists(
        path.join(projectRoot, 'src', 'styles')
      );
      if (cssExists) {
        execSync('npm run build:css', { stdio: 'inherit', cwd: projectRoot });
        log.success('CSS built successfully');
      } else {
        log.info('No CSS source files found, skipping CSS build');
      }
    } catch (error) {
      log.warning(`CSS build failed: ${error.message}`);
      // Don't throw error, continue with build
    }
  }

  // Optimize images (basic)
  async optimizeImages() {
    log.step('Optimizing images...');
    try {
      const imageDir = path.join(this.distDir, 'assets', 'images');
      if (await fs.pathExists(imageDir)) {
        // Basic optimization could be added here
        log.info(
          'Image optimization skipped (no optimization tools configured)'
        );
      }
    } catch (error) {
      log.warning(`Image optimization failed: ${error.message}`);
    }
  }

  // Generate manifest
  async generateManifest() {
    log.step('Generating build manifest...');
    try {
      const manifest = {
        buildTime: new Date().toISOString(),
        version: '1.0.0',
        buildType: 'simple',
        notes: 'Clean build without file hashing for better performance',
      };

      await fs.writeFile(
        path.join(this.distDir, 'build-manifest.json'),
        JSON.stringify(manifest, null, 2)
      );

      log.success('Build manifest generated');
    } catch (error) {
      log.warning(`Failed to generate manifest: ${error.message}`);
    }
  }

  // Main build process
  async build() {
    const startTime = Date.now();

    log.info('🚀 Starting Simple Build Process');
    log.info('================================');

    try {
      await this.clean();
      await this.copyFiles();
      await this.buildCSS();
      await this.optimizeImages();
      await this.generateManifest();

      const buildTime = ((Date.now() - startTime) / 1000).toFixed(2);
      log.success(`✅ Build completed successfully in ${buildTime}s`);
      log.info(`📦 Output directory: ${this.distDir}`);
    } catch (error) {
      log.error(`❌ Build failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// Run build if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const builder = new SimpleBuildSystem();
  builder.build();
}

export default SimpleBuildSystem;
