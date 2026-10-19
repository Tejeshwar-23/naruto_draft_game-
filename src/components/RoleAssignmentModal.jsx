import { useState } from 'react';
import { ROLES } from '../data/roles';
import CharacterPortrait from './CharacterPortrait';
import './RoleAssignmentModal.css';

export default function RoleAssignmentModal({
  character,
  winningBid = 5,
  winnerName = 'PLAYER 1',
  playerRoster = {},
  onSelectRole
}) {
  const [showTraitorWarning, setShowTraitorWarning] = useState(false);

  // Count available slots
  const availableRoles = ROLES.filter((r) => !playerRoster[r.id]);
  const isOnlyOneAvailable = availableRoles.length === 1;
  const isTraitorOnlyRemaining = isOnlyOneAvailable && availableRoles[0].id === 'traitor';

  const handleRoleClick = (roleId) => {
    // If selecting Traitor and other normal roles are also empty, show warning confirmation
    if (roleId === 'traitor' && !isOnlyOneAvailable) {
      setShowTraitorWarning(true);
      return;
    }
    onSelectRole(roleId);
  };

  const handleConfirmTraitor = () => {
    setShowTraitorWarning(false);
    onSelectRole('traitor');
  };

  return (
    <div className="role-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="role-modal-content">
        {/* Corner Accents */}
        <span className="modal-corner top-left" aria-hidden="true"></span>
        <span className="modal-corner top-right" aria-hidden="true"></span>
        <span className="modal-corner bottom-left" aria-hidden="true"></span>
        <span className="modal-corner bottom-right" aria-hidden="true"></span>

        {/* Modal Header */}
        <div className="modal-header">
          <span className="modal-victory-tag">✦ ACQUISITION CONFIRMED ✦</span>
          <h2 id="modal-title" className="modal-title">
            ASSIGN {character ? character.name.toUpperCase() : 'SHINOBI'}
          </h2>

          <div className="modal-char-highlight">
            <div className="modal-portrait-wrap">
              <CharacterPortrait
                character={character}
                size="sm"
                alt={character?.name}
              />
            </div>
            <div className="modal-char-meta">
              <span className="modal-char-name">{character?.name}</span>
              <span className="modal-price-badge">
                {winnerName} • {winningBid === 0 ? 'FREE ($0)' : `$${winningBid}`}
              </span>
            </div>
          </div>

          <p className="modal-prompt">
            {isTraitorOnlyRemaining ? (
              <span className="traitor-only-notice">
                ⚠️ ONLY TRAITOR SLOT REMAINS — This shinobi must be placed here.
              </span>
            ) : (
              'CHOOSE A ROLE FOR YOUR SQUAD'
            )}
          </p>
        </div>

        {/* Traitor Warning Confirmation Overlay */}
        {showTraitorWarning ? (
          <div className="traitor-warning-dialog" role="alertdialog" aria-labelledby="traitor-warn-title">
            <div className="traitor-warn-icon">🗡️</div>
            <h3 id="traitor-warn-title" className="traitor-warn-title">
              ASSIGN AS TRAITOR?
            </h3>
            <p className="traitor-warn-desc">
              <strong>{character?.name}</strong> will become the <em>Traitor</em> and <strong>betray your team</strong> during the final battle.
            </p>
            <p className="traitor-warn-sub">
              You generally want to minimize the damage of this liability slot. Are you sure?
            </p>

            <div className="traitor-warn-actions">
              <button
                type="button"
                className="btn-traitor-cancel"
                onClick={() => setShowTraitorWarning(false)}
                id="btn-traitor-cancel"
              >
                CANCEL (CHOOSE OTHER ROLE)
              </button>

              <button
                type="button"
                className="btn-traitor-confirm"
                onClick={handleConfirmTraitor}
                id="btn-traitor-confirm"
              >
                CONFIRM AS TRAITOR
              </button>
            </div>
          </div>
        ) : (
          /* Normal Category / Roles Grid */
          <div className="role-options-grid">
            {ROLES.map((role) => {
              const isOccupied = Boolean(playerRoster[role.id]);
              const isSoloAvailable = !isOccupied && isOnlyOneAvailable;
              const isTraitor = role.id === 'traitor';

              return (
                <button
                  key={role.id}
                  type="button"
                  className={`role-option-btn role-btn-${role.id} ${
                    isOccupied ? 'occupied' : 'available'
                  } ${isSoloAvailable ? 'solo-available' : ''} ${
                    isTraitor ? 'role-btn-traitor-special' : ''
                  }`}
                  disabled={isOccupied}
                  onClick={() => handleRoleClick(role.id)}
                  id={`assign-role-${role.id}`}
                >
                  <div className="role-opt-icon">{role.icon}</div>
                  <div className="role-opt-info">
                    <span className="role-opt-title">{role.name}</span>
                    <span className="role-opt-tagline">
                      {isTraitor ? '⚠️ Will betray squad in battle' : role.tagline}
                    </span>
                  </div>
                  <div className="role-opt-status">
                    {isOccupied ? (
                      <span className="status-occupied">OCCUPIED</span>
                    ) : isSoloAvailable ? (
                      <span className="status-solo">ONLY AVAILABLE</span>
                    ) : (
                      <span className={`status-available ${isTraitor ? 'status-traitor' : ''}`}>
                        {isTraitor ? 'SELECT (LIABILITY)' : 'SELECT'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Modal Footer Note */}
        {!showTraitorWarning && (
          <div className="modal-footer">
            <span className="modal-requirement-note">
              Select one available position to finalize squad placement.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
