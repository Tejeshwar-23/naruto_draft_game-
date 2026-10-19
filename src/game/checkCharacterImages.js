/* global process */
/**
 * Character Artwork Audit Utility (Step 7)
 * Checks for presence of local character artwork in public/characters/
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHARACTERS } from '../data/characters.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Root public/characters directory
const publicDir = path.resolve(__dirname, '../../public');
const charactersDir = path.join(publicDir, 'characters');

console.log('==================================================');
console.log('CHARACTER ARTWORK AUDIT');
console.log('==================================================\n');

let foundCount = 0;
let missingCount = 0;

CHARACTERS.forEach((char) => {
  const imageProp = char.image || '';
  // Convert /characters/filename.webp into filesystem path
  const relativeFromPublic = imageProp.startsWith('/') ? imageProp.slice(1) : imageProp;
  const filePath = path.join(publicDir, relativeFromPublic);
  const filename = path.basename(filePath);

  const exists = fs.existsSync(filePath);

  if (exists) {
    foundCount++;
    console.log(`[FOUND]   ${char.name} (${char.version})`);
    console.log(`          ${filename}\n`);
  } else {
    missingCount++;
    console.log(`[MISSING] ${char.name} (${char.version})`);
    console.log(`          ${filename}\n`);
  }
});

console.log('==================================================');
console.log('SUMMARY');
console.log('==================================================');
console.log(`Total Characters: ${CHARACTERS.length}`);
console.log(`Images Found:     ${foundCount}`);
console.log(`Images Missing:   ${missingCount}`);
console.log(`Target Directory: ${charactersDir}`);
console.log('==================================================\n');

// Missing artwork is expected at this stage; do not exit with error code.
process.exit(0);
