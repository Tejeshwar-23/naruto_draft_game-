import { useState } from 'react';
import { getCharacterColor, getCharacterInitials } from '../utils/characterUtils';
import './CharacterPortrait.css';

/**
 * Reusable CharacterPortrait Component
 *
 * Handles:
 * - Direct image rendering if character.image exists and loads
 * - Graceful fallback to styled anime/shinobi vector art with glowing chakra aura & initials
 * - Loading state
 * - Absolute immunity against broken-image icons
 * - Multiple sizing presets: 'xs', 'sm', 'md', 'lg', 'card'
 */
export default function CharacterPortrait({
  character,
  size = 'md',
  alt = '',
  className = '',
  isTraitor = false
}) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!character) {
    return (
      <div className={`char-portrait char-portrait-empty size-${size} ${className}`} aria-hidden="true">
        <span className="empty-symbol">?</span>
      </div>
    );
  }

  const accentColor = isTraitor ? '#f43f5e' : getCharacterColor(character);
  const initials = getCharacterInitials(character.name);
  const hasValidImage = Boolean(character.image) && !imageError;

  return (
    <div
      className={`char-portrait size-${size} ${isTraitor ? 'is-traitor-portrait' : ''} ${className}`}
      style={{ '--portrait-accent': accentColor }}
    >
      {hasValidImage ? (
        <>
          {!isLoaded && (
            <div className="portrait-loading-skeleton" aria-hidden="true" />
          )}
          <img
            src={character.image}
            alt={alt || character.name}
            className={`portrait-img ${isLoaded ? 'loaded' : 'loading'}`}
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              if (import.meta.env.DEV) {
                console.info(`[Naruto Draft] Using fallback avatar for: ${character.name} (${character.image})`);
              }
              setImageError(true);
            }}
          />
        </>
      ) : (
        /* Stylized Shinobi Graphic Fallback (No external images required) */
        <div className="portrait-fallback" aria-label={alt || character.name}>
          <div className="fallback-chakra-aura" aria-hidden="true" />

          {/* SVG Silhouette with Ninja Headband Plate & Initials */}
          <svg
            className="fallback-svg"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id={`glow-${character.id || 'default'}-${size}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor="#080a14" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Base Background */}
            <rect width="100" height="100" fill="#0c0e18" />
            <circle cx="50" cy="50" r="46" fill={`url(#glow-${character.id || 'default'}-${size})`} />

            {/* Ninja Crest Watermark */}
            <text
              x="50"
              y="58"
              fontFamily="'Cinzel', serif"
              fontSize="44"
              fontWeight="900"
              fill={accentColor}
              fillOpacity="0.16"
              textAnchor="middle"
              dominantBaseline="central"
            >
              忍
            </text>

            {/* Shinobi Bust Outline */}
            <g fill="#181e2e" stroke={accentColor} strokeWidth="1" strokeOpacity="0.4">
              {/* Shoulders */}
              <path d="M 12 100 Q 25 74 50 74 Q 75 74 88 100 Z" fill="#131726" />
              {/* Head / Hair */}
              <circle cx="50" cy="42" r="22" fill="#1e2436" />
              {/* Spikes */}
              <polygon points="50,16 42,26 58,26" fill="#242c40" />
              <polygon points="34,22 42,32 30,34" fill="#242c40" />
              <polygon points="66,22 58,32 70,34" fill="#242c40" />
              {/* Forehead Protector */}
              <rect x="34" y="34" width="32" height="9" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="0.8" />
              {/* Glowing Eyes */}
              <circle cx="43" cy="48" r="2.5" fill={accentColor} />
              <circle cx="57" cy="48" r="2.5" fill={accentColor} />
            </g>
          </svg>

          {/* Initials Badge Overlay */}
          <span className="portrait-initials-badge">
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}
