import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import BattleSimulation from './BattleSimulation';
import axios from 'axios';

const API_BASE = '/api';

const BattlePuzzle: React.FC = () => {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'complete'>('intro');
  const [score, setScore] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [gameWon, setGameWon] = useState(false);

  const handleGameComplete = (finalScore: number, won: boolean) => {
    setScore(finalScore);
    setGameWon(won);
    setGameState('complete');
  };

  const handleStartGame = () => {
    setGameState('playing');
    setScore(null);
    setScoreSubmitted(false);
    setSubmitError(null);
    setPlayerName('');
  };

  const handleRestart = () => {
    setGameState('intro');
    setScore(null);
    setScoreSubmitted(false);
    setSubmitError(null);
    setPlayerName('');
  };

  const handleScoreSubmit = async () => {
    if (!playerName.trim()) {
      setSubmitError('Name is required');
      return;
    }

    if (playerName.length < 1 || playerName.length > 20) {
      setSubmitError('Name must be 1-20 characters');
      return;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(playerName)) {
      setSubmitError('Name can only contain letters, numbers, and spaces');
      return;
    }

    try {
      await axios.post(`${API_BASE}/scores`, {
        name: playerName.trim(),
        score: score,
      });
      setScoreSubmitted(true);
      setSubmitError(null);
    } catch (error) {
      setSubmitError('Failed to submit score. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-display italic text-accent-coral mb-8">
        {t('battlePuzzle')}
      </h2>

      <AnimatePresence mode="wait">
        {gameState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="border-l-4 border-accent-coral bg-surface p-12 text-center"
          >
            <div className="text-6xl mb-6">⚔️🔥🌊</div>
            <h3 className="text-xl font-bold uppercase tracking-wider text-text mb-4">
              {t('battleOfRedCliffs')}
            </h3>
            <p className="text-text-muted mb-8 max-w-lg mx-auto leading-relaxed">
              {t('battleDescription')}
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8 text-sm text-text-muted">
              <div className="bg-surface-2 p-4">
                <div className="text-2xl mb-2">🌬️</div>
                {t('phase1Short')}
              </div>
              <div className="bg-surface-2 p-4">
                <div className="text-2xl mb-2">⛓️</div>
                {t('phase2Short')}
              </div>
              <div className="bg-surface-2 p-4">
                <div className="text-2xl mb-2">🔥</div>
                {t('phase3Short')}
              </div>
            </div>
            <button
              onClick={handleStartGame}
              className="px-8 py-4 bg-accent-coral text-text font-bold uppercase tracking-wider hover:bg-accent-coral/80 transition-all"
            >
              {t('startBattle')}
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BattleSimulation onComplete={handleGameComplete} />
          </motion.div>
        )}

        {gameState === 'complete' && score !== null && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-l-4 border-accent-coral bg-surface p-12 text-center"
          >
            <div className={`text-4xl font-display italic mb-6 ${gameWon ? 'text-accent-gold' : 'text-text-muted'}`}>
              {gameWon ? t('victoryEmblem') : t('defeatEmblem')}
            </div>
            <h3 className={`text-2xl font-display italic mb-4 ${gameWon ? 'text-accent-coral' : 'text-text-muted'}`}>
              {gameWon ? t('victory') : t('defeat')}
            </h3>
            <p className="text-text mb-4">{gameWon ? t('battleWon') : t('battleLost')}</p>
            {gameWon && (
              <div className="text-5xl font-bold text-accent-gold mb-8">
                {score} {t('points')}
              </div>
            )}

            {gameWon && !scoreSubmitted ? (
              <div className="max-w-sm mx-auto">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder={t('enterName')}
                  maxLength={20}
                  className="w-full px-4 py-3 bg-surface-2 text-text border border-border focus:outline-none focus:border-accent-coral text-sm mb-4"
                />
                {submitError && (
                  <p className="text-accent-coral text-xs mb-4 font-bold uppercase">{submitError}</p>
                )}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleScoreSubmit}
                    className="px-6 py-3 bg-accent-coral text-text font-bold uppercase tracking-wider hover:bg-accent-coral/80 transition-all"
                  >
                    {t('submitScore')}
                  </button>
                  <button
                    onClick={handleRestart}
                    className="px-6 py-3 border border-border text-text font-bold uppercase tracking-wider hover:border-accent-coral transition-all"
                  >
                    {t('playAgain')}
                  </button>
                </div>
              </div>
            ) : !gameWon ? (
              <div>
                <p className="text-text-muted mb-4">{t('timeSurvived')}: {Math.floor(score / 10)}s</p>
                <button
                  onClick={handleRestart}
                  className="px-8 py-4 border border-border text-text font-bold uppercase tracking-wider hover:border-accent-coral hover:bg-surface transition-all"
                >
                  {t('tryAgain')}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-accent-coral font-bold uppercase mb-4">{t('scoreSubmitted')}</p>
                <button
                  onClick={handleRestart}
                  className="px-8 py-4 bg-accent-coral text-text font-bold uppercase tracking-wider hover:bg-accent-coral/80 transition-all"
                >
                  {t('playAgain')}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BattlePuzzle;
