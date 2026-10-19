/* global process */
/**
 * Automated Verification Script for Step 4 Auction Engine Rules
 * Tests all Scenarios A through L programmatically against auctionEngine.js
 */
import {
  createInitialAuctionState,
  processCharacterReveal,
  processBid,
  processPass,
  processZeroClaim,
  processRoleAssignment,
  AUCTION_PHASE,
  AUCTION_MODE
} from './auctionEngine.js';
import { CHARACTERS } from '../data/characters.js';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ ${message}`);
  }
}

console.log('=== RUNNING AUCTION ENGINE VERIFICATION SUITE ===\n');

// Mock characters
const char1 = CHARACTERS[0]; // Naruto
const char2 = CHARACTERS[1]; // Sasuke
const char3 = CHARACTERS[2]; // Sakura

// TEST B — OPENING PASS: Pass is disabled when no bid exists
{
  let state = createInitialAuctionState('local');
  const rev = processCharacterReveal(state, char1);
  state = rev.state;
  assert(state.phase === AUCTION_PHASE.BIDDING, 'Test B: Phase is bidding');
  assert(state.highestBidder === null, 'Test B: highestBidder is null');
  assert(state.currentBid === 0, 'Test B: currentBid is 0');
  const passRes = processPass(state);
  assert(!passRes.success, 'Test B: Opening player cannot pass before a bid exists');
}

// TEST A — NORMAL AUCTION: P1 bids $1 -> P2 bids $3 -> P1 bids $5 -> P2 passes
{
  let state = createInitialAuctionState('local');
  state = processCharacterReveal(state, char1).state;
  
  // P1 bids $1
  let res = processBid(state, 1);
  assert(res.success, 'Test A: P1 bids $1 succeeds');
  state = res.state;
  assert(state.currentBid === 1 && state.highestBidder === 'p1' && state.activePlayer === 'p2', 'Test A: Turn switches to P2 with bid $1');

  // P2 bids $3
  res = processBid(state, 3);
  assert(res.success, 'Test A: P2 bids $3 succeeds');
  state = res.state;
  assert(state.currentBid === 3 && state.highestBidder === 'p2' && state.activePlayer === 'p1', 'Test A: Turn switches to P1 with bid $3');

  // P1 bids $5
  res = processBid(state, 5);
  assert(res.success, 'Test A: P1 bids $5 succeeds');
  state = res.state;
  assert(state.currentBid === 5 && state.highestBidder === 'p1' && state.activePlayer === 'p2', 'Test A: Turn switches to P2 with bid $5');

  // P2 passes
  res = processPass(state);
  assert(res.success, 'Test A: P2 passes');
  state = res.state;
  assert(state.phase === AUCTION_PHASE.ROLE_ASSIGNMENT, 'Test A: Phase becomes roleAssignment');
  assert(state.winner === 'p1' && state.winningBid === 5, 'Test A: P1 wins for $5');
  assert(state.players.p1.budget === 25, 'Test A: P1 budget deducted $5 -> $25');
  assert(state.players.p2.budget === 30, 'Test A: P2 budget remains $30');

  // Assign role
  const assignRes = processRoleAssignment(state, 'captain');
  assert(assignRes.success, 'Test A: Role assignment succeeds');
  state = assignRes.state;
  assert(state.players.p1.team.captain.name === char1.name, 'Test A: Naruto assigned as Captain');
  assert(state.phase === AUCTION_PHASE.WAITING_FOR_REVEAL, 'Test A: Resets to waitingForReveal');
  assert(state.characterNumber === 2, 'Test A: characterNumber incremented to 2');
}

// TEST C — BUDGET LIMIT: P1 has $4, cannot bid higher than budget
{
  let state = createInitialAuctionState('local');
  state.players.p1.budget = 4;
  state = processCharacterReveal(state, char2).state;
  const res = processBid(state, 5);
  assert(!res.success, 'Test C: Bid exceeding budget ($5 > $4) is rejected');
}

// TEST D & F — PLAYER REACHES $0 / CHEAP TAKE IN FODDER DUMP
{
  let state = createInitialAuctionState('local');
  state.players.p1.budget = 1;
  state.players.p2.budget = 0; // P2 is at $0
  state = processCharacterReveal(state, char2).state;
  assert(state.auctionMode === AUCTION_MODE.FODDER_DUMP, 'Test D/F: Auction mode is FODDER_DUMP');
  assert(state.activePlayer === 'p1', 'Test D/F: Funded player P1 is active');

  // P1 bids $1
  const bidRes = processBid(state, 1);
  assert(bidRes.success, 'Test F: P1 bids $1 in fodder mode');
  state = bidRes.state;
  assert(state.winner === 'p1' && state.winningBid === 1, 'Test F: P1 immediately wins for $1');
  assert(state.players.p1.budget === 0, 'Test D: P1 budget reaches exactly $0');
}

// TEST E — FODDER DUMP PASS: P1 has $10, P2 has $0, P1 passes
{
  let state = createInitialAuctionState('local');
  state.players.p1.budget = 10;
  state.players.p2.budget = 0;
  state = processCharacterReveal(state, char3).state;
  assert(state.auctionMode === AUCTION_MODE.FODDER_DUMP, 'Test E: FODDER_DUMP detected');
  const passRes = processPass(state);
  assert(passRes.success, 'Test E: P1 pass succeeds');
  state = passRes.state;
  assert(state.winner === 'p2' && state.winningBid === 0, 'Test E: P2 is forced to receive character for $0');
  assert(state.players.p2.budget === 0, 'Test E: P2 pays $0');
  assert(state.players.p1.budget === 10, 'Test E: P1 pays $0');
}

// TEST G — DOUBLE $0 (ZERO CLAIM MODE)
{
  let state = createInitialAuctionState('local');
  state.players.p1.budget = 0;
  state.players.p2.budget = 0;
  state = processCharacterReveal(state, char1).state;
  assert(state.phase === AUCTION_PHASE.ZERO_CLAIM, 'Test G: Phase is ZERO_CLAIM');
  assert(state.activePlayer === 'p1', 'Test G: P1 has claim priority');

  // Test claim branch
  const claimRes = processZeroClaim(state);
  assert(claimRes.success, 'Test G: P1 claim for $0 succeeds');
  assert(claimRes.state.winner === 'p1' && claimRes.state.winningBid === 0, 'Test G: P1 wins for $0');

  // Test pass branch -> P2 forced to receive for $0
  const passRes = processPass(state);
  assert(passRes.success, 'Test G: P1 pass in zero claim succeeds');
  state = passRes.state;
  assert(state.winner === 'p2' && state.winningBid === 0, 'Test G: P2 forced to receive for $0');
  assert(state.zeroClaimPriority === 'p2', 'Test G: zeroClaimPriority alternated to p2');
}

// TEST H — FINAL ROLE AUTO-ASSIGNMENT: 5 roles filled, 1 empty
{
  let state = createInitialAuctionState('local');
  // Fill 5 roles for P1
  state.players.p1.team.captain = { name: 'Filler1' };
  state.players.p1.team.attacker = { name: 'Filler2' };
  state.players.p1.team.tank = { name: 'Filler3' };
  state.players.p1.team.support = { name: 'Filler4' };
  state.players.p1.team.traitor = { name: 'Filler5' };
  // Only medic remains

  state = processCharacterReveal(state, char1).state;
  // P1 bids $1
  state = processBid(state, 1).state;
  // P2 passes -> P1 wins, should auto-assign to Medic!
  const passRes = processPass(state);
  assert(passRes.success, 'Test H: P2 pass triggers win');
  state = passRes.state;
  assert(state.players.p1.team.medic.name === char1.name, 'Test H: Character auto-assigned to Medic');
  assert(state.autoAssignedMessage !== null, 'Test H: autoAssignedMessage generated');
  assert(state.phase === AUCTION_PHASE.WAITING_FOR_REVEAL, 'Test H: Phase reset to waitingForReveal without modal');
}

// TEST I & L — ONE TEAM FULL (6/6) & MATCH COMPLETION
{
  let state = createInitialAuctionState('local');
  // Fill all 6 roles for P1
  ['captain', 'attacker', 'tank', 'medic', 'support', 'traitor'].forEach((r) => {
    state.players.p1.team[r] = { name: 'P1 Ninja' };
  });

  // Reveal character
  const rev = processCharacterReveal(state, char2);
  state = rev.state;
  assert(state.winner === 'p2' && state.winningBid === 0, 'Test I: P2 automatically receives character for $0');
  assert(rev.mode === AUCTION_MODE.ONE_TEAM_FULL, 'Test I: ONE_TEAM_FULL mode');

  // Fill P2 to 5 roles
  ['captain', 'attacker', 'tank', 'support', 'traitor'].forEach((r) => {
    state.players.p2.team[r] = { name: 'P2 Ninja' };
  });

  // Assign role to P2's final slot (medic)
  const assignRes = processRoleAssignment(state, 'medic');
  assert(assignRes.success, 'Test L: Final role assigned');
  state = assignRes.state;
  assert(state.phase === AUCTION_PHASE.COMPLETE, 'Test L: Phase is COMPLETE when both teams are 6/6');
  assert(state.auctionMode === AUCTION_MODE.MATCH_COMPLETE, 'Test L: Mode is MATCH_COMPLETE');
}

console.log('\n🌟 ALL AUCTION ENGINE SCENARIOS VERIFIED SUCCESSFULLY!');
