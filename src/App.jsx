import { useState } from 'react';
import Home from './pages/Home';
import Draft from './pages/Draft';
import PixelBackground from './components/PixelBackground';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [gameMode, setGameMode] = useState('cpu'); // 'cpu' | 'local'

  const handleStartDraft = (selectedModeId) => {
    const normalizedMode = selectedModeId === 'local-1v1' || selectedModeId === 'local' ? 'local' : 'cpu';
    setGameMode(normalizedMode);
    setCurrentScreen('draft');
    console.log(`[Naruto Draft] Navigating to Draft screen with mode: ${normalizedMode}`);
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    console.log('[Naruto Draft] Returned to Home screen');
  };

  return (
    <div className="app-root">
      {/* Fixed Fullscreen Pixel Art Background on Home only */}
      {currentScreen === 'home' && <PixelBackground />}

      {currentScreen === 'home' ? (
        <Home onStartDraft={handleStartDraft} />
      ) : (
        <Draft gameMode={gameMode} onBack={handleBackToHome} />
      )}
    </div>
  );
}

export default App;
