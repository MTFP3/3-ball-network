#!/usr/bin/env node

import { build } from 'vite';
import path, { resolve } from 'path';
import fs from 'fs-extra';
import { globSync } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildWithViteHMR() {
  try {
    console.log('🚀 Building 3 Ball Network with Vite + HMR support...\n');

    // Clean previous build
    await fs.remove(resolve(__dirname, '../dist'));
    console.log('🧹 Cleaned previous build');

    // Build with Vite
    await build({
      configFile: resolve(__dirname, '../vite.config.js'),
      mode: 'production',
      logLevel: 'info',
    });

    console.log('✅ Vite build completed');

    // Copy dist back to public for Firebase deployment
    const distDir = resolve(__dirname, '../dist');
    const publicDir = resolve(__dirname, '../public');

    // Backup original public directory
    const backupDir = resolve(__dirname, '../public-backup');
    if (await fs.pathExists(publicDir)) {
      await fs.copy(publicDir, backupDir);
      console.log('💾 Backed up original public directory');
    }

    // Copy built files to public
    if (await fs.pathExists(distDir)) {
      await fs.copy(distDir, publicDir);
      console.log('📁 Copied built files to public directory');
    }

    // Generate file manifest for cache busting
    const manifest = {};
    const files = globSync('**/*', {
      cwd: publicDir,
      nodir: true,
      ignore: ['**/node_modules/**', '**/.git/**'],
    });

    files.forEach(file => {
      const stats = fs.statSync(resolve(publicDir, file));
      manifest[file] = {
        size: stats.size,
        mtime: stats.mtime.toISOString(),
        hash: file.includes('-') ? file.split('-')[1]?.split('.')[0] : null,
      };
    });

    await fs.writeJSON(resolve(publicDir, 'build-manifest.json'), manifest, {
      spaces: 2,
    });
    console.log('📋 Generated build manifest');

    // Update service worker with new file hashes
    await updateServiceWorker(publicDir, manifest);

    console.log('\n✅ Build completed successfully!');
    console.log('🔥 HMR-optimized build ready for deployment');
    console.log('📦 Files are hashed and cache-busted');
    console.log('🚀 Run `npm run deploy:vite` to deploy to Firebase\n');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

async function updateServiceWorker(publicDir, manifest) {
  const swPath = resolve(publicDir, 'sw.js');

  if (await fs.pathExists(swPath)) {
    let swContent = await fs.readFile(swPath, 'utf8');

    // Extract file list for caching
    const filesToCache = Object.keys(manifest)
      .filter(
        file => !file.includes('sw.js') && !file.includes('manifest.json')
      )
      .map(file => `'/${file}'`);

    // Update cache list in service worker
    const cacheListRegex = /const CACHE_FILES = \[[\s\S]*?\];/;
    const newCacheList = `const CACHE_FILES = [\n  ${filesToCache.join(',\n  ')}\n];`;

    if (cacheListRegex.test(swContent)) {
      swContent = swContent.replace(cacheListRegex, newCacheList);
    } else {
      // Add cache list if it doesn't exist
      swContent = `${newCacheList}\n\n${swContent}`;
    }

    // Update cache version with build timestamp
    const versionRegex = /const CACHE_VERSION = ['"][^'"]*['"];/;
    const newVersion = `const CACHE_VERSION = 'v${Date.now()}';`;

    if (versionRegex.test(swContent)) {
      swContent = swContent.replace(versionRegex, newVersion);
    } else {
      swContent = `${newVersion}\n${swContent}`;
    }

    await fs.writeFile(swPath, swContent);
    console.log('🔄 Updated service worker with new file hashes');
  }
}

buildWithViteHMR();
