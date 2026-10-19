/* global process */
/**
 * Automated Verification Script for Step 5 botAI.js (Updated for Strategic Traitor Role Rules)
 *
 * Verifies:
 * 1. Itachi does NOT choose Traitor when Tank, Medic, and Traitor are available; he chooses Tank.
 * 2. Strong characters generally avoid Traitor when a reasonable normal role is available.
 * 3. Lower-risk characters may be assigned Traitor when strategically appropriate.
 * 4. If Traitor is the only remaining role, assignment is forced to Traitor.
 * 5. If Traitor is the only remaining role, CPU bidding valuation accounts for betrayal risk.
 * 6. Normal bidding, fodder dump, and zero claim operate under new Traitor rules.
 */
import {
  calculateDesirability,
  calculateMaxBid,
  getBotBidDecision,
  getBotZeroClaimDecision,
  chooseBestRoleForCpu,
  getBestAvailableRoleFit,
  setDebugAI
} from './botAI.js';
import { createInitialAuctionState } from './auctionEngine.js';
import { CHARACTERS } from '../data/characters.js';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ ${message}`);
  }
}

console.log('=== RUNNING BOT AI (STRATEGIC TRAITOR) VERIFICATION SUITE ===\n');

// Find test characters
const madara = CHARACTERS.find((c) => c.id === 'madara_reanimated');
const tsunade = CHARACTERS.find((c) => c.id === 'tsunade_fifth_hokage');
const kiba = CHARACTERS.find((c) => c.id === 'kiba_shippuden');
const itachi = CHARACTERS.find((c) => c.id === 'itachi_akatsuki');
const tenten = CHARACTERS.find((c) => c.id === 'tenten_shippuden');

assert(Boolean(madara && tsunade && kiba && itachi && tenten), 'Test Setup: Target characters exist');
assert(itachi.traitorRisk === 10, 'Test Setup: Itachi has traitorRisk 10');
assert(tenten.traitorRisk === 2, 'Test Setup: Tenten has traitorRisk 2');
assert(itachi.roleRatings.traitor === undefined, 'Test Setup: Traitor is removed from normal roleRatings');

// 1. ITACHI ROLE ASSIGNMENT: TANK vs MEDIC vs TRAITOR
// User prompt: "Itachi is won by CPU. Available roles: Tank (6), Medic (1), Traitor.
// Itachi should NOT automatically go to Traitor simply because old traitor rating was 10.
// If Tank suitability = 6, Medic suitability = 1, traitorRisk = high, CPU should prefer TANK."
{
  const mockCpu = {
    team: {
      captain: { name: 'Filler1' },
      attacker: { name: 'Filler2' },
      tank: null,    // Itachi suitability: 6
      medic: null,   // Itachi suitability: 1
      support: { name: 'Filler3' },
      traitor: null  // Traitor slot open, but Itachi traitorRisk = 10 (catastrophic)
    }
  };

  const chosenRole = chooseBestRoleForCpu(itachi, mockCpu);
  console.log(`Itachi (Tank: 6, Medic: 1, Traitor open) -> CPU Assigned: ${chosenRole.toUpperCase()}`);
  assert(chosenRole === 'tank', 'Requirement 1: Itachi assigned to TANK, protecting him from Traitor liability');
}

// 2. STRONG CHARACTERS GENERALLY AVOID TRAITOR
{
  const mockCpu = {
    team: {
      captain: null, // Madara suitability: 10
      attacker: null,
      tank: null,
      medic: null,
      support: null,
      traitor: null  // Traitor open
    }
  };

  const madaraRole = chooseBestRoleForCpu(madara, mockCpu);
  console.log(`Madara with all roles open -> CPU Assigned: ${madaraRole.toUpperCase()}`);
  assert(madaraRole !== 'traitor', 'Requirement 2: Madara is never assigned to Traitor when normal roles are open');
}

// 3. LOW-RISK CHARACTERS MAY BE STRATEGICALLY ASSIGNED TO TRAITOR
// Tenten (traitorRisk: 2, auctionValue: 4).
// Available roles: Captain (rating 3), Medic (rating 1), Traitor.
// CPU should strategically assign Tenten to Traitor: it safely disarms the Traitor liability
// with a low-impact character, leaving Captain and Medic open for future high-tier ninjas!
{
  const mockCpu = {
    team: {
      captain: null, // Tenten suitability: 3
      attacker: { name: 'Naruto' },
      tank: { name: 'Choji' },
      medic: null,   // Tenten suitability: 1
      support: { name: 'Shikamaru' },
      traitor: null  // Traitor slot open, Tenten traitorRisk = 2 (harmless traitor)
    }
  };

  const tentenRole = chooseBestRoleForCpu(tenten, mockCpu);
  console.log(`Tenten (Captain: 3, Medic: 1, Traitor open, risk: 2) -> CPU Assigned: ${tentenRole.toUpperCase()}`);
  assert(tentenRole === 'traitor', 'Requirement 3: Tenten strategically assigned to TRAITOR to safely disarm the liability slot');
}

// 4. FORCED ASSIGNMENT WHEN TRAITOR IS THE ONLY REMAINING ROLE
{
  const mockCpu = {
    team: {
      captain: { name: 'P1' },
      attacker: { name: 'P2' },
      tank: { name: 'P3' },
      medic: { name: 'P4' },
      support: { name: 'P5' },
      traitor: null // ONLY Traitor remains
    }
  };

  const forcedRole = chooseBestRoleForCpu(madara, mockCpu);
  console.log(`Madara when only Traitor slot remains -> CPU Assigned: ${forcedRole.toUpperCase()}`);
  assert(forcedRole === 'traitor', 'Requirement 4: Forced assignment to Traitor when it is the only remaining slot');
}

// 5. BIDDING VALUATION ACCOUNTS FOR BETRAYAL RISK WHEN ONLY TRAITOR REMAINS
// User prompt: "If Traitor is the ONLY remaining slot, then CPU knows:
// 'If I acquire this character, they will become my Traitor.'
// This should LOWER willingness to pay for extremely dangerous/high-value characters.
// Example: CPU only has Traitor empty. Madara appears. CPU should NOT think: 'Madara is amazing, spend everything.'
// Instead it should understand: 'Madara would become MY TRAITOR and fight/betray my team.'
// Therefore Madara may actually be a terrible acquisition in this situation."
{
  const mockCpuTraitorOnly = {
    id: 'p2',
    name: 'CPU',
    budget: 20,
    team: {
      captain: { name: 'P1' },
      attacker: { name: 'P2' },
      tank: { name: 'P3' },
      medic: { name: 'P4' },
      support: { name: 'P5' },
      traitor: null // Only Traitor remains
    }
  };

  const madaraMaxBid = calculateMaxBid({
    character: madara, // traitorRisk = 10
    cpuPlayer: mockCpuTraitorOnly,
    humanPlayer: null,
    controlledRandom: false
  });

  const tentenMaxBid = calculateMaxBid({
    character: tenten, // traitorRisk = 2
    cpuPlayer: mockCpuTraitorOnly,
    humanPlayer: null,
    controlledRandom: false
  });

  console.log(`Only Traitor remaining -> Madara (traitorRisk 10) Max Bid: $${madaraMaxBid}`);
  console.log(`Only Traitor remaining -> Tenten (traitorRisk 2)  Max Bid: $${tentenMaxBid}`);

  assert(madaraMaxBid === 0, 'Requirement 5A: Madara max bid is $0 when only Traitor slot remains (catastrophic betrayal risk)');
  assert(tentenMaxBid > 0, 'Requirement 5B: Tenten max bid is positive ($1-$2) to safely disarm the Traitor slot');

  // Verify Madara desirability when only Traitor remains
  const madaraTraitorDes = calculateDesirability(madara, ['traitor']);
  const tentenTraitorDes = calculateDesirability(tenten, ['traitor']);
  console.log(`Only Traitor remaining -> Madara Desirability: ${madaraTraitorDes} / 10`);
  console.log(`Only Traitor remaining -> Tenten Desirability: ${tentenTraitorDes} / 10`);
  assert(madaraTraitorDes <= 2.0, 'Requirement 5C: Madara desirability as Traitor is very low (<= 2.0)');
  assert(tentenTraitorDes >= 7.0, 'Requirement 5D: Tenten desirability as safe Traitor is high (>= 7.0)');
}

// 6. ROLE FIT HELPER DOES NOT TREAT TRAITOR AS BENEFICIAL
{
  const fit = getBestAvailableRoleFit(itachi, ['medic', 'tank', 'traitor']);
  console.log(`getBestAvailableRoleFit for Itachi among [medic, tank, traitor]: ${fit.role} (rating ${fit.rating})`);
  assert(fit.role === 'tank' && fit.rating === 6, 'Requirement 6: getBestAvailableRoleFit ignores Traitor and returns Tank (rating 6)');
}

// 7. NO HARD RESERVE PROTECTION WHEN NORMAL ROLES EXIST
// (Madara when normal roles exist still allows full budget spend)
{
  const mockCpu = {
    id: 'p2',
    name: 'CPU',
    budget: 8,
    team: {
      captain: null,
      attacker: null,
      tank: null,
      medic: { name: 'P1' },
      support: { name: 'P2' },
      traitor: { name: 'P3' }
    }
  };

  const maxBid = calculateMaxBid({
    character: madara,
    cpuPlayer: mockCpu,
    humanPlayer: null,
    controlledRandom: false
  });

  console.log(`Madara with 3 normal roles empty & $8 Budget -> Max Bid: $${maxBid}`);
  assert(maxBid === 8, 'Requirement 7: CPU can spend all $8 for Madara when normal roles are open');
}

// 8. FULL BID DECISION VERIFICATION (MADARA PASSES AS TRAITOR-ONLY)
{
  const state = createInitialAuctionState('cpu');
  state.players.p2.team = {
    captain: { name: 'P1' },
    attacker: { name: 'P2' },
    tank: { name: 'P3' },
    medic: { name: 'P4' },
    support: { name: 'P5' },
    traitor: null
  };
  state.currentCharacter = madara;
  state.currentBid = 1;
  state.highestBidder = 'p1';
  state.activePlayer = 'p2';

  const decision = getBotBidDecision({ auctionState: state, controlledRandom: false });
  console.log(`getBotBidDecision when only Traitor is open and currentCharacter is Madara: ${decision.type}`);
  assert(decision.type === 'PASS', 'Requirement 8: CPU passes on Madara when only Traitor slot remains');
}

// 9. ZERO CLAIM DECISION VERIFICATION (MADARA PASSED, TENTEN CLAIMED)
{
  const state = createInitialAuctionState('cpu');
  state.players.p1.budget = 0;
  state.players.p2.budget = 0;
  state.auctionMode = 'ZERO_CLAIM';
  state.players.p2.team = {
    captain: { name: 'P1' },
    attacker: { name: 'P2' },
    tank: { name: 'P3' },
    medic: { name: 'P4' },
    support: { name: 'P5' },
    traitor: null
  };

  state.currentCharacter = madara;
  const madaraDecision = getBotZeroClaimDecision({ auctionState: state });
  console.log(`getBotZeroClaimDecision for Madara (traitorRisk 10): ${madaraDecision.type}`);
  assert(madaraDecision.type === 'PASS', 'Requirement 9A: CPU passes on Madara in ZERO_CLAIM when only Traitor remains');

  state.currentCharacter = tenten;
  const tentenDecision = getBotZeroClaimDecision({ auctionState: state });
  console.log(`getBotZeroClaimDecision for Tenten (traitorRisk 2): ${tentenDecision.type}`);
  assert(tentenDecision.type === 'CLAIM', 'Requirement 9B: CPU claims Tenten in ZERO_CLAIM to safely disarm Traitor');
}

setDebugAI(false);
console.log('\n🌟 ALL STRATEGIC TRAITOR BOT AI TESTS PASSED VERIFICATION!');

