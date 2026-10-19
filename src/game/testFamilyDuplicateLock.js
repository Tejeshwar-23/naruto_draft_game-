/* global process */
/**
 * Test Suite: Family ID Duplicate Prevention (Pain / Nagato & General Family Locking)
 *
 * Verifies that characters sharing the same underlying person/family (specifically Pain and Nagato)
 * are mutually exclusive during drafting and character selection based strictly on `familyId`.
 */
import { CHARACTERS } from '../data/characters.js';
import { getRandomAvailableCharacter, getRemainingFamiliesCount } from './characterSelector.js';
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

console.log('=== RUNNING FAMILY DUPLICATE & PAIN/NAGATO LOCK VERIFICATION SUITE ===\n');

// 1. Verify Database Schema for Pain & Nagato
{
  const pain = CHARACTERS.find((c) => c.id === 'pain_deva');
  const nagato = CHARACTERS.find((c) => c.id === 'nagato_uzumaki');

  assert(Boolean(pain), 'Pain exists in character database');
  assert(Boolean(nagato), 'Nagato exists in character database');
  assert(pain.id !== nagato.id, 'Pain and Nagato have distinct IDs');
  assert(pain.familyId === nagato.familyId, `Pain and Nagato share identical familyId ("${pain.familyId}")`);
  assert(pain.familyId === 'pain_nagato', 'Pain and Nagato familyId is "pain_nagato"');
  assert(pain.image !== nagato.image, 'Pain and Nagato have distinct artwork paths');

  console.log('✅ Requirement: Pain and Nagato represent the same underlying family entity in database.\n');
}

// 2. Character Selector Availability Filtering (Dynamic Generic familyId check)
{
  const pain = CHARACTERS.find((c) => c.id === 'pain_deva');
  const nagato = CHARACTERS.find((c) => c.id === 'nagato_uzumaki');

  // Scenario A: Pain's family is drafted/used
  const usedWithPain = new Set([pain.familyId]);
  const availableWhenPainUsed = CHARACTERS.filter((c) => !usedWithPain.has(c.familyId));
  assert(!availableWhenPainUsed.some((c) => c.id === 'nagato_uzumaki'), 'Nagato is UNAVAILABLE when Pain familyId is used');
  assert(!availableWhenPainUsed.some((c) => c.id === 'pain_deva'), 'Pain is UNAVAILABLE when Pain familyId is used');

  // Scenario B: Nagato's family is drafted/used
  const usedWithNagato = new Set([nagato.familyId]);
  const availableWhenNagatoUsed = CHARACTERS.filter((c) => !usedWithNagato.has(c.familyId));
  assert(!availableWhenNagatoUsed.some((c) => c.id === 'pain_deva'), 'Pain is UNAVAILABLE when Nagato familyId is used');
  assert(!availableWhenNagatoUsed.some((c) => c.id === 'nagato_uzumaki'), 'Nagato is UNAVAILABLE when Nagato familyId is used');

  // Scenario C: Selector helper respects family lock
  for (let trial = 0; trial < 100; trial++) {
    const selected = getRandomAvailableCharacter(CHARACTERS, usedWithPain);
    assert(selected.familyId !== pain.familyId, `Trial ${trial}: getRandomAvailableCharacter never picks Pain/Nagato family`);
    assert(selected.id !== 'nagato_uzumaki' && selected.id !== 'pain_deva', 'Trial: Neither Nagato nor Pain selected');
  }

  console.log('✅ Selector Test: Pain and Nagato mutual exclusion verified via generic familyId filtering.\n');
}

// 3. Full Auction Engine Integration Test: Drafting Pain Locks Nagato
{
  let state = createInitialAuctionState('cpu');
  const usedFamilyIds = new Set();

  const pain = CHARACTERS.find((c) => c.id === 'pain_deva');

  // Round 1: Reveal Pain
  const rev1 = processCharacterReveal(state, pain);
  state = rev1.state;
  if (rev1.assignedFamilyId) usedFamilyIds.add(rev1.assignedFamilyId);

  // P1 Bids $1
  const bid1 = processBid(state, 1);
  state = bid1.state;
  if (bid1.assignedFamilyId) usedFamilyIds.add(bid1.assignedFamilyId);

  // CPU / P2 Passes
  const pass1 = processPass(state);
  state = pass1.state;
  if (pass1.assignedFamilyId) usedFamilyIds.add(pass1.assignedFamilyId);

  // P1 assigns Pain to Captain
  assert(state.phase === AUCTION_PHASE.ROLE_ASSIGNMENT, 'Phase is role assignment for Pain');
  const assign1 = processRoleAssignment(state, 'captain');
  state = assign1.state;
  if (assign1.assignedFamilyId) {
    usedFamilyIds.add(assign1.assignedFamilyId);
  }

  assert(usedFamilyIds.has('pain_nagato'), 'usedFamilyIds includes "pain_nagato" after Pain drafted');
  assert(state.players.p1.team.captain.name === 'Pain', 'Pain is drafted as P1 Captain');

  // Verify Nagato is now locked out of available pool
  const remainingCount = getRemainingFamiliesCount(CHARACTERS, usedFamilyIds);
  const remainingPool = CHARACTERS.filter((c) => !usedFamilyIds.has(c.familyId));

  assert(!remainingPool.some((c) => c.name === 'Nagato'), 'Nagato is completely filtered out of remaining draft pool');
  assert(!remainingPool.some((c) => c.name === 'Pain'), 'Pain is completely filtered out of remaining draft pool');
  assert(remainingCount === remainingPool.length, 'getRemainingFamiliesCount accurately reflects remaining pool');

  console.log('✅ Auction Engine Test: Drafting Pain locks Nagato via familyId tracking.\n');
}

// 4. Full Auction Engine Integration Test: Drafting Nagato Locks Pain
{
  let state = createInitialAuctionState('cpu');
  const usedFamilyIds = new Set();

  const nagato = CHARACTERS.find((c) => c.id === 'nagato_uzumaki');

  // Round 1: Reveal Nagato
  const rev1 = processCharacterReveal(state, nagato);
  state = rev1.state;
  if (rev1.assignedFamilyId) usedFamilyIds.add(rev1.assignedFamilyId);

  // P1 Bids $2
  const bid1 = processBid(state, 2);
  state = bid1.state;
  if (bid1.assignedFamilyId) usedFamilyIds.add(bid1.assignedFamilyId);

  // CPU / P2 Passes
  const pass1 = processPass(state);
  state = pass1.state;
  if (pass1.assignedFamilyId) usedFamilyIds.add(pass1.assignedFamilyId);

  // P1 assigns Nagato to Attacker
  assert(state.phase === AUCTION_PHASE.ROLE_ASSIGNMENT, 'Phase is role assignment for Nagato');
  const assign1 = processRoleAssignment(state, 'attacker');
  state = assign1.state;
  if (assign1.assignedFamilyId) {
    usedFamilyIds.add(assign1.assignedFamilyId);
  }

  assert(usedFamilyIds.has('pain_nagato'), 'usedFamilyIds includes "pain_nagato" after Nagato drafted');
  assert(state.players.p1.team.attacker.name === 'Nagato', 'Nagato is drafted as P1 Attacker');

  // Verify Pain is now locked out of available pool
  const remainingPool = CHARACTERS.filter((c) => !usedFamilyIds.has(c.familyId));
  assert(!remainingPool.some((c) => c.name === 'Pain'), 'Pain is completely filtered out of remaining draft pool');
  assert(!remainingPool.some((c) => c.name === 'Nagato'), 'Nagato is completely filtered out of remaining draft pool');

  console.log('✅ Auction Engine Test: Drafting Nagato locks Pain via familyId tracking.\n');
}

console.log('🌟 ALL PAIN / NAGATO & FAMILY LOCK TESTS PASSED!\n');
