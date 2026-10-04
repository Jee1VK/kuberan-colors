import React, { useState, useEffect } from 'react';
import { colord } from 'colord';
import confetti from 'canvas-confetti';
import { Award, Eye, RefreshCw, Sliders, HelpCircle, Sparkles, Download } from 'lucide-react';
import { COLOR_DICTIONARY, getRandomColor, generateRandomHex, calculateAccuracy } from './utils/colorUtils';

export default function App() {
  const [mode, setMode] = useState('MEMORY'); // 'MEMORY', 'GUESS_HEX', 'NAME_MATCH'
  const [target, setTarget] = useState(getRandomColor());
  const [userHsl, setUserHsl] = useState({ h: 180, s: 50, l: 50 });
  const [isRevealed, setIsRevealed] = useState(false);
  const [gameState, setGameState] = useState('PLAYING'); // 'MEMORIZING', 'PLAYING', 'SCORED'
  const [score, setScore] = useState(null);
  const [streak, setStreak] = useState(0);

  // Memory mode timer reveal
  useEffect(() => {
    if (mode === 'MEMORY') {
      setGameState('MEMORIZING');
      const timer = setTimeout(() => {
        setGameState('PLAYING');
      }, 2500); // 2.5 seconds memorize window
      return () => clearTimeout(timer);
    } else {
      setGameState('PLAYING');
    }
  }, [target, mode]);

  const userHex = colord(userHsl).toHex().toUpperCase();

  const handleNextRound = () => {
    setTarget(mode === 'NAME_MATCH' ? getRandomColor() : generateRandomHex());
    setUserHsl({ h: Math.floor(Math.random() * 360), s: 50, l: 50 });
    setGameState('PLAYING');
    setScore(null);
  };

  const handleCheck = () => {
    const calculatedScore = calculateAccuracy(target.hex, userHex);
    setScore(calculatedScore);
    setGameState('SCORED');

    if (calculatedScore >= 90) {
      setStreak((prev) => prev + 1);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    } else {
      setStreak(0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 font-sans">
      {/* Header */}
      <header className="w-full max-w-2xl flex items-center justify-between py-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <a href="https://kuberansilks.com/" target="_blank" rel="noopener noreferrer" className="shrink-0 hover:opacity-80 transition-opacity">
            <img src="/images/kuberan_logo_white_bg.png" alt="Kuberan Silks Logo" className="w-8 h-8 rounded" />
          </a>
          <h1 className="text-xl md:text-2xl font-black tracking-wider bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            KUBERAN COLORS (COLOR IQ GAME)
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Streak: {streak}</span>
          </div>
          <button 
            onClick={() => alert('To install: Click the install/download icon in your browser search bar or menu.')} 
            className="text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition">
            <Download className="w-3.5 h-3.5" /> Download App
          </button>
        </div>
      </header>

      {/* Main Game Container */}
      <main className="w-full max-w-xl flex flex-col items-center my-auto py-6">
        {/* Mode Selector */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mb-8 w-full">
          {[
            { id: 'MEMORY', label: 'Color Memory' },
            { id: 'GUESS_HEX', label: 'HEX Code IQ' },
            { id: 'NAME_MATCH', label: 'Color Names' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); handleNextRound(); }}
              className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${
                mode === m.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Target Stage Display */}
        <div className="w-full flex flex-col items-center mb-6">
          {mode === 'MEMORY' && (
            <div className="text-center mb-3">
              {gameState === 'MEMORIZING' ? (
                <span className="text-amber-400 text-sm font-medium animate-pulse">Memorize the color...</span>
              ) : (
                <span className="text-slate-400 text-sm">Recreate the shade from memory!</span>
              )}
            </div>
          )}

          {mode === 'NAME_MATCH' && (
            <div className="text-center mb-4">
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Target Color Name</span>
              <h2 className="text-3xl font-extrabold text-white mt-1">{target.name}</h2>
            </div>
          )}

          {mode === 'GUESS_HEX' && (
            <div className="text-center mb-4">
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Target HEX Code</span>
              <h2 className="text-3xl font-mono font-bold tracking-wider text-white mt-1">{target.hex}</h2>
            </div>
          )}

          {/* Color Display Canvas */}
          <div className="grid grid-cols-2 gap-4 w-full h-44 rounded-2xl overflow-hidden p-2 bg-slate-900 border border-slate-800 shadow-2xl">
            {/* Target Swatch */}
            <div className="relative rounded-xl flex items-center justify-center transition-all duration-300" 
                 style={{ 
                   backgroundColor: (mode === 'MEMORY' && gameState !== 'MEMORIZING' && gameState !== 'SCORED') ? '#0f172a' : target.hex 
                 }}>
              {mode === 'MEMORY' && gameState === 'PLAYING' && (
                <Eye className="w-8 h-8 text-slate-700 animate-pulse" />
              )}
              <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded text-white/80 backdrop-blur-sm">
                Target
              </span>
            </div>

            {/* User Swatch */}
            <div className="relative rounded-xl flex items-center justify-center transition-all duration-150" 
                 style={{ backgroundColor: userHex }}>
              <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded text-white/80 backdrop-blur-sm">
                Your Dial ({userHex})
              </span>
            </div>
          </div>
        </div>

        {/* HSB / HSL Sliders */}
        <div className="w-full bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg mb-6">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-400">Hue</span>
              <span className="text-indigo-400">{userHsl.h}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={userHsl.h}
              onChange={(e) => setUserHsl({ ...userHsl, h: parseInt(e.target.value) })}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              style={{ background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-400">Saturation</span>
              <span className="text-indigo-400">{userHsl.s}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={userHsl.s}
              onChange={(e) => setUserHsl({ ...userHsl, s: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-400">Lightness</span>
              <span className="text-indigo-400">{userHsl.l}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={userHsl.l}
              onChange={(e) => setUserHsl({ ...userHsl, l: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        {/* Action Button / Results */}
        {gameState === 'SCORED' ? (
          <div className="w-full bg-slate-900/90 border border-indigo-500/30 p-4 rounded-2xl text-center space-y-3">
            <div className="text-xs uppercase tracking-widest text-slate-400">Accuracy Rating</div>
            <div className="text-4xl font-black text-indigo-400">{score}%</div>
            <p className="text-xs text-slate-300">
              Target was <span className="font-mono text-indigo-300">{target.hex}</span>
              {target.name && ` (${target.name})`}
            </p>
            <button
              onClick={handleNextRound}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Next Round
            </button>
          </div>
        ) : (
          <button
            disabled={gameState === 'MEMORIZING'}
            onClick={handleCheck}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition"
          >
            Submit Match
          </button>
        )}
      </main>

      {/* Footer */}
      <footer className="text-xs text-slate-500 text-center py-4 space-y-2">
        <p>Kuberan Colors - Color IQ Training App • Hosted on GitHub</p>
      </footer>
    </div>
  );
}
