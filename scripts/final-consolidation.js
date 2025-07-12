#!/usr/bin/env node

/**
 * 3 Ball Network - Final Consolidation Script
 * Solves all remaining file duplication and reference issues
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

class FinalConsolidator {
  constructor() {
    this.jsDir = 'public/assets/js';
    this.deletedCount = 0;
    this.renamedCount = 0;
    this.fixedReferences = 0;
  }

  // Extract the base functionality name from filename
  getBaseName(filename) {
    const nameWithoutExt = filename.replace('.js', '');

    // Remove hash patterns to get the base name
    const parts = nameWithoutExt.split('-');
    const baseParts = [];

    for (const part of parts) {
      // Stop at hash-like patterns (8+ chars, alphanumeric)
      if (/^[A-Za-z0-9_]{8,}$/.test(part) && baseParts.length > 0) {
        break;
      }
      baseParts.push(part);
    }

    return baseParts.join('-');
  }

  // Group files by functionality
  async groupFiles() {
    const files = await glob(`${this.jsDir}/*.js`);
    const groups = new Map();

    for (const filePath of files) {
      const filename = path.basename(filePath);
      const baseName = this.getBaseName(filename);

      if (!groups.has(baseName)) {
        groups.set(baseName, []);
      }

      const stats = await fs.stat(filePath);
      groups.get(baseName).push({
        filename,
        filePath,
        stats,
        size: stats.size,
      });
    }

    return groups;
  }

  // Consolidate duplicate files - keep the largest/newest
  async consolidateDuplicates() {
    log.step('🔄 Consolidating duplicate files...');

    const groups = await this.groupFiles();

    for (const [baseName, files] of groups) {
      if (files.length <= 1) {
        continue;
      }

      log.info(`Processing ${baseName}: ${files.length} files`);

      // Sort by size (largest first), then by modification time (newest first)
      files.sort((a, b) => {
        if (b.size !== a.size) {
          return b.size - a.size;
        }
        return b.stats.mtime - a.stats.mtime;
      });

      const keepFile = files[0];
      const removeFiles = files.slice(1);

      // Rename the kept file to clean name if it's hashed
      const cleanName = `${baseName}.js`;
      const cleanPath = path.join(this.jsDir, cleanName);

      if (keepFile.filename !== cleanName) {
        await fs.move(keepFile.filePath, cleanPath);
        log.success(`Renamed: ${keepFile.filename} → ${cleanName}`);
        this.renamedCount++;
      } else {
        log.success(`Keeping: ${keepFile.filename}`);
      }

      // Remove duplicates
      for (const file of removeFiles) {
        await fs.remove(file.filePath);
        log.warning(`Removed: ${file.filename}`);
        this.deletedCount++;
      }
    }
  }

  // Fix broken import references in all files
  async fixImportReferences() {
    log.step('🔧 Fixing import references...');

    const files = await glob(`${this.jsDir}/*.js`);

    for (const filePath of files) {
      let content = await fs.readFile(filePath, 'utf8');
      let modified = false;

      // Fix modulepreload imports - these are likely broken
      const modulepreloadPattern =
        /import ['"]\.\/modulepreload-polyfill-[^'"]+['"]/g;
      if (modulepreloadPattern.test(content)) {
        // Remove all modulepreload imports as they're likely broken
        content = content.replace(
          modulepreloadPattern,
          '// Removed broken modulepreload import'
        );
        modified = true;
        log.info(`Fixed modulepreload imports in: ${path.basename(filePath)}`);
      }

      // Fix other broken imports with hash patterns
      const brokenImportPattern =
        /import [^'"]*['"][^'"]*-[A-Za-z0-9_]{8,}[^'"]*['"]/g;
      const matches = content.match(brokenImportPattern);

      if (matches) {
        for (const match of matches) {
          // Extract the base name and create clean import
          const pathMatch = match.match(/['"]([^'"]+)['"]/);
          if (pathMatch) {
            const importPath = pathMatch[1];
            const filename = path.basename(importPath);
            const baseName = this.getBaseName(filename);
            const cleanImport = match.replace(filename, `${baseName}.js`);

            content = content.replace(match, cleanImport);
            modified = true;
            log.info(`Fixed import: ${filename} → ${baseName}.js`);
          }
        }
      }

      if (modified) {
        await fs.writeFile(filePath, content);
        this.fixedReferences++;
      }
    }
  }

  // Remove any remaining problematic files
  async removeProblematicFiles() {
    log.step('🗑️ Removing problematic files...');

    const files = await glob(`${this.jsDir}/*.js`);

    for (const filePath of files) {
      const filename = path.basename(filePath);

      // Remove files that are clearly still chained or problematic
      if (
        filename.includes('--') ||
        (filename.split('-').length > 3 && filename.includes('B5Qt9EMX'))
      ) {
        await fs.remove(filePath);
        log.warning(`Removed problematic: ${filename}`);
        this.deletedCount++;
      }
    }
  }

  // Create a clean file index
  async createFileIndex() {
    log.step('📝 Creating file index...');

    const files = await glob(`${this.jsDir}/*.js`);
    const filesByCategory = {
      admin: [],
      analytics: [],
      auth: [],
      dashboard: [],
      demo: [],
      player: [],
      coach: [],
      fan: [],
      scout: [],
      team: [],
      utils: [],
      other: [],
    };

    for (const filePath of files) {
      const filename = path.basename(filePath);
      const baseName = filename.replace('.js', '');

      if (baseName.includes('admin')) {
        filesByCategory.admin.push(filename);
      } else if (baseName.includes('analytics')) {
        filesByCategory.analytics.push(filename);
      } else if (baseName.includes('auth') || baseName.includes('login')) {
        filesByCategory.auth.push(filename);
      } else if (baseName.includes('dashboard')) {
        filesByCategory.dashboard.push(filename);
      } else if (baseName.includes('demo')) {
        filesByCategory.demo.push(filename);
      } else if (baseName.includes('player')) {
        filesByCategory.player.push(filename);
      } else if (baseName.includes('coach')) {
        filesByCategory.coach.push(filename);
      } else if (baseName.includes('fan')) {
        filesByCategory.fan.push(filename);
      } else if (baseName.includes('scout')) {
        filesByCategory.scout.push(filename);
      } else if (baseName.includes('team')) {
        filesByCategory.team.push(filename);
      } else if (
        baseName.includes('search') ||
        baseName.includes('compression') ||
        baseName.includes('image') ||
        baseName.includes('messaging')
      ) {
        filesByCategory.utils.push(filename);
      } else {
        filesByCategory.other.push(filename);
      }
    }

    const indexContent = `# 3 Ball Network - JavaScript File Index

Generated: ${new Date().toLocaleDateString()}

## File Organization (${files.length} total files)

${Object.entries(filesByCategory)
  .filter(([, files]) => files.length > 0)
  .map(
    ([category, files]) =>
      `### ${category.charAt(0).toUpperCase() + category.slice(1)} (${files.length} files)\n${files.map(f => `- ${f}`).join('\n')}`
  )
  .join('\n\n')}

## File Size Analysis
${await this.getFileSizeAnalysis(files)}
`;

    await fs.writeFile('FILE_INDEX.md', indexContent);
    log.success('Created FILE_INDEX.md');
  }

  async getFileSizeAnalysis(files) {
    const sizes = await Promise.all(
      files.map(async file => {
        const stats = await fs.stat(file);
        return { file: path.basename(file), size: stats.size };
      })
    );

    sizes.sort((a, b) => b.size - a.size);
    const top5 = sizes.slice(0, 5);

    return `\n**Largest Files:**\n${top5.map(f => `- ${f.file}: ${(f.size / 1024).toFixed(1)}KB`).join('\n')}`;
  }

  // Main consolidation process
  async consolidate() {
    try {
      log.step('🚀 Starting Final Consolidation...');

      await this.consolidateDuplicates();
      await this.fixImportReferences();
      await this.removeProblematicFiles();
      await this.createFileIndex();

      const finalCount = (await glob(`${this.jsDir}/*.js`)).length;

      log.step('📊 Final Consolidation Summary:');
      log.success(`Final file count: ${finalCount}`);
      log.warning(`Files deleted: ${this.deletedCount}`);
      log.info(`Files renamed: ${this.renamedCount}`);
      log.info(`Import references fixed: ${this.fixedReferences}`);
      log.success('✨ Final consolidation completed!');
    } catch (error) {
      log.error(`Consolidation failed: ${error.message}`);
      throw error;
    }
  }
}

// Run final consolidation
async function finalConsolidation() {
  const consolidator = new FinalConsolidator();

  try {
    await consolidator.consolidate();
  } catch (error) {
    log.error(`Final consolidation failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  finalConsolidation();
}

export default finalConsolidation;
