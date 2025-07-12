#!/usr/bin/env node

/**
 * 3 Ball Network - Ultra Consolidation
 * Aggressively reduces files to absolute minimum
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

class UltraConsolidator {
  constructor() {
    this.jsDir = 'public/assets/js';
    this.deletedCount = 0;
    this.keptCount = 0;

    // Define which files we ACTUALLY need (core functionality only)
    this.essentialFiles = {
      // Core functionality files (keep only one of each type)
      admin: 'admin.js',
      analytics: 'analytics.js',
      auth: 'auth.js',
      player: 'player.js',
      coach: 'coach.js',
      fan: 'fan.js',
      scout: 'scout.js',
      team: 'team.js',
      search: 'search.js',
      dashboard: 'dashboard.js',

      // Keep essential utility files as-is
      keep_as_is: [
        'firebaseAuth.js',
        'analyticsDashboard.js',
        'adminAnalytics.js',
        'adminDashboard.js',
        'coachAnalytics.js',
        'coachDashboard.js',
        'playerCharts.js',
        'teamCharts.js',
        'searchEngine.js',
        'compression.js',
        'game-grade.js',
        'ai-chat-interface.js',
        'ai-game-tracker.js',
        'live-coaching.js',
        'winLossChart.js',
      ],
    };
  }

  // Get category for a file
  getFileCategory(filename) {
    const name = filename.toLowerCase().replace('.js', '');

    if (
      name.includes('admin') &&
      !name.includes('analytics') &&
      !name.includes('dashboard')
    ) {
      return 'admin';
    }
    if (
      name.includes('analytics') &&
      !name.includes('admin') &&
      !name.includes('coach')
    ) {
      return 'analytics';
    }
    if (name.includes('auth') || name.includes('login')) {
      return 'auth';
    }
    if (
      name.includes('player') &&
      !name.includes('dashboard') &&
      !name.includes('chart')
    ) {
      return 'player';
    }
    if (
      name.includes('coach') &&
      !name.includes('analytics') &&
      !name.includes('dashboard')
    ) {
      return 'coach';
    }
    if (name.includes('fan') && !name.includes('dashboard')) {
      return 'fan';
    }
    if (name.includes('scout') && !name.includes('dashboard')) {
      return 'scout';
    }
    if (name.includes('team') && !name.includes('chart')) {
      return 'team';
    }
    if (name.includes('search') && !name.includes('engine')) {
      return 'search';
    }
    if (
      name.includes('dashboard') &&
      !name.includes('analytics') &&
      !name.includes('admin') &&
      !name.includes('coach')
    ) {
      return 'dashboard';
    }

    return 'keep_as_is';
  }

  // Ultra consolidate - keep only best file per category
  async ultraConsolidate() {
    log.step('⚡ Ultra Consolidation - Keeping only essential files...');

    const files = await glob(`${this.jsDir}/*.js`);
    const categories = {};

    // Group files by category
    for (const filePath of files) {
      const filename = path.basename(filePath);
      const category = this.getFileCategory(filename);

      if (!categories[category]) {
        categories[category] = [];
      }

      const stats = await fs.stat(filePath);
      categories[category].push({
        filename,
        filePath,
        size: stats.size,
        mtime: stats.mtime,
      });
    }

    // Process each category
    for (const [category, fileList] of Object.entries(categories)) {
      if (category === 'keep_as_is') {
        // Keep all essential utility files
        for (const file of fileList) {
          if (this.essentialFiles.keep_as_is.includes(file.filename)) {
            log.success(`Keeping essential: ${file.filename}`);
            this.keptCount++;
          } else {
            await fs.remove(file.filePath);
            log.warning(`Removed non-essential: ${file.filename}`);
            this.deletedCount++;
          }
        }
        continue;
      }

      if (fileList.length === 0) {
        continue;
      }

      // For duplicate categories, keep the largest/newest file and rename it
      fileList.sort((a, b) => {
        if (b.size !== a.size) {
          return b.size - a.size;
        }
        return b.mtime - a.mtime;
      });

      const bestFile = fileList[0];
      const targetName = this.essentialFiles[category];
      const targetPath = path.join(this.jsDir, targetName);

      // Rename the best file to the clean name
      if (bestFile.filename !== targetName) {
        await fs.move(bestFile.filePath, targetPath);
        log.success(`Consolidated: ${bestFile.filename} → ${targetName}`);
      } else {
        log.success(`Keeping: ${bestFile.filename}`);
      }
      this.keptCount++;

      // Remove all other files in this category
      for (let i = 1; i < fileList.length; i++) {
        await fs.remove(fileList[i].filePath);
        log.warning(`Removed duplicate: ${fileList[i].filename}`);
        this.deletedCount++;
      }
    }
  }

  // Fix imports to use clean names
  async fixImportsForCleanNames() {
    log.step('🔧 Updating imports to use clean names...');

    const files = await glob(`${this.jsDir}/*.js`);
    let fixedCount = 0;

    for (const filePath of files) {
      let content = await fs.readFile(filePath, 'utf8');
      let modified = false;

      // Map of old patterns to new clean names
      const importMappings = [
        [/admin-[A-Za-z0-9_-]+\.js/g, 'admin.js'],
        [/analytics-[A-Za-z0-9_-]+\.js/g, 'analytics.js'],
        [/player-[A-Za-z0-9_-]+\.js/g, 'player.js'],
        [/coach-[A-Za-z0-9_-]+\.js/g, 'coach.js'],
        [/fan-[A-Za-z0-9_-]+\.js/g, 'fan.js'],
        [/scout-[A-Za-z0-9_-]+\.js/g, 'scout.js'],
        [/team-[A-Za-z0-9_-]+\.js/g, 'team.js'],
        [/search-[A-Za-z0-9_-]+\.js/g, 'search.js'],
        [/login-[A-Za-z0-9_-]+\.js/g, 'auth.js'],
      ];

      for (const [pattern, replacement] of importMappings) {
        if (pattern.test(content)) {
          content = content.replace(pattern, replacement);
          modified = true;
        }
      }

      if (modified) {
        await fs.writeFile(filePath, content);
        fixedCount++;
        log.info(`Fixed imports in: ${path.basename(filePath)}`);
      }
    }

    log.success(`Fixed imports in ${fixedCount} files`);
  }

  // Create final optimized index
  async createOptimizedIndex() {
    log.step('📄 Creating optimized file index...');

    const files = await glob(`${this.jsDir}/*.js`);
    files.sort();

    const indexContent = `# 3 Ball Network - Optimized File Structure

**Total Files**: ${files.length} (Optimized from 686+)

## Core Application Files
${files
  .filter(
    f =>
      !path.basename(f).includes('Dashboard') &&
      !path.basename(f).includes('Analytics')
  )
  .map(f => `- ${path.basename(f)}`)
  .join('\n')}

## Dashboard & Analytics Files  
${files
  .filter(
    f =>
      path.basename(f).includes('Dashboard') ||
      path.basename(f).includes('Analytics')
  )
  .map(f => `- ${path.basename(f)}`)
  .join('\n')}

## Optimization Summary
- **Original Files**: 686+
- **After Cleanup**: 67  
- **Final Optimized**: ${files.length}
- **Space Saved**: ~${Math.round((1 - files.length / 686) * 100)}%

Generated: ${new Date().toLocaleString()}
`;

    await fs.writeFile('OPTIMIZED_FILE_INDEX.md', indexContent);
    log.success('Created OPTIMIZED_FILE_INDEX.md');
  }

  // Main ultra consolidation process
  async consolidate() {
    try {
      log.step('🚀 Starting Ultra Consolidation...');

      await this.ultraConsolidate();
      await this.fixImportsForCleanNames();
      await this.createOptimizedIndex();

      const finalCount = (await glob(`${this.jsDir}/*.js`)).length;

      log.step('📊 Ultra Consolidation Summary:');
      log.success(`Final optimized file count: ${finalCount}`);
      log.warning(`Files removed: ${this.deletedCount}`);
      log.info(`Files kept/renamed: ${this.keptCount}`);
      log.success('🎉 Ultra consolidation completed!');

      log.info('\n🎯 Your project now has the absolute minimum files needed!');
    } catch (error) {
      log.error(`Ultra consolidation failed: ${error.message}`);
      throw error;
    }
  }
}

// Run ultra consolidation
async function ultraConsolidation() {
  const consolidator = new UltraConsolidator();

  try {
    await consolidator.consolidate();
  } catch (error) {
    log.error(`Ultra consolidation failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  ultraConsolidation();
}

export default ultraConsolidation;
