#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * 3 Ball Network - Asset Consolidation Script
 * Removes duplicate hashed files and keeps only the latest versions
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

class AssetConsolidator {
  constructor() {
    this.jsDir = 'public/assets/js';
    this.deletedFiles = [];
    this.keptFiles = [];
  }

  // Extract base name from hashed filename
  extractBaseName(filename) {
    // Remove .js extension first
    const nameWithoutExt = filename.replace(/\.js$/, '');

    // Split by hashes and take the first part
    const parts = nameWithoutExt.split('-');
    if (parts.length === 1) {
      return parts[0]; // No hash
    }

    // For files like "analytics-B7XR8O1t" or "modulepreload-polyfill-B5Qt9EMX"
    // Keep the meaningful name parts before the hash
    const hashPattern = /^[A-Za-z0-9_]{8,}$/;
    const meaningfulParts = [];

    for (const part of parts) {
      if (hashPattern.test(part) && meaningfulParts.length > 0) {
        break; // Stop at first hash-like part
      }
      meaningfulParts.push(part);
    }

    return meaningfulParts.join('-') || parts[0];
  }

  // Get file stats for comparison
  async getFileStats(filePath) {
    const stats = await fs.stat(filePath);
    return {
      mtime: stats.mtime,
      size: stats.size,
      path: filePath,
    };
  }

  // Group files by base name
  async groupFilesByBaseName() {
    const jsFiles = await glob(`${this.jsDir}/*.js`);
    const groups = new Map();

    for (const filePath of jsFiles) {
      const filename = path.basename(filePath);
      const baseName = this.extractBaseName(filename);

      if (!groups.has(baseName)) {
        groups.set(baseName, []);
      }

      const stats = await this.getFileStats(filePath);
      groups.get(baseName).push({
        filename,
        filePath,
        stats,
      });
    }

    return groups;
  }

  // Keep the newest file and remove duplicates
  async consolidateGroup(groupName, files) {
    if (files.length <= 1) {
      this.keptFiles.push(...files.map(f => f.filename));
      return; // No duplicates
    }

    log.info(`Processing group: ${groupName} (${files.length} files)`);

    // Sort by modification time (newest first)
    files.sort((a, b) => b.stats.mtime - a.stats.mtime);

    // Keep the newest file
    const keepFile = files[0];
    const removeFiles = files.slice(1);

    this.keptFiles.push(keepFile.filename);
    log.success(`  ✓ Keeping: ${keepFile.filename}`);

    // Remove older duplicates
    for (const file of removeFiles) {
      try {
        await fs.remove(file.filePath);

        // Also remove corresponding .map file if it exists
        const mapFile = `${file.filePath}.map`;
        if (await fs.pathExists(mapFile)) {
          await fs.remove(mapFile);
        }

        this.deletedFiles.push(file.filename);
        log.warning(`  ✗ Removed: ${file.filename}`);
      } catch (error) {
        log.error(`  Failed to remove ${file.filename}: ${error.message}`);
      }
    }
  }

  // Main consolidation process
  async consolidate() {
    try {
      log.step('🔍 Analyzing JavaScript files...');

      if (!(await fs.pathExists(this.jsDir))) {
        log.warning('JavaScript directory not found');
        return;
      }

      const fileGroups = await this.groupFilesByBaseName();
      log.info(`Found ${fileGroups.size} file groups`);

      log.step('🧹 Consolidating duplicate files...');

      for (const [groupName, files] of fileGroups) {
        await this.consolidateGroup(groupName, files);
      }

      // Summary
      log.step('📊 Consolidation Summary:');
      log.success(`Files kept: ${this.keptFiles.length}`);
      log.warning(`Files removed: ${this.deletedFiles.length}`);

      if (this.deletedFiles.length > 0) {
        log.info('Removed files:');
        this.deletedFiles.forEach(file => {
          console.log(`  - ${file}`);
        });
      }

      log.success('✨ Asset consolidation completed!');
    } catch (error) {
      log.error(`Consolidation failed: ${error.message}`);
      throw error;
    }
  }

  // Clean up modulepreload polyfill chains
  async cleanModulepreloadChains() {
    log.step('🔧 Cleaning modulepreload polyfill chains...');

    const modulepreloadFiles = await glob(
      `${this.jsDir}/modulepreload-polyfill-*.js`
    );

    if (modulepreloadFiles.length <= 1) {
      return;
    }

    // Keep only the shortest named file (least chained)
    const sortedFiles = modulepreloadFiles.sort((a, b) => a.length - b.length);
    const keepFile = sortedFiles[0];
    const removeFiles = sortedFiles.slice(1);

    log.success(`Keeping: ${path.basename(keepFile)}`);

    for (const file of removeFiles) {
      try {
        await fs.remove(file);
        const mapFile = `${file}.map`;
        if (await fs.pathExists(mapFile)) {
          await fs.remove(mapFile);
        }
        log.warning(`Removed: ${path.basename(file)}`);
      } catch (error) {
        log.error(`Failed to remove ${file}: ${error.message}`);
      }
    }
  }
}

// Enhanced clean script
async function enhancedClean() {
  const consolidator = new AssetConsolidator();

  try {
    await consolidator.consolidate();
    await consolidator.cleanModulepreloadChains();
  } catch (error) {
    log.error(`Consolidation failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  enhancedClean();
}

export default enhancedClean;
