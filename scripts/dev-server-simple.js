#!/usr/bin/env node

console.log('🚀 Starting 3 Ball Network HMR Development Server...\n');

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Start Vite development server
const viteProcess = spawn(
  'npx',
  ['vite', '--config', path.resolve(__dirname, '../vite.config.js')],
  {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
  }
);

console.log('✅ Development server started successfully!');
console.log('📱 Local:   http://localhost:3000');
console.log('🌐 Network: http://0.0.0.0:3000');
console.log('\n🔥 Hot Module Replacement is active');
console.log('📝 CSS, JS, and HTML changes will reload automatically');
console.log('\n---\n');

// Handle process termination
process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development server...');
  viteProcess.kill();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development server...');
  viteProcess.kill();
  process.exit(0);
});

viteProcess.on('exit', code => {
  if (code !== 0) {
    console.error(`❌ Development server exited with code ${code}`);
  }
  process.exit(code);
});
