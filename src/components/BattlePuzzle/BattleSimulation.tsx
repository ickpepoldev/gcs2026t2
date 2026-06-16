import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface BattleSimulationProps {
  onComplete: (score: number, won: boolean) => void;
}

interface Projectile {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  startTime: number;
  duration: number;
}

interface DamageNumber {
  id: number;
  x: number;
  y: number;
  amount: number;
}

// SVG Ship Icon Component with realistic hull
const ShipIcon: React.FC<{
  isChained?: boolean;
  isOnFire?: boolean;
  size?: number;
  className?: string;
}> = ({ isChained, isOnFire, size = 70, className = '' }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 70 90" className={`w-12 h-16 sm:w-14 sm:h-[4.5rem] md:w-16 md:h-20 ${className}`}>
    <defs>
      <linearGradient id={`hullGradient-${isChained}-${isOnFire}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={isOnFire ? '#ff6b35' : isChained ? '#5a5a5a' : '#4a5568'} />
        <stop offset="50%" stopColor={isOnFire ? '#e8613a' : isChained ? '#4a4a4a' : '#3a4a5a'} />
        <stop offset="100%" stopColor={isOnFire ? '#c44d2a' : isChained ? '#2a2a2a' : '#1a2a3a'} />
      </linearGradient>
      <filter id="fireGlow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Hull with realistic curves */}
    <path
      d="M10,30 Q8,45 15,55 L35,85 Q35,87 38,85 L58,55 Q65,45 63,30 Q60,20 50,18 L23,18 Q13,20 10,30 Z"
      fill={`url(#hullGradient-${isChained}-${isOnFire})`}
      stroke="#1a202c"
      strokeWidth="2"
    />

    {/* Deck detail */}
    <path d="M15,35 L58,35" stroke="#2d3748" strokeWidth="1" opacity="0.5" />

    {/* Mast */}
    <rect x="33" y="5" width="4" height="35" fill="#4a3728" rx="1" />

    {/* Sail with wind ripple effect */}
    <path
      d="M18,12 Q35,8 52,12 Q50,20 48,28 Q35,24 22,28 Q20,20 18,12"
      fill={isOnFire ? '#ff8c69' : '#e8e8e8'}
      stroke="#a0aec0"
      strokeWidth="1"
      opacity={isOnFire ? 0.7 : 0.9}
    />

    {/* Chain links for chained ships */}
    {isChained && (
      <g className="animate-pulse">
        <circle cx="8" cy="30" r="4" fill="#c8a85c" stroke="#8b7355" strokeWidth="1.5" />
        <path d="M8,30 Q20,25 35,30 Q50,35 62,30" stroke="#c8a85c" strokeWidth="2" fill="none" strokeDasharray="6,3" opacity="0.8" />
        <circle cx="62" cy="30" r="4" fill="#c8a85c" stroke="#8b7355" strokeWidth="1.5" />
      </g>
    )}

    {/* Fire effect with animation */}
    {isOnFire && (
      <g filter="url(#fireGlow)">
        <motion.path
          d="M22,15 Q28,-8 35,15 Q42,-5 48,15"
          fill="#ff4757"
          opacity="0.9"
          animate={{ d: ["M22,15 Q28,-8 35,15 Q42,-5 48,15", "M22,15 Q28,-12 35,15 Q42,-8 48,15", "M22,15 Q28,-8 35,15 Q42,-5 48,15"] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        <motion.path
          d="M28,20 Q32,5 36,20"
          fill="#ffaa00"
          opacity="0.7"
          animate={{ d: ["M28,20 Q32,5 36,20", "M28,20 Q32,0 36,20", "M28,20 Q32,5 36,20"] }}
          transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
        />
        <motion.path
          d="M38,18 Q42,8 46,18"
          fill="#ff6b35"
          opacity="0.6"
          animate={{ d: ["M38,18 Q42,8 46,18", "M38,18 Q42,2 46,18", "M38,18 Q42,8 46,18"] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        />
      </g>
    )}
  </svg>
);

// SVG Fire Ship Icon with animated flames
const FireShipIcon: React.FC<{ size?: number; isReady?: boolean; className?: string }> = ({ size = 55, isReady = false, className = '' }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 55 75" className={`w-10 h-14 sm:w-12 sm:h-[4.5rem] md:w-14 md:h-[4.5rem] ${className}`}>
    <defs>
      <linearGradient id="fireHull" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e8613a" />
        <stop offset="50%" stopColor="#c44d2a" />
        <stop offset="100%" stopColor="#9c3a1e" />
      </linearGradient>
      <filter id="intenseFire">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Hull */}
    <path d="M8,25 L27,68 L46,25 Z" fill="url(#fireHull)" stroke="#1a202c" strokeWidth="2" />

    {/* Mast */}
    <rect x="25" y="8" width="4" height="22" fill="#4a3728" rx="1" />

    {/* Animated fire on deck */}
    <g filter="url(#intenseFire)">
      <motion.path
        d="M12,22 Q18,0 27,22 Q36,0 42,22"
        fill="#ff4757"
        opacity={isReady ? "1" : "0.6"}
        animate={isReady ? {
          d: ["M12,22 Q18,0 27,22 Q36,0 42,22", "M12,22 Q18,-5 27,22 Q36,-5 42,22", "M12,22 Q18,0 27,22 Q36,0 42,22"]
        } : {}}
        transition={{ duration: 0.3, repeat: Infinity }}
      />
      <motion.path
        d="M18,18 Q22,5 27,18 Q32,5 36,18"
        fill="#ff9500"
        opacity={isReady ? "0.8" : "0.4"}
        animate={isReady ? {
          d: ["M18,18 Q22,5 27,18 Q32,5 36,18", "M18,18 Q22,-2 27,18 Q32,-2 36,18", "M18,18 Q22,5 27,18 Q32,5 36,18"]
        } : {}}
        transition={{ duration: 0.25, repeat: Infinity, delay: 0.05 }}
      />
    </g>

    {/* Ready indicator glow */}
    {isReady && (
      <motion.circle
        cx="27"
        cy="35"
        r="30"
        fill="none"
        stroke="#c8a85c"
        strokeWidth="2"
        opacity="0.5"
        animate={{ r: [30, 35, 30], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    )}
  </svg>
);

// Enhanced Arrow with trail effect
const ArrowIcon: React.FC<{ rotation?: number; isHit?: boolean }> = ({ rotation = 0, isHit = false }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" style={{ transform: `rotate(${rotation}deg)` }}>
    <defs>
      <linearGradient id="arrowHead" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#e8613a" />
        <stop offset="100%" stopColor="#c8a85c" />
      </linearGradient>
      <linearGradient id="arrowTrail" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#e8613a" stopOpacity="0" />
        <stop offset="50%" stopColor="#e8613a" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#c8a85c" stopOpacity="0.6" />
      </linearGradient>
    </defs>

    {/* Motion trail */}
    {!isHit && (
      <>
        <ellipse cx="12" cy="16" rx="8" ry="2" fill="url(#arrowTrail)" />
        <ellipse cx="16" cy="16" rx="6" ry="1.5" fill="url(#arrowTrail)" opacity="0.5" />
      </>
    )}

    {/* Arrow shaft */}
    <line x1="2" y1="16" x2="22" y2="16" stroke="url(#arrowHead)" strokeWidth="2.5" strokeLinecap="round" />

    {/* Arrow head */}
    <path d="M18,10 L28,16 L18,22" fill="none" stroke="url(#arrowHead)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Impact ring when hit */}
    {isHit && (
      <motion.circle
        cx="16"
        cy="16"
        r="4"
        fill="none"
        stroke="#ff4757"
        strokeWidth="2"
        initial={{ r: 4, opacity: 1 }}
        animate={{ r: 20, opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
    )}
  </svg>
);

// Enhanced Wind Compass with realistic needle movement
const WindCompass: React.FC<{ direction: number; isGoodWind: boolean }> = ({ direction, isGoodWind }) => (
  <svg width="110" height="110" viewBox="0 0 110 110">
    <defs>
      <radialGradient id="compassFace" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#2d3748" />
        <stop offset="100%" stopColor="#1a202c" />
      </radialGradient>
      <linearGradient id="needleGood" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#48bb78" />
        <stop offset="100%" stopColor="#38a169" />
      </linearGradient>
      <linearGradient id="needleBad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e8613a" />
        <stop offset="100%" stopColor="#c44d2a" />
      </linearGradient>
      <filter id="compassGlow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Outer ring */}
    <circle cx="55" cy="55" r="50" fill="url(#compassFace)" stroke={isGoodWind ? "#48bb78" : "#4a5568"} strokeWidth="3" filter={isGoodWind ? "url(#compassGlow)" : ""} />
    <circle cx="55" cy="55" r="42" fill="none" stroke="#2d3748" strokeWidth="1" />

    {/* Cardinal directions */}
    <text x="55" y="18" textAnchor="middle" fill={isGoodWind ? "#48bb78" : "#a0aec0"} fontSize="12" fontWeight="bold">N</text>
    <text x="55" y="98" textAnchor="middle" fill="#a0aec0" fontSize="12" fontWeight="bold">S</text>
    <text x="12" y="60" textAnchor="middle" fill="#a0aec0" fontSize="12" fontWeight="bold">W</text>
    <text x="98" y="60" textAnchor="middle" fill="#a0aec0" fontSize="12" fontWeight="bold">E</text>

    {/* Direction markers */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
      <line
        key={deg}
        x1="55"
        y1="15"
        x2="55"
        y2={deg % 90 === 0 ? "20" : "18"}
        stroke="#4a5568"
        strokeWidth={deg % 90 === 0 ? "2" : "1"}
        transform={`rotate(${deg}, 55, 55)`}
      />
    ))}

    {/* Needle with animation */}
    <g transform={`rotate(${direction}, 55, 55)`}>
      <motion.path
        d="M55,15 L62,55 L55,50 L48,55 Z"
        fill={isGoodWind ? "url(#needleGood)" : "url(#needleBad)"}
        animate={isGoodWind ? { opacity: [1, 0.8, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      <path d="M55,95 L62,55 L55,60 L48,55 Z" fill="#4a5568" />
    </g>

    {/* Center pivot */}
    <circle cx="55" cy="55" r="5" fill="#c8a85c" />
    <circle cx="55" cy="55" r="2" fill="#1a202c" />
  </svg>
);

// SVG Health Heart with pulse animation
const HealthIcon: React.FC<{ health: number }> = ({ health }) => (
  <svg width="28" height="28" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="heartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={health > 50 ? '#e8613a' : health > 25 ? '#ed8936' : '#fc8181'} />
        <stop offset="100%" stopColor={health > 50 ? '#c44d2a' : health > 25 ? '#dd6b20' : '#f56565'} />
      </linearGradient>
    </defs>
    <motion.path
      d="M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z"
      fill="url(#heartGrad)"
      stroke={health > 50 ? '#e8613a' : health > 25 ? '#ed8936' : '#fc8181'}
      strokeWidth="1.5"
      animate={health < 30 ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.5, repeat: Infinity }}
    />
  </svg>
);

// Damage number animation
const DamageNumber: React.FC<{ x: number; y: number; amount: number }> = ({ x, y, amount }) => (
  <motion.div
    className="absolute text-red-500 font-bold text-xl pointer-events-none z-50"
    style={{ left: x, top: y }}
    initial={{ opacity: 1, y: 0, scale: 1 }}
    animate={{ opacity: 0, y: -40, scale: 1.5 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    -{amount}
  </motion.div>
);

// Enemy Health Bar Component
const EnemyHealthBar: React.FC<{ health: number; maxHealth: number }> = ({ health, maxHealth }) => {
  const { t } = useTranslation();
  const percentage = (health / maxHealth) * 100;

  const getHealthColor = () => {
    if (percentage > 60) return 'from-red-500 to-red-600';
    if (percentage > 30) return 'from-orange-500 to-red-500';
    return 'from-red-700 to-red-800';
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1">
        <div className="flex justify-between text-xs text-text-muted mb-1">
          <span className="font-bold uppercase tracking-wider text-red-400">{t('enemyHealth')}</span>
          <span className={`font-bold ${percentage <= 30 ? 'text-red-500' : ''}`}>
            {Math.round(health)}/{maxHealth}
          </span>
        </div>
        <div className="h-4 bg-surface-2 border-2 border-border overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${getHealthColor()}`}
            initial={{ width: '100%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          />
        </div>
      </div>
    </div>
  );
};

// Tick Damage Indicator Component
const TickDamageIndicator: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-red-900/90 border-2 border-red-500 px-4 py-2 rounded-lg z-30"
    >
      <div className="flex items-center gap-2">
        <span className="text-red-400 animate-pulse">🔥</span>
        <span className="text-red-300 text-sm font-bold">
          {count}x BLEEDING! -{count * 2} HP/sec
        </span>
      </div>
    </motion.div>
  );
};

// Health Bar Component with smooth animation
const HealthBar: React.FC<{ health: number; maxHealth: number }> = ({ health, maxHealth }) => {
  const { t } = useTranslation();
  const percentage = (health / maxHealth) * 100;

  const getHealthColor = () => {
    if (percentage > 60) return 'from-green-500 to-green-600';
    if (percentage > 30) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <HealthIcon health={health} />
      <div className="flex-1">
        <div className="flex justify-between text-xs text-text-muted mb-1">
          <span className="font-bold uppercase tracking-wider">{t('health')}</span>
          <span className={`font-bold ${percentage <= 30 ? 'text-red-500' : ''}`}>
            {Math.round(health)}/{maxHealth}
          </span>
        </div>
        <div className="h-4 bg-surface-2 border-2 border-border overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${getHealthColor()}`}
            initial={{ width: '100%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          />
        </div>
      </div>
    </div>
  );
};

// Main Battle Simulation Component
const BattleSimulation: React.FC<BattleSimulationProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState(0); // 0 = chain ships, 1 = fire attack available
  const [windDirection, setWindDirection] = useState(135); // SE is ~135°
  const [health, setHealth] = useState(100);
  const [maxHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [maxEnemyHealth] = useState(100);
  const [bossTickDamageCount, setBossTickDamageCount] = useState(0); // Player arrows causing bleed on boss
  const [chainedShips, setChainedShips] = useState<Set<number>>(new Set());
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [playerProjectiles, setPlayerProjectiles] = useState<Projectile[]>([]);
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; x: number; y: number; text: string; color: string }[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isGoodWind, setIsGoodWind] = useState(false);
  const [reloadTime, setReloadTime] = useState(0); // Reload timer in seconds
  const [isReloading, setIsReloading] = useState(false);

  const gameStartTime = useRef(Date.now());
  const projectileIdRef = useRef(0);
  const damageIdRef = useRef(0);
  const RELOAD_DURATION = 1; // 1 second reload

  // SE wind range: 120-150 degrees
  const SE_MIN = 120;
  const SE_MAX = 150;

  // Wei fleet positions (enemy ships)
  const weiShips = [
    { id: 0, x: 18, y: 30 },
    { id: 1, x: 32, y: 35 },
    { id: 2, x: 46, y: 30 },
    { id: 3, x: 60, y: 35 },
    { id: 4, x: 74, y: 30 },
  ];

  // Fire ships (player's attack ships)
  const fireShips = [
    { id: 10, x: 15, y: 72 },
    { id: 11, x: 30, y: 78 },
    { id: 12, x: 45, y: 72 },
  ];

  // Wind simulation - continuously changing
  useEffect(() => {
    if (gameComplete) return;

    const windInterval = setInterval(() => {
      const time = Date.now() / 1000;
      // Complex wind pattern that occasionally hits SE
      const baseDirection = 100 + Math.sin(time * 0.3) * 40 + Math.sin(time * 0.7) * 20;
      const noise = (Math.random() - 0.5) * 10;
      const newDirection = Math.max(60, Math.min(180, baseDirection + noise));

      setWindDirection(newDirection);
      setIsGoodWind(newDirection >= SE_MIN && newDirection <= SE_MAX);
    }, 200);

    return () => clearInterval(windInterval);
  }, [gameComplete]);

  // Boss tick damage - player arrows cause fire spread on boss
  useEffect(() => {
    if (gameComplete || bossTickDamageCount === 0) return;

    const tickInterval = setInterval(() => {
      setEnemyHealth((prev) => {
        const damage = bossTickDamageCount * 5; // Each player arrow wound deals 5 HP/sec to boss (fire spread)
        const newHealth = Math.max(0, prev - damage);
        if (newHealth <= 0) {
          setGameComplete(true);
          setGameWon(true);
          const finalScore = calculateFinalScore(health, elapsedTime);
          onComplete(finalScore, true);
        }
        return newHealth;
      });
    }, 1000);

    return () => clearInterval(tickInterval);
  }, [gameComplete, bossTickDamageCount, elapsedTime, onComplete]);

  // Game timer
  useEffect(() => {
    if (gameComplete) return;

    const timerInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - gameStartTime.current) / 1000));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameComplete]);

  // Reload timer
  useEffect(() => {
    if (!isReloading) return;

    const reloadInterval = setInterval(() => {
      setReloadTime(prev => {
        const newTime = prev + 0.1;
        if (newTime >= RELOAD_DURATION) {
          setIsReloading(false);
          return 0;
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(reloadInterval);
  }, [isReloading]);

  // Enemy projectile spawning - every 2-4 seconds
  useEffect(() => {
    if (gameComplete) return;

    const spawnProjectile = () => {
      const spawnInterval = 2000 + Math.random() * 2000; // 2-4 seconds

      const timeout = setTimeout(() => {
        if (gameComplete) return;

        // Pick random enemy ship
        const randomShip = weiShips[Math.floor(Math.random() * weiShips.length)];
        // Target random player fire ship
        const randomTarget = fireShips[Math.floor(Math.random() * fireShips.length)];

        const newProjectile: Projectile = {
          id: projectileIdRef.current++,
          x: randomShip.x,
          y: randomShip.y,
          targetX: randomTarget.x,
          targetY: randomTarget.y,
          startTime: Date.now(),
          duration: 1800 + Math.random() * 400, // 1.8-2.2 seconds
        };

        setProjectiles((prev) => [...prev, newProjectile]);

        // Check for hit after animation
        setTimeout(() => {
          setProjectiles((prev) => {
            const projectile = prev.find(p => p.id === newProjectile.id);
            if (projectile) {
              // Arrow wasn't clicked - hit!
              takeDamage(5, randomTarget.x, randomTarget.y); // Arrow hit damage
              return prev.filter((p) => p.id !== newProjectile.id);
            }
            return prev;
          });
        }, newProjectile.duration);

        spawnProjectile();
      }, spawnInterval);

      return () => clearTimeout(timeout);
    };

    const cleanup = spawnProjectile();
    return cleanup;
  }, [gameComplete, health]);

  // Progress to fire phase when all ships chained
  useEffect(() => {
    if (chainedShips.size === weiShips.length && phase === 0) {
      setTimeout(() => {
        setPhase(1);
        setShowHint(true);
      }, 1000);
    }
  }, [chainedShips, weiShips.length, phase]);

  const calculateFinalScore = (remainingHealth: number, time: number) => {
    // Score is primarily based on health remaining (80% of score)
    // Health is worth 50 points per percentage point
    const healthBonus = Math.floor(remainingHealth * 50);
    // Small speed bonus (20% of max possible)
    const speedBonus = Math.max(0, 100 - time) * 2;
    const total = healthBonus + speedBonus;
    setScore(total);
    return total;
  };

  const takeDamage = (amount: number, x?: number, y?: number) => {
    setHealth((prev) => {
      const newHealth = Math.max(0, prev - amount);

      // Show damage number
      if (x !== undefined && y !== undefined) {
        const damageNum: DamageNumber = {
          id: damageIdRef.current++,
          x: x,
          y: y,
          amount: amount,
        };
        setDamageNumbers(prev => [...prev, damageNum]);
        setTimeout(() => {
          setDamageNumbers(prev => prev.filter(d => d.id !== damageNum.id));
        }, 800);
      }

      if (newHealth <= 0) {
        setGameComplete(true);
        setGameWon(false);
        calculateFinalScore(0, elapsedTime);
        onComplete(0, false);
      }
      return newHealth;
    });
  };

  const handleProjectileClick = (projectileId: number) => {
    setProjectiles((prev) => prev.filter((p) => p.id !== projectileId));
  };

  const handleChainShip = (shipId: number) => {
    if (phase !== 0) return;

    setChainedShips((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(shipId)) {
        newSet.delete(shipId);
        const ship = weiShips.find(s => s.id === shipId);
        if (ship) takeDamage(3, ship.x, ship.y); // Very low penalty for unchaining
      } else {
        newSet.add(shipId);
      }
      return newSet;
    });
  };

  // Calculate hit quality based on wind timing
  const calculateHitQuality = (direction: number): 'perfect' | 'good' | 'miss' => {
    const perfectAngle = 135; // Exact SE
    const deviation = Math.abs(direction - perfectAngle);

    if (deviation <= 8) return 'perfect'; // 127-143° = perfect (much easier)
    if (deviation <= 20) return 'good';    // 115-155° = good (very wide)
    return 'miss';                          // Outside range = miss
  };

  const handleLaunchFireShip = (shipId: number) => {
    // Check if reloading
    if (isReloading) {
      const ship = fireShips.find(s => s.id === shipId);
      if (ship) {
        showFloatingText(ship.x, ship.y, 'Reloading...', '#f59e0b');
      }
      return;
    }

    // Calculate hit quality based on timing
    const hitQuality = calculateHitQuality(windDirection);

    // Always create projectile animation
    const playerShip = fireShips.find(s => s.id === shipId);
    if (playerShip) {
      const targetShip = weiShips[Math.floor(Math.random() * weiShips.length)];

      // Adjust target based on wind direction
      const windOffset = (windDirection - 135) * 0.3; // Wind affects trajectory
      const adjustedTargetX = targetShip.x + windOffset;
      const adjustedTargetY = targetShip.y - Math.abs(windOffset) * 0.5;

      const newProjectile: Projectile = {
        id: projectileIdRef.current++,
        x: playerShip.x,
        y: playerShip.y,
        targetX: adjustedTargetX,
        targetY: adjustedTargetY,
        startTime: Date.now(),
        duration: 800, // Fast animation
      };
      setPlayerProjectiles(prev => [...prev, newProjectile]);

      // Remove projectile after animation
      setTimeout(() => {
        setPlayerProjectiles(prev => prev.filter(p => p.id !== newProjectile.id));
      }, newProjectile.duration);
    }

    if (hitQuality === 'miss') {
      // Fire ship misses - just show feedback, no game over
      const ship = fireShips.find(s => s.id === shipId);
      if (ship) {
        showFloatingText(ship.x, ship.y, t('missLabel'), '#ef4444');
      }
      // Start reload even on miss
      setIsReloading(true);
      setReloadTime(0);
      return;
    }

    // Successful hit!
    // Deal initial damage to boss
    const initialDamage = hitQuality === 'perfect' ? 15 : 10;
    setEnemyHealth(prev => {
      const newHealth = Math.max(0, prev - initialDamage);
      if (newHealth <= 0) {
        setGameComplete(true);
        setGameWon(true);
        const finalScore = calculateFinalScore(health, elapsedTime);
        onComplete(finalScore, true);
      }
      return newHealth;
    });

    // Add fire spread tick damage to boss
    setBossTickDamageCount(prev => prev + 1);

    // Start reload
    setIsReloading(true);
    setReloadTime(0);

    // Show hit quality feedback
    if (playerShip) {
      const qualityText = hitQuality === 'perfect' ? t('perfectLabel') : t('hitLabel');
      const qualityColor = hitQuality === 'perfect' ? '#22c55e' : '#eab308';
      showFloatingText(playerShip.x, playerShip.y, qualityText, qualityColor);
    }
  };

  // Show floating text feedback
  const showFloatingText = (x: number, y: number, text: string, color: string) => {
    const id = Date.now();
    setFloatingTexts(prev => [...prev, { id, x, y, text, color }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1500);
  };

  const resetGame = () => {
    window.location.reload();
  };

  return (
    <div className="relative w-full h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] bg-gradient-to-b from-[#0f1419] via-[#1a2332] to-[#0f1419] border-2 border-border overflow-hidden">
      {/* Animated background waves */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a365d" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#2c5282" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,400 Q250,350 500,400 T1000,400 L1000,650 L0,650 Z"
            fill="url(#waveGrad)"
            animate={{
              d: [
                "M0,400 Q250,350 500,400 T1000,400 L1000,650 L0,650 Z",
                "M0,400 Q250,450 500,400 T1000,400 L1000,650 L0,650 Z",
                "M0,400 Q250,350 500,400 T1000,400 L1000,650 L0,650 Z"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Health Bar - Top */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 bg-surface/95 border-2 border-border p-2 sm:p-4 z-20">
        <div className="flex flex-col gap-2">
          <HealthBar health={health} maxHealth={maxHealth} />
          <EnemyHealthBar health={enemyHealth} maxHealth={maxEnemyHealth} />
        </div>
      </div>

      {/* Tick Damage Indicator */}
      <TickDamageIndicator count={bossTickDamageCount} />

      {/* Wind Indicator - Top Right */}
      <div className="absolute top-20 sm:top-24 right-2 sm:right-4 bg-surface/95 border-2 border-border p-2 sm:p-4 z-10">
        <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 text-center">{t('wind')}</div>
        <WindCompass direction={windDirection} isGoodWind={isGoodWind} />
        <div className={`text-center text-xs mt-2 font-bold ${isGoodWind ? 'text-green-500' : 'text-red-500'}`}>
          {isGoodWind ? t('windSEGood') : t('windNotSE')}
        </div>
        <div className="text-center text-xs text-text-muted mt-1">
          {Math.round(windDirection)}°
        </div>
      </div>

      {/* Phase & Progress */}
      <div className="absolute top-20 sm:top-24 left-2 sm:left-4 bg-surface/95 border-2 border-border p-2 sm:p-4 z-10">
        <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">{t('progress')}</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${chainedShips.size === weiShips.length ? 'bg-green-500' : 'bg-accent-gold animate-pulse'}`} />
            <span className="text-sm text-text">{t('chainShips')}: {chainedShips.size}/{weiShips.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isGoodWind ? 'bg-accent-coral animate-pulse' : 'bg-border'}`} />
            <span className="text-sm text-text">{t('fireShips')}: Unlimited</span>
          </div>
          {isReloading && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-sm text-text">Reloading: {Math.ceil(RELOAD_DURATION - reloadTime)}s</span>
            </div>
          )}
        </div>
      </div>

      {/* Wind Status Indicator with Timing Precision */}
      <motion.div
        className="absolute top-48 left-4 px-4 py-2 border-2 z-10"
        animate={{
          borderColor: calculateHitQuality(windDirection) === 'perfect' ? '#22c55e' :
            calculateHitQuality(windDirection) === 'good' ? '#eab308' : '#e8613a',
          backgroundColor: calculateHitQuality(windDirection) === 'perfect' ? 'rgba(34, 197, 94, 0.3)' :
            calculateHitQuality(windDirection) === 'good' ? 'rgba(234, 179, 8, 0.2)' :
              'rgba(232, 97, 58, 0.1)'
        }}
      >
        <div className={`text-sm font-bold ${calculateHitQuality(windDirection) === 'perfect' ? 'text-green-400' :
          calculateHitQuality(windDirection) === 'good' ? 'text-yellow-400' :
            'text-accent-coral'
          }`}>
          {calculateHitQuality(windDirection) === 'perfect' ? `🔥 ${t('perfectTiming')}` :
            calculateHitQuality(windDirection) === 'good' ? `⚡ ${t('goodTiming')}` :
              t('waitForWind')}
        </div>
        <div className="text-xs text-text-muted mt-1">
          {Math.round(windDirection)}° {t('windTarget')}
        </div>
      </motion.div>

      {/* Time Display */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-surface/95 border-2 border-border px-6 py-2 z-10">
        <div className="text-xs font-bold uppercase tracking-wider text-text-muted text-center">{t('time')}</div>
        <div className="text-lg text-text font-bold font-mono">
          {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Shoot Button */}
      <motion.button
        className={`absolute bottom-4 right-4 z-50 w-16 h-16 rounded-full border-2 flex items-center justify-center ${isReloading
          ? 'bg-gray-600 border-gray-500 cursor-not-allowed opacity-50'
          : 'bg-accent-coral border-accent-coral cursor-pointer hover:scale-110'
          }`}
        whileHover={!isReloading ? { scale: 1.1 } : {}}
        whileTap={!isReloading ? { scale: 0.95 } : {}}
        onClick={() => {
          if (phase === 1 && !isReloading && fireShips.length > 0) {
            handleLaunchFireShip(fireShips[0].id);
          }
        }}
        disabled={isReloading || phase !== 0}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          {/* Bow */}
          <path
            d="M8,20 Q8,5 20,5 Q32,5 32,20 Q32,35 20,35 Q8,35 8,20"
            stroke="#fff"
            strokeWidth="2"
            fill="none"
          />
          {/* Bowstring */}
          <path
            d="M8,20 Q20,25 32,20"
            stroke="#fff"
            strokeWidth="1"
            fill="none"
          />
          {/* Arrow */}
          <path
            d="M20,20 L20,8"
            stroke="#ff4757"
            strokeWidth="2"
          />
          <path
            d="M20,8 L17,11 M20,8 L23,11"
            stroke="#ff4757"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </motion.button>

      {/* Instructions */}
      <AnimatePresence mode="wait">
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-surface/98 border-2 border-accent-coral px-6 py-4 max-w-lg text-center z-20 cursor-pointer shadow-lg"
            onClick={() => setShowHint(false)}
          >
            <p className="text-text text-sm mb-2">
              {phase === 0 ? t('chainShipsInstruction') :
                isGoodWind ? t('launchWhenReady') : t('waitForSEWind')}
            </p>
            <p className="text-text-muted text-xs">{t('clickToDismiss')}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Damage Numbers */}
      <AnimatePresence>
        {damageNumbers.map((dmg) => (
          <DamageNumber key={dmg.id} x={dmg.x} y={dmg.y} amount={dmg.amount} />
        ))}
      </AnimatePresence>

      {/* Floating Text (HIT/MISS/Perfect) */}
      <AnimatePresence>
        {floatingTexts.map((text) => (
          <motion.div
            key={text.id}
            className="absolute font-bold text-xl pointer-events-none z-50"
            style={{ left: text.x, top: text.y, color: text.color }}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -50, scale: 1.2 }}
            transition={{ duration: 1 }}
          >
            {text.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Enemy Projectiles with arcs */}
      <AnimatePresence>
        {projectiles.map((projectile) => {
          const progress = Math.min(1, (Date.now() - projectile.startTime) / projectile.duration);
          const currentX = projectile.x + (projectile.targetX - projectile.x) * progress;
          const currentY = projectile.y + (projectile.targetY - projectile.y) * progress - Math.sin(progress * Math.PI) * 30; // Arc
          const rotation = Math.atan2(projectile.targetY - projectile.y, projectile.targetX - projectile.x) * 180 / Math.PI + 90;

          return (
            <motion.div
              key={projectile.id}
              className="absolute cursor-pointer z-30"
              style={{
                left: `${currentX}%`,
                top: `${currentY}%`,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={() => handleProjectileClick(projectile.id)}
              whileHover={{ scale: 1.3 }}
            >
              <ArrowIcon rotation={rotation} />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Player Projectiles with fire animation */}
      <AnimatePresence>
        {playerProjectiles.map((projectile) => {
          const progress = Math.min(1, (Date.now() - projectile.startTime) / projectile.duration);
          const currentX = projectile.x + (projectile.targetX - projectile.x) * progress;
          const currentY = projectile.y + (projectile.targetY - projectile.y) * progress - Math.sin(progress * Math.PI) * 20;
          const rotation = Math.atan2(projectile.targetY - projectile.y, projectile.targetX - projectile.x) * 180 / Math.PI + 90;

          return (
            <motion.div
              key={projectile.id}
              className="absolute z-40"
              style={{
                left: `${currentX}%`,
                top: `${currentY}%`,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: progress < 1 ? 1 : 0, scale: progress < 1 ? 1 : 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <div className="relative">
                <svg width="40" height="40" viewBox="0 0 30 30" style={{ transform: `rotate(${rotation}deg)` }}>
                  <defs>
                    <linearGradient id={`fireGrad-${projectile.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff4757" />
                      <stop offset="50%" stopColor="#ff6b35" />
                      <stop offset="100%" stopColor="#ffaa00" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M15,5 L20,25 L15,20 L10,25 Z"
                    fill={`url(#fireGrad-${projectile.id})`}
                    style={{ filter: 'drop-shadow(0 0 4px #ff4757)' }}
                  />
                  <circle cx="15" cy="5" r="4" fill="#ff4757" opacity="0.8" />
                </svg>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Battle Area */}
      <div className="absolute inset-0 pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-8">
        {/* Enemy Fleet (Top) */}
        <div className="relative h-[45%] border-b-2 border-border/40">
          <div className="absolute top-1 sm:top-2 left-1 sm:left-2 text-[10px] sm:text-xs text-text-muted uppercase tracking-wider bg-surface/80 px-1 sm:px-2 py-0.5 sm:py-1">
            {t('caoCaoFleet')}
          </div>

          {weiShips.map((ship, index) => (
            <motion.div
              key={ship.id}
              className="absolute cursor-pointer"
              style={{
                left: `${ship.x}%`,
                top: `${ship.y}%`,
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              onClick={() => handleChainShip(ship.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShipIcon isChained={chainedShips.has(ship.id)} />
              {chainedShips.has(ship.id) && (
                <motion.div
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-accent-gold text-xs font-bold bg-surface/90 px-2 py-1 border border-accent-gold"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {t('chainedLabel')}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Player Fleet (Bottom) */}
        <div className="relative h-[55%]">
          <div className="absolute top-1 sm:top-2 left-1 sm:left-2 text-[10px] sm:text-xs text-text-muted uppercase tracking-wider bg-surface/80 px-1 sm:px-2 py-0.5 sm:py-1">
            {t('allianceFleet')}
          </div>

          {fireShips.map((ship, index) => (
            <motion.div
              key={ship.id}
              className="absolute cursor-pointer transition-all duration-500"
              style={{
                left: `${ship.x}%`,
                top: `${ship.y}%`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              onClick={() => handleLaunchFireShip(ship.id)}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <FireShipIcon isReady={calculateHitQuality(windDirection) !== 'miss'} />

              {/* Show hit quality status */}
              <motion.div
                className={`absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-bold whitespace-nowrap ${calculateHitQuality(windDirection) === 'perfect' ? 'text-green-400' :
                  calculateHitQuality(windDirection) === 'good' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}
                animate={calculateHitQuality(windDirection) !== 'miss' ? { opacity: [0.5, 1, 0.5] } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                {calculateHitQuality(windDirection) === 'perfect' ? t('perfectLabel') :
                  calculateHitQuality(windDirection) === 'good' ? t('goodLabel') :
                    t('waitLabel')}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Game Over Screen */}
      <AnimatePresence>
        {gameComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-bg/98 flex items-center justify-center z-50"
          >
            <motion.div
              className="text-center max-w-md border-2 border-border bg-surface p-8"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: gameWon ? [0, -10, 10, 0] : 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="mb-6 flex justify-center"
              >
                {gameWon ? (
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="#c8a85c">
                    <path d="M5 16L3 21L8 19L12 23L16 19L21 21L19 16L21 14L19 12L21 10L19 8L21 3L16 5L12 1L8 5L3 3L5 8L3 10L5 12L3 14L5 16M12 13C10.34 13 9 11.66 9 10C9 8.34 10.34 7 12 7C13.66 7 15 8.34 15 10C15 11.66 13.66 13 12 13Z" />
                  </svg>
                ) : (
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="#797876">
                    <path d="M12,2C7.58,2 4,5.58 4,10C4,12.75 5.25,15.25 7.25,17C7.25,17 7.5,18.5 7.5,19.5C7.5,20.88 8.62,22 10,22H14C15.38,22 16.5,20.88 16.5,19.5C16.5,18.5 16.75,17 16.75,17C18.75,15.25 20,12.75 20,10C20,5.58 16.42,2 12,2Z" />
                  </svg>
                )}
              </motion.div>

              <h3 className={`text-4xl font-display italic mb-4 ${gameWon ? 'text-accent-coral' : 'text-text-muted'}`}>
                {gameWon ? t('victory') : t('defeat')}
              </h3>

              <p className="text-text mb-6">
                {gameWon ? t('battleWon') : t('battleLost')}
              </p>

              {gameWon ? (
                <>
                  <div className="bg-surface-2 border-2 border-border p-4 mb-6">
                    <div className="text-xs text-text-muted uppercase tracking-wider mb-3">{t('scoreBreakdown')}</div>
                    <div className="flex justify-between text-sm text-text mb-2">
                      <span>{t('healthBonus')}:</span>
                      <span className="text-green-400">+{Math.round(health * 10)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-text mb-2">
                      <span>{t('speedBonus')}:</span>
                      <span className="text-accent-coral">+{Math.max(0, 300 - elapsedTime) * 5}</span>
                    </div>
                    <div className="border-t-2 border-border mt-3 pt-3 flex justify-between text-2xl font-bold text-accent-gold">
                      <span>{t('totalScore')}:</span>
                      <span>{score}</span>
                    </div>
                  </div>
                  <motion.button
                    onClick={resetGame}
                    className="px-8 py-4 bg-accent-coral text-text font-bold uppercase tracking-wider border-2 border-accent-coral hover:bg-accent-coral/80 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('playAgain')}
                  </motion.button>
                </>
              ) : (
                <>
                  <div className="bg-surface-2 border-2 border-border p-4 mb-6">
                    <div className="text-sm text-text-muted mb-2">{t('timeSurvived')}</div>
                    <div className="text-3xl font-bold text-text">{elapsedTime}s</div>
                  </div>
                  <motion.button
                    onClick={resetGame}
                    className="px-8 py-4 border-2 border-border text-text font-bold uppercase tracking-wider hover:border-accent-coral hover:bg-surface-2 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('tryAgain')}
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BattleSimulation;
