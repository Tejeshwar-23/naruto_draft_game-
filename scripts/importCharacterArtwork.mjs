/* global process */
/**
 * STEP 8: AUTOMATIC CHARACTER ARTWORK IMPORTER
 *
 * Developer utility that queries the AniList GraphQL API for missing
 * Naruto character portraits, converts them into 600x800 WEBP format,
 * and atomically writes them to public/characters/<filename>.
 *
 * NOTE:
 * - This is a development-time tool ONLY.
 * - The React game runtime never calls AniList and strictly uses local assets.
 * - This tool dynamically reads src/data/characters.js and never hardcodes 30 characters.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { CHARACTERS } from '../src/data/characters.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const charactersDir = path.join(publicDir, 'characters');
const manifestPath = path.join(charactersDir, 'ARTWORK_SOURCES.json');

// Command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isForce = args.includes('--force');

// AniList GraphQL configuration
const ANILIST_API_URL = 'https://graphql.anilist.co';
const PACING_DELAY_MS = 2200; // ~27 req/min, safe under AniList 30-90 req/min rate limit
const MAX_RETRIES = 3;

/**
 * Optional search aliases when character name differs in AniList database.
 * Default search is always character.name.
 * Aliases are search hints only.
 */
const SEARCH_ALIASES = {
  'killer_b': 'Killer Bee',
  'killer_b_jinchuriki': 'Killer Bee',
  'might_guy': 'Might Guy',
  'might_guy_eight_gates': 'Might Guy',
  'pain_nagato': 'Pain',
  'pain_deva': 'Pain',
  'obito_masked': 'Tobi',
  'obito_uchiha': 'Tobi',
  'choji_butterfly': 'Chouji Akimichi',
  'choji_akimichi': 'Chouji Akimichi',
  'neji_hyuga': 'Neji Hyuuga',
  'hinata_hyuga': 'Hinata Hyuuga',
  'tsunade_fifth_hokage': 'Tsunade',
  'tsunade': 'Tsunade',
  // Expansion Pack 1
  'a_fourth_raikage': 'Fourth Raikage',
  'onoki_fence_sitter': 'Oonoki',
  'onoki': 'Oonoki',
  'suigetsu_hozuki': 'Suigetsu Houzuki',
  'nagato_uzumaki': 'Pain',
  'kimimaro_kaguya': 'Kimimaro',
  'karin_uzumaki': 'Karin'
};

const CHARACTER_SEARCH_QUERY = `
  query ($search: String) {
    Page(page: 1, perPage: 25) {
      characters(search: $search) {
        id
        name {
          full
          native
          alternative
        }
        image {
          large
          medium
        }
        siteUrl
        media(page: 1, perPage: 15) {
          nodes {
            id
            title {
              romaji
              english
              native
            }
          }
        }
      }
    }
  }
`;

/**
 * Helper to pause execution
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Verifies that candidate's media includes Naruto franchise titles.
 */
function isNarutoAssociated(mediaNodes) {
  if (!mediaNodes || !Array.isArray(mediaNodes)) return false;
  return mediaNodes.some((node) => {
    const titles = [
      node.title?.romaji,
      node.title?.english,
      node.title?.native
    ].filter(Boolean).join(' ');
    return /naruto|boruto/i.test(titles);
  });
}

/**
 * Safe search against AniList with rate limiting and 429 retry handling.
 */
async function searchAniList(searchTerm, retryCount = 0) {
  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'NarutoDraftArtworkImporter/1.0'
      },
      body: JSON.stringify({
        query: CHARACTER_SEARCH_QUERY,
        variables: { search: searchTerm }
      })
    });

    if (response.status === 429) {
      if (retryCount >= MAX_RETRIES) {
        throw new Error('HTTP 429 Rate limit exceeded; max retries reached.');
      }
      const retryAfterHeader = response.headers.get('Retry-After');
      const waitTimeSec = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 5 * (retryCount + 1);
      console.warn(`[RATE LIMIT 429] Waiting ${waitTimeSec} seconds before retry ${retryCount + 1}...`);
      await sleep(waitTimeSec * 1000);
      return searchAniList(searchTerm, retryCount + 1);
    }

    if (response.status >= 500) {
      if (retryCount >= MAX_RETRIES) {
        throw new Error(`AniList returned HTTP ${response.status}: ${response.statusText} (max retries reached)`);
      }
      const waitTimeSec = (retryCount + 1) * 2;
      console.warn(`[SERVER ERROR ${response.status}] Retrying "${searchTerm}" in ${waitTimeSec}s (${retryCount + 1}/${MAX_RETRIES})...`);
      await sleep(waitTimeSec * 1000);
      return searchAniList(searchTerm, retryCount + 1);
    }

    if (!response.ok) {
      throw new Error(`AniList returned HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    return json?.data?.Page?.characters || [];
  } catch (err) {
    if (retryCount < MAX_RETRIES && err.message.includes('fetch failed')) {
      console.warn(`[NETWORK WARNING] Retrying "${searchTerm}" (${retryCount + 1}/${MAX_RETRIES})...`);
      await sleep(2000 * (retryCount + 1));
      return searchAniList(searchTerm, retryCount + 1);
    }
    throw err;
  }
}

/**
 * Validates image path to prevent directory traversal
 */
function validateImagePath(imageProp, charName) {
  if (typeof imageProp !== 'string' || !imageProp.startsWith('/characters/') || !imageProp.endsWith('.webp')) {
    throw new Error(`Security check failed: Character "${charName}" image path "${imageProp}" must start with /characters/ and end with .webp`);
  }
  if (imageProp.includes('..') || imageProp.includes(':') || imageProp.includes('\\')) {
    throw new Error(`Security check failed: Character "${charName}" image path "${imageProp}" contains invalid traversal characters.`);
  }
  const filename = path.basename(imageProp);
  const targetFullPath = path.join(charactersDir, filename);
  if (!targetFullPath.startsWith(charactersDir)) {
    throw new Error(`Security check failed: Target path ${targetFullPath} is outside ${charactersDir}`);
  }
  return { filename, targetFullPath };
}

/**
 * Downloads image and processes into 600x800 WEBP format using sharp.
 * Safely preserves the entire source portrait without destructive cropping:
 * 1. Generates a softly blurred, darkened copy of the source artwork as the background canvas.
 * 2. Scales the original uncropped portrait cleanly inside the 600x800 canvas (fit: contain).
 * 3. Composites the sharp portrait over the background, eliminating white/black bars while
 *    guaranteeing full head, face, hair, and upper torso visibility.
 * 4. Writes atomically using a temporary file.
 */
async function downloadAndProcessImage(imageUrl, targetFullPath) {
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) {
    throw new Error(`Failed to download image from ${imageUrl}: HTTP ${imgRes.status}`);
  }

  const arrayBuffer = await imgRes.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  // 1. Background: blurred, darkened copy of the source (covers entire 600x800 canvas)
  const bgBuffer = await sharp(inputBuffer)
    .resize(600, 800, { fit: 'cover', position: 'top' })
    .blur(30)
    .modulate({ brightness: 0.42 })
    .toBuffer();

  // 2. Foreground: full uncropped, sharp character portrait contained inside 600x800
  const fgBuffer = await sharp(inputBuffer)
    .resize(600, 800, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  // 3. Composite foreground centered over background canvas
  const webpBuffer = await sharp(bgBuffer)
    .composite([{ input: fgBuffer, gravity: 'center' }])
    .webp({ quality: 86 })
    .toBuffer();

  // 4. Atomic file write using temporary file
  const tempPath = `${targetFullPath}.${Date.now()}.tmp`;
  fs.writeFileSync(tempPath, webpBuffer);
  fs.renameSync(tempPath, targetFullPath);
}

/**
 * Loads or initializes the source manifest.
 */
function loadManifest() {
  if (fs.existsSync(manifestPath)) {
    try {
      const data = fs.readFileSync(manifestPath, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      console.warn(`[WARN] Could not parse existing ARTWORK_SOURCES.json: ${e.message}. Initializing empty.`);
      return {};
    }
  }
  return {};
}

/**
 * Saves manifest back to public/characters/ARTWORK_SOURCES.json
 */
function saveManifest(manifest) {
  if (!fs.existsSync(charactersDir)) {
    fs.mkdirSync(charactersDir, { recursive: true });
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
}

/**
 * Main importer workflow
 */
async function main() {
  console.log('==================================================');
  console.log('NARUTO CHARACTER ARTWORK IMPORTER (DEVELOPER UTILITY)');
  console.log('==================================================');
  console.log(`Mode:            ${isDryRun ? 'DRY RUN (--dry-run)' : 'REAL IMPORT'}`);
  console.log(`Force Overwrite: ${isForce ? 'ENABLED (--force)' : 'DISABLED'}`);
  console.log(`Characters:      ${CHARACTERS.length} total in characters.js`);
  console.log(`Target Dir:      ${charactersDir}`);
  console.log('==================================================\n');

  if (!fs.existsSync(charactersDir)) {
    fs.mkdirSync(charactersDir, { recursive: true });
  }

  const manifest = loadManifest();
  let skippedCount = 0;
  let matchedCount = 0;
  let downloadedCount = 0;
  let reviewCount = 0;
  let failedCount = 0;

  const reviewList = [];
  const failedList = [];

  for (let i = 0; i < CHARACTERS.length; i++) {
    const char = CHARACTERS[i];
    const { filename, targetFullPath } = validateImagePath(char.image, char.name);
    const exists = fs.existsSync(targetFullPath);

    // Skip if already exists and not forcing
    if (exists && !isForce) {
      skippedCount++;
      console.log(`[SKIP] ${char.name} — artwork already exists (${filename})`);
      continue;
    }

    // Determine search term
    const searchTerm = SEARCH_ALIASES[char.id] || SEARCH_ALIASES[char.familyId] || char.name;

    // Rate pacing before API call
    await sleep(PACING_DELAY_MS);

    try {
      const candidates = await searchAniList(searchTerm);

      if (!candidates || candidates.length === 0) {
        failedCount++;
        failedList.push({ name: char.name, reason: 'No results found on AniList' });
        console.log(`[FAILED] ${char.name} — no results found on AniList for search "${searchTerm}"\n`);
        continue;
      }

      // Naruto verification
      const verifiedCandidate = candidates.find((cand) => isNarutoAssociated(cand.media?.nodes));

      if (!verifiedCandidate) {
        reviewCount++;
        reviewList.push({
          name: char.name,
          reason: `Top candidate "${candidates[0]?.name?.full}" could not be verified with Naruto franchise media`
        });
        console.log(`[REVIEW] ${char.name}`);
        console.log(`Could not confidently verify Naruto association.`);
        console.log(`Top candidate returned: "${candidates[0]?.name?.full}" (AniList ID: ${candidates[0]?.id})\n`);
        continue;
      }

      const imageUrl = verifiedCandidate.image?.large || verifiedCandidate.image?.medium;
      if (!imageUrl) {
        failedCount++;
        failedList.push({ name: char.name, reason: 'AniList candidate has no image URL' });
        console.log(`[FAILED] ${char.name} — candidate has no valid image URL\n`);
        continue;
      }

      if (isDryRun) {
        matchedCount++;
        console.log('Game character:');
        console.log(char.name);
        console.log('\nAniList:');
        console.log(verifiedCandidate.name?.full);
        console.log('\nAniList ID:');
        console.log(verifiedCandidate.id);
        console.log('\nTarget:');
        console.log(`public/characters/${filename}`);
        console.log('\nStatus:');
        console.log('FOUND\n');
        console.log('--------------------------------------------------\n');
      } else {
        // Real download and process
        await downloadAndProcessImage(imageUrl, targetFullPath);
        downloadedCount++;

        // Update provenance manifest
        manifest[filename] = {
          character: char.name,
          provider: 'AniList',
          anilistId: verifiedCandidate.id,
          sourcePage: verifiedCandidate.siteUrl || `https://anilist.co/character/${verifiedCandidate.id}`,
          retrievedAt: new Date().toISOString()
        };

        console.log('Game character:');
        console.log(char.name);
        console.log('\nAniList:');
        console.log(verifiedCandidate.name?.full);
        console.log('\nAniList ID:');
        console.log(verifiedCandidate.id);
        console.log('\nTarget:');
        console.log(`public/characters/${filename}`);
        console.log('\nStatus:');
        console.log('DOWNLOADED\n');
        console.log('--------------------------------------------------\n');
      }
    } catch (err) {
      failedCount++;
      failedList.push({ name: char.name, reason: err.message });
      console.log(`[FAILED] ${char.name} — ${err.message}\n`);
    }
  }

  // Save manifest if in real mode and any images were downloaded
  if (!isDryRun && downloadedCount > 0) {
    saveManifest(manifest);
  }

  console.log('==================================================');
  console.log('IMPORT SUMMARY REPORT');
  console.log('==================================================');
  console.log(`Total Characters: ${CHARACTERS.length}`);
  console.log(`Skipped Existing: ${skippedCount}`);
  if (isDryRun) {
    console.log(`Matched (Dry-run):${matchedCount}`);
  } else {
    console.log(`Downloaded:       ${downloadedCount}`);
  }
  console.log(`Review Items:     ${reviewCount}`);
  console.log(`Failed Items:     ${failedCount}`);

  if (reviewList.length > 0) {
    console.log('\nITEMS NEEDING REVIEW:');
    reviewList.forEach((item) => {
      console.log(`- ${item.name}: ${item.reason}`);
    });
  }

  if (failedList.length > 0) {
    console.log('\nFAILED ITEMS:');
    failedList.forEach((item) => {
      console.log(`- ${item.name}: ${item.reason}`);
    });
  }

  console.log('==================================================\n');
}

main().catch((err) => {
  console.error('Fatal error in importer:', err);
  process.exit(1);
});
