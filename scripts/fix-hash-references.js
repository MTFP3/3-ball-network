#!/usr/bin/env node

/**
 * Fix broken hash references in HTML files
 * Replace overly long hash chains with simple paths
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

class HashFixer {
  constructor() {
    this.publicDir = 'public';
    this.fixedFiles = 0;
  }

  async fixBrokenHashReferences() {
    log.info('🔧 Fixing broken hash references in HTML files...');

    const htmlFiles = await glob(`${this.publicDir}/**/*.html`);

    for (const filePath of htmlFiles) {
      await this.fixFileReferences(filePath);
    }

    log.success(`✅ Fixed ${this.fixedFiles} HTML files`);
  }

  async fixFileReferences(filePath) {
    try {
      let content = await fs.readFile(filePath, 'utf8');
      let hasChanges = false;

      // Fix logo references
      const logoPattern = /\/assets\/png\/logo-[C3J1yCbD-]+\.png/g;
      if (content.match(logoPattern)) {
        content = content.replace(logoPattern, '/logo.png');
        hasChanges = true;
      }

      // Fix manifest references
      const manifestPattern = /\/assets\/json\/manifest-[RduZY6E_-]+\.json/g;
      if (content.match(manifestPattern)) {
        content = content.replace(manifestPattern, '/manifest.json');
        hasChanges = true;
      }

      // Fix CSS references with long hashes
      const cssPattern = /\/assets\/css\/[a-zA-Z0-9-]+\.css/g;
      const cssMatches = content.match(cssPattern);
      if (cssMatches) {
        for (const match of cssMatches) {
          // If the hash is excessively long, replace with simple name
          if (match.length > 50) {
            const baseName = match.split('/').pop().split('-')[0];
            content = content.replace(match, `/assets/css/${baseName}.css`);
            hasChanges = true;
          }
        }
      }

      // Fix JS references with long hashes
      const jsPattern = /\/assets\/js\/[a-zA-Z0-9-]+\.js/g;
      const jsMatches = content.match(jsPattern);
      if (jsMatches) {
        for (const match of jsMatches) {
          // If the hash is excessively long, replace with simple name
          if (match.length > 50) {
            const baseName = match.split('/').pop().split('-')[0];
            content = content.replace(match, `/assets/js/${baseName}.js`);
            hasChanges = true;
          }
        }
      }

      if (hasChanges) {
        await fs.writeFile(filePath, content);
        this.fixedFiles++;
        log.info(`Fixed: ${path.relative(this.publicDir, filePath)}`);
      }
    } catch (error) {
      log.warning(`Failed to fix ${filePath}: ${error.message}`);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const fixer = new HashFixer();
  fixer.fixBrokenHashReferences();
}

export default HashFixer;
