#!/usr/bin/env node

import fs from 'fs';

// List of HTML files to clean
const htmlFiles = [
  'public/admin.html',
  'public/coach.html',
  'public/index.html',
  'public/login.html',
  'public/playerProfile.html',
  'public/scout.html',
  'public/team.html',
  'public/fan.html',
  'public/ai-coach.html',
  'public/analytics.html',
  'public/player.html',
  'public/recruiting-hub.html',
  'public/social-hub.html',
  'public/search.html',
  'public/register.html',
  'public/about.html',
  'public/overview.html',
  'public/live.html',
  'public/demo-coach.html',
  'public/demo-player.html',
  'public/demo-scout.html',
  'public/demo-fan.html',
  'public/demo-enhanced.html',
  'public/cache-clear.html',
  'public/claim-profile.html',
  'public/analytics-dashboard.html',
  'public/live-demo.html',
  'public/privacy.html',
  'public/terms.html',
  'public/smart-input.html',
  'public/test-integration.html',
  'public/teamArchive.html',
];

function cleanModulepreloadTags(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return false;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const originalSize = content.length;

    // Remove modulepreload tags with base64 data URLs (without self-closing slash)
    const cleanedContent = content.replace(
      /<link\s+rel="modulepreload"\s+crossorigin\s+href="data:text\/javascript;base64,[^"]*"[^>]*>/g,
      ''
    );

    // Also remove any standalone modulepreload tags that might remain
    const tempContent = cleanedContent.replace(
      /<link\s+rel="modulepreload"[^>]*href="[^"]*"[^>]*>/g,
      match => {
        // Keep only modulepreload tags that reference actual JS files, not data URLs
        if (
          match.includes('data:text/javascript;base64,') ||
          match.includes('data:application/javascript;base64,')
        ) {
          return '';
        }
        return match;
      }
    );

    // Clean up repeated hash patterns in href attributes
    // Look for patterns like: filename-hash1-hash2-hash2-hash2-etc
    const finalContent = tempContent.replace(
      /href="([^"]*?)(-[A-Za-z0-9_]{8,})(\2+)([^"]*?)"/g,
      (match, prefix, hash, repeatedHashes, suffix) => {
        // Keep only one instance of the repeated hash
        return `href="${prefix}${hash}${suffix}"`;
      }
    );

    const newSize = finalContent.length;
    const saved = originalSize - newSize;

    if (saved > 0) {
      fs.writeFileSync(filePath, finalContent);
      console.log(
        `${filePath}: Saved ${saved} bytes (${Math.round(saved / 1024)}KB)`
      );
      return true;
    } else {
      console.log(`${filePath}: No changes needed`);
      return false;
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return false;
  }
}

console.log('Cleaning modulepreload tags from HTML files...\n');

let filesProcessed = 0;

htmlFiles.forEach(filePath => {
  if (cleanModulepreloadTags(filePath)) {
    filesProcessed++;
  }
});

console.log(`\nProcessed ${filesProcessed} files`);
console.log('Cleanup complete!');
