/**
 * Naruto Draft - Bot AI (Step 5 - Updated with Strategic Traitor Role Rules)
 * Pure decision engine for the Computer Opponent (CPU).
 *
 * CRITICAL RULE UPDATE FOR TRAITOR:
 * - Traitor is a LIABILITY SLOT (betrays team during final battle).
 * - It is NOT a normal positive role suitability slot.
 * - Normal roleRatings represent: captain, attacker, tank, medic, support.
 * - traitorRisk (1-10) measures how dangerous/catastrophic the character is if they betray your team.
 * - High-risk characters (Madara, Itachi, Hashirama) must be protected from Traitor when normal roles are open.
 * - Low-risk characters (Tenten, Hinata, Kiba) are strategic candidates to safely disarm the Traitor slot.
 * - When Traitor is the ONLY remaining slot, willingness to pay for elite/high-risk characters drops dramatically
 *   (e.g. Madara is a liability as Traitor, so CPU will not spend big for him).
 */

import { getEmptyRoles, isTeamFull, getMinimumNextBid } from './auctionEngine.js';

// Normal beneficial team roles (Traitor is excluded from beneficial role ratings)
export const NORMAL_ROLES = ['captain', 'attacker', 'tank', 'medic', 'support'];

// Global debug flag (toggleable in console via window.__DEBUG_AI__)
export let DEBUG_AI = false;

export function setDebugAI(enabled) {
  DEBUG_AI = Boolean(enabled);
}

// Desirability score component weights for normal team roles
export const AI_WEIGHTS = {
  auctionValue: 0.55,
  bestRoleRating: 0.35,
  overallStats: 0.10
};

/**
 * Computes average of 8 shinobi stats (1-10).
 */
export function getAverageStats(character) {
  if (!character || !character.stats) return 5;
  const stats = character.stats;
  const keys = ['power', 'speed', 'defense', 'chakra', 'intelligence', 'ninjutsu', 'taijutsu', 'genjutsu'];
  const total = keys.reduce((acc, k) => acc + (stats[k] || 5), 0);
  return total / keys.length;
}

/**
 * Finds the best role fit and rating strictly among empty NORMAL roles.
 * Traitor is NEVER evaluated as a beneficial role.
 */
export function getBestAvailableRoleFit(character, emptyRoles) {
  if (!character || !character.roleRatings || !emptyRoles || emptyRoles.length === 0) {
    return { role: null, rating: 1 };
  }

  // Filter out Traitor: normal suitability only applies to beneficial roles
  const normalEmptyRoles = emptyRoles.filter((r) => NORMAL_ROLES.includes(r));

  if (normalEmptyRoles.length === 0) {
    // Only Traitor is empty: return null role with default baseline
    return { role: null, rating: 1 };
  }

  let bestRole = normalEmptyRoles[0];
  let bestRating = -1;

  for (const role of normalEmptyRoles) {
    const rating = character.roleRatings[role] !== undefined ? character.roleRatings[role] : 1;
    if (rating > bestRating) {
      bestRating = rating;
      bestRole = role;
    }
  }

  return { role: bestRole, rating: Math.max(1, bestRating) };
}

/**
 * Calculates normalized desirability score (1.0 to 10.0).
 *
 * If CPU has normal roles open:
 *   Desirability is based on auctionValue, best normal role fit, and stats.
 * If CPU ONLY has Traitor open:
 *   Desirability is INVERTED relative to traitorRisk:
 *   Low-risk characters (Tenten, Kiba) are desirable because they safely disarm the Traitor slot.
 *   Catastrophic characters (Madara, Itachi) have low desirability because they will betray your team.
 */
export function calculateDesirability(character, emptyRoles) {
  if (!character) return 1;

  const isTraitorOnly = emptyRoles && emptyRoles.length === 1 && emptyRoles[0] === 'traitor';

  // SPECIAL CASE: Only Traitor slot remains
  if (isTraitorOnly) {
    const risk = character.traitorRisk !== undefined ? character.traitorRisk : 7;
    // Lower risk is much more desirable to have as traitor
    // Risk 1-2 -> score ~8-9; Risk 9-10 -> score ~1-2
    const safeTraitorScore = Math.max(1, 11 - risk);
    const score = safeTraitorScore * 0.7 + Math.max(1, 11 - (character.auctionValue || 5)) * 0.3;
    return Math.min(10, Math.max(1, parseFloat(score.toFixed(2))));
  }

  // STANDARD CASE: Normal beneficial roles exist
  const auctionVal = character.auctionValue || 5;
  const { rating: bestRoleRating } = getBestAvailableRoleFit(character, emptyRoles);
  const statsAvg = getAverageStats(character);

  const score =
    auctionVal * AI_WEIGHTS.auctionValue +
    bestRoleRating * AI_WEIGHTS.bestRoleRating +
    statsAvg * AI_WEIGHTS.overallStats;

  return Math.min(10, Math.max(1, parseFloat(score.toFixed(2))));
}

/**
 * Calculates CPU's maximum willingness to pay (maxBid).
 *
 * Rules:
 * - NO artificial reserve-budget protection for normal roles.
 * - If only Traitor remains: willingness to pay for elite/high-risk characters is drastically capped
 *   because they will become the CPU's traitor and fight against them.
 */
export function calculateMaxBid({
  character,
  cpuPlayer,
  humanPlayer,
  controlledRandom = true
}) {
  if (!character || !cpuPlayer || cpuPlayer.budget <= 0) {
    return 0;
  }

  const cpuBudget = cpuPlayer.budget;
  const cpuEmptyRoles = getEmptyRoles(cpuPlayer);
  const cpuSlotsLeft = cpuEmptyRoles.length;

  if (cpuSlotsLeft === 0) return 0;

  const isTraitorOnly = cpuSlotsLeft === 1 && cpuEmptyRoles[0] === 'traitor';
  const risk = character.traitorRisk !== undefined ? character.traitorRisk : 7;

  // TRAITOR-ONLY SITUATION:
  // CPU knows: "This character will become my Traitor and betray my team."
  if (isTraitorOnly) {
    if (risk >= 7 || (character.auctionValue || 5) >= 8) {
      // Catastrophic traitor: CPU will NOT bid high; cap at $0 or $1
      return 0;
    }
    // Low-risk traitor (e.g. Tenten, Kiba, Hinata): willing to pay small amount ($1-$2) to secure safe traitor
    if (risk <= 3) {
      return Math.min(cpuBudget, 2);
    }
    // Moderate risk: max $1
    return Math.min(cpuBudget, 1);
  }

  // NORMAL SQUAD FORMATION:
  const desirability = calculateDesirability(character, cpuEmptyRoles);
  const { rating: bestRoleRating } = getBestAvailableRoleFit(character, cpuEmptyRoles);

  // Market value power-curve
  const baseVal = Math.pow(desirability / 10, 1.35) * 12 + 1;

  // Budget pressure context: average budget per remaining slot (Starting avg is 30/6 = 5.0)
  const avgBudgetPerSlot = cpuBudget / cpuSlotsLeft;
  const budgetRatio = avgBudgetPerSlot / 5.0;

  let pressureFactor;
  if (desirability >= 8.5) {
    // Elite tier: high willingness even under budget stress
    pressureFactor = Math.min(1.3, Math.max(0.75, 0.65 + 0.35 * budgetRatio));
  } else if (desirability >= 6.5) {
    // Solid tier: moderate budget sensitivity
    pressureFactor = Math.min(1.25, Math.max(0.55, 0.5 + 0.5 * budgetRatio));
  } else {
    // Low/mediocre tier: strong budget conservation
    pressureFactor = Math.min(1.1, Math.max(0.4, 0.4 + 0.6 * budgetRatio));
  }

  let valuation = baseVal * pressureFactor;

  // Final normal slot special fit bonus
  const normalSlotsLeft = cpuEmptyRoles.filter((r) => NORMAL_ROLES.includes(r)).length;
  if (normalSlotsLeft === 1 && bestRoleRating >= 8) {
    valuation += 1.5;
  }

  // Light opponent awareness (denial factor)
  if (humanPlayer) {
    const humanEmptyRoles = getEmptyRoles(humanPlayer).filter((r) => NORMAL_ROLES.includes(r));
    if (humanEmptyRoles.length <= 2) {
      const humanFit = getBestAvailableRoleFit(character, humanEmptyRoles);
      if (humanFit.rating >= 9) {
        valuation += 0.8;
      }
    }
  }

  // Controlled variance (±10% to ±14%) for normal difficulty
  if (controlledRandom) {
    const variance = 1 + (Math.random() * 0.24 - 0.12);
    valuation *= variance;
  }

  let maxBid = Math.round(valuation);

  // Elite character with small budget can consume entire budget
  if (desirability >= 8.5 && cpuBudget <= 10 && bestRoleRating >= 8) {
    maxBid = Math.max(maxBid, cpuBudget);
  }

  // Weak characters (desirability < 4.0) capped at $2
  if (desirability < 4.0) {
    maxBid = Math.min(maxBid, 2);
  }

  // Hard clamp
  maxBid = Math.max(0, Math.min(cpuBudget, maxBid));

  return maxBid;
}

/**
 * Main CPU decision function called during bidding turns.
 * Returns legal action object for Draft.jsx to pass to auctionEngine.
 */
export function getBotBidDecision({
  auctionState,
  controlledRandom = true
}) {
  const { currentCharacter, currentBid, highestBidder, auctionMode } = auctionState;
  const cpu = auctionState.players.p2;
  const human = auctionState.players.p1;

  if (!currentCharacter || isTeamFull(cpu)) {
    return { type: 'PASS' };
  }

  const cpuEmptyRoles = getEmptyRoles(cpu);
  const isTraitorOnly = cpuEmptyRoles.length === 1 && cpuEmptyRoles[0] === 'traitor';
  const risk = currentCharacter.traitorRisk !== undefined ? currentCharacter.traitorRisk : 7;
  const desirability = calculateDesirability(currentCharacter, cpuEmptyRoles);
  const { role: bestRole, rating: bestRoleRating } = getBestAvailableRoleFit(currentCharacter, cpuEmptyRoles);
  const maxBid = calculateMaxBid({
    character: currentCharacter,
    cpuPlayer: cpu,
    humanPlayer: human,
    controlledRandom
  });

  // 1. FODDER DUMP MODE (CPU has $, Human has $0)
  if (auctionMode === 'FODDER_DUMP') {
    let wantsCharacter;

    if (isTraitorOnly) {
      // If only Traitor remains:
      // High-risk characters (Madara, Itachi) -> PASS to dump them onto Human!
      // Low-risk characters (Tenten, Kiba) -> BID $1 to safely lock in a harmless traitor.
      wantsCharacter = risk <= 4 && cpu.budget >= 1;
    } else {
      // Normal squad building:
      wantsCharacter =
        (bestRoleRating >= 6 && desirability >= 5.0) ||
        desirability >= 8.0;
    }

    const decision = (wantsCharacter && cpu.budget >= 1)
      ? { type: 'BID', amount: 1 }
      : { type: 'PASS' };

    logDebug({
      mode: 'FODDER_DUMP',
      character: currentCharacter.name,
      desirability,
      bestRole: isTraitorOnly ? 'traitor' : bestRole,
      bestRoleRating,
      cpuBudget: cpu.budget,
      currentBid: 0,
      maxBid,
      decision: decision.type === 'BID' ? 'BID $1 (Claim)' : 'PASS (Dump onto Human)'
    });

    return decision;
  }

  // 2. NORMAL BIDDING MODE
  const minNextBid = getMinimumNextBid(currentBid);

  // If CPU is opening the auction (no bids exist yet)
  if (highestBidder === null) {
    if (isTraitorOnly && risk >= 7) {
      // If Traitor is only slot and character is catastrophic, CPU opens with minimum $1
      // but will readily concede if human bids
      const decision = { type: 'BID', amount: 1 };
      return decision;
    }

    let openingBid = 1;

    // Small chance to open higher if character is elite and CPU is rich (and not traitor-only)
    if (!isTraitorOnly && maxBid >= 7 && cpu.budget >= 18 && Math.random() < 0.25) {
      openingBid = 2;
    }

    openingBid = Math.min(openingBid, cpu.budget);
    const decision = { type: 'BID', amount: openingBid };

    logDebug({
      mode: 'NORMAL_OPENING',
      character: currentCharacter.name,
      desirability,
      bestRole: isTraitorOnly ? 'traitor' : bestRole,
      bestRoleRating,
      cpuBudget: cpu.budget,
      currentBid,
      maxBid,
      decision: `BID $${openingBid}`
    });

    return decision;
  }

  // Human has placed a bid: evaluate raise vs pass
  if (minNextBid > maxBid || minNextBid > cpu.budget) {
    const decision = { type: 'PASS' };

    logDebug({
      mode: 'NORMAL_CONCESSION',
      character: currentCharacter.name,
      desirability,
      bestRole: isTraitorOnly ? 'traitor' : bestRole,
      bestRoleRating,
      cpuBudget: cpu.budget,
      currentBid,
      maxBid,
      decision: 'PASS'
    });

    return decision;
  }

  // CPU chooses to raise. Determine bid sizing:
  let raiseAmount = minNextBid;
  const spread = maxBid - currentBid;

  if (!isTraitorOnly && spread >= 4 && cpu.budget >= currentBid + 2 && Math.random() < 0.35) {
    raiseAmount = currentBid + 2;
  }

  raiseAmount = Math.max(minNextBid, Math.min(cpu.budget, Math.min(maxBid, raiseAmount)));
  const decision = { type: 'BID', amount: raiseAmount };

  logDebug({
    mode: 'NORMAL_RAISE',
    character: currentCharacter.name,
    desirability,
    bestRole: isTraitorOnly ? 'traitor' : bestRole,
    bestRoleRating,
    cpuBudget: cpu.budget,
    currentBid,
    maxBid,
    decision: `BID $${raiseAmount}`
  });

  return decision;
}

/**
 * CPU decision during Zero-Claim mode ($0 vs $0).
 * Chooses CLAIM ($0) if character benefits CPU, or PASS to force onto opponent.
 */
export function getBotZeroClaimDecision({
  auctionState
}) {
  const { currentCharacter } = auctionState;
  const cpu = auctionState.players.p2;

  if (!currentCharacter || isTeamFull(cpu)) {
    return { type: 'PASS' };
  }

  const cpuEmptyRoles = getEmptyRoles(cpu);
  const isTraitorOnly = cpuEmptyRoles.length === 1 && cpuEmptyRoles[0] === 'traitor';
  const risk = currentCharacter.traitorRisk !== undefined ? currentCharacter.traitorRisk : 7;
  const desirability = calculateDesirability(currentCharacter, cpuEmptyRoles);
  const { role: bestRole, rating: bestRoleRating } = getBestAvailableRoleFit(currentCharacter, cpuEmptyRoles);

  let shouldClaim;

  if (isTraitorOnly) {
    // If only Traitor remains:
    // Low-risk characters (Tenten, Kiba) are CLAIMED for $0 (safely disarms traitor slot).
    // Dangerous characters (Madara, Itachi) are PASSED to force them onto human as human's traitor!
    shouldClaim = risk <= 4;
  } else {
    shouldClaim = (bestRoleRating >= 6 && desirability >= 5.0) || desirability >= 8.0;
  }

  const decision = shouldClaim ? { type: 'CLAIM' } : { type: 'PASS' };

  logDebug({
    mode: 'ZERO_CLAIM',
    character: currentCharacter.name,
    desirability,
    bestRole: isTraitorOnly ? 'traitor' : bestRole,
    bestRoleRating,
    cpuBudget: 0,
    currentBid: 0,
    maxBid: 0,
    decision: decision.type === 'CLAIM' ? 'CLAIM $0' : 'PASS to Human'
  });

  return decision;
}

/**
 * CPU role assignment decision.
 *
 * STRATEGIC RULES FOR TRAITOR ASSIGNMENT:
 * 1. Traitor is a LIABILITY SLOT (betrays team during battle).
 * 2. High-value / high-risk characters (Madara, Itachi, Tsunade, etc.) MUST be protected
 *    and assigned to a beneficial normal role (Captain, Attacker, Tank, Medic, Support).
 * 3. Weaker, low-risk characters (Tenten, Kiba, Hinata with traitorRisk <= 4) can be strategically
 *    assigned to Traitor to disarm the liability slot and save normal roles for stronger ninjas.
 * 4. If Traitor is the ONLY remaining role, forced assignment occurs.
 */
export function chooseBestRoleForCpu(character, cpuPlayer) {
  if (!character || !cpuPlayer) return null;

  const emptyRoles = getEmptyRoles(cpuPlayer);
  if (emptyRoles.length === 0) return null;
  if (emptyRoles.length === 1) return emptyRoles[0];

  const normalEmptyRoles = emptyRoles.filter((r) => NORMAL_ROLES.includes(r));

  // If no normal roles are open, Traitor must be selected
  if (normalEmptyRoles.length === 0) {
    return 'traitor';
  }

  // Find best available normal role and rating
  const { role: bestNormalRole, rating: bestNormalRating } = getBestAvailableRoleFit(character, normalEmptyRoles);

  const risk = character.traitorRisk !== undefined ? character.traitorRisk : 7;
  const auctionVal = character.auctionValue || 5;

  // RULE A: Strong / High-Risk characters are NEVER placed into Traitor when a normal role is open
  if (risk >= 6 || auctionVal >= 7) {
    logDebug({
      mode: 'ROLE_ASSIGNMENT',
      character: character.name,
      decision: `Assign to ${bestNormalRole.toUpperCase()} (Protected from Traitor: risk=${risk})`
    });
    return bestNormalRole;
  }

  // RULE B: Low-Risk / Weak characters (risk <= 4, auctionVal <= 5)
  // If Traitor is open and their best normal role rating is poor/mediocre (<= 6),
  // placing them into Traitor safely disarms the liability slot while saving beneficial roles!
  const hasTraitorOpen = emptyRoles.includes('traitor');
  const traitorDisarmValue = 10 - risk; // e.g. risk 2 -> 8, risk 3 -> 7

  if (hasTraitorOpen && traitorDisarmValue > bestNormalRating) {
    logDebug({
      mode: 'ROLE_ASSIGNMENT',
      character: character.name,
      decision: `Assign to TRAITOR (Safely disarms Traitor slot with low-risk character: risk=${risk})`
    });
    return 'traitor';
  }

  logDebug({
    mode: 'ROLE_ASSIGNMENT',
    character: character.name,
    decision: `Assign to ${bestNormalRole.toUpperCase()} (Rating: ${bestNormalRating})`
  });

  return bestNormalRole;
}

/**
 * Internal developer logging when DEBUG_AI is enabled.
 */
function logDebug(data) {
  if (!DEBUG_AI && (typeof window === 'undefined' || !window.__DEBUG_AI__)) {
    return;
  }

  console.groupCollapsed(`[CPU AI DEBUG] ${data.character} -> ${data.decision}`);
  console.log(`Mode:            ${data.mode}`);
  console.log(`Desirability:    ${data.desirability}`);
  console.log(`Best Role:       ${data.bestRole} (Rating: ${data.bestRoleRating})`);
  console.log(`CPU Budget:      $${data.cpuBudget}`);
  console.log(`Current Bid:     $${data.currentBid}`);
  console.log(`Calculated Max:  $${data.maxBid}`);
  console.log(`Decision:        ${data.decision}`);
  console.groupEnd();
}
