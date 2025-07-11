#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * 3 Ball Network - Build with File Hashing
 * Generates content-based hashes for static assets and updates references
 */

import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import { glob } from 'glob';
import { execSync } from 'child_process';

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

class FileHashBuilder {
  constructor() {
    this.publicDir = 'public';
    this.distDir = 'dist';
    this.hashMap = new Map();
    this.hashLength = 8;
  }

  // Generate hash from file content
  generateHash(content) {
    return crypto
      .createHash('md5')
      .update(content)
      .digest('hex')
      .substring(0, this.hashLength);
  }

  // Get hashed filename
  getHashedFilename(originalPath, hash) {
    const ext = path.extname(originalPath);
    const basename = path.basename(originalPath, ext);
    const dirname = path.dirname(originalPath);
    return path.join(dirname, `${basename}.${hash}${ext}`);
  }

  // Clean previous build
  async cleanBuild() {
    log.step('Cleaning previous build...');
    try {
      await fs.remove(this.distDir);
      await fs.ensureDir(this.distDir);
      log.success('Build directory cleaned');
    } catch (error) {
      log.error(`Failed to clean build: ${error.message}`);
      throw error;
    }
  }

  // Copy public directory to dist
  async copyPublicToDist() {
    log.step('Copying files to dist directory...');
    try {
      await fs.copy(this.publicDir, this.distDir);
      log.success('Files copied successfully');
    } catch (error) {
      log.error(`Failed to copy files: ${error.message}`);
      throw error;
    }
  }

  // Build CSS with PostCSS
  async buildCSS() {
    log.step('Building CSS assets...');
    try {
      execSync('npm run build:css', { stdio: 'inherit' });
      log.success('CSS built successfully');
    } catch (error) {
      log.error(`CSS build failed: ${error.message}`);
      throw error;
    }
  }

  // Hash static assets
  async hashAssets() {
    log.step('Hashing static assets...');

    const assetPatterns = [
      `${this.distDir}/assets/css/*.css`,
      `${this.distDir}/assets/js/*.js`,
      `${this.distDir}/assets/images/*`,
      `${this.distDir}/*.png`,
      `${this.distDir}/*.jpg`,
      `${this.distDir}/*.jpeg`,
      `${this.distDir}/*.svg`,
      `${this.distDir}/*.ico`,
    ];

    for (const pattern of assetPatterns) {
      const files = await glob(pattern);

      for (const filePath of files) {
        try {
          const content = await fs.readFile(filePath);
          const hash = this.generateHash(content);
          const relativePath = path.relative(this.distDir, filePath);
          const hashedPath = this.getHashedFilename(relativePath, hash);
          const hashedFullPath = path.join(this.distDir, hashedPath);

          // Copy file with hashed name
          await fs.copy(filePath, hashedFullPath);

          // Store mapping for reference updates
          this.hashMap.set(relativePath, hashedPath);

          log.info(`Hashed: ${relativePath} → ${hashedPath}`);
        } catch (error) {
          log.warning(`Failed to hash ${filePath}: ${error.message}`);
        }
      }
    }

    log.success(`Hashed ${this.hashMap.size} assets`);
  }

  // Update file references in HTML files
  async updateReferences() {
    log.step('Updating asset references in HTML files...');

    const htmlFiles = await glob(`${this.distDir}/**/*.html`);
    let updatedFiles = 0;

    for (const htmlFile of htmlFiles) {
      try {
        let content = await fs.readFile(htmlFile, 'utf8');
        let hasChanges = false;

        // Update each hashed asset reference
        for (const [originalPath, hashedPath] of this.hashMap.entries()) {
          const originalRef = `/${originalPath}`;
          const hashedRef = `/${hashedPath}`;

          if (content.includes(originalRef)) {
            content = content.replace(
              new RegExp(
                originalRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                'g'
              ),
              hashedRef
            );
            hasChanges = true;
          }
        }

        if (hasChanges) {
          await fs.writeFile(htmlFile, content);
          updatedFiles++;
          log.info(
            `Updated references in: ${path.relative(this.distDir, htmlFile)}`
          );
        }
      } catch (error) {
        log.warning(`Failed to update ${htmlFile}: ${error.message}`);
      }
    }

    log.success(`Updated references in ${updatedFiles} HTML files`);
  }

  // Remove original (unhashed) files
  async removeOriginalFiles() {
    log.step('Removing original unhashed files...');

    let removedCount = 0;
    for (const originalPath of this.hashMap.keys()) {
      const fullPath = path.join(this.distDir, originalPath);
      try {
        await fs.remove(fullPath);
        removedCount++;
      } catch (error) {
        log.warning(`Failed to remove ${fullPath}: ${error.message}`);
      }
    }

    log.success(`Removed ${removedCount} original files`);
  }

  // Generate asset manifest
  async generateManifest() {
    log.step('Generating asset manifest...');

    const manifest = {};
    for (const [original, hashed] of this.hashMap.entries()) {
      manifest[original] = hashed;
    }

    const manifestPath = path.join(this.distDir, 'asset-manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    log.success(`Asset manifest generated: ${manifest.size} entries`);
  }

  // Update service worker with new file paths
  async updateServiceWorker() {
    log.step('Updating service worker...');

    const swPath = path.join(this.distDir, 'sw.js');

    if (await fs.pathExists(swPath)) {
      try {
        let swContent = await fs.readFile(swPath, 'utf8');

        // Update cached file references
        for (const [originalPath, hashedPath] of this.hashMap.entries()) {
          const originalRef = `/${originalPath}`;
          const hashedRef = `/${hashedPath}`;
          swContent = swContent.replace(
            new RegExp(originalRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            hashedRef
          );
        }

        await fs.writeFile(swPath, swContent);
        log.success('Service worker updated with hashed asset paths');
      } catch (error) {
        log.warning(`Failed to update service worker: ${error.message}`);
      }
    } else {
      log.info('No service worker found to update');
    }
  }

  // Main build process
  async build() {
    try {
      log.info('🚀 Starting build with file hashing...');
      const startTime = Date.now();

      await this.cleanBuild();
      await this.copyPublicToDist();
      await this.buildCSS();
      await this.hashAssets();
      await this.updateReferences();
      await this.updateServiceWorker();
      await this.removeOriginalFiles();
      await this.generateManifest();

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      log.success(`🎉 Build completed successfully in ${duration}s`);
      log.info(`📦 Generated ${this.hashMap.size} hashed assets`);
      log.info(`📁 Build output: ${this.distDir}/`);
    } catch (error) {
      log.error(`Build failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// Run the build if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const builder = new FileHashBuilder();
  builder.build();
}

export default FileHashBuilder;
