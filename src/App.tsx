import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './components/LanguageToggle';
import Timeline from './components/Timeline/Timeline';
import BattlePuzzle from './components/BattlePuzzle/BattlePuzzle';
import Leaderboard from './components/Leaderboard';

type ViewState = 'home' | 'timeline' | 'puzzle' | 'leaderboard' | 'about';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [view, setView] = useState<ViewState>('home');

  const tabs = [
    { id: 'home' as ViewState, label: t('timeline') },
    { id: 'timeline' as ViewState, label: t('timeline') },
    { id: 'puzzle' as ViewState, label: t('puzzle') },
    { id: 'leaderboard' as ViewState, label: t('leaderboard') },
    { id: 'about' as ViewState, label: t('about') },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Top Bar */}
      <div className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
          <LanguageToggle />
        </div>
      </div>

      {/* Hero Section */}
      {view === 'home' && (
        <div className="max-w-5xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-text-muted text-xs font-bold uppercase tracking-wider">
                {t('eyebrow')}
              </span>
              <span className="text-accent-coral text-xs italic font-display">
                {t('interactive')}
              </span>
            </div>

            <h1 className="text-8xl md:text-9xl font-display italic leading-none mb-8">
              <span className="text-text-muted not-italic">{t('heroThe')}</span>{' '}
              <span className="text-accent-coral">{t('heroThreeKingdoms')}</span>
              <br />
              <span className="text-text italic">{t('heroRiseFall')}</span>
            </h1>

            <div className="flex gap-3 mb-8">
              <span className="px-3 py-1 border-2 border-accent-coral text-accent-coral text-xs font-bold uppercase tracking-wider hover:bg-accent-coral hover:text-text transition-all cursor-pointer">
                {t('track')}
              </span>
              <span className="px-3 py-1 border-2 border-accent-gold text-accent-gold text-xs font-bold uppercase tracking-wider hover:bg-accent-gold hover:text-text transition-all cursor-pointer">
                {t('craft')}
              </span>
            </div>

            <p className="text-text-muted text-sm font-bold uppercase tracking-wider mb-12">
              {t('instruction')}
            </p>

            <div className="border-l-4 border-accent-coral bg-surface p-8 hover:bg-surface-2 transition-all duration-300">
              <h2 className="text-lg font-bold uppercase tracking-wider text-text-muted mb-4">
                {t('welcome')}
              </h2>
              <p className="text-text leading-relaxed mb-4">
                {t('welcomeText')}
              </p>
              <p className="text-text leading-relaxed mb-6">
                {t('welcomeText2')}
              </p>
              <button
                onClick={() => setView('timeline')}
                className="px-6 py-3 bg-accent-coral text-text text-xs font-bold uppercase tracking-wider hover:bg-accent-coral/80 transition-all"
              >
                {t('beginTimeline')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-8 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`relative pb-4 text-sm font-bold uppercase tracking-wider transition-colors ${view === tab.id ? 'text-accent-coral' : 'text-text-muted hover:text-text'
                }`}
            >
              {tab.label}
              {view === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-px bg-accent-coral"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-5xl mx-auto px-6 py-8 text-text">
        {view === 'timeline' && <Timeline />}
        {view === 'puzzle' && <BattlePuzzle />}
        {view === 'leaderboard' && <Leaderboard />}
        {view === 'about' && (
          <div className="border-l-4 border-accent-coral bg-surface p-8 hover:bg-surface-2 transition-all duration-300">
            <h2 className="text-lg font-bold uppercase tracking-wider text-text-muted mb-4">
              {t('about')}
            </h2>
            <p className="text-text leading-relaxed mb-4">
              An educational interactive experience about the Three Kingdoms period in Chinese history.
            </p>
            <p className="text-text leading-relaxed mb-4">
              Built with React, TypeScript, Fastify, and SQLite. Features a REST API backend with real-time score tracking and leaderboard functionality.
            </p>
            <p className="text-text-muted text-sm">
              Requires backend server and database for full functionality.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
