import CharacterPortrait from './CharacterPortrait';
import { getCharacterColor } from '../utils/characterUtils';
import './CharacterCard.css';

export default function CharacterCard({
  character,
  isRevealed,
  isRevealing = false,
  onReveal,
  characterNumber = 1,
  isPoolEmpty = false
}) {
  const accentColor = isRevealed && character ? getCharacterColor(character) : '#ff6a00';

  if (isPoolEmpty) {
    return (
      <div className="character-card-container empty-pool">
        <div className="empty-pool-message">
          <span className="empty-icon">⚠️</span>
          <h3>No available characters remain.</h3>
          <p>All unique ninja lineages from the pool have been drafted.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`character-card-container ${
        isRevealing ? 'revealing' : isRevealed ? 'revealed' : 'hidden'
      }`}
      style={{ '--char-accent': accentColor }}
      role="region"
      aria-label={isRevealed && character ? `Character dossier for ${character.name}` : 'Hidden character card'}
    >
      {/* Shinobi Scroll / Dossier Corner Brackets */}
      <span className="card-corner top-left" aria-hidden="true"></span>
      <span className="card-corner top-right" aria-hidden="true"></span>
      <span className="card-corner bottom-left" aria-hidden="true"></span>
      <span className="card-corner bottom-right" aria-hidden="true"></span>

      {/* Chakra Ring Effect during reveal animation */}
      {isRevealing && (
        <div className="reveal-chakra-blast" aria-hidden="true">
          <div className="chakra-blast-ring ring-1"></div>
          <div className="chakra-blast-ring ring-2"></div>
        </div>
      )}

      {/* Header Tag */}
      <div className="char-card-header">
        <span className="char-round-tag">
          <span className="scroll-icon">📜</span> CHARACTER #{characterNumber}
        </span>
        <span className="char-rarity-badge">
          {isRevealed && character ? character.version : 'CLASSIFIED SHINOBI'}
        </span>
      </div>

      {/* Main Art & Dossier Frame */}
      <div className="char-art-frame">
        {isRevealed && character ? (
          <div className="char-art-revealed">
            {/* Reusable CharacterPortrait Component (size="card") */}
            <CharacterPortrait
              character={character}
              size="card"
              alt={character.name}
            />

            {/* Glowing Chakra aura and subtle scanline overlay */}
            <div className="dossier-scanlines" aria-hidden="true"></div>
            <div className="char-chakra-glow-halo" aria-hidden="true"></div>
          </div>
        ) : (
          <div className="char-art-hidden">
            {/* Hidden State: Mysterious silhouette with pulsing question mark */}
            <div className="mystery-silhouette" aria-hidden="true">
              <div className="smoke-circle"></div>
              <div className="chakra-ring-pulse"></div>
              <span className="mystery-symbol">?</span>
            </div>

            <p className="mystery-prompt">HOST HAS SELECTED A SHINOBI</p>

            <button
              type="button"
              className={`btn-reveal-shinobi ${isRevealing ? 'is-triggering' : ''}`}
              onClick={onReveal}
              disabled={isRevealing}
              id="btn-reveal-character"
              aria-label="Reveal the selected shinobi"
            >
              <span className="btn-icon">✦</span>
              <span className="btn-text">
                {isRevealing ? 'REVEALING CHAKRA...' : 'REVEAL CHARACTER'}
              </span>
              <span className="btn-icon">✦</span>
            </button>
          </div>
        )}
      </div>

      {/* Character Identity & Titles */}
      <div className="char-card-body">
        <h3 className="char-name-title">
          {isRevealed && character ? character.name : 'CLASSIFIED SHINOBI'}
        </h3>
        <p className="char-subtitle">
          {isRevealed && character ? character.version : 'Shinobi Identity Concealed'}
        </p>

        {/* Lore Traits & Signature Ability (NO numerical stats, ratings, or valuations shown) */}
        {isRevealed && character && (
          <div className="char-lore-info">
            {character.traits && character.traits.length > 0 && (
              <div className="char-traits-row">
                {character.traits.slice(0, 4).map((trait) => (
                  <span key={trait} className="char-trait-pill">
                    {trait.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}
            {character.abilities && character.abilities.length > 0 && (
              <div className="char-ability-preview">
                <span className="ability-label">JUTSU:</span>
                <span className="ability-name">{character.abilities[0]}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
