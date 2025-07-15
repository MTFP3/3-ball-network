import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIRS = ['scripts', 'server'];
const IMPORT_LINE = `import humanfsCore from '@humanfs/core';\n`;

function addImportToFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(IMPORT_LINE.trim())) return; // Already present

  // Insert after any shebang or at the very top
  let newContent;
  if (content.startsWith('#!')) {
    const firstNewline = content.indexOf('\n') + 1;
    newContent =
      content.slice(0, firstNewline) +
      IMPORT_LINE +
      content.slice(firstNewline);
  } else {
    newContent = IMPORT_LINE + content;
  }
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`✅ Added import to: ${filePath}`);
}

function processDir(dir) {
  const absDir = path.isAbsolute(dir) ? dir : path.join(__dirname, dir);
  if (!fs.existsSync(absDir)) return;
  fs.readdirSync(absDir).forEach(file => {
    const fullPath = path.join(absDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(path.join(dir, file));
    } else if (file.endsWith('.js')) {
      addImportToFile(fullPath);
    }
  });
}

TARGET_DIRS.forEach(processDir);
