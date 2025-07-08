#!/usr/bin/env node

/**
 * HTML Optimizer - Extract CSS and optimize file size
 */

import fs from 'fs-extra';
import path from 'path';

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

class HtmlOptimizer {
  constructor() {
    this.publicDir = 'public';
    this.originalSize = 0;
    this.optimizedSize = 0;
  }

  async optimizeIndexHtml() {
    log.info('🚀 Optimizing index.html for faster loading...');

    const indexPath = path.join(this.publicDir, 'index.html');
    const content = await fs.readFile(indexPath, 'utf8');
    this.originalSize = content.length;

    // Extract CSS between <style> and </style>
    const styleRegex = /<style>([\s\S]*?)<\/style>/;
    const styleMatch = content.match(styleRegex);

    if (styleMatch) {
      const cssContent = styleMatch[1].trim();

      // Save CSS to external file
      const cssPath = path.join(this.publicDir, 'assets', 'css', 'index.css');
      await fs.ensureDir(path.dirname(cssPath));
      await fs.writeFile(cssPath, cssContent);

      // Replace inline CSS with link
      const optimizedContent = content.replace(
        styleRegex,
        '<link rel="stylesheet" href="/assets/css/index.css">'
      );

      // Write optimized HTML
      await fs.writeFile(indexPath, optimizedContent);
      this.optimizedSize = optimizedContent.length;

      log.success(`CSS extracted to: ${cssPath}`);
      log.success(`CSS size: ${(cssContent.length / 1024).toFixed(1)}KB`);
    }

    await this.optimizeInlineStyles(indexPath);
    await this.reportOptimization();
  }

  async optimizeInlineStyles(filePath) {
    log.info('Optimizing inline styles...');

    let content = await fs.readFile(filePath, 'utf8');

    // Remove excessive whitespace in style attributes
    content = content.replace(/style="\s+/g, 'style="');
    content = content.replace(/;\s+"/g, ';"');
    content = content.replace(/:\s+/g, ':');

    // Compress common CSS values
    content = content.replace(/0\.(\d+)/g, '.$1'); // 0.5 -> .5
    content = content.replace(/\s*;\s*}/g, '}'); // Remove last semicolon in blocks

    await fs.writeFile(filePath, content);
    this.optimizedSize = content.length;
  }

  async reportOptimization() {
    const reduction = this.originalSize - this.optimizedSize;
    const percentage = ((reduction / this.originalSize) * 100).toFixed(1);

    log.success('📊 Optimization Results:');
    log.info(`   Original size: ${(this.originalSize / 1024).toFixed(1)}KB`);
    log.info(`   Optimized size: ${(this.optimizedSize / 1024).toFixed(1)}KB`);
    log.success(
      `   Reduction: ${(reduction / 1024).toFixed(1)}KB (${percentage}%)`
    );

    if (percentage > 10) {
      log.success('🚀 Significant improvement! Pages should load much faster.');
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const optimizer = new HtmlOptimizer();
  optimizer.optimizeIndexHtml().catch(console.error);
}

export default HtmlOptimizer;
