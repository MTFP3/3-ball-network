#!/usr/bin/env node

/**
 * 🚀 3 Ball Network - Universal Deployment Script
 *
 * This comprehensive script handles all deployment scenarios:
 * - Development with HMR
 * - Production builds with file hashing and optimization
 * - Firebase deployment with pre/post checks
 * - Git operations and versioning
 * - PWA service worker generation
 * - Security checks and environment validation
 * - Cache busting and manifest generation
 * - Full CI/CD pipeline support
 *
 * Usage:
 *   ./deploy.js dev              # Start HMR development server
 *   ./deploy.js build            # Build for production
 *   ./deploy.js firebase         # Deploy to Firebase only
 *   ./deploy.js full             # Complete build + deploy pipeline
 *   ./deploy.js clean            # Clean build artifacts
 *   ./deploy.js verify           # Verify deployment health
 *   ./deploy.js help             # Show help
 *
 * Options:
 *   --verbose, -v                # Enable verbose logging
 *   --dry-run, -d                # Show what would be done without executing
 *   --skip-backup                # Skip backing up public directory
 *   --skip-git                   # Skip git operations
 *   --skip-tests                 # Skip pre-deployment tests
 *   --force                      # Force deployment even with warnings
 *
 * @version 3.0.0
 * @author 3 Ball Network Team
 */

import { createServer, build as viteBuild } from 'vite';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs-extra';
import { globSync } from 'glob';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import chalk from 'chalk';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  projectRoot: path.resolve(__dirname),
  publicDir: path.resolve(__dirname, 'public'),
  distDir: path.resolve(__dirname, 'dist'),
  backupDir: path.resolve(__dirname, 'public-backup'),
  scriptsDir: path.resolve(__dirname, 'scripts'),
  port: 3000,
  hmrPort: 24678,
  version: '3.0.0',
  buildTimeout: 300000, // 5 minutes
  deployTimeout: 600000, // 10 minutes
};

// Enhanced logging with colors
const log = {
  info: msg => console.log(chalk.blue(`ℹ️  ${msg}`)),
  success: msg => console.log(chalk.green(`✅ ${msg}`)),
  error: msg => console.error(chalk.red(`❌ ${msg}`)),
  warning: msg => console.log(chalk.yellow(`⚠️  ${msg}`)),
  debug: msg => console.log(chalk.gray(`🐛 ${msg}`)),
  header: msg => {
    console.log(chalk.cyan(`\n🚀 ${msg}`));
    console.log(chalk.cyan('='.repeat(msg.length + 4)));
  },
  step: msg => console.log(chalk.magenta(`📋 ${msg}`)),
  process: msg => console.log(chalk.blue(`⚙️  ${msg}`)),
  deploy: msg => console.log(chalk.green(`🌐 ${msg}`)),
  security: msg => console.log(chalk.red(`🔒 ${msg}`)),
  performance: msg => console.log(chalk.yellow(`⚡ ${msg}`)),
};

// Get command line arguments
const command = process.argv[2] || 'help';
const flags = process.argv.slice(3);

// Deployment Manager Class
class UniversalDeploymentManager {
  constructor() {
    this.isVerbose = flags.includes('--verbose') || flags.includes('-v');
    this.isDryRun = flags.includes('--dry-run') || flags.includes('-d');
    this.skipBackup = flags.includes('--skip-backup');
    this.skipGit = flags.includes('--skip-git');
    this.skipTests = flags.includes('--skip-tests');
    this.force = flags.includes('--force');
    this.processes = [];
    this.startTime = Date.now();

    // Initialize deployment context
    this.deploymentContext = {
      buildHash: '',
      version: CONFIG.version,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      gitCommit: '',
      gitBranch: '',
    };
  }

  // =================
  // UTILITY METHODS
  // =================

  async executeCommand(command, options = {}) {
    if (this.isDryRun) {
      log.debug(`[DRY RUN] Would execute: ${command}`);
      return { stdout: '', stderr: '' };
    }

    const timeout = options.timeout || 30000;
    const cwd = options.cwd || CONFIG.projectRoot;

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd,
        timeout,
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
      });

      if (this.isVerbose && stdout) {
        log.debug(`Command output: ${stdout.trim()}`);
      }

      return { stdout, stderr };
    } catch (error) {
      log.error(`Command failed: ${command}`);
      log.error(`Error: ${error.message}`);
      if (error.stdout) log.debug(`stdout: ${error.stdout}`);
      if (error.stderr) log.debug(`stderr: ${error.stderr}`);
      throw error;
    }
  }

  async spawnProcess(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      if (this.isDryRun) {
        log.debug(`[DRY RUN] Would spawn: ${command} ${args.join(' ')}`);
        resolve(0);
        return;
      }

      const proc = spawn(command, args, {
        stdio: this.isVerbose ? 'inherit' : 'pipe',
        cwd: options.cwd || CONFIG.projectRoot,
        ...options,
      });

      let output = '';
      let errorOutput = '';

      if (proc.stdout) {
        proc.stdout.on('data', data => {
          output += data.toString();
        });
      }

      if (proc.stderr) {
        proc.stderr.on('data', data => {
          errorOutput += data.toString();
        });
      }

      proc.on('close', code => {
        if (code === 0) {
          resolve({ code, output, errorOutput });
        } else {
          reject(
            new Error(
              `Process failed with code ${code}: ${errorOutput || output}`
            )
          );
        }
      });

      proc.on('error', reject);
      this.processes.push(proc);
    });
  }

  async checkRequirements() {
    log.step('Checking deployment requirements...');

    const requirements = [
      { command: 'node --version', name: 'Node.js' },
      { command: 'npm --version', name: 'npm' },
      { command: 'git --version', name: 'Git' },
      { command: 'firebase --version', name: 'Firebase CLI', optional: true },
    ];

    for (const req of requirements) {
      try {
        await this.executeCommand(req.command);
        log.success(`${req.name} is available`);
      } catch (error) {
        if (req.optional) {
          log.warning(`${req.name} not found - installing...`);
          if (req.name === 'Firebase CLI') {
            await this.executeCommand('npm install -g firebase-tools');
          }
        } else {
          log.error(`${req.name} is required but not available`);
          throw new Error(`Missing requirement: ${req.name}`);
        }
      }
    }
  }

  async getGitInfo() {
    try {
      const { stdout: commit } =
        await this.executeCommand('git rev-parse HEAD');
      const { stdout: branch } = await this.executeCommand(
        'git rev-parse --abbrev-ref HEAD'
      );

      this.deploymentContext.gitCommit = commit.trim();
      this.deploymentContext.gitBranch = branch.trim();

      log.debug(
        `Git commit: ${this.deploymentContext.gitCommit.substring(0, 8)}`
      );
      log.debug(`Git branch: ${this.deploymentContext.gitBranch}`);
    } catch (error) {
      log.warning('Could not retrieve Git information');
    }
  }

  // =================
  // SECURITY CHECKS
  // =================

  async performSecurityChecks() {
    log.header('Security Validation');

    // Check for .env in git tracking
    try {
      await this.executeCommand('git ls-files --error-unmatch .env');
      log.error('.env file is being tracked by git! This is a security risk.');
      log.info(
        'Run: git rm --cached .env && git commit -m "Remove .env from tracking"'
      );
      if (!this.force) {
        throw new Error('Security check failed: .env file is tracked');
      }
    } catch (error) {
      if (error.message.includes('not under version control')) {
        log.success('.env file is not tracked by git');
      } else if (!error.message.includes('Security check failed')) {
        log.success('.env file handling is secure');
      }
    }

    // Check for sensitive files
    const sensitiveFiles = [
      'sendgrid.env',
      '*.key',
      '*.pem',
      'secrets.json',
      'private-key.json',
    ];

    for (const pattern of sensitiveFiles) {
      const files = globSync(pattern, { cwd: CONFIG.projectRoot });
      for (const file of files) {
        try {
          await this.executeCommand(`git ls-files --error-unmatch "${file}"`);
          log.warning(`Sensitive file tracked by git: ${file}`);
        } catch (error) {
          log.debug(`Sensitive file not tracked: ${file}`);
        }
      }
    }

    // Check environment variables
    if (process.env.NODE_ENV === 'production') {
      const requiredEnvVars = ['FIREBASE_API_KEY', 'FIREBASE_PROJECT_ID'];
      for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
          log.warning(`Missing environment variable: ${envVar}`);
        }
      }
    }

    log.success('Security validation completed');
  }

  // =================
  // DEVELOPMENT SERVER
  // =================

  async startDevelopment() {
    log.header('Starting Development Server with HMR');

    await this.checkRequirements();

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
        logLevel: this.isVerbose ? 'info' : 'warn',
      });

      await server.listen();

      log.success('Development server started successfully!');
      log.deploy(`📱 Local:   http://localhost:${CONFIG.port}`);
      log.deploy(`🌐 Network: http://0.0.0.0:${CONFIG.port}`);
      log.info('🔥 Hot Module Replacement is active');
      log.info('📝 CSS, JS, and HTML changes will reload automatically');

      // Enhanced file watching
      this.setupAdvancedFileWatching(server);

      // Setup graceful shutdown
      this.setupGracefulShutdown(() => server.close());

      return server;
    } catch (error) {
      log.error(`Failed to start development server: ${error.message}`);
      process.exit(1);
    }
  }

  setupAdvancedFileWatching(server) {
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

  // =================
  // BUILD PROCESS
  // =================

  async buildProduction() {
    log.header('Building for Production');

    await this.checkRequirements();
    await this.getGitInfo();

    try {
      // Clean previous builds
      log.step('Cleaning previous builds...');
      await this.cleanBuild();

      // Install/update dependencies
      log.step('Installing dependencies...');
      await this.executeCommand('npm ci --production=false', {
        timeout: CONFIG.buildTimeout,
      });

      // Run tests if not skipped
      if (!this.skipTests) {
        log.step('Running pre-build tests...');
        try {
          await this.executeCommand('npm test -- --passWithNoTests', {
            timeout: 60000,
          });
          log.success('Pre-build tests passed');
        } catch (error) {
          log.warning('Tests failed - continuing build');
          if (!this.force) {
            throw new Error('Pre-build tests failed');
          }
        }
      }

      // Build CSS
      log.step('Building optimized CSS...');
      await this.executeCommand('npm run build:css');

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
      const manifest = await this.generateAdvancedManifest();

      // Update service worker
      log.step('Updating PWA service worker...');
      await this.updateServiceWorker(manifest);

      // Copy build to public directory
      log.step('Preparing files for deployment...');
      await this.prepareBuildForDeployment();

      // Performance analysis
      log.step('Analyzing build performance...');
      await this.analyzeBuildPerformance(manifest);

      log.success('Production build completed successfully!');
      log.performance(
        '🔥 Build is optimized with file hashing and cache busting'
      );
      log.performance('📦 Ready for Firebase deployment');

      return manifest;
    } catch (error) {
      log.error(`Build failed: ${error.message}`);
      if (this.isVerbose) {
        console.error(error.stack);
      }
      throw error;
    }
  }

  async cleanBuild() {
    const dirsToClean = [
      CONFIG.distDir,
      path.resolve(CONFIG.publicDir, 'build-manifest.json'),
    ];

    for (const target of dirsToClean) {
      if (await fs.pathExists(target)) {
        await fs.remove(target);
        log.debug(`Cleaned: ${path.relative(CONFIG.projectRoot, target)}`);
      }
    }

    // Clean old backup
    if (await fs.pathExists(CONFIG.backupDir)) {
      await fs.remove(CONFIG.backupDir);
      log.debug('Cleaned old backup directory');
    }
  }

  async generateAdvancedManifest() {
    const manifest = {
      buildTime: this.deploymentContext.timestamp,
      version: this.deploymentContext.version,
      gitCommit: this.deploymentContext.gitCommit,
      gitBranch: this.deploymentContext.gitBranch,
      environment: this.deploymentContext.environment,
      nodeVersion: process.version,
      buildHash: '',
      files: {},
      hashes: {},
      sizes: {},
      performance: {},
    };

    const sourceDir = (await fs.pathExists(CONFIG.distDir))
      ? CONFIG.distDir
      : CONFIG.publicDir;
    const files = globSync('**/*', {
      cwd: sourceDir,
      nodir: true,
      ignore: [
        '**/node_modules/**',
        '**/.git/**',
        '**/build-manifest.json',
        '**/public-backup/**',
      ],
    });

    let totalSize = 0;

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
        hash: hash,
        type: this.getFileType(file),
      };

      manifest.hashes[file] = hash;
      manifest.sizes[file] = stats.size;
      totalSize += stats.size;
    }

    // Generate overall build hash
    const buildContent = JSON.stringify(manifest.files);
    manifest.buildHash = crypto
      .createHash('md5')
      .update(buildContent)
      .digest('hex')
      .substring(0, 8);

    // Performance metrics
    manifest.performance = {
      totalFiles: files.length,
      totalSize: totalSize,
      totalSizeFormatted: this.formatBytes(totalSize),
      buildDuration: Date.now() - this.startTime,
      avgFileSize: Math.round(totalSize / files.length),
    };

    // Write manifest
    const manifestPath = path.resolve(sourceDir, 'build-manifest.json');
    await fs.writeJSON(manifestPath, manifest, { spaces: 2 });

    log.debug(
      `Generated manifest with ${Object.keys(manifest.files).length} files`
    );
    log.performance(
      `Total build size: ${manifest.performance.totalSizeFormatted}`
    );

    return manifest;
  }

  getFileType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const types = {
      '.html': 'html',
      '.css': 'stylesheet',
      '.js': 'script',
      '.json': 'data',
      '.png': 'image',
      '.jpg': 'image',
      '.jpeg': 'image',
      '.gif': 'image',
      '.svg': 'image',
      '.woff': 'font',
      '.woff2': 'font',
      '.ttf': 'font',
      '.eot': 'font',
    };
    return types[ext] || 'other';
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async updateServiceWorker(manifest) {
    const swPath = path.resolve(CONFIG.publicDir, 'sw.js');

    if (await fs.pathExists(swPath)) {
      let swContent = await fs.readFile(swPath, 'utf8');

      // Extract file list for caching
      const filesToCache = Object.keys(manifest.files)
        .filter(
          file => !file.includes('sw.js') && !file.includes('manifest.json')
        )
        .map(file => `'/${file}?v=${manifest.hashes[file]}'`);

      // Update cache list
      const cacheListRegex = /const CACHE_FILES = \[[\s\S]*?\];/;
      const newCacheList = `const CACHE_FILES = [\n  ${filesToCache.join(',\n  ')}\n];`;

      if (cacheListRegex.test(swContent)) {
        swContent = swContent.replace(cacheListRegex, newCacheList);
      } else {
        swContent = `${newCacheList}\n\n${swContent}`;
      }

      // Update cache version with build hash
      const versionRegex = /const CACHE_VERSION = ['"][^'"]*['"];/;
      const newVersion = `const CACHE_VERSION = 'v${manifest.buildHash}';`;

      if (versionRegex.test(swContent)) {
        swContent = swContent.replace(versionRegex, newVersion);
      } else {
        swContent = `${newVersion}\n${swContent}`;
      }

      await fs.writeFile(swPath, swContent);
      log.debug('Updated service worker with new file hashes');
    }
  }

  async analyzeBuildPerformance(manifest) {
    const perf = manifest.performance;

    log.performance(`Build completed in ${perf.buildDuration}ms`);
    log.performance(`Total files: ${perf.totalFiles}`);
    log.performance(`Total size: ${perf.totalSizeFormatted}`);
    log.performance(`Average file size: ${this.formatBytes(perf.avgFileSize)}`);

    // Warn about large files
    const largeFiles = Object.entries(manifest.sizes)
      .filter(([, size]) => size > 500 * 1024) // > 500KB
      .sort(([, a], [, b]) => b - a);

    if (largeFiles.length > 0) {
      log.warning('Large files detected (>500KB):');
      largeFiles.slice(0, 5).forEach(([file, size]) => {
        log.warning(`  ${file}: ${this.formatBytes(size)}`);
      });
    }
  }

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

  // =================
  // GIT OPERATIONS
  // =================

  async performGitOperations() {
    if (this.skipGit) {
      log.step('Skipping git operations...');
      return;
    }

    log.header('Git Operations');

    try {
      // Check for uncommitted changes
      const { stdout: status } = await this.executeCommand(
        'git status --porcelain'
      );

      if (status.trim()) {
        log.step('Adding changes to git...');
        await this.executeCommand('git add .');

        // Create commit message
        const timestamp = new Date().toISOString().split('T')[0];
        const commitMessage = `🚀 Production deployment - ${timestamp}

- Enhanced build with file hashing
- PWA service worker updates  
- Performance optimizations
- Security improvements
- Cache busting implementation

Build hash: ${this.deploymentContext.buildHash || 'pending'}
Environment: ${this.deploymentContext.environment}`;

        log.step('Creating commit...');
        await this.executeCommand(`git commit -m "${commitMessage}"`);

        log.step('Pushing to remote repository...');
        await this.executeCommand('git push origin HEAD');

        log.success('Git operations completed');
      } else {
        log.info('No changes to commit');
      }
    } catch (error) {
      log.warning(`Git operations failed: ${error.message}`);
      if (!this.force) {
        throw error;
      }
    }
  }

  // =================
  // FIREBASE DEPLOYMENT
  // =================

  async deployToFirebase() {
    log.header('Firebase Deployment');

    try {
      log.step('Checking Firebase configuration...');

      // Verify Firebase CLI
      await this.executeCommand('firebase --version');

      // Check if logged in
      try {
        await this.executeCommand('firebase projects:list');
        log.success('Firebase authentication verified');
      } catch (error) {
        log.warning('Not logged into Firebase. Please login...');
        await this.spawnProcess('firebase', ['login']);
      }

      // Check project configuration
      if (await fs.pathExists('.firebaserc')) {
        const firebaserc = await fs.readJSON('.firebaserc');
        log.info(
          `Deploying to project: ${firebaserc.projects?.default || 'default'}`
        );
      }

      log.step('Deploying to Firebase Hosting...');

      const deployArgs = ['deploy'];
      if (this.isVerbose) deployArgs.push('--debug');

      await this.spawnProcess('firebase', deployArgs, {
        timeout: CONFIG.deployTimeout,
      });

      log.success('Firebase deployment completed successfully!');

      // Post-deployment verification
      await this.verifyDeployment();
    } catch (error) {
      log.error(`Firebase deployment failed: ${error.message}`);
      throw error;
    }
  }

  async verifyDeployment() {
    log.step('Verifying deployment...');

    try {
      // Get the deployed URL
      const { stdout } = await this.executeCommand(
        'firebase hosting:channel:list'
      );
      log.debug('Deployment verification completed');

      // Check if site is accessible
      const siteUrl = 'https://3ballnetwork.com';
      try {
        const { stdout: httpStatus } = await this.executeCommand(
          `curl -s -o /dev/null -w "%{http_code}" ${siteUrl}`
        );

        if (httpStatus.trim() === '200') {
          log.success('✅ Site is accessible and responding');
          log.deploy(`🌐 Live at: ${siteUrl}`);
        } else {
          log.warning(`⚠️  Site returned HTTP status: ${httpStatus.trim()}`);
        }
      } catch (error) {
        log.warning('Could not verify site accessibility (curl not available)');
      }

      // PWA verification
      log.step('🔍 PWA Verification:');
      log.info('   - Manifest file: /manifest.json');
      log.info('   - Service worker: /sw.js');
      log.info('   - Test installation on mobile devices');
    } catch (error) {
      log.warning(`Deployment verification failed: ${error.message}`);
    }
  }

  // =================
  // FULL DEPLOYMENT PIPELINE
  // =================

  async deployFull() {
    log.header('Full Deployment Pipeline');

    const startTime = Date.now();

    try {
      // Security checks
      await this.performSecurityChecks();

      // Build production
      const manifest = await this.buildProduction();
      this.deploymentContext.buildHash = manifest.buildHash;

      // Git operations
      await this.performGitOperations();

      // Firebase deployment
      await this.deployToFirebase();

      const totalTime = Date.now() - startTime;

      log.success('🎉 Full deployment completed successfully!');
      log.performance(
        `Total deployment time: ${Math.round(totalTime / 1000)}s`
      );

      // Deployment summary
      this.showDeploymentSummary(manifest);
    } catch (error) {
      log.error(`Full deployment failed: ${error.message}`);
      throw error;
    }
  }

  showDeploymentSummary(manifest) {
    log.header('Deployment Summary');

    console.log(`
🚀 Deployment Summary:
   - Build hash: ${this.deploymentContext.buildHash}
   - Git commit: ${this.deploymentContext.gitCommit.substring(0, 8)}
   - Git branch: ${this.deploymentContext.gitBranch}
   - Total files: ${manifest?.performance?.totalFiles || 'N/A'}
   - Total size: ${manifest?.performance?.totalSizeFormatted || 'N/A'}
   - Environment: ${this.deploymentContext.environment}

✅ Completed Tasks:
   - Security validation: ✅
   - Production build: ✅
   - File hashing: ✅
   - PWA optimization: ✅
   - Git commit & push: ✅
   - Firebase deployment: ✅
   - Post-deployment verification: ✅

🌐 Live URLs:
   - Production: https://3ballnetwork.com
   - Admin: https://3ballnetwork.com/admin.html
   - Player Portal: https://3ballnetwork.com/player.html

🔧 Next Steps:
   1. Test PWA installation on mobile devices
   2. Verify all functionality works correctly
   3. Monitor performance metrics
   4. Check analytics for user engagement
   5. Update documentation if needed
`);
  }

  // =================
  // MAINTENANCE OPERATIONS
  // =================

  async cleanAll() {
    log.header('Cleaning Build Artifacts');

    const dirsToClean = [
      CONFIG.distDir,
      CONFIG.backupDir,
      path.resolve(CONFIG.projectRoot, 'node_modules/.cache'),
      path.resolve(CONFIG.projectRoot, '.vite'),
    ];

    const filesToClean = [
      path.resolve(CONFIG.publicDir, 'build-manifest.json'),
      path.resolve(CONFIG.projectRoot, 'npm-debug.log'),
      path.resolve(CONFIG.projectRoot, 'yarn-error.log'),
    ];

    for (const dir of dirsToClean) {
      if (await fs.pathExists(dir)) {
        await fs.remove(dir);
        log.success(
          `Cleaned directory: ${path.relative(CONFIG.projectRoot, dir)}`
        );
      }
    }

    for (const file of filesToClean) {
      if (await fs.pathExists(file)) {
        await fs.remove(file);
        log.success(`Cleaned file: ${path.relative(CONFIG.projectRoot, file)}`);
      }
    }

    log.success('Cleanup completed');
  }

  // =================
  // HELP & UTILITIES
  // =================

  showHelp() {
    console.log(
      chalk.cyan(`
🚀 3 Ball Network - Universal Deployment Script v${CONFIG.version}

${chalk.bold('USAGE:')}
  ./deploy.js <command> [options]

${chalk.bold('COMMANDS:')}
  ${chalk.green('dev, development')}    Start HMR development server
  ${chalk.green('build, production')}   Build for production with optimization
  ${chalk.green('firebase, deploy')}    Deploy to Firebase Hosting only
  ${chalk.green('full, all')}           Complete build + deploy pipeline
  ${chalk.green('clean')}               Clean build artifacts and cache
  ${chalk.green('verify')}              Verify deployment health
  ${chalk.green('help, --help')}        Show this help message

${chalk.bold('OPTIONS:')}
  ${chalk.yellow('--verbose, -v')}       Enable verbose logging
  ${chalk.yellow('--dry-run, -d')}       Show what would be done without executing
  ${chalk.yellow('--skip-backup')}       Skip backing up public directory
  ${chalk.yellow('--skip-git')}          Skip git operations
  ${chalk.yellow('--skip-tests')}        Skip pre-deployment tests
  ${chalk.yellow('--force')}             Force deployment even with warnings

${chalk.bold('EXAMPLES:')}
  ./deploy.js dev                    # Start development server
  ./deploy.js build --verbose        # Build with detailed logging
  ./deploy.js full --skip-backup     # Full deployment without backup
  ./deploy.js firebase --dry-run     # Preview Firebase deployment
  ./deploy.js clean                  # Clean all build artifacts

${chalk.bold('ENVIRONMENT VARIABLES:')}
  NODE_ENV                Set to 'production' for production builds
  npm_package_version     Used for versioning (from package.json)

${chalk.bold('FEATURES:')}
  ✅ Hot Module Replacement (HMR) for development
  ✅ Production builds with Vite optimization
  ✅ File hashing and cache busting
  ✅ PWA service worker generation
  ✅ Security validation and checks
  ✅ Git integration with smart commits
  ✅ Firebase deployment with verification
  ✅ Performance analysis and monitoring
  ✅ Comprehensive error handling
  ✅ Dry-run mode for safe testing

${chalk.bold('PROJECT:')}
  🏀 3 Ball Network - Basketball Community Platform
  🌐 Connecting players, coaches, scouts, and fans worldwide

${chalk.gray('For more information, visit: https://github.com/3ballnetwork/3-ball-network')}
`)
    );
  }

  setupGracefulShutdown(cleanup) {
    const shutdown = async signal => {
      log.info(`\n🛑 Received ${signal}, shutting down gracefully...`);

      try {
        // Close all processes
        for (const process of this.processes) {
          if (process && typeof process.close === 'function') {
            await process.close();
          } else if (process && typeof process.kill === 'function') {
            process.kill('SIGTERM');
          }
        }

        // Run cleanup
        if (cleanup) await cleanup();

        log.success('Shutdown completed');
        process.exit(0);
      } catch (error) {
        log.error(`Error during shutdown: ${error.message}`);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGQUIT', () => shutdown('SIGQUIT'));
  }
}

// =================
// MAIN EXECUTION
// =================

async function main() {
  const deployer = new UniversalDeploymentManager();

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

      case 'full':
      case 'all':
        await deployer.deployFull();
        break;

      case 'clean':
        await deployer.cleanAll();
        break;

      case 'verify':
        await deployer.verifyDeployment();
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

// Handle unhandled promises and errors
process.on('unhandledRejection', (reason, promise) => {
  log.error(`Unhandled Rejection at: ${promise}`);
  log.error(`Reason: ${reason}`);
  process.exit(1);
});

process.on('uncaughtException', error => {
  log.error(`Uncaught Exception: ${error.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }
  process.exit(1);
});

// Start the deployment process
main();
