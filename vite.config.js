import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

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

export default defineConfig(({ command, mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  console.log(`🔧 Building in ${mode} mode`);
  console.log(
    `🔥 Firebase Project: ${env.VITE_FIREBASE_PROJECT_ID || 'Not configured'}`
  );

  return {
    root: 'public',

    // Environment variable configuration
    envPrefix: 'VITE_',
    envDir: '../', // Look for .env files in project root

    // Multi-page app configuration
    build: {
      rollupOptions: {
        input: getHtmlEntries(),
        output: {
          entryFileNames: 'assets/js/[name]-[hash].js',
          chunkFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          // Manual chunking for better code splitting
          manualChunks: {
            // Vendor libraries
            'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
            'vendor-charts': ['chart.js'],
            
            // Application modules by feature
            'app-auth': [], // Will contain auth related modules
            'app-dashboard': [], // Dashboard and analytics
            'app-video': [], // Video processing and gallery
            'app-ai': [], // AI chat and game tracking
            'app-player': [], // Player portal and related features
          },
        },
      },
      outDir: '../dist',
      emptyOutDir: true,
      sourcemap: true,
      // Increase chunk size warning limit to 750kb
      chunkSizeWarningLimit: 750,
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
      __DEV__: JSON.stringify(mode === 'development'),
      __PROD__: JSON.stringify(mode === 'production'),
      __VERSION__: JSON.stringify(
        env.VITE_APP_VERSION || process.env.npm_package_version || '2.0.0'
      ),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __BUILD_MODE__: JSON.stringify(mode),
      __FIREBASE_PROJECT__: JSON.stringify(
        env.VITE_FIREBASE_PROJECT_ID || 'not-configured'
      ),
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
  };
});
