import { useState } from 'react';
import GameModeCard from '../components/GameModeCard';
import RoleBadge from '../components/RoleBadge';
import { GAME_MODES } from '../data/gameModes';
import { ROLES } from '../data/roles';
import { GAME_CONSTANTS } from '../game/constants';
import './Home.css';

export default function Home({ onStartDraft }) {
  const [selectedMode, setSelectedMode] = useState(null);

  const handleSelectMode = (mode) => {
    setSelectedMode(mode);
    console.log(`[Naruto Draft] Selected Game Mode: ${mode.title} (${mode.id})`);
  };

  const handleConfirmDraft = () => {
    if (selectedMode && onStartDraft) {
      onStartDraft(selectedMode.id);
    }
  };

  return (
    <main className="home-container">
      {/* Background Japanese Watermark Character (忍 - Shinobi) */}
      <div className="watermark-shinobi" aria-hidden="true">
        忍
      </div>

      {/* Top Header & Dramatic Title */}
      <header className="hero-header">
        <div className="title-emblem-wrap">
          <span className="shuriken-icon" aria-hidden="true">✦</span>
          <span className="sub-tag">SHINOBI STRATEGY DRAFT</span>
          <span className="shuriken-icon" aria-hidden="true">✦</span>
        </div>

        <h1 className="main-title">
          <span className="title-naruto">NARUTO</span>
          <span className="title-draft">DRAFT</span>
        </h1>

        <p className="hero-subtitle">
          Build Your Ultimate Shinobi Squad
        </p>

        <div className="title-divider" aria-hidden="true">
          <span className="divider-line"></span>
          <span className="divider-knot">◆</span>
          <span className="divider-line"></span>
        </div>
      </header>

      {/* Game Mode Selection Section */}
      <section className="mode-selection-section" aria-labelledby="mode-selection-heading">
        <div className="section-label-wrap">
          <h2 id="mode-selection-heading" className="section-label">
            SELECT GAME MODE
          </h2>
        </div>

        <div className="mode-cards-grid">
          {GAME_MODES.map((mode) => (
            <GameModeCard
              key={mode.id}
              mode={mode}
              isSelected={selectedMode?.id === mode.id}
              onSelect={(m) => {
                if (selectedMode?.id === m.id) {
                  // Second click on selected card starts draft
                  handleConfirmDraft();
                } else {
                  handleSelectMode(m);
                }
              }}
            />
          ))}
        </div>

        {/* Dynamic Selection Feedback Pill with Direct Start Button */}
        {selectedMode && (
          <div className="selection-feedback-banner" role="status" aria-live="polite">
            <span className="feedback-pulse" aria-hidden="true"></span>
            <span className="feedback-text">
              Selected: <strong>{selectedMode.title}</strong> — {selectedMode.description}
            </span>
            <button
              type="button"
              className="btn-start-draft-action"
              onClick={handleConfirmDraft}
              id="btn-confirm-start-draft"
            >
              <span>⚔️</span> START DRAFT →
            </button>
          </div>
        )}
      </section>

      {/* Squad Rules & Budget Section (Parchment-Themed Scroll Panel) */}
      <section className="rules-scroll-panel" aria-label="Drafting Squad Rules">
        <div className="scroll-roller top" aria-hidden="true"></div>

        <div className="rules-header">
          <div className="budget-stat">
            <span className="stat-label">STARTING BUDGET</span>
            <span className="stat-value">
              {GAME_CONSTANTS.CURRENCY_SYMBOL}{GAME_CONSTANTS.STARTING_BUDGET}
            </span>
          </div>

          <div className="rules-separator" aria-hidden="true">✦</div>

          <div className="budget-stat">
            <span className="stat-label">SQUAD REQUIREMENT</span>
            <span className="stat-value">
              {GAME_CONSTANTS.SQUAD_SIZE} NINJA SQUAD
            </span>
          </div>
        </div>

        <div className="roles-intro">
          <span className="roles-intro-text">
            Every team must draft exactly one shinobi for each specialized role:
          </span>
        </div>

        {/* The 6 Team Roles Grid */}
        <div className="roles-grid">
          {ROLES.map((role) => (
            <RoleBadge key={role.id} role={role} />
          ))}
        </div>

        <div className="scroll-roller bottom" aria-hidden="true"></div>
      </section>

      {/* Footer / Info */}
      <footer className="home-footer">
        <p className="footer-copyright">
          Naruto Draft • Local Browser Edition • Form Your Tactical Shinobi Clan
        </p>
      </footer>
    </main>
  );
}
