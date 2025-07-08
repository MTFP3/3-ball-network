#!/usr/bin/env node

/**
 * Optimize all HTML files for better performance
 */

import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
};

const log = {
  info: msg => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: msg => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: msg =>
    console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
};

class BulkHtmlOptimizer {
  constructor() {
    this.publicDir = 'public';
    this.totalOriginalSize = 0;
    this.totalOptimizedSize = 0;
    this.processedFiles = 0;
  }

  async optimizeAllHtmlFiles() {
    log.info('🚀 Optimizing all HTML files for faster loading...');

    const htmlFiles = await glob(`${this.publicDir}/**/*.html`);

    for (const filePath of htmlFiles) {
      await this.optimizeFile(filePath);
    }

    await this.reportTotalOptimization();
  }

  async optimizeFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const originalSize = content.length;

      // Skip if file is already small
      if (originalSize < 50000) {
        // 50KB
        return;
      }

      this.totalOriginalSize += originalSize;

      let optimizedContent = content;

      // Extract inline CSS if it's large
      const styleRegex = /<style>([\s\S]*?)<\/style>/;
      const styleMatch = content.match(styleRegex);

      if (styleMatch && styleMatch[1].length > 5000) {
        // 5KB+
        const cssContent = styleMatch[1].trim();
        const fileName = path.basename(filePath, '.html');
        const cssPath = path.join(
          this.publicDir,
          'assets',
          'css',
          `${fileName}.css`
        );

        await fs.ensureDir(path.dirname(cssPath));
        await fs.writeFile(cssPath, cssContent);

        optimizedContent = content.replace(
          styleRegex,
          `<link rel="stylesheet" href="/assets/css/${fileName}.css">`
        );
      }

      // Optimize inline styles
      optimizedContent = this.optimizeInlineStyles(optimizedContent);

      // Remove excessive whitespace
      optimizedContent = this.minifyHtml(optimizedContent);

      await fs.writeFile(filePath, optimizedContent);

      const optimizedSize = optimizedContent.length;
      this.totalOptimizedSize += optimizedSize;
      this.processedFiles++;

      const reduction = originalSize - optimizedSize;
      const percentage = ((reduction / originalSize) * 100).toFixed(1);

      if (percentage > 5) {
        log.success(
          `Optimized ${path.relative(this.publicDir, filePath)}: ${(reduction / 1024).toFixed(1)}KB (${percentage}%) saved`
        );
      }
    } catch (error) {
      log.warning(`Failed to optimize ${filePath}: ${error.message}`);
    }
  }

  optimizeInlineStyles(content) {
    // Remove excessive whitespace in style attributes
    content = content.replace(/style="\s+/g, 'style="');
    content = content.replace(/;\s+"/g, ';"');
    content = content.replace(/:\s+/g, ':');

    // Compress common CSS values
    content = content.replace(/0\.(\d+)/g, '.$1'); // 0.5 -> .5
    content = content.replace(/\s*;\s*}/g, '}'); // Remove last semicolon

    return content;
  }

  minifyHtml(content) {
    // Remove comments (but keep conditional comments)
    content = content.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');

    // Remove excessive whitespace between tags
    content = content.replace(/>\s+</g, '><');

    // Remove whitespace at the beginning and end of lines
    content = content.replace(/^\s+/gm, '');
    content = content.replace(/\s+$/gm, '');

    // Collapse multiple spaces into single space
    content = content.replace(/\s{2,}/g, ' ');

    return content;
  }

  async reportTotalOptimization() {
    const totalReduction = this.totalOriginalSize - this.totalOptimizedSize;
    const percentage =
      this.totalOriginalSize > 0
        ? ((totalReduction / this.totalOriginalSize) * 100).toFixed(1)
        : 0;

    log.success('📊 Total Optimization Results:');
    log.info(`   Files processed: ${this.processedFiles}`);
    log.info(
      `   Original total: ${(this.totalOriginalSize / 1024).toFixed(1)}KB`
    );
    log.info(
      `   Optimized total: ${(this.totalOptimizedSize / 1024).toFixed(1)}KB`
    );
    log.success(
      `   Total reduction: ${(totalReduction / 1024).toFixed(1)}KB (${percentage}%)`
    );

    if (percentage > 15) {
      log.success(
        '🚀 Excellent! Website should load significantly faster now.'
      );
    } else if (percentage > 5) {
      log.success('✅ Good improvement! Users will notice faster loading.');
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const optimizer = new BulkHtmlOptimizer();
  optimizer.optimizeAllHtmlFiles().catch(console.error);
}

export default BulkHtmlOptimizer;
