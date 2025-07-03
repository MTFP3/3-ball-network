import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

// Automatically discover all HTML files in the public directory
function getHtmlEntries() {
  const publicDir = resolve(__dirname, 'public');
  const entries = {};

  // Get all HTML files in public directory
  const htmlFiles = fs
    .readdirSync(publicDir)
    .filter(file => file.endsWith('.html'))
    .filter(file => !file.startsWith('temp_')); // Exclude temp files

  htmlFiles.forEach(file => {
    const name = file.replace('.html', '');
    entries[name] = resolve(publicDir, file);
  });

  return entries;
}

export default defineConfig({
  root: 'public',

  // Multi-page app configuration
  build: {
    rollupOptions: {
      input: getHtmlEntries(),
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
  },

  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true,
    hmr: {
      port: 24678,
      overlay: true,
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
  },

  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      css: {
        charset: false,
      },
    },
  },

  // Assets configuration
  assetsInclude: [
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif',
    '**/*.svg',
    '**/*.ico',
  ],

  // Plugin configuration
  plugins: [
    {
      name: 'html-hot-reload',
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.html')) {
          server.ws.send({
            type: 'full-reload',
          });
          return [];
        }
      },
    },
  ],

  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, 'public'),
      '@assets': resolve(__dirname, 'public/assets'),
      '@js': resolve(__dirname, 'public/assets/js'),
      '@css': resolve(__dirname, 'public/assets/css'),
    },
  },

  // Define global constants
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '2.0.0'),
  },

  // Optimization
  optimizeDeps: {
    include: [
      'chart.js',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
    ],
    exclude: [],
  },
});
