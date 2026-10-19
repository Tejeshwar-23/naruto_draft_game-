import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const sourcePath = path.join(rootDir, 'naruto-battlefield.png');
const backgroundsDir = path.join(rootDir, 'public', 'backgrounds');
const targetOriginalPng = path.join(backgroundsDir, 'naruto-battlefield.png');
const targetPixelWebp = path.join(backgroundsDir, 'naruto-battlefield-pixel.webp');

async function main() {
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source image not found at ${sourcePath}`);
    process.exit(1);
  }

  if (!fs.existsSync(backgroundsDir)) {
    fs.mkdirSync(backgroundsDir, { recursive: true });
  }

  // 1. Copy exact original source asset to public/backgrounds/naruto-battlefield.png
  fs.copyFileSync(sourcePath, targetOriginalPng);
  console.log(`✅ Saved original asset: ${targetOriginalPng}`);

  // 2. Generate 16-bit retro pixelated WebP asset:
  // Downscale by factor of ~4 (482x270) to produce authentic pixel grid
  // Then upscale back to 1928x1080 with nearest-neighbor interpolation
  const metadata = await sharp(sourcePath).metadata();
  const origW = metadata.width || 1928;
  const origH = metadata.height || 1080;

  const pixelDownW = Math.round(origW / 4); // ~482
  const pixelDownH = Math.round(origH / 4); // ~270

  const downscaledBuffer = await sharp(sourcePath)
    .resize(pixelDownW, pixelDownH, { fit: 'fill', kernel: sharp.kernel.cubic })
    .toBuffer();

  const upscaledPixelBuffer = await sharp(downscaledBuffer)
    .resize(origW, origH, { fit: 'fill', kernel: sharp.kernel.nearest })
    .webp({ quality: 90 })
    .toBuffer();

  fs.writeFileSync(targetPixelWebp, upscaledPixelBuffer);
  console.log(`✅ Generated pixelated WebP asset (${pixelDownW}x${pixelDownH} -> ${origW}x${origH}): ${targetPixelWebp}`);
  const stats = fs.statSync(targetPixelWebp);
  console.log(`Pixel WebP size: ${stats.size} bytes (~${(stats.size / 1024).toFixed(1)} KB)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
