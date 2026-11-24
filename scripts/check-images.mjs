import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');
const srcDir = path.resolve(rootDir, 'src');
const seedFile = path.resolve(rootDir, 'supabase/seed.sql');

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg']);

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// 1. Gather all existing images in public
const allPublicFiles = getAllFiles(publicDir);
const publicImageRelPaths = new Set(
  allPublicFiles
    .filter(f => imageExtensions.has(path.extname(f).toLowerCase()))
    .map(f => '/' + path.relative(publicDir, f).replace(/\\/g, '/'))
);

// 2. Scan src/ and seed.sql for image references
const imageRefRegex = /['"`](\/(?:products|brand)\/[^'"`]+\.(?:jpg|jpeg|png|webp|svg))['"`]/gi;
const referencedImages = new Set();

function scanFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  let match;
  while ((match = imageRefRegex.exec(content)) !== null) {
    referencedImages.add(match[1]);
  }
}

const srcFiles = getAllFiles(srcDir).filter(f => /\.(tsx?|jsx?|css|json)$/.test(f));
for (const file of srcFiles) {
  scanFile(file);
}
scanFile(seedFile);

// 3. Check for missing referenced images
const missing = [];
for (const ref of referencedImages) {
  if (!publicImageRelPaths.has(ref)) {
    missing.push(ref);
  }
}

// 4. Check for unreferenced images in public/
const unreferenced = [];
for (const pubImg of publicImageRelPaths) {
  if (!referencedImages.has(pubImg)) {
    unreferenced.push(pubImg);
  }
}

console.log('--- Image Verification Report ---');
console.log(`Total public images found: ${publicImageRelPaths.size}`);
console.log(`Total referenced images: ${referencedImages.size}`);

if (missing.length > 0) {
  console.error('\n❌ Missing images referenced in src/ or seed.sql:');
  for (const m of missing) {
    console.error(`  - ${m}`);
  }
  process.exit(1);
} else {
  console.log('\n✅ All referenced images exist in public/!');
}

if (unreferenced.length > 0) {
  console.log('\nℹ️ Images in public/ not explicitly referenced in code:');
  for (const u of unreferenced) {
    console.log(`  - ${u}`);
  }
}

console.log('---------------------------------');

