import './GameModeCard.css';

export default function GameModeCard({ mode, isSelected, onSelect }) {
  const { id, title, badge, icon, description, details } = mode;

  return (
    <button
      type="button"
      className={`game-mode-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(mode)}
      aria-pressed={isSelected}
      id={`mode-btn-${id}`}
    >
      {/* Ninja Corner Accents */}
      <span className="card-corner top-left" aria-hidden="true"></span>
      <span className="card-corner top-right" aria-hidden="true"></span>
      <span className="card-corner bottom-left" aria-hidden="true"></span>
      <span className="card-corner bottom-right" aria-hidden="true"></span>

      {/* Mode Badge */}
      <div className="mode-badge-wrap">
        <span className="mode-badge">{badge}</span>
      </div>

      {/* Main Icon with Chakra Aura */}
      <div className="icon-wrapper">
        <span className="icon-aura" aria-hidden="true"></span>
        <span className="icon-symbol" role="img" aria-label={title}>
          {icon}
        </span>
      </div>

      {/* Text Info */}
      <div className="mode-info">
        <h3 className="mode-title">{title}</h3>
        <p className="mode-description">{description}</p>
        <span className="mode-details">{details}</span>
      </div>

      {/* Action Prompt */}
      <div className="card-footer">
        <span className="select-action">
          {isSelected ? '⚔️ ENTER DRAFT' : 'SELECT MODE'}
        </span>
      </div>
    </button>
  );
}
