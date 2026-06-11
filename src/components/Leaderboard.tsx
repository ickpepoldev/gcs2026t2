import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const API_BASE = '/api';

interface Score {
  id: number;
  name: string;
  score: number;
  timestamp: number;
}

const Leaderboard: React.FC = () => {
  const { t } = useTranslation();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const response = await axios.get<{ scores: Score[] }>(`${API_BASE}/scores`);
      setScores(response.data.scores);
      setError(null);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-5xl font-display italic text-accent-coral mb-12 leading-tight">
          {t('leaderboard')}
        </h2>
        <div className="border-l-4 border-accent-coral bg-surface p-8 text-center">
          <p className="text-text-muted text-xs font-bold uppercase tracking-wider">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h2 className="text-5xl font-display italic text-accent-coral mb-12 leading-tight">
          {t('leaderboard')}
        </h2>
        <div className="border-l-4 border-accent-coral bg-surface p-8 text-center">
          <p className="text-accent-coral text-sm font-bold uppercase tracking-wider mb-4">{error}</p>
          <button
            onClick={fetchScores}
            className="px-6 py-3 bg-accent-coral text-text text-xs font-bold uppercase tracking-wider"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-5xl font-display italic text-accent-coral mb-12 leading-tight">
        {t('leaderboard')}
      </h2>
      <div className="border-l-4 border-accent-coral bg-surface p-8 hover:bg-surface-2 transition-all duration-300">
        {scores.length === 0 ? (
          <p className="text-center text-text-muted text-sm">{t('noScores')}</p>
        ) : (
          <div className="space-y-3">
            {scores.map((score, index) => (
              <div
                key={score.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-surface-2 px-4 -mx-4 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-8 h-8 flex items-center justify-center text-xs font-bold uppercase tracking-wider transition-all duration-300 ${index === 0
                      ? 'bg-accent-coral text-text glow-accent'
                      : index === 1
                        ? 'bg-surface-2 text-accent-gold border border-accent-gold'
                        : index === 2
                          ? 'bg-surface-2 text-accent-gold border border-accent-gold'
                          : 'bg-surface-2 text-text-muted'
                      }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-text font-medium group-hover:text-accent-coral transition-colors duration-300">{score.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-accent-coral font-display italic text-lg glow-accent">{score.score}</span>
                  <span className="text-text-muted text-xs font-bold uppercase tracking-wider">
                    {new Date(score.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={fetchScores}
          className="mt-6 w-full px-4 py-3 bg-surface-2 text-text-muted text-xs font-bold uppercase tracking-wider border border-border hover:border-accent-coral hover:text-text hover:bg-surface transition-all duration-300"
        >
          {t('refresh')}
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
