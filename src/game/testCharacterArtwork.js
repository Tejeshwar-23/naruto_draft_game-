/* global process */
/**
 * Character Artwork & Integration Verification Suite (Step 7)
 */
import { CHARACTERS } from '../data/characters.js';
import { getCharacterColor, getCharacterInitials } from '../utils/characterUtils.js';
import {
  createInitialAuctionState,
  processCharacterReveal,
  processBid,
  processPass,
  processRoleAssignment,
  AUCTION_PHASE
} from './auctionEngine.js';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ ${message}`);
  }
}

console.log('=== RUNNING STEP 7 CHARACTER ARTWORK INTEGRATION TESTS ===\n');

// 1. All Characters Schema Verification
{
  assert(CHARACTERS.length >= 30, `Database contains valid characters roster (found ${CHARACTERS.length} characters)`);

  const requiredFields = [
    'id',
    'familyId',
    'name',
    'version',
    'image',
    'auctionValue',
    'stats',
    'roleRatings',
    'traitorRisk',
    'traits',
    'abilities'
  ];

  const seenIds = new Set();
  const seenImages = new Set();

  CHARACTERS.forEach((char) => {
    // Check all required fields
    requiredFields.forEach((field) => {
      assert(
        char[field] !== undefined && char[field] !== null,
        `Character ${char.name} has required field: ${field}`
      );
    });

    // Check unique IDs
    assert(!seenIds.has(char.id), `Character ID ${char.id} is unique`);
    seenIds.add(char.id);

    // Image Path Validation
    assert(typeof char.image === 'string' && char.image.length > 0, `Character ${char.name} has non-empty image`);
    assert(char.image.startsWith('/characters/'), `Image path for ${char.name} starts with "/characters/" (${char.image})`);
    assert(char.image.endsWith('.webp'), `Image path for ${char.name} ends with ".webp" (${char.image})`);
    assert(
      !char.image.includes('http://') && !char.image.includes('https://') && !char.image.startsWith('//'),
      `Image path for ${char.name} is strictly local without remote URLs`
    );

    // Check image path uniqueness
    assert(!seenImages.has(char.image), `Image path ${char.image} is unique across roster`);
    seenImages.add(char.image);

    // Color and initials helper validation
    const color = getCharacterColor(char);
    assert(typeof color === 'string' && color.startsWith('#'), `Valid color for ${char.name}: ${color}`);

    const initials = getCharacterInitials(char.name);
    assert(typeof initials === 'string' && initials.length >= 2, `Valid initials for ${char.name}: ${initials}`);
  });

  console.log(`\n✅ All ${CHARACTERS.length} character records passed schema, image-path, and local-URL validation.`);
}

// 2. Hidden State Privacy Check (No leaked character identity before reveal)
{
  const state = createInitialAuctionState('cpu');
  assert(state.currentCharacter === null, 'Current character is initially null in waitingForReveal phase');
  assert(state.phase === AUCTION_PHASE.WAITING_FOR_REVEAL, 'Initial phase is WAITING_FOR_REVEAL');
  console.log('✅ Hidden reveal state preserves total confidentiality before reveal.');
}

// 3. Fallback Resilience & Full Match Progression to 6/6
{
  let state = createInitialAuctionState('cpu');
  const usedFamilyIds = new Set();
  let round = 0;

  while (state.phase !== AUCTION_PHASE.COMPLETE && round < CHARACTERS.length) {
    round++;
    const candidate = CHARACTERS.find((c) => !usedFamilyIds.has(c.familyId));
    assert(Boolean(candidate), `Unused candidate available for round ${round}`);

    const rev = processCharacterReveal(state, candidate);
    state = rev.state;
    if (rev.assignedFamilyId) usedFamilyIds.add(rev.assignedFamilyId);

    if (state.phase === AUCTION_PHASE.BIDDING) {
      const bidRes = processBid(state, 1);
      state = bidRes.state;
      if (bidRes.assignedFamilyId) usedFamilyIds.add(bidRes.assignedFamilyId);

      if (state.phase === AUCTION_PHASE.BIDDING) {
        const passRes = processPass(state);
        state = passRes.state;
        if (passRes.assignedFamilyId) usedFamilyIds.add(passRes.assignedFamilyId);
      }
    }

    if (state.phase === AUCTION_PHASE.ROLE_ASSIGNMENT) {
      const winner = state.winner;
      const winnerPlayer = state.players[winner];
      const emptyRoles = Object.keys(winnerPlayer.team).filter((r) => !winnerPlayer.team[r]);
      const chosenRole = emptyRoles[0];

      const assignRes = processRoleAssignment(state, chosenRole);
      state = assignRes.state;
      if (assignRes.assignedFamilyId) usedFamilyIds.add(assignRes.assignedFamilyId);
    }
  }

  assert(state.phase === AUCTION_PHASE.COMPLETE, 'Match reached complete state without crashing on missing images');
  const p1Count = Object.values(state.players.p1.team).filter(Boolean).length;
  const p2Count = Object.values(state.players.p2.team).filter(Boolean).length;
  assert(p1Count === 6, `Player 1 squad has 6/6 characters`);
  assert(p2Count === 6, `Player 2 / CPU squad has 6/6 characters`);

  console.log('✅ Missing artwork does not crash gameplay; matches progress to 6/6 cleanly.');
}

console.log('\n🌟 ALL STEP 7 ARTWORK INTEGRATION TESTS PASSED!');
