/**
 * Minimal Draft Engine Placeholder (Step 2)
 * Full auction state machine, fodder dump logic, and claim mode will be built in subsequent steps.
 */
import { GAME_CONSTANTS } from './constants';

export function createInitialDraftState(gameMode = 'cpu') {
  return {
    gameMode,
    round: 1,
    budgetLimit: GAME_CONSTANTS.STARTING_BUDGET,
    p1: {
      id: 'p1',
      name: 'Player 1',
      budget: GAME_CONSTANTS.STARTING_BUDGET,
      roster: {
        captain: null,
        attacker: null,
        tank: null,
        medic: null,
        support: null,
        traitor: null
      }
    },
    p2: {
      id: gameMode === 'cpu' ? 'cpu' : 'p2',
      name: gameMode === 'cpu' ? 'CPU' : 'Player 2',
      budget: GAME_CONSTANTS.STARTING_BUDGET,
      roster: {
        captain: null,
        attacker: null,
        tank: null,
        medic: null,
        support: null,
        traitor: null
      }
    },
    currentTurn: 'p1',
    currentBid: 1,
    highestBidder: null,
    isRevealed: false
  };
}
