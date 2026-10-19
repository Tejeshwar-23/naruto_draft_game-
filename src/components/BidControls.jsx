import { useState, useEffect, useRef } from 'react';
import './BidControls.css';

export default function BidControls({
  currentBid = 0,
  highestBidder = null,
  activePlayerName = 'PLAYER 1',
  activePlayerBudget = 30,
  activePlayerKey = 'p1',
  opponentName = 'PLAYER 2',
  isRevealed = false,
  auctionMode = 'NORMAL',
  statusMessage = '',
  isProcessing = false,
  onBid,
  onPass,
  onZeroClaim
}) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customVal, setCustomVal] = useState('');
  const [customError, setCustomError] = useState('');
  const [isBidPulsing, setIsBidPulsing] = useState(false);
  const prevBidRef = useRef(currentBid);

  // Animate bid changes
  useEffect(() => {
    if (prevBidRef.current !== currentBid && currentBid > 0) {
      setIsBidPulsing(true);
      const timer = setTimeout(() => setIsBidPulsing(false), 700);
      prevBidRef.current = currentBid;
      return () => clearTimeout(timer);
    }
  }, [currentBid]);

  // Calculate next legal bids
  const minNextBid = currentBid <= 0 ? 1 : currentBid + 1;
  const bidPlus1 = minNextBid;
  const bidPlus2 = currentBid <= 0 ? 2 : currentBid + 2;
  const bidPlus5 = currentBid <= 0 ? 5 : currentBid + 5;

  const canAffordPlus1 = isRevealed && !isProcessing && bidPlus1 <= activePlayerBudget;
  const canAffordPlus2 = isRevealed && !isProcessing && bidPlus2 <= activePlayerBudget;
  const canAffordPlus5 = isRevealed && !isProcessing && bidPlus5 <= activePlayerBudget;
  const canOpenCustom = isRevealed && !isProcessing && activePlayerBudget >= minNextBid;

  // PASS is only legal in normal auction if an active bid exists
  const canPassNormal = isRevealed && !isProcessing && highestBidder !== null;

  const isCpuThinking = statusMessage && statusMessage.includes('THINKING');

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const val = parseInt(customVal, 10);

    if (isNaN(val)) {
      setCustomError('Enter a valid dollar amount.');
      return;
    }
    if (val < minNextBid) {
      setCustomError(`Minimum legal bid is $${minNextBid}.`);
      return;
    }
    if (val > activePlayerBudget) {
      setCustomError(`Exceeds your budget of $${activePlayerBudget}.`);
      return;
    }

    setCustomError('');
    setShowCustomInput(false);
    setCustomVal('');
    onBid(val);
  };

  // Render Special Mode Controls (Fodder Dump: one player has $, opponent has $0)
  if (isRevealed && auctionMode === 'FODDER_DUMP') {
    return (
      <div className="bid-controls-container special-mode-container" role="region" aria-label="Fodder Dump Controls">
        <div className="special-mode-banner fodder-banner">
          <span className="banner-badge">⚠️ SPECIAL AUCTION MODE</span>
          <h3 className="banner-title">{opponentName} HAS $0 BUDGET</h3>
          <p className="banner-desc">
            {activePlayerName} has financial supremacy. BID $1 to acquire this shinobi, or PASS to force them onto {opponentName} for $0.
          </p>
        </div>

        <div className="fodder-actions-row">
          <button
            type="button"
            className="btn-special btn-fodder-bid"
            disabled={isProcessing || activePlayerBudget < 1}
            onClick={() => onBid(1)}
            id="btn-fodder-bid-1"
          >
            <span className="btn-icon">💰</span>
            <span className="btn-text">BID $1 (CLAIM)</span>
          </button>

          <button
            type="button"
            className="btn-special btn-fodder-pass"
            disabled={isProcessing}
            onClick={onPass}
            id="btn-fodder-pass-dump"
          >
            <span className="btn-icon">⏩</span>
            <span className="btn-text">PASS — FORCE TO {opponentName.toUpperCase()}</span>
          </button>
        </div>

        {statusMessage && (
          <div className="auction-status-hint">
            {isCpuThinking ? (
              <span className="cpu-thinking-text">
                CPU IS THINKING <span className="animated-dots"><span>.</span><span>.</span><span>.</span></span>
              </span>
            ) : (
              statusMessage
            )}
          </div>
        )}
      </div>
    );
  }

  // Render Special Mode Controls (Zero Claim: both players have $0)
  if (isRevealed && auctionMode === 'ZERO_CLAIM') {
    return (
      <div className="bid-controls-container special-mode-container" role="region" aria-label="Zero Claim Controls">
        <div className="special-mode-banner zero-claim-banner">
          <span className="banner-badge">⚖️ $0 CLAIM MODE</span>
          <h3 className="banner-title">BOTH TEAMS HAVE $0</h3>
          <p className="banner-desc">
            {activePlayerName} holds Claim Priority. CLAIM this shinobi for $0, or PASS to force them onto {opponentName}.
          </p>
        </div>

        <div className="zero-claim-actions-row">
          <button
            type="button"
            className="btn-special btn-claim-zero"
            disabled={isProcessing}
            onClick={onZeroClaim}
            id="btn-claim-zero"
          >
            <span className="btn-icon">✨</span>
            <span className="btn-text">CLAIM FOR $0</span>
          </button>

          <button
            type="button"
            className="btn-special btn-pass-zero"
            disabled={isProcessing}
            onClick={onPass}
            id="btn-pass-zero"
          >
            <span className="btn-icon">⏩</span>
            <span className="btn-text">PASS TO {opponentName.toUpperCase()}</span>
          </button>
        </div>

        {statusMessage && (
          <div className="auction-status-hint">
            {isCpuThinking ? (
              <span className="cpu-thinking-text">
                CPU IS EVALUATING <span className="animated-dots"><span>.</span><span>.</span><span>.</span></span>
              </span>
            ) : (
              statusMessage
            )}
          </div>
        )}
      </div>
    );
  }

  // Render One Team Full Notice
  if (isRevealed && auctionMode === 'ONE_TEAM_FULL') {
    return (
      <div className="bid-controls-container special-mode-container" role="region" aria-label="One Team Full Notice">
        <div className="special-mode-banner full-squad-banner">
          <span className="banner-badge">👑 SQUAD COMPLETE</span>
          <h3 className="banner-title">{opponentName} SQUAD IS FULL</h3>
          <p className="banner-desc">
            No bidding required. This shinobi will automatically be awarded to {activePlayerName} for $0.
          </p>
        </div>
      </div>
    );
  }

  // Normal Auction UI
  return (
    <div className={`bid-controls-container ${!isRevealed ? 'controls-disabled' : ''}`}>
      {/* Current Bid Display */}
      <div className="current-bid-display">
        <div className="bid-header-row">
          <span className="bid-label">
            {!isRevealed
              ? 'AUCTION PENDING'
              : currentBid === 0
              ? 'OPENING BID REQUIRED'
              : 'CURRENT HIGH BID'}
          </span>

          {/* Turn Indicator Badge with Visual Glow */}
          <div className={`turn-indicator-pill ${activePlayerKey === 'p1' ? 'your-turn' : 'opponent-turn'}`}>
            <span className="turn-dot"></span>
            <span className="turn-text">
              {isCpuThinking ? (
                <>
                  CPU IS THINKING <span className="animated-dots"><span>.</span><span>.</span><span>.</span></span>
                </>
              ) : activePlayerKey === 'p1' ? (
                'YOUR TURN'
              ) : (
                `${activePlayerName.toUpperCase()}'S TURN`
              )}
            </span>
          </div>
        </div>

        {/* Big Bid Amount with Pulse Transition */}
        <div className="bid-amount-wrap">
          <span className={`bid-amount ${isBidPulsing ? 'bid-pulse' : ''}`}>
            {!isRevealed ? '—' : currentBid === 0 ? '$0' : `$${currentBid}`}
          </span>
          {isRevealed && currentBid === 0 && (
            <span className="starting-bid-note">(MINIMUM OPEN: $1)</span>
          )}
        </div>

        <div className="bid-meta-row">
          <span className="highest-bidder-info">
            HIGH BIDDER:{' '}
            <strong className="bidder-highlight">
              {!isRevealed
                ? '—'
                : highestBidder
                ? highestBidder.toUpperCase()
                : 'NONE'}
            </strong>
          </span>

          {statusMessage && !isCpuThinking && (
            <span className="status-message-tag">{statusMessage}</span>
          )}
        </div>
      </div>

      {/* Interactive Bidding Action Buttons */}
      <div className="bid-actions-grid">
        <button
          type="button"
          className="btn-bid btn-bid-increment"
          disabled={!canAffordPlus1}
          onClick={() => onBid(bidPlus1)}
          id="btn-bid-plus-1"
        >
          <span className="btn-amount">+${minNextBid - currentBid}</span>
          <span className="btn-subtext">BID ${bidPlus1}</span>
        </button>

        <button
          type="button"
          className="btn-bid btn-bid-increment"
          disabled={!canAffordPlus2}
          onClick={() => onBid(bidPlus2)}
          id="btn-bid-plus-2"
        >
          <span className="btn-amount">+$2</span>
          <span className="btn-subtext">BID ${bidPlus2}</span>
        </button>

        <button
          type="button"
          className="btn-bid btn-bid-increment"
          disabled={!canAffordPlus5}
          onClick={() => onBid(bidPlus5)}
          id="btn-bid-plus-5"
        >
          <span className="btn-amount">+$5</span>
          <span className="btn-subtext">BID ${bidPlus5}</span>
        </button>

        <button
          type="button"
          className={`btn-bid btn-bid-custom ${showCustomInput ? 'active' : ''}`}
          disabled={!canOpenCustom}
          onClick={() => {
            setShowCustomInput(!showCustomInput);
            setCustomError('');
          }}
          id="btn-bid-custom"
        >
          <span className="btn-amount">CUSTOM</span>
          <span className="btn-subtext">ENTER $</span>
        </button>

        <button
          type="button"
          className="btn-bid btn-bid-pass"
          disabled={!canPassNormal}
          onClick={onPass}
          id="btn-bid-pass"
        >
          <span className="btn-amount">PASS</span>
          <span className="btn-subtext">CONCEDE</span>
        </button>
      </div>

      {/* Custom Bid Modal / Drawer */}
      {showCustomInput && (
        <form onSubmit={handleCustomSubmit} className="custom-bid-form">
          <div className="custom-input-wrap">
            <span className="currency-prefix">$</span>
            <input
              type="number"
              min={minNextBid}
              max={activePlayerBudget}
              value={customVal}
              onChange={(e) => {
                setCustomVal(e.target.value);
                setCustomError('');
              }}
              placeholder={`Min $${minNextBid}`}
              className="custom-bid-input"
              autoFocus
              id="input-custom-bid"
            />
            <button type="submit" className="btn-custom-submit" id="btn-custom-submit">
              SUBMIT BID
            </button>
            <button
              type="button"
              className="btn-custom-cancel"
              onClick={() => setShowCustomInput(false)}
            >
              ✕
            </button>
          </div>
          {customError && <span className="custom-bid-error">{customError}</span>}
        </form>
      )}
    </div>
  );
}
