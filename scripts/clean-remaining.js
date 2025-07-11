#!/usr/bin/env node
/* eslint-disable no-console */

import fs from 'fs';

const files = [
  'public/coach.html',
  'public/scout.html',
  'public/team.html',
  'public/playerProfile.html',
];

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const originalSize = content.length;

  const cleanedContent = content.replace(
    /<link\s+rel="modulepreload"\s+crossorigin\s+href="data:text\/javascript;base64,[^"]*"\s*\/>/g,
    ''
  );

  const newSize = cleanedContent.length;
  const saved = originalSize - newSize;

  if (saved > 0) {
    fs.writeFileSync(filePath, cleanedContent);
    console.log(
      `${filePath}: Saved ${saved} bytes (${Math.round(saved / 1024)}KB)`
    );
  } else {
    console.log(`${filePath}: No changes needed`);
  }
});
