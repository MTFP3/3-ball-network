#!/usr/bin/env node

import { createServer } from 'vite';
import chokidar from 'chokidar';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startDevServer() {
  try {
    console.log('🚀 Starting 3 Ball Network HMR Development Server...\n');

    // Create Vite development server
    const server = await createServer({
      configFile: path.resolve(__dirname, '../vite.config.js'),
      server: {
        port: 3000,
        host: true,
      },
    });

    await server.listen();

    console.log('✅ Development server started successfully!');
    console.log('📱 Local:   http://localhost:3000');
    console.log('🌐 Network: http://0.0.0.0:3000');
    console.log('\n🔥 Hot Module Replacement is active');
    console.log('📝 CSS, JS, and HTML changes will reload automatically');
    console.log('⚡ Firebase config changes will trigger full reload');
    console.log('\n---\n');

    // Watch for Firebase config changes
    const firebaseWatcher = chokidar.watch(
      [
        'firebase.json',
        'firestore.rules',
        '.firebaserc',
        'public/assets/js/firebaseConfig.js',
      ],
      {
        ignoreInitial: true,
      }
    );

    firebaseWatcher.on('change', filePath => {
      console.log(`🔄 Firebase config changed: ${filePath}`);
      console.log('🔥 Triggering full reload...');
      server.ws.send({
        type: 'full-reload',
      });
    });

    // Enhanced file watching with better feedback
    const publicWatcher = chokidar.watch('public/**/*', {
      ignoreInitial: true,
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
    });

    publicWatcher.on('change', filePath => {
      const ext = path.extname(filePath);
      const relativePath = path.relative(process.cwd(), filePath);

      switch (ext) {
        case '.html':
          console.log(`📄 HTML updated: ${relativePath}`);
          break;
        case '.css':
          console.log(`🎨 CSS updated: ${relativePath}`);
          break;
        case '.js':
          console.log(`⚙️  JS updated: ${relativePath}`);
          break;
        default:
          console.log(`📁 File updated: ${relativePath}`);
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('\n🛑 Shutting down development server...');
      await server.close();
      firebaseWatcher.close();
      publicWatcher.close();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down development server...');
      await server.close();
      firebaseWatcher.close();
      publicWatcher.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Failed to start development server:', error);
    process.exit(1);
  }
}

startDevServer();
