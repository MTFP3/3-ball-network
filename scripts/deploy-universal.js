#!/usr/bin/env node

/**
 * 🚀 3 Ball Network - Universal Deployment Script
 *
 * This script handles all deployment scenarios:
 * - Development with HMR
 * - Production builds with file hashing
 * - Firebase deployment
 * - Vite builds with optimization
 * - Cache busting and manifest generation
 *
 * Usage:
 *   npm run deploy:dev     # Start HMR development server
 *   npm run deploy:build   # Build for production
 *   npm run deploy:firebase # Deploy to Firebase
 *   npm run deploy:all     # Build and deploy to Firebase
 */

import { createServer, build as viteBuild } from 'vite';
import { spawn } from 'child_process';
import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs-extra';
import { globSync } from 'glob';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  projectRoot: path.resolve(__dirname, '..'),
  publicDir: path.resolve(__dirname, '../public'),
  distDir: path.resolve(__dirname, '../dist'),
  backupDir: path.resolve(__dirname, '../public-backup'),
  port: 3000,
  hmrPort: 24678,
};

// Utility functions
const log = {
  info: msg => console.log(`ℹ️  ${msg}`),
  success: msg => console.log(`✅ ${msg}`),
  error: msg => console.error(`❌ ${msg}`),
  warning: msg => console.log(`⚠️  ${msg}`),
  debug: msg => console.log(`🐛 ${msg}`),
  header: msg => console.log(`\n🚀 ${msg}\n${'-'.repeat(msg.length + 4)}`),
  step: msg => console.log(`📋 ${msg}`),
};

// Get command line arguments
const command = process.argv[2] || 'help';
const flags = process.argv.slice(3);

// Main deployment class
class DeploymentManager {
  constructor() {
    this.isVerbose = flags.includes('--verbose') || flags.includes('-v');
    this.isDryRun = flags.includes('--dry-run') || flags.includes('-d');
    this.skipBackup = flags.includes('--skip-backup');
    this.processes = [];
  }

  // Development server with HMR
  async startDevelopment() {
    log.header('Starting HMR Development Server');

    try {
      log.step('Initializing Vite development server...');

      const server = await createServer({
        configFile: path.resolve(CONFIG.projectRoot, 'vite.config.js'),
        server: {
          port: CONFIG.port,
          host: true,
          open: true,
          cors: true,
          hmr: {
            port: CONFIG.hmrPort,
            overlay: true,
          },
        },
      });

      await server.listen();

      log.success('Development server started successfully!');
      log.info(`📱 Local:   http://localhost:${CONFIG.port}`);
      log.info(`🌐 Network: http://0.0.0.0:${CONFIG.port}`);
      log.info('🔥 Hot Module Replacement is active');
      log.info('📝 CSS, JS, and HTML changes will reload automatically\n');

      // Enhanced file watching
      this.setupFileWatching(server);

      // Setup graceful shutdown
      this.setupGracefulShutdown(() => server.close());

      return server;
    } catch (error) {
      log.error(`Failed to start development server: ${error.message}`);
      process.exit(1);
    }
  }

  // Setup enhanced file watching
  setupFileWatching(server) {
    // Firebase config watcher
    const firebaseWatcher = chokidar.watch(
      [
        'firebase.json',
        'firestore.rules',
        '.firebaserc',
        'public/assets/js/firebaseConfig.js',
      ],
      {
        ignoreInitial: true,
        cwd: CONFIG.projectRoot,
      }
    );

    firebaseWatcher.on('change', filePath => {
      log.warning(`Firebase config changed: ${filePath}`);
      log.info('🔄 Triggering full reload...');
      server.ws.send({ type: 'full-reload' });
    });

    // Enhanced public directory watcher
    const publicWatcher = chokidar.watch('public/**/*', {
      ignoreInitial: true,
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
      cwd: CONFIG.projectRoot,
    });

    publicWatcher.on('change', filePath => {
      const ext = path.extname(filePath);
      const relativePath = path.relative(CONFIG.projectRoot, filePath);

      switch (ext) {
        case '.html':
          log.info(`📄 HTML updated: ${relativePath}`);
          break;
        case '.css':
          log.info(`🎨 CSS updated: ${relativePath}`);
          break;
        case '.js':
          log.info(`⚙️  JS updated: ${relativePath}`);
          break;
        default:
          log.debug(`📁 File updated: ${relativePath}`);
      }
    });

    this.processes.push(firebaseWatcher, publicWatcher);
  }

  // Production build with optimization
  async buildProduction() {
    log.header('Building for Production');

    try {
      // Clean previous builds
      log.step('Cleaning previous builds...');
      await this.cleanBuild();

      // Build with Vite
      log.step('Building with Vite...');
      await viteBuild({
        configFile: path.resolve(CONFIG.projectRoot, 'vite.config.js'),
        mode: 'production',
        logLevel: this.isVerbose ? 'info' : 'warn',
      });

      log.success('Vite build completed');

      // Generate file hashes and manifest
      log.step('Generating file hashes and manifest...');
      const manifest = await this.generateManifest();

      // Update service worker
      log.step('Updating service worker...');
      await this.updateServiceWorker(manifest);

      // Copy build to public directory
      log.step('Preparing files for deployment...');
      await this.prepareBuildForDeployment();

      log.success('Production build completed successfully!');
      log.info('🔥 Build is optimized with file hashing and cache busting');
      log.info('📦 Ready for Firebase deployment\n');

      return manifest;
    } catch (error) {
      log.error(`Build failed: ${error.message}`);
      if (this.isVerbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }

  // Clean build directories
  async cleanBuild() {
    const dirsToClean = [CONFIG.distDir];

    for (const dir of dirsToClean) {
      if (await fs.pathExists(dir)) {
        await fs.remove(dir);
        log.debug(`Cleaned: ${path.relative(CONFIG.projectRoot, dir)}`);
      }
    }
  }

  // Generate file manifest with hashes
  async generateManifest() {
    const manifest = {
      buildTime: new Date().toISOString(),
      version: process.env.npm_package_version || '2.0.0',
      files: {},
      hashes: {},
    };

    const sourceDir = (await fs.pathExists(CONFIG.distDir))
      ? CONFIG.distDir
      : CONFIG.publicDir;
    const files = globSync('**/*', {
      cwd: sourceDir,
      nodir: true,
      ignore: ['**/node_modules/**', '**/.git/**', '**/build-manifest.json'],
    });

    for (const file of files) {
      const filePath = path.resolve(sourceDir, file);
      const stats = await fs.stat(filePath);
      const content = await fs.readFile(filePath);
      const hash = crypto
        .createHash('md5')
        .update(content)
        .digest('hex')
        .substring(0, 8);

      manifest.files[file] = {
        size: stats.size,
        mtime: stats.mtime.toISOString(),
        hash,
      };

      manifest.hashes[file] = hash;
    }

    // Write manifest
    const manifestPath = path.resolve(sourceDir, 'build-manifest.json');
    await fs.writeJSON(manifestPath, manifest, { spaces: 2 });

    log.debug(
      `Generated manifest with ${Object.keys(manifest.files).length} files`
    );
    return manifest;
  }

  // Update service worker with new file list
  async updateServiceWorker(manifest) {
    const swPath = path.resolve(CONFIG.publicDir, 'sw.js');

    if (await fs.pathExists(swPath)) {
      let swContent = await fs.readFile(swPath, 'utf8');

      // Extract file list for caching
      const filesToCache = Object.keys(manifest.files)
        .filter(
          file => !file.includes('sw.js') && !file.includes('manifest.json')
        )
        .map(file => `'/${file}'`);

      // Update cache list
      const cacheListRegex = /const CACHE_FILES = \[[\s\S]*?\];/;
      const newCacheList = `const CACHE_FILES = [\n  ${filesToCache.join(',\n  ')}\n];`;

      if (cacheListRegex.test(swContent)) {
        swContent = swContent.replace(cacheListRegex, newCacheList);
      } else {
        swContent = `${newCacheList}\n\n${swContent}`;
      }

      // Update cache version
      const versionRegex = /const CACHE_VERSION = ['"][^'"]*['"];/;
      const newVersion = `const CACHE_VERSION = 'v${Date.now()}';`;

      if (versionRegex.test(swContent)) {
        swContent = swContent.replace(versionRegex, newVersion);
      } else {
        swContent = `${newVersion}\n${swContent}`;
      }

      await fs.writeFile(swPath, swContent);
      log.debug('Updated service worker with new file hashes');
    }
  }

  // Prepare build for deployment
  async prepareBuildForDeployment() {
    if (await fs.pathExists(CONFIG.distDir)) {
      // Backup original public directory
      if (!this.skipBackup && (await fs.pathExists(CONFIG.publicDir))) {
        await fs.copy(CONFIG.publicDir, CONFIG.backupDir);
        log.debug('Backed up original public directory');
      }

      // Copy built files to public
      await fs.copy(CONFIG.distDir, CONFIG.publicDir);
      log.debug('Copied built files to public directory');
    }
  }

  // Deploy to Firebase
  async deployToFirebase() {
    log.header('Deploying to Firebase');

    try {
      log.step('Checking Firebase CLI...');

      // Check if Firebase CLI is available
      const firebaseCheck = spawn('firebase', ['--version'], { stdio: 'pipe' });
      await new Promise((resolve, reject) => {
        firebaseCheck.on('close', code => {
          if (code === 0) {
            resolve();
          } else {
            reject(
              new Error(
                'Firebase CLI not found. Install with: npm install -g firebase-tools'
              )
            );
          }
        });
      });

      log.step('Deploying to Firebase Hosting...');

      const deployArgs = ['deploy'];
      if (this.isVerbose) {
        deployArgs.push('--debug');
      }

      const deployment = spawn('firebase', deployArgs, {
        stdio: 'inherit',
        cwd: CONFIG.projectRoot,
      });

      await new Promise((resolve, reject) => {
        deployment.on('close', code => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Firebase deployment failed with code ${code}`));
          }
        });
      });

      log.success('Firebase deployment completed successfully!');
      log.info('🌐 Your site is now live');
    } catch (error) {
      log.error(`Firebase deployment failed: ${error.message}`);
      process.exit(1);
    }
  }

  // Full deployment pipeline
  async deployAll() {
    log.header('Full Deployment Pipeline');

    await this.buildProduction();
    await this.deployToFirebase();

    log.success('Full deployment completed successfully! 🎉');
  }

  // Setup graceful shutdown
  setupGracefulShutdown(cleanup) {
    const shutdown = async signal => {
      log.info(`\n🛑 Received ${signal}, shutting down gracefully...`);

      try {
        // Close all processes
        for (const process of this.processes) {
          if (process && typeof process.close === 'function') {
            await process.close();
          }
        }

        // Run cleanup
        if (cleanup) {
          await cleanup();
        }

        log.success('Shutdown completed');
        process.exit(0);
      } catch (error) {
        log.error(`Error during shutdown: ${error.message}`);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }

  // Show help
  showHelp() {
    console.log(`
🚀 3 Ball Network - Universal Deployment Script

Usage: node scripts/deploy-universal.js <command> [options]

Commands:
  dev, development     Start HMR development server
  build, production    Build for production with optimization
  firebase, deploy     Deploy to Firebase Hosting
  all, full           Build and deploy to Firebase
  help, --help        Show this help message

Options:
  --verbose, -v       Enable verbose logging
  --dry-run, -d       Show what would be done without executing
  --skip-backup       Skip backing up public directory

Examples:
  node scripts/deploy-universal.js dev
  node scripts/deploy-universal.js build --verbose
  node scripts/deploy-universal.js all --skip-backup
  node scripts/deploy-universal.js firebase

Environment Variables:
  NODE_ENV           Set to 'production' for production builds
  npm_package_version Used for versioning (from package.json)

🏀 Built for the 3 Ball Network - Basketball Community Platform
`);
  }
}

// Main execution
async function main() {
  const deployer = new DeploymentManager();

  try {
    switch (command) {
      case 'dev':
      case 'development':
        await deployer.startDevelopment();
        break;

      case 'build':
      case 'production':
        await deployer.buildProduction();
        break;

      case 'firebase':
      case 'deploy':
        await deployer.deployToFirebase();
        break;

      case 'all':
      case 'full':
        await deployer.deployAll();
        break;

      case 'help':
      case '--help':
      case '-h':
      default:
        deployer.showHelp();
        break;
    }
  } catch (error) {
    log.error(`Deployment failed: ${error.message}`);
    if (deployer.isVerbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Handle unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  log.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

// Start the deployment process
main();
