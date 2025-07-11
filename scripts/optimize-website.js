#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * 🚀 Comprehensive Website Optimization Script
 * Optimizes 3 Ball Network for better performance, user experience, and efficiency
 */

import fs from 'fs-extra';
import path from 'path';
import { globSync } from 'glob';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const log = {
  info: msg => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: msg => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: msg =>
    console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: msg => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  header: msg => console.log(`${colors.cyan}\n🚀 ${msg}${colors.reset}`),
  step: msg => console.log(`${colors.magenta}📋 ${msg}${colors.reset}`),
};

class WebsiteOptimizer {
  constructor() {
    this.publicDir = 'public';
    this.assetsDir = 'public/assets';
    this.totalSavings = 0;
    this.optimizations = [];
  }

  async runAllOptimizations() {
    log.header('3 Ball Network - Website Optimization');
    console.log('='.repeat(50));

    await this.optimizeHTML();
    await this.optimizeCSS();
    await this.optimizeImages();
    await this.optimizeJavaScript();
    await this.optimizeServiceWorker();
    await this.generateOptimizedManifest();
    await this.cleanupUnusedFiles();
    await this.reportResults();
  }

  async optimizeHTML() {
    log.step('Optimizing HTML files...');
    const htmlFiles = globSync(`${this.publicDir}/**/*.html`);
    let totalSaved = 0;

    for (const file of htmlFiles) {
      const originalSize = (await fs.stat(file)).size;
      let content = await fs.readFile(file, 'utf8');

      // Remove comments (except IE conditionals)
      content = content.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');

      // Minify HTML
      content = content.replace(/>\s+</g, '><');
      content = content.replace(/\s{2,}/g, ' ');
      content = content.replace(/^\s+/gm, '');
      content = content.replace(/\s+$/gm, '');

      // Optimize meta tags
      content = this.optimizeMetaTags(content);

      // Remove empty attributes
      content = content.replace(/\s+\w+=""/g, '');

      await fs.writeFile(file, content);

      const newSize = (await fs.stat(file)).size;
      const saved = originalSize - newSize;
      totalSaved += saved;
    }

    this.totalSavings += totalSaved;
    this.optimizations.push({
      type: 'HTML',
      files: htmlFiles.length,
      saved: totalSaved,
    });

    log.success(
      `HTML: ${htmlFiles.length} files optimized, ${(totalSaved / 1024).toFixed(1)}KB saved`
    );
  }

  optimizeMetaTags(content) {
    // Add performance hints
    const performanceHints = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://www.gstatic.com">
    <link rel="dns-prefetch" href="https://firebaseapp.com">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <meta name="format-detection" content="telephone=no">
    `;

    // Insert after <head> tag
    content = content.replace(/<head>/i, `<head>${performanceHints}`);

    return content;
  }

  async optimizeCSS() {
    log.step('Optimizing CSS files...');
    const cssFiles = globSync(`${this.assetsDir}/css/**/*.css`);
    let totalSaved = 0;

    for (const file of cssFiles) {
      if (file.includes('.min.')) {
        continue;
      } // Skip already minified files

      const originalSize = (await fs.stat(file)).size;
      let content = await fs.readFile(file, 'utf8');

      // Remove comments
      content = content.replace(/\/\*[\s\S]*?\*\//g, '');

      // Remove extra whitespace
      content = content.replace(/\s{2,}/g, ' ');
      content = content.replace(/;\s+}/g, '}');
      content = content.replace(/{\s+/g, '{');
      content = content.replace(/}\s+/g, '}');
      content = content.replace(/:\s+/g, ':');
      content = content.replace(/;\s+/g, ';');

      // Optimize values
      content = content.replace(/0\.(\d+)/g, '.$1'); // 0.5 -> .5
      content = content.replace(/\s*0px/g, '0'); // 0px -> 0
      content = content.replace(/:0 0 0 0/g, ':0'); // Shorthand
      content = content.replace(/;\s*}/g, '}'); // Remove last semicolon

      await fs.writeFile(file, content);

      const newSize = (await fs.stat(file)).size;
      const saved = originalSize - newSize;
      totalSaved += saved;
    }

    this.totalSavings += totalSaved;
    this.optimizations.push({
      type: 'CSS',
      files: cssFiles.length,
      saved: totalSaved,
    });

    log.success(
      `CSS: ${cssFiles.length} files optimized, ${(totalSaved / 1024).toFixed(1)}KB saved`
    );
  }

  async optimizeImages() {
    log.step('Analyzing images...');
    const imageFiles = globSync(
      `${this.assetsDir}/**/*.{png,jpg,jpeg,gif,svg}`
    );
    let totalSize = 0;

    for (const file of imageFiles) {
      const size = (await fs.stat(file)).size;
      totalSize += size;

      if (size > 100 * 1024) {
        // Files larger than 100KB
        log.warning(
          `Large image found: ${file} (${(size / 1024).toFixed(1)}KB)`
        );
      }
    }

    this.optimizations.push({
      type: 'Images',
      files: imageFiles.length,
      totalSize,
    });

    log.info(
      `Images: ${imageFiles.length} files analyzed, ${(totalSize / 1024).toFixed(1)}KB total`
    );
  }

  async optimizeJavaScript() {
    log.step('Optimizing JavaScript files...');
    const jsFiles = globSync(`${this.assetsDir}/js/**/*.js`).filter(
      f => !f.includes('.min.') && !f.includes('.map')
    );
    let totalSaved = 0;

    for (const file of jsFiles) {
      const originalSize = (await fs.stat(file)).size;
      let content = await fs.readFile(file, 'utf8');

      // Remove comments (but keep copyright notices)
      content = content.replace(/\/\*(?![\s\S]*?@license)[\s\S]*?\*\//g, '');
      content = content.replace(/\/\/.*$/gm, '');

      // Remove extra whitespace
      content = content.replace(/\s{2,}/g, ' ');
      content = content.replace(/;\s+/g, ';');
      content = content.replace(/{\s+/g, '{');
      content = content.replace(/}\s+/g, '}');

      await fs.writeFile(file, content);

      const newSize = (await fs.stat(file)).size;
      const saved = originalSize - newSize;
      totalSaved += saved;
    }

    this.totalSavings += totalSaved;
    this.optimizations.push({
      type: 'JavaScript',
      files: jsFiles.length,
      saved: totalSaved,
    });

    log.success(
      `JavaScript: ${jsFiles.length} files optimized, ${(totalSaved / 1024).toFixed(1)}KB saved`
    );
  }

  async optimizeServiceWorker() {
    log.step('Optimizing Service Worker...');
    const swPath = path.join(this.publicDir, 'sw.js');

    if (await fs.pathExists(swPath)) {
      const originalSize = (await fs.stat(swPath)).size;
      let content = await fs.readFile(swPath, 'utf8');

      // Remove duplicate entries
      const lines = content.split('\n');
      const uniqueLines = [...new Set(lines)];
      content = uniqueLines.join('\n');

      // Optimize cache strategy
      content = this.optimizeCacheStrategy(content);

      await fs.writeFile(swPath, content);

      const newSize = (await fs.stat(swPath)).size;
      const saved = originalSize - newSize;
      this.totalSavings += saved;

      log.success(
        `Service Worker optimized, ${(saved / 1024).toFixed(1)}KB saved`
      );
    }
  }

  optimizeCacheStrategy(content) {
    // Add efficient cache strategies
    const cacheStrategy = `
// Enhanced caching strategy
const CACHE_STRATEGIES = {
  static: 'CacheFirst',
  dynamic: 'NetworkFirst',
  images: 'CacheFirst',
  api: 'NetworkFirst'
};

// Cache timeout for different content types
const CACHE_TIMEOUTS = {
  static: 86400000, // 24 hours
  dynamic: 3600000, // 1 hour
  images: 604800000, // 7 days
  api: 300000 // 5 minutes
};
`;

    // Insert cache strategy before fetch event
    content = content.replace(
      /self\.addEventListener\('fetch'/,
      `${cacheStrategy}\nself.addEventListener('fetch'`
    );

    return content;
  }

  async generateOptimizedManifest() {
    log.step('Generating optimized manifest...');
    const manifestPath = path.join(this.publicDir, 'manifest.json');

    if (await fs.pathExists(manifestPath)) {
      const manifest = await fs.readJSON(manifestPath);

      // Optimize manifest
      manifest.display = 'standalone';
      manifest.start_url = '/';
      manifest.scope = '/';
      manifest.orientation = 'any';

      // Add performance hints
      manifest.prefer_related_applications = false;
      manifest.background_sync = ['game-data'];
      manifest.categories = ['sports', 'social', 'entertainment'];

      await fs.writeJSON(manifestPath, manifest, { spaces: 2 });
      log.success('PWA manifest optimized');
    }
  }

  async cleanupUnusedFiles() {
    log.step('Cleaning up unused files...');
    const patterns = [
      '**/*.log',
      '**/*.tmp',
      '**/*.bak',
      '**/*~',
      '**/.DS_Store',
      '**/Thumbs.db',
      '**/*.orig',
    ];

    let cleaned = 0;
    for (const pattern of patterns) {
      const files = globSync(pattern, { cwd: this.publicDir });
      for (const file of files) {
        const fullPath = path.join(this.publicDir, file);
        await fs.remove(fullPath);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      log.success(`Cleaned ${cleaned} unused files`);
    }
  }

  async reportResults() {
    log.header('Optimization Results');
    console.log('='.repeat(50));

    this.optimizations.forEach(opt => {
      if (opt.saved !== undefined) {
        console.log(
          `${colors.green}✅ ${opt.type}:${colors.reset} ${opt.files} files, ${(opt.saved / 1024).toFixed(1)}KB saved`
        );
      } else if (opt.totalSize !== undefined) {
        console.log(
          `${colors.blue}📊 ${opt.type}:${colors.reset} ${opt.files} files, ${(opt.totalSize / 1024).toFixed(1)}KB total`
        );
      }
    });

    console.log(
      `\n${colors.cyan}💾 Total savings: ${(this.totalSavings / 1024).toFixed(1)}KB${colors.reset}`
    );

    if (this.totalSavings > 50 * 1024) {
      log.success(
        '🚀 Excellent! Website should load significantly faster now.'
      );
    } else if (this.totalSavings > 10 * 1024) {
      log.success('✅ Good improvement! Users will notice faster loading.');
    } else {
      log.info('📈 Modest improvement. Consider further optimizations.');
    }

    // Generate recommendations
    console.log(`\n${colors.cyan}📋 Recommendations:${colors.reset}`);
    console.log('   1. Implement image lazy loading');
    console.log('   2. Add resource hints (preload, prefetch)');
    console.log('   3. Enable gzip compression on server');
    console.log('   4. Consider using a CDN for assets');
    console.log('   5. Implement code splitting for JavaScript');
    console.log('   6. Add performance monitoring');
    console.log('   7. Consider WebP image format');
    console.log('   8. Implement critical CSS inlining');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const optimizer = new WebsiteOptimizer();
  optimizer.runAllOptimizations().catch(console.error);
}

export default WebsiteOptimizer;
