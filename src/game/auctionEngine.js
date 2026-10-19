/**
 * Real Naruto Draft Auction Engine (Step 4)
 * Pure game rules & state machine for Naruto Draft auctions.
 *
 * Responsibilities:
 * - Legal bid validation and execution
 * - Turn and opening priority alternation
 * - Normal auction flow, Pass concessions, and payments
 * - Special auction modes:
 *     1. Fodder-Dump Mode (one player has $0, funded player bids $1 or forces pass)
 *     2. Zero-Claim Mode (both players have $0, priority player claims or forces pass)
 *     3. One-Team-Full Mode (completed player excluded, incomplete receives for $0)
 * - Role assignment & auto-assignment for last remaining empty slot
 * - Team completion verification (6/6 each)
 */

import { STARTING_BUDGET, TEAM_SIZE, ROLES } from './gameConstants.js';

// Auction Phases
export const AUCTION_PHASE = {
  WAITING_FOR_REVEAL: 'waitingForReveal',
  BIDDING: 'bidding',
  ZERO_CLAIM: 'zeroClaim',
  ROLE_ASSIGNMENT: 'roleAssignment',
  COMPLETE: 'complete'
};

// Auction Modes
export const AUCTION_MODE = {
  NORMAL: 'NORMAL',
  FODDER_DUMP: 'FODDER_DUMP',
  ZERO_CLAIM: 'ZERO_CLAIM',
  ONE_TEAM_FULL: 'ONE_TEAM_FULL',
  MATCH_COMPLETE: 'MATCH_COMPLETE'
};

/**
 * Creates a clean player initial state.
 */
export function createInitialPlayer(id, name, isCpu = false) {
  const team = {};
  ROLES.forEach((role) => {
    team[role] = null;
  });

  return {
    id,
    name,
    isCpu,
    budget: STARTING_BUDGET,
    team,
    roster: team
  };
}

/**
 * Creates clean initial auction state for a match.
 */
export function createInitialAuctionState(gameMode = 'local') {
  const isCpuMode = gameMode === 'cpu';

  return {
    phase: AUCTION_PHASE.WAITING_FOR_REVEAL,
    auctionMode: AUCTION_MODE.NORMAL,
    currentCharacter: null,
    currentBid: 0,
    highestBidder: null, // 'p1' | 'p2' | null
    activePlayer: 'p1', // 'p1' | 'p2'
    openingPlayer: 'p1', // alternates by character number
    zeroClaimPriority: 'p1', // alternates each time zero-claim is entered
    characterNumber: 1,
    winner: null, // 'p1' | 'p2' | null
    winningBid: 0,
    statusMessage: 'Click "REVEAL CHARACTER" to begin the auction.',
    autoAssignedMessage: null,
    players: {
      p1: createInitialPlayer('p1', 'PLAYER 1', false),
      p2: createInitialPlayer('p2', isCpuMode ? 'CPU' : 'PLAYER 2', isCpuMode)
    }
  };
}

/**
 * Counts filled roles in a player's team.
 */
export function getFilledRoleCount(player) {
  if (!player || !player.team) return 0;
  return ROLES.filter((role) => player.team[role] !== null).length;
}

/**
 * Checks if a player's team is complete (6/6).
 */
export function isTeamFull(player) {
  return getFilledRoleCount(player) >= TEAM_SIZE;
}

/**
 * Returns array of empty role IDs for a player.
 */
export function getEmptyRoles(player) {
  if (!player || !player.team) return [];
  return ROLES.filter((role) => player.team[role] === null);
}

/**
 * Determines which auction mode applies based on player states.
 */
export function determineAuctionMode(p1, p2) {
  const p1Full = isTeamFull(p1);
  const p2Full = isTeamFull(p2);

  if (p1Full && p2Full) {
    return AUCTION_MODE.MATCH_COMPLETE;
  }

  if (p1Full || p2Full) {
    return AUCTION_MODE.ONE_TEAM_FULL;
  }

  const p1HasBudget = p1.budget > 0;
  const p2HasBudget = p2.budget > 0;

  if (p1HasBudget && p2HasBudget) {
    return AUCTION_MODE.NORMAL;
  }

  if (!p1HasBudget && !p2HasBudget) {
    return AUCTION_MODE.ZERO_CLAIM;
  }

  // Exactly one player has budget > 0
  return AUCTION_MODE.FODDER_DUMP;
}

/**
 * Computes minimum legal next bid.
 * - If currentBid === 0: minimum is $1.
 * - If currentBid > 0: minimum is currentBid + 1.
 */
export function getMinimumNextBid(currentBid) {
  return currentBid <= 0 ? 1 : currentBid + 1;
}

/**
 * Validates a normal auction bid.
 */
export function validateBid({ bidAmount, currentBid, activePlayer, phase }) {
  if (phase !== AUCTION_PHASE.BIDDING) {
    return { isValid: false, error: 'Bidding is not open at this time.' };
  }

  if (!activePlayer) {
    return { isValid: false, error: 'No active player designated.' };
  }

  if (isTeamFull(activePlayer)) {
    return { isValid: false, error: `${activePlayer.name}'s squad is already complete.` };
  }

  const minBid = getMinimumNextBid(currentBid);

  if (typeof bidAmount !== 'number' || isNaN(bidAmount)) {
    return { isValid: false, error: 'Invalid bid amount format.' };
  }

  if (bidAmount < minBid) {
    return {
      isValid: false,
      error: `Bid must be at least $${minBid}. (Current bid: $${currentBid})`
    };
  }

  if (bidAmount > activePlayer.budget) {
    return {
      isValid: false,
      error: `Bid of $${bidAmount} exceeds ${activePlayer.name}'s available budget ($${activePlayer.budget}).`
    };
  }

  return { isValid: true };
}

/**
 * Handles character reveal and transitions auction state based on mode.
 */
export function processCharacterReveal(state, character) {
  if (state.phase !== AUCTION_PHASE.WAITING_FOR_REVEAL) {
    return { state, error: 'Cannot reveal another character while current auction is active.' };
  }

  if (!character) {
    return { state, error: 'No character provided to reveal.' };
  }

  const { p1, p2 } = state.players;
  const mode = determineAuctionMode(p1, p2);

  // Determine opening priority based on character number parity
  // Char #1 -> p1, Char #2 -> p2, Char #3 -> p1...
  const openingPlayerKey = state.characterNumber % 2 === 1 ? 'p1' : 'p2';

  // Base state with revealed character
  const next = {
    ...state,
    currentCharacter: character,
    currentBid: 0,
    highestBidder: null,
    winner: null,
    winningBid: 0,
    autoAssignedMessage: null,
    auctionMode: mode
  };

  // PATH D: ONE TEAM FULL
  if (mode === AUCTION_MODE.ONE_TEAM_FULL) {
    const incompletePlayerKey = isTeamFull(p1) ? 'p2' : 'p1';
    const completePlayerKey = incompletePlayerKey === 'p1' ? 'p2' : 'p1';
    const incompletePlayer = state.players[incompletePlayerKey];
    const emptyRoles = getEmptyRoles(incompletePlayer);

    // Character automatically awarded for $0
    next.winner = incompletePlayerKey;
    next.winningBid = 0;
    next.activePlayer = incompletePlayerKey;

    if (emptyRoles.length === 1) {
      // Auto-assign immediately
      const singleRole = emptyRoles[0];
      return {
        state: autoAssignPlayerRole(next, incompletePlayerKey, singleRole, 0, character),
        mode
      };
    }

    // Role assignment modal needed
    next.phase = AUCTION_PHASE.ROLE_ASSIGNMENT;
    next.statusMessage = `${state.players[completePlayerKey].name} squad is complete! ${incompletePlayer.name} receives ${character.name} for $0.`;
    return { state: next, mode };
  }

  // PATH C: BOTH $0 (ZERO-CLAIM MODE)
  if (mode === AUCTION_MODE.ZERO_CLAIM) {
    const priorityKey = state.zeroClaimPriority || 'p1';
    next.phase = AUCTION_PHASE.ZERO_CLAIM;
    next.activePlayer = priorityKey;
    next.statusMessage = `$0 CLAIM MODE: Both players have $0. ${state.players[priorityKey].name} has claim priority.`;
    return { state: next, mode };
  }

  // PATH B: FODDER-DUMP MODE (ONE HAS $0)
  if (mode === AUCTION_MODE.FODDER_DUMP) {
    const fundedKey = p1.budget > 0 ? 'p1' : 'p2';
    const zeroKey = fundedKey === 'p1' ? 'p2' : 'p1';
    next.phase = AUCTION_PHASE.BIDDING;
    next.activePlayer = fundedKey;
    next.statusMessage = `FODDER DUMP: ${state.players[zeroKey].name} has $0! ${state.players[fundedKey].name} may BID $1 to claim, or PASS to dump onto opponent.`;
    return { state: next, mode };
  }

  // PATH A: NORMAL AUCTION
  next.phase = AUCTION_PHASE.BIDDING;
  next.openingPlayer = openingPlayerKey;
  next.activePlayer = openingPlayerKey;
  next.statusMessage = `AUCTION OPEN: ${state.players[openingPlayerKey].name}'s turn to open the bidding (Min $1).`;

  return { state: next, mode };
}

/**
 * Handles a bid placed by the active player.
 */
export function processBid(state, bidAmount) {
  if (state.phase !== AUCTION_PHASE.BIDDING) {
    return { state, success: false, error: 'Bidding is not currently active.' };
  }

  const activeKey = state.activePlayer;
  const activePlayer = state.players[activeKey];
  const opponentKey = activeKey === 'p1' ? 'p2' : 'p1';
  const opponentPlayer = state.players[opponentKey];

  // In FODDER_DUMP mode: funded player can only bid $1 (or any legal positive bid <= budget)
  if (state.auctionMode === AUCTION_MODE.FODDER_DUMP) {
    if (activePlayer.budget < 1) {
      return { state, success: false, error: 'Insufficient funds.' };
    }
    const cost = Math.max(1, bidAmount || 1);
    if (cost > activePlayer.budget) {
      return { state, success: false, error: 'Bid exceeds available budget.' };
    }

    // Funded player immediately wins for the bid amount!
    return resolveAuctionWin(state, activeKey, cost);
  }

  // Normal bidding validation
  const validation = validateBid({
    bidAmount,
    currentBid: state.currentBid,
    activePlayer,
    phase: state.phase,
    auctionMode: state.auctionMode
  });

  if (!validation.isValid) {
    return { state, success: false, error: validation.error };
  }

  const nextState = {
    ...state,
    currentBid: bidAmount,
    highestBidder: activeKey,
    // Switch turn to opponent
    activePlayer: opponentKey,
    statusMessage: `${activePlayer.name} placed bid: $${bidAmount}. ${opponentPlayer.name}'s turn to raise or pass.`
  };

  return { state: nextState, success: true };
}

/**
 * Handles a pass by the active player.
 */
export function processPass(state) {
  if (state.phase === AUCTION_PHASE.ZERO_CLAIM) {
    // In zero-claim: priority player passes -> opponent is forced to receive for $0
    const priorityKey = state.activePlayer;
    const opponentKey = priorityKey === 'p1' ? 'p2' : 'p1';

    // Alternate zero claim priority for the next zero claim reveal
    const nextPriority = priorityKey === 'p1' ? 'p2' : 'p1';
    const stateWithPriority = {
      ...state,
      zeroClaimPriority: nextPriority
    };

    return resolveAuctionWin(stateWithPriority, opponentKey, 0);
  }

  if (state.phase !== AUCTION_PHASE.BIDDING) {
    return { state, success: false, error: 'Cannot pass at this phase.' };
  }

  const activeKey = state.activePlayer;
  const opponentKey = activeKey === 'p1' ? 'p2' : 'p1';

  // FODDER DUMP: Funded player passes -> Opponent is forced to receive for $0
  if (state.auctionMode === AUCTION_MODE.FODDER_DUMP) {
    return resolveAuctionWin(state, opponentKey, 0);
  }

  // NORMAL AUCTION:
  // Cannot pass if no bid exists yet (opening player must make initial bid)
  if (state.highestBidder === null) {
    return {
      state,
      success: false,
      error: 'Cannot pass on an unbid character. The opening player must bid at least $1.'
    };
  }

  // Active player concedes -> current highest bidder wins immediately!
  const winningKey = state.highestBidder;
  const winningBid = state.currentBid;

  return resolveAuctionWin(state, winningKey, winningBid);
}

/**
 * Handles claim in zero-claim mode.
 */
export function processZeroClaim(state) {
  if (state.phase !== AUCTION_PHASE.ZERO_CLAIM) {
    return { state, success: false, error: 'Zero-claim mode is not active.' };
  }

  const priorityKey = state.activePlayer;
  // Alternate zero claim priority for future reveals
  const nextPriority = priorityKey === 'p1' ? 'p2' : 'p1';
  const stateWithPriority = {
    ...state,
    zeroClaimPriority: nextPriority
  };

  return resolveAuctionWin(stateWithPriority, priorityKey, 0);
}

/**
 * Resolves a won character: deducts budget, checks empty roles (auto-assign if 1 left).
 */
export function resolveAuctionWin(state, winnerKey, cost) {
  const winner = state.players[winnerKey];
  const emptyRoles = getEmptyRoles(winner);

  // Deduct cost from winner's budget
  const newBudget = Math.max(0, winner.budget - cost);
  const updatedPlayers = {
    ...state.players,
    [winnerKey]: {
      ...winner,
      budget: newBudget
    }
  };

  const nextState = {
    ...state,
    players: updatedPlayers,
    winner: winnerKey,
    winningBid: cost
  };

  // If winner has exactly 1 empty role, automatically assign!
  if (emptyRoles.length === 1) {
    const singleRole = emptyRoles[0];
    const autoAssignedState = autoAssignPlayerRole(nextState, winnerKey, singleRole, cost, state.currentCharacter);
    return {
      state: autoAssignedState,
      assignedFamilyId: state.currentCharacter.familyId,
      success: true
    };
  }

  // Otherwise, transition to roleAssignment modal
  nextState.phase = AUCTION_PHASE.ROLE_ASSIGNMENT;
  nextState.statusMessage = `${winner.name} won ${state.currentCharacter.name} for $${cost}! Assigning squad category...`;

  return { state: nextState, success: true };
}

/**
 * Internal helper to automatically assign character when exactly 1 role is open.
 */
function autoAssignPlayerRole(state, playerKey, roleId, cost, character) {
  const player = state.players[playerKey];
  const roleNameUpper = roleId.toUpperCase();

  const updatedTeam = {
    ...player.team,
    [roleId]: {
      id: character.id,
      familyId: character.familyId,
      name: character.name,
      version: character.version,
      cost
    }
  };

  const updatedPlayers = {
    ...state.players,
    [playerKey]: {
      ...player,
      team: updatedTeam,
      roster: updatedTeam
    }
  };

  const autoMsg = `${character.name} was automatically assigned to ${player.name}'s only remaining slot: ${roleNameUpper}.`;

  // Check if match is now complete
  const p1Full = isTeamFull(updatedPlayers.p1);
  const p2Full = isTeamFull(updatedPlayers.p2);
  const isMatchComplete = p1Full && p2Full;

  return {
    ...state,
    players: updatedPlayers,
    phase: isMatchComplete ? AUCTION_PHASE.COMPLETE : AUCTION_PHASE.WAITING_FOR_REVEAL,
    auctionMode: isMatchComplete ? AUCTION_MODE.MATCH_COMPLETE : AUCTION_MODE.NORMAL,
    currentCharacter: null,
    currentBid: 0,
    highestBidder: null,
    winner: null,
    winningBid: 0,
    characterNumber: state.characterNumber + 1,
    autoAssignedMessage: autoMsg,
    statusMessage: isMatchComplete
      ? 'DRAFT COMPLETE! Both squads are fully assembled.'
      : `${autoMsg} Click "REVEAL CHARACTER" to continue.`
  };
}

/**
 * Assigns won character to a chosen role in the winner's squad.
 */
export function processRoleAssignment(state, roleId) {
  if (state.phase !== AUCTION_PHASE.ROLE_ASSIGNMENT) {
    return { state, success: false, error: 'Role assignment is not active.' };
  }

  const winnerKey = state.winner;
  if (!winnerKey || !state.players[winnerKey]) {
    return { state, success: false, error: 'No valid winner found.' };
  }

  const winner = state.players[winnerKey];
  const character = state.currentCharacter;

  if (!character) {
    return { state, success: false, error: 'No active character to assign.' };
  }

  // Ensure role exists and is empty
  if (!ROLES.includes(roleId)) {
    return { state, success: false, error: `Invalid role "${roleId}".` };
  }

  if (winner.team[roleId] !== null) {
    return { state, success: false, error: `Role "${roleId}" is already occupied.` };
  }

  const updatedTeam = {
    ...winner.team,
    [roleId]: {
      id: character.id,
      familyId: character.familyId,
      name: character.name,
      version: character.version,
      cost: state.winningBid
    }
  };

  const updatedPlayers = {
    ...state.players,
    [winnerKey]: {
      ...winner,
      team: updatedTeam,
      roster: updatedTeam
    }
  };

  // Check if both teams are full (6/6)
  const p1Full = isTeamFull(updatedPlayers.p1);
  const p2Full = isTeamFull(updatedPlayers.p2);
  const isComplete = p1Full && p2Full;

  const nextState = {
    ...state,
    players: updatedPlayers,
    phase: isComplete ? AUCTION_PHASE.COMPLETE : AUCTION_PHASE.WAITING_FOR_REVEAL,
    auctionMode: isComplete ? AUCTION_MODE.MATCH_COMPLETE : AUCTION_MODE.NORMAL,
    currentCharacter: null,
    currentBid: 0,
    highestBidder: null,
    winner: null,
    winningBid: 0,
    characterNumber: state.characterNumber + 1,
    autoAssignedMessage: null,
    statusMessage: isComplete
      ? 'DRAFT COMPLETE! Both squads are fully assembled.'
      : `Assigned ${character.name} to ${winner.name}'s ${roleId.toUpperCase()}. Click "REVEAL CHARACTER" for the next shinobi.`
  };

  return {
    state: nextState,
    assignedFamilyId: character.familyId,
    success: true
  };
}
