import { useState, useEffect, useRef } from 'react';
import PlayerPanel from '../components/PlayerPanel';
import CharacterCard from '../components/CharacterCard';
import BidControls from '../components/BidControls';
import RoleAssignmentModal from '../components/RoleAssignmentModal';
import AuctionLog from '../components/AuctionLog';
import DraftComplete from '../components/DraftComplete';
import { CHARACTERS } from '../data/characters';
import { getRandomAvailableCharacter } from '../game/characterSelector';
import {
  createInitialAuctionState,
  processCharacterReveal,
  processBid,
  processPass,
  processZeroClaim,
  processRoleAssignment,
  AUCTION_PHASE,
  getEmptyRoles
} from '../game/auctionEngine';
import {
  getBotBidDecision,
  getBotZeroClaimDecision,
  chooseBestRoleForCpu
} from '../game/botAI';
import './Draft.css';

export default function Draft({ gameMode = 'local', onBack }) {
  // Auction & Match State
  const [auctionState, setAuctionState] = useState(() => createInitialAuctionState(gameMode));
  const [usedFamilyIds, setUsedFamilyIds] = useState(() => new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPoolEmpty, setIsPoolEmpty] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  // CPU Thinking & Live Activity State
  const [activityLogs, setActivityLogs] = useState([]);
  const cpuTimerRef = useRef(null);
  const revealTimerRef = useRef(null);

  const { p1, p2 } = auctionState.players;
  const isP1Turn = auctionState.activePlayer === 'p1';
  const activePlayer = auctionState.players[auctionState.activePlayer];
  const opponentPlayer = auctionState.players[auctionState.activePlayer === 'p1' ? 'p2' : 'p1'];
  const isRevealed = Boolean(auctionState.currentCharacter);
  const isComplete = auctionState.phase === AUCTION_PHASE.COMPLETE;

  // Derive CPU status label dynamically based on active phase
  const isCpuActive =
    gameMode === 'cpu' &&
    !isComplete &&
    ((auctionState.phase === AUCTION_PHASE.ROLE_ASSIGNMENT && auctionState.winner === 'p2') ||
      (auctionState.phase === AUCTION_PHASE.ZERO_CLAIM && auctionState.activePlayer === 'p2') ||
      (auctionState.phase === AUCTION_PHASE.BIDDING && auctionState.activePlayer === 'p2'));

  const cpuStatus = !isCpuActive
    ? null
    : auctionState.phase === AUCTION_PHASE.ROLE_ASSIGNMENT
    ? 'CPU IS ASSIGNING ROLE...'
    : auctionState.phase === AUCTION_PHASE.ZERO_CLAIM
    ? 'CPU IS EVALUATING $0 CLAIM...'
    : 'CPU IS THINKING...';

  // Add an event to the compact auction log
  const addLog = (text, type = 'system') => {
    setActivityLogs((prev) => [
      { id: Date.now() + Math.random(), text, type },
      ...prev.slice(0, 5) // Keep latest 6 entries
    ]);
  };

  // Safe timer cleaner
  const clearCpuTimer = () => {
    if (cpuTimerRef.current) {
      clearTimeout(cpuTimerRef.current);
      cpuTimerRef.current = null;
    }
  };

  const clearRevealTimer = () => {
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  };

  // Cleanup on unmount or navigation
  useEffect(() => {
    return () => {
      clearCpuTimer();
      clearRevealTimer();
    };
  }, []);

  // Intelligent CPU AI Execution Loop (VS Computer Mode Only)
  useEffect(() => {
    if (gameMode !== 'cpu' || isProcessing || isComplete || isRevealing) return;

    clearCpuTimer();

    // 1. CPU ROLE ASSIGNMENT
    if (auctionState.phase === AUCTION_PHASE.ROLE_ASSIGNMENT && auctionState.winner === 'p2') {
      const char = auctionState.currentCharacter;
      const emptyRoles = getEmptyRoles(p2);

      if (char && emptyRoles.length > 0) {
        // 550ms to 900ms thinking delay for role placement
        const delay = Math.floor(550 + Math.random() * 350);

        cpuTimerRef.current = setTimeout(() => {
          const chosenRole = chooseBestRoleForCpu(char, p2);

          if (chosenRole) {
            const result = processRoleAssignment(auctionState, chosenRole);
            if (result.success) {
              setAuctionState(result.state);
              addLog(`🤖 CPU ASSIGNED ${char.name.toUpperCase()} → ${chosenRole.toUpperCase()}`, 'cpu');

              if (result.assignedFamilyId) {
                setUsedFamilyIds((prev) => new Set(prev).add(result.assignedFamilyId));
              }
            }
          }
        }, delay);

        return () => clearCpuTimer();
      }
    }

    // 2. CPU ZERO-CLAIM MODE DECISION
    if (auctionState.phase === AUCTION_PHASE.ZERO_CLAIM && auctionState.activePlayer === 'p2') {
      // 650ms to 1100ms thinking delay
      const delay = Math.floor(650 + Math.random() * 450);

      cpuTimerRef.current = setTimeout(() => {
        const decision = getBotZeroClaimDecision({ auctionState });

        if (decision.type === 'CLAIM') {
          const result = processZeroClaim(auctionState);
          if (result.success) {
            setAuctionState(result.state);
            addLog(`🤖 CPU CLAIMED ${auctionState.currentCharacter.name.toUpperCase()} FOR $0`, 'cpu');
            if (result.assignedFamilyId) {
              setUsedFamilyIds((prev) => new Set(prev).add(result.assignedFamilyId));
            }
          }
        } else {
          // PASS -> forces character onto human for $0
          const result = processPass(auctionState);
          if (result.success) {
            setAuctionState(result.state);
            addLog(`🤖 CPU PASSED ${auctionState.currentCharacter.name.toUpperCase()} TO YOU ($0)`, 'cpu');
            if (result.assignedFamilyId) {
              setUsedFamilyIds((prev) => new Set(prev).add(result.assignedFamilyId));
            }
          }
        }
      }, delay);

      return () => clearCpuTimer();
    }

    // 3. CPU BIDDING TURN (Normal & Fodder-Dump Modes)
    if (auctionState.phase === AUCTION_PHASE.BIDDING && auctionState.activePlayer === 'p2') {
      // 700ms to 1250ms thinking delay
      const delay = Math.floor(700 + Math.random() * 550);

      cpuTimerRef.current = setTimeout(() => {
        const decision = getBotBidDecision({ auctionState, controlledRandom: true });

        if (decision.type === 'BID') {
          const isOpening = auctionState.highestBidder === null;
          const result = processBid(auctionState, decision.amount);

          if (result.success) {
            setAuctionState(result.state);
            if (isOpening) {
              addLog(`🤖 CPU OPENED BID: $${decision.amount}`, 'cpu');
            } else if (decision.amount > auctionState.currentBid + 1) {
              addLog(`🤖 CPU JUMP-RAISED TO $${decision.amount}`, 'cpu');
            } else {
              addLog(`🤖 CPU RAISED TO $${decision.amount}`, 'cpu');
            }

            if (result.assignedFamilyId) {
              setUsedFamilyIds((prev) => new Set(prev).add(result.assignedFamilyId));
            }
          }
        } else if (decision.type === 'PASS') {
          const isFodder = auctionState.auctionMode === 'FODDER_DUMP';
          const result = processPass(auctionState);

          if (result.success) {
            setAuctionState(result.state);
            if (isFodder) {
              addLog(`🤖 CPU PASSED — DUMPED ${auctionState.currentCharacter.name.toUpperCase()} TO YOU ($0)`, 'cpu');
            } else {
              addLog(`🤖 CPU PASSED ON ${auctionState.currentCharacter.name.toUpperCase()}`, 'cpu');
            }

            if (result.assignedFamilyId) {
              setUsedFamilyIds((prev) => new Set(prev).add(result.assignedFamilyId));
            }
          }
        }
      }, delay);

      return () => clearCpuTimer();
    }
  }, [auctionState, gameMode, isProcessing, isComplete, isRevealing, p2]);

  // Reveal Character with Choreographed Animation Sequence
  const handleRevealCharacter = () => {
    if (isProcessing || isRevealed || isComplete || Boolean(cpuStatus) || isRevealing) return;

    clearCpuTimer();
    clearRevealTimer();

    const chosen = getRandomAvailableCharacter(CHARACTERS, usedFamilyIds);

    if (!chosen) {
      setIsPoolEmpty(true);
      console.warn('[Naruto Draft] No unused shinobi families remain in pool.');
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const revealDuration = prefersReducedMotion ? 120 : 850;

    setIsRevealing(true);
    setIsProcessing(true);

    const result = processCharacterReveal(auctionState, chosen);

    revealTimerRef.current = setTimeout(() => {
      setAuctionState(result.state);
      setIsRevealing(false);
      setIsProcessing(false);
      addLog(`✦ REVEALED: ${chosen.name.toUpperCase()} (${chosen.version})`, 'system');

      // If auto-assigned immediately (e.g. one team full and other has 1 slot left)
      if (result.assignedFamilyId) {
        setUsedFamilyIds((prev) => new Set(prev).add(result.assignedFamilyId));
        addLog(`👑 AUTO-ASSIGNED ${chosen.name.toUpperCase()} TO LAST REMAINING SLOT`, 'system');
      }
    }, revealDuration);
  };

  // Submit Bid (Human)
  const handleBid = (bidAmount) => {
    if (isProcessing || !isRevealed || isComplete || Boolean(cpuStatus) || isRevealing) return;

    setIsProcessing(true);
    const isOpening = auctionState.highestBidder === null;
    const result = processBid(auctionState, bidAmount);

    if (result.success) {
      setAuctionState(result.state);
      if (isOpening) {
        addLog(`👤 ${activePlayer.name} OPENED BID: $${bidAmount}`, 'human');
      } else {
        addLog(`👤 ${activePlayer.name} BID: $${bidAmount}`, 'human');
      }

      if (result.assignedFamilyId) {
        setUsedFamilyIds((prev) => new Set(prev).add(result.assignedFamilyId));
      }
    } else if (result.error) {
      console.warn('[Naruto Draft] Illegal bid rejected:', result.error);
    }

    setIsProcessing(false);
  };

  // Pass Action (Human)
  const handlePass = () => {
    if (isProcessing || !isRevealed || isComplete || Boolean(cpuStatus) || isRevealing) return;

    setIsProcessing(true);
    const result = processPass(auctionState);

    if (result.success) {
      setAuctionState(result.state);
      addLog(`👤 ${activePlayer.name} PASSED`, 'human');

      if (result.assignedFamilyId) {
        setUsedFamilyIds((prev) => new Set(prev).add(result.assignedFamilyId));
      }
    } else if (result.error) {
      console.warn('[Naruto Draft] Illegal pass rejected:', result.error);
    }

    setIsProcessing(false);
  };

  // Zero-Claim Action (Human)
  const handleZeroClaim = () => {
    if (isProcessing || !isRevealed || isComplete || Boolean(cpuStatus) || isRevealing) return;

    setIsProcessing(true);
    const result = processZeroClaim(auctionState);

    if (result.success) {
      setAuctionState(result.state);
      addLog(`👤 ${activePlayer.name} CLAIMED FOR $0`, 'human');

      if (result.assignedFamilyId) {
        setUsedFamilyIds((prev) => new Set(prev).add(result.assignedFamilyId));
      }
    }

    setIsProcessing(false);
  };

  // Assign Role from Modal (Human)
  const handleAssignRole = (roleId) => {
    if (isProcessing || !auctionState.winner) return;

    setIsProcessing(true);
    const charName = auctionState.currentCharacter?.name || 'Shinobi';
    const result = processRoleAssignment(auctionState, roleId);

    if (result.success) {
      setAuctionState(result.state);
      addLog(`👤 ASSIGNED ${charName.toUpperCase()} → ${roleId.toUpperCase()}`, 'human');

      if (result.assignedFamilyId) {
        setUsedFamilyIds((prev) => new Set(prev).add(result.assignedFamilyId));
      }
    } else if (result.error) {
      console.warn('[Naruto Draft] Role assignment rejected:', result.error);
    }

    setIsProcessing(false);
  };

  // Restart match fresh
  const handleRestartMatch = () => {
    clearCpuTimer();
    clearRevealTimer();
    setActivityLogs([]);
    setAuctionState(createInitialAuctionState(gameMode));
    setUsedFamilyIds(new Set());
    setIsPoolEmpty(false);
    setIsProcessing(false);
    setIsRevealing(false);
  };

  // Clean exit back home
  const handleBackHome = () => {
    clearCpuTimer();
    clearRevealTimer();
    onBack();
  };

  // Determine winner details for the role modal & sold banner
  const winnerPlayer = auctionState.winner ? auctionState.players[auctionState.winner] : null;
  const showRoleModal =
    auctionState.phase === AUCTION_PHASE.ROLE_ASSIGNMENT &&
    Boolean(winnerPlayer) &&
    Boolean(auctionState.currentCharacter) &&
    !(gameMode === 'cpu' && auctionState.winner === 'p2'); // Don't show human modal for CPU

  // Disable controls when CPU is thinking, processing, or revealing
  const isHumanDisabled =
    isProcessing ||
    isRevealing ||
    Boolean(cpuStatus) ||
    (gameMode === 'cpu' && (auctionState.activePlayer === 'p2' || auctionState.winner === 'p2'));

  return (
    <div className="draft-screen-container">
      {/* Fullscreen Pixelated Naruto Battlefield Gameplay Background */}
      <div className="draft-battlefield-bg" aria-hidden="true">
        <div className="battlefield-pixel-layer" />
        <div className="battlefield-overlay-layer" />
        <div className="battlefield-vignette-layer" />
      </div>

      {/* Top HUD Navigation Bar */}
      <header className="draft-hud-nav">
        <button
          type="button"
          className="btn-back-home"
          onClick={handleBackHome}
          id="btn-draft-back"
          aria-label="Back to Home Page"
        >
          <span className="back-arrow">←</span> BACK
        </button>

        <div className="draft-hud-title-wrap">
          <h1 className="draft-hud-title">NARUTO DRAFT</h1>
          <span className="draft-hud-sub">
            {gameMode === 'cpu' ? 'SOLO VS CPU (NORMAL AI)' : 'LOCAL 1V1 MATCH'}
          </span>
        </div>

        <div className="draft-round-badge">
          <span className="round-prefix">CHARACTER</span>
          <span className="round-num">#{auctionState.characterNumber}</span>
        </div>
      </header>

      {/* Auto-Assignment Notification Toast */}
      {auctionState.autoAssignedMessage && (
        <div className="auto-assign-alert" role="status" aria-live="polite">
          <span className="alert-star">✦</span>
          <span className="alert-text">{auctionState.autoAssignedMessage}</span>
        </div>
      )}

      {/* Main Arena or Final Draft Complete Screen */}
      {isComplete ? (
        <main className="draft-complete-stage">
          <DraftComplete
            p1={p1}
            p2={p2}
            gameMode={gameMode}
            onPlayAgain={handleRestartMatch}
            onBackToHome={handleBackHome}
          />
        </main>
      ) : (
        <main className="draft-main-arena">
          {/* Left Column: Player 1 Team */}
          <section className="draft-column player1-column" aria-label="Player 1 Team Roster">
            <PlayerPanel
              player={p1}
              isTurn={!isComplete && isP1Turn}
              isOpponent={false}
            />
          </section>

          {/* Center Column: Character Reveal, Sold Feedback & Auction Controls */}
          <section className="draft-column center-auction-column" aria-label="Current Auction Shinobi">
            {/* Sold / Won Resolution Feedback Banner */}
            {auctionState.phase === AUCTION_PHASE.ROLE_ASSIGNMENT && winnerPlayer && auctionState.currentCharacter && (
              <div className="auction-sold-banner" role="status" aria-live="polite">
                <span className="sold-tag">✦ ACQUISITION RESOLVED ✦</span>
                <span className="sold-char-name">
                  {auctionState.currentCharacter.name.toUpperCase()}
                </span>
                <span className="sold-winner-badge">
                  AWARDED TO {winnerPlayer.name.toUpperCase()} •{' '}
                  {auctionState.winningBid === 0 ? 'FREE ($0)' : `$${auctionState.winningBid}`}
                </span>
              </div>
            )}

            <CharacterCard
              character={auctionState.currentCharacter}
              isRevealed={isRevealed}
              isRevealing={isRevealing}
              onReveal={handleRevealCharacter}
              characterNumber={auctionState.characterNumber}
              isPoolEmpty={isPoolEmpty}
            />

            <BidControls
              currentBid={auctionState.currentBid}
              highestBidder={
                auctionState.highestBidder
                  ? auctionState.players[auctionState.highestBidder].name
                  : null
              }
              activePlayerName={activePlayer.name}
              activePlayerBudget={activePlayer.budget}
              activePlayerKey={auctionState.activePlayer}
              opponentName={opponentPlayer.name}
              isRevealed={isRevealed}
              auctionMode={auctionState.auctionMode}
              statusMessage={cpuStatus ? cpuStatus : auctionState.statusMessage}
              isProcessing={isHumanDisabled}
              onBid={handleBid}
              onPass={handlePass}
              onZeroClaim={handleZeroClaim}
            />

            <AuctionLog activityLogs={activityLogs} cpuStatus={cpuStatus} />
          </section>

          {/* Right Column: Player 2 / CPU Team */}
          <section className="draft-column opponent-column" aria-label="Opponent Team Roster">
            <PlayerPanel
              player={p2}
              isTurn={!isComplete && !isP1Turn}
              isOpponent={true}
            />
          </section>
        </main>
      )}

      {/* Role Assignment Modal */}
      {showRoleModal && (
        <RoleAssignmentModal
          character={auctionState.currentCharacter}
          winningBid={auctionState.winningBid}
          winnerName={winnerPlayer.name}
          playerRoster={winnerPlayer.team}
          onSelectRole={handleAssignRole}
        />
      )}
    </div>
  );
}
