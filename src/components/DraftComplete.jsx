import { ROLES } from '../data/roles';
import CharacterPortrait from './CharacterPortrait';
import './DraftComplete.css';

export default function DraftComplete({
  p1,
  p2,
  gameMode = 'cpu',
  onPlayAgain,
  onBackToHome
}) {
  const p2Title = gameMode === 'cpu' ? 'CPU FINAL SQUAD' : `${p2.name.toUpperCase()} FINAL SQUAD`;

  return (
    <div className="draft-complete-container" role="region" aria-label="Final Draft Comparison">
      {/* Header Banner */}
      <div className="complete-banner">
        <div className="complete-scroll-emblem">📜</div>
        <h1 className="complete-heading">DRAFT COMPLETE</h1>
        <p className="complete-subheading">
          Both shinobi squads are fully assembled (6 / 6). Inspect your final rosters below.
        </p>
      </div>

      {/* 6-vs-6 Side-by-Side Comparison Showcase */}
      <div className="squads-showcase-grid">
        {/* Player 1 Squad Showcase */}
        <div className="squad-column squad-p1">
          <div className="squad-column-header">
            <div className="squad-header-left">
              <span className="squad-avatar-icon">👤</span>
              <div>
                <h2 className="squad-title">{p1.name.toUpperCase()} SQUAD</h2>
                <span className="squad-budget-left">Remaining Budget: 💰 ${p1.budget}</span>
              </div>
            </div>
            <span className="squad-status-badge">COMPLETE (6/6)</span>
          </div>

          <div className="squad-roster-cards">
            {ROLES.map((role) => {
              const char = p1.roster[role.id];
              const isTraitor = role.id === 'traitor';

              return (
                <div
                  key={role.id}
                  className={`squad-card role-${role.id} ${isTraitor ? 'is-traitor-card' : ''}`}
                >
                  <div className="squad-card-role">
                    <span className="role-icon">{role.icon}</span>
                    <span className="role-name">{role.name}</span>
                    {isTraitor && (
                      <span className="traitor-liability-pill">WILL BETRAY TEAM</span>
                    )}
                  </div>

                  <div className="squad-card-shinobi">
                    <div className="squad-portrait-wrap">
                      <CharacterPortrait
                        character={char}
                        size="sm"
                        isTraitor={isTraitor}
                        alt={char?.name}
                      />
                    </div>

                    <div className="squad-shinobi-info">
                      <span className="shinobi-name">{char ? char.name : 'Unknown'}</span>
                      <span className="shinobi-ver">{char ? char.version : '—'}</span>
                    </div>

                    {char?.cost !== undefined && (
                      <div className="squad-shinobi-cost">
                        <span className="cost-pill">${char.cost}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* VS Divider in Center */}
        <div className="squads-vs-divider" aria-hidden="true">
          <div className="vs-line"></div>
          <div className="vs-emblem">VS</div>
          <div className="vs-line"></div>
        </div>

        {/* Player 2 / CPU Squad Showcase */}
        <div className="squad-column squad-p2">
          <div className="squad-column-header">
            <div className="squad-header-left">
              <span className="squad-avatar-icon">
                {gameMode === 'cpu' ? '🤖' : '👥'}
              </span>
              <div>
                <h2 className="squad-title">{p2Title}</h2>
                <span className="squad-budget-left">Remaining Budget: 💰 ${p2.budget}</span>
              </div>
            </div>
            <span className="squad-status-badge">COMPLETE (6/6)</span>
          </div>

          <div className="squad-roster-cards">
            {ROLES.map((role) => {
              const char = p2.roster[role.id];
              const isTraitor = role.id === 'traitor';

              return (
                <div
                  key={role.id}
                  className={`squad-card role-${role.id} ${isTraitor ? 'is-traitor-card' : ''}`}
                >
                  <div className="squad-card-role">
                    <span className="role-icon">{role.icon}</span>
                    <span className="role-name">{role.name}</span>
                    {isTraitor && (
                      <span className="traitor-liability-pill">WILL BETRAY TEAM</span>
                    )}
                  </div>

                  <div className="squad-card-shinobi">
                    <div className="squad-portrait-wrap">
                      <CharacterPortrait
                        character={char}
                        size="sm"
                        isTraitor={isTraitor}
                        alt={char?.name}
                      />
                    </div>

                    <div className="squad-shinobi-info">
                      <span className="shinobi-name">{char ? char.name : 'Unknown'}</span>
                      <span className="shinobi-ver">{char ? char.version : '—'}</span>
                    </div>

                    {char?.cost !== undefined && (
                      <div className="squad-shinobi-cost">
                        <span className="cost-pill">${char.cost}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="complete-actions-bar">
        <button
          type="button"
          className="btn-complete-action btn-complete-play-again"
          onClick={onPlayAgain}
          id="btn-complete-play-again"
        >
          <span className="action-icon">⚔️</span> PLAY AGAIN
        </button>

        <button
          type="button"
          className="btn-complete-action btn-complete-home"
          onClick={onBackToHome}
          id="btn-complete-home"
        >
          <span className="action-icon">🏠</span> BACK TO HOME
        </button>
      </div>
    </div>
  );
}
