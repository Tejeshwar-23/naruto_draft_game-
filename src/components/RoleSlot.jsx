import CharacterPortrait from './CharacterPortrait';
import './RoleSlot.css';

export default function RoleSlot({ role, character }) {
  const isFilled = Boolean(character);
  const isTraitor = role.id === 'traitor';

  return (
    <div
      className={`role-slot ${isFilled ? 'filled' : 'empty'} role-slot-${role.id} ${
        isTraitor ? 'is-traitor-slot' : ''
      }`}
    >
      {/* Role Icon / Badge */}
      <div className="role-slot-icon-box" title={role.name}>
        <span className="role-slot-icon">{role.icon}</span>
      </div>

      {/* Character Portrait (if filled) or Empty Slot Indicator */}
      {isFilled ? (
        <div className="role-slot-portrait-wrap">
          <CharacterPortrait
            character={character}
            size="xs"
            isTraitor={isTraitor}
            alt={character.name}
          />
        </div>
      ) : (
        <div className="role-slot-empty-indicator" aria-hidden="true">
          <span className="empty-dot"></span>
        </div>
      )}

      {/* Middle Info: Role name & Character name */}
      <div className="role-slot-info">
        <div className="role-slot-header-line">
          <span className="role-slot-name">{role.name}</span>
          {isTraitor && isFilled && (
            <span className="traitor-betray-badge">WILL BETRAY</span>
          )}
        </div>

        {isFilled ? (
          <div className="role-slot-character">
            <span className="char-name" title={character.name}>{character.name}</span>
            {character.version && (
              <span className="char-version">{character.version}</span>
            )}
          </div>
        ) : (
          <span className="role-slot-status">
            {isTraitor ? 'LIABILITY SLOT (EMPTY)' : 'EMPTY'}
          </span>
        )}
      </div>

      {/* Right Cost / Winning Bid Badge */}
      {isFilled && character.cost !== undefined && (
        <div className="role-slot-cost" title={`Acquisition cost: $${character.cost}`}>
          <span className="cost-tag">${character.cost}</span>
        </div>
      )}
    </div>
  );
}
