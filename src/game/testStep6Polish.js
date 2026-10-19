/* global process */
/**
 * Automated Verification Script for Step 6 Polish
 */
import { CHARACTERS } from '../data/characters.js';
import { ROLES } from '../data/roles.js';
import { getCharacterColor, getCharacterInitials } from '../utils/characterUtils.js';
import {
  createInitialAuctionState,
  processCharacterReveal,
  processBid,
  processPass,
  processRoleAssignment,
  AUCTION_PHASE
} from './auctionEngine.js';
import { chooseBestRoleForCpu } from './botAI.js';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ ${message}`);
  }
}

console.log('=== RUNNING STEP 6 POLISH VERIFICATION ===\n');

// 1. Character Image Architecture
{
  assert(CHARACTERS.length >= 30, `Character database contains valid roster (found ${CHARACTERS.length} characters)`);

  for (const char of CHARACTERS) {
    assert(
      typeof char.image === 'string' && char.image.startsWith('/characters/'),
      `Character ${char.name} has image path ${char.image}`
    );
    const color = getCharacterColor(char);
    assert(Boolean(color) && color.startsWith('#'), `Character ${char.name} has valid color ${color}`);
    const initials = getCharacterInitials(char.name);
    assert(initials.length >= 2, `Character ${char.name} has valid initials ${initials}`);
  }
  console.log(`✅ Requirement 2 & 3: Character image schema & color/initial utilities verified for all ${CHARACTERS.length} characters`);
}

// 2. Traitor Role Meaning & Liability
{
  const traitorRole = ROLES.find((r) => r.id === 'traitor');
  assert(traitorRole !== undefined, 'Traitor role exists in ROLES');
  assert(
    traitorRole.tagline.toLowerCase().includes('betray') || traitorRole.description.toLowerCase().includes('betray'),
    'Traitor definition explicitly highlights betrayal'
  );
  console.log('✅ Requirement 16 & 18: Traitor role definition accurately reflects liability slot');
}

// 3. Match Simulation to 6/6 (Draft Complete Verification)
{
  let state = createInitialAuctionState('cpu');
  const usedFamilyIds = new Set();
  let reveals = 0;

  while (state.phase !== AUCTION_PHASE.COMPLETE && reveals < CHARACTERS.length) {
    reveals++;
    // Find next available character
    const candidate = CHARACTERS.find((c) => !usedFamilyIds.has(c.familyId));
    assert(Boolean(candidate), `Found unused candidate for round ${reveals}`);

    const revResult = processCharacterReveal(state, candidate);
    state = revResult.state;
    if (revResult.assignedFamilyId) {
      usedFamilyIds.add(revResult.assignedFamilyId);
    }

    if (state.phase === AUCTION_PHASE.BIDDING) {
      // Simulate P1 opening bid of $1
      const p1Bid = processBid(state, 1);
      state = p1Bid.state;
      if (p1Bid.assignedFamilyId) usedFamilyIds.add(p1Bid.assignedFamilyId);

      // P2 passes or bids; let's simulate P2 pass
      if (state.phase === AUCTION_PHASE.BIDDING) {
        const p2Pass = processPass(state);
        state = p2Pass.state;
        if (p2Pass.assignedFamilyId) usedFamilyIds.add(p2Pass.assignedFamilyId);
      }
    }

    // Role assignment for winner
    if (state.phase === AUCTION_PHASE.ROLE_ASSIGNMENT) {
      const winner = state.winner;
      const winnerPlayer = state.players[winner];
      const char = state.currentCharacter;

      // Find first empty role
      const emptyRoles = Object.keys(winnerPlayer.team).filter((r) => !winnerPlayer.team[r]);
      const chosenRole = winner === 'p2' ? chooseBestRoleForCpu(char, winnerPlayer) : emptyRoles[0];

      const assignResult = processRoleAssignment(state, chosenRole);
      state = assignResult.state;
      if (assignResult.assignedFamilyId) {
        usedFamilyIds.add(assignResult.assignedFamilyId);
      }
    }
  }

  assert(state.phase === AUCTION_PHASE.COMPLETE, 'Match reached AUCTION_PHASE.COMPLETE');
  const p1SquadCount = Object.values(state.players.p1.team).filter(Boolean).length;
  const p2SquadCount = Object.values(state.players.p2.team).filter(Boolean).length;
  assert(p1SquadCount === 6, `P1 squad is 6/6 (actual: ${p1SquadCount})`);
  assert(p2SquadCount === 6, `P2 squad is 6/6 (actual: ${p2SquadCount})`);
  console.log('✅ Requirement 23 & 24: Match cleanly progresses to 6/6 and Draft Complete state');
}

console.log('\n🌟 ALL STEP 6 POLISH VERIFICATION TESTS PASSED!');
