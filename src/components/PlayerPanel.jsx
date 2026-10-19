import { useEffect, useState, useRef } from 'react';
import RoleSlot from './RoleSlot';
import { ROLES } from '../data/roles';
import './PlayerPanel.css';

export default function PlayerPanel({ player, isTurn, isOpponent = false }) {
  const filledCount = Object.values(player.roster).filter(Boolean).length;
  const isBudgetLow = player.budget <= 5;
  const isSquadFull = filledCount === 6;

  // Animate budget when it decreases/changes
  const [isBudgetAnimating, setIsBudgetAnimating] = useState(false);
  const prevBudgetRef = useRef(player.budget);

  useEffect(() => {
    if (prevBudgetRef.current !== player.budget) {
      setIsBudgetAnimating(true);
      const timer = setTimeout(() => setIsBudgetAnimating(false), 900);
      prevBudgetRef.current = player.budget;
      return () => clearTimeout(timer);
    }
  }, [player.budget]);

  return (
    <aside
      className={`player-panel ${isTurn ? 'active-turn' : 'inactive-turn'} ${
        isOpponent ? 'opponent-panel' : 'user-panel'
      }`}
    >
      {/* Corner Brackets */}
      <span className="panel-corner top-left" aria-hidden="true"></span>
      <span className="panel-corner top-right" aria-hidden="true"></span>
      <span className="panel-corner bottom-left" aria-hidden="true"></span>
      <span className="panel-corner bottom-right" aria-hidden="true"></span>

      {/* Header Info */}
      <header className="player-panel-header">
        <div className="player-identity">
          <div className="player-avatar-badge">
            {player.id === 'p2' && isOpponent && player.name.includes('CPU')
              ? '🤖'
              : isOpponent
              ? '👥'
              : '👤'}
          </div>
          <div className="player-titles">
            <h2 className="player-name">{player.name}</h2>
            {isTurn && (
              <span className="turn-indicator-badge">
                <span className="beacon-dot"></span> ACTIVE TURN
              </span>
            )}
          </div>
        </div>

        {/* Stats: Prominent Budget & Squad Size */}
        <div className="player-stats-row">
          <div
            className={`budget-box ${isBudgetLow ? 'budget-low' : ''} ${
              isBudgetAnimating ? 'budget-changed-pulse' : ''
            }`}
          >
            <span className="stat-sub">BUDGET</span>
            <span className="stat-main">
              <span className="coin-icon">💰</span> ${player.budget}
            </span>
          </div>

          <div className={`squad-box ${isSquadFull ? 'squad-complete' : ''}`}>
            <span className="stat-sub">SQUAD</span>
            <span className="stat-main">
              {filledCount} / 6 <span className="squad-sub-label">SHINOBI</span>
            </span>
          </div>
        </div>
      </header>

      {/* Roster Slots List (6 Roles) */}
      <div className="player-roster-list" role="list">
        {ROLES.map((role) => (
          <RoleSlot
            key={role.id}
            role={role}
            character={player.roster[role.id]}
          />
        ))}
      </div>
    </aside>
  );
}
