import fs from 'fs';
import path from 'path';

function removeHumanfsImportFromFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  // Remove ES module imports
  content = content.replace(
    /^.*import\s+.*['"]@humanfs\/core['"].*;.*\n?/gm,
    ''
  );
  // Remove CommonJS requires
  content = content.replace(
    /^.*require\s*\(\s*['"]@humanfs\/core['"]\s*\).*;.*\n?/gm,
    ''
  );
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`🧹 Removed @humanfs/core import from: ${filePath}`);
  }
}

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.js')) {
      removeHumanfsImportFromFile(fullPath);
    }
  });
}

// Run for scripts/ directory (not public/assets/js/)
processDir('./scripts');
