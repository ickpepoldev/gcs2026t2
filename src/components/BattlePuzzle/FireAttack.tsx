import { useState } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface FireAttackProps {
  onComplete: () => void;
}

const FireAttack: React.FC<FireAttackProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [launchedBoats, setLaunchedBoats] = useState<Set<number>>(new Set());
  const [showFire, setShowFire] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const fireBoats = [
    { id: 1, name: 'Fire 1' },
    { id: 2, name: 'Fire 2' },
    { id: 3, name: 'Fire 3' },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    if (over && over.id === 'launch-zone') {
      const boatId = Number(event.active.id);
      setLaunchedBoats((prev) => new Set([...prev, boatId]));

      if (launchedBoats.size >= 2) {
        setShowFire(true);
        setShowFeedback(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">
        {t('fireAttack')}
      </h3>
      <p className="text-text text-sm mb-6">
        {t('fireAttackInstruction')}
      </p>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="relative w-full h-64 bg-surface-2 border border-border mb-4">
          <div
            id="launch-zone"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-32 h-32 border-2 border-accent-coral border-dashed flex items-center justify-center"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-accent-coral">LAUNCH</span>
          </div>

          {fireBoats.map((boat, index) => (
            <motion.div
              key={boat.id}
              id={`boat-${boat.id}`}
              className={`absolute w-16 h-8 bg-accent-gold flex items-center justify-center text-text text-xs font-bold uppercase tracking-wider cursor-grab ${launchedBoats.has(boat.id) ? 'opacity-0' : ''
                }`}
              style={{
                left: `${index * 30 + 10}%`,
                top: '40%',
              }}
              animate={showFire && launchedBoats.has(boat.id) ? { x: 300, opacity: 0 } : {}}
              transition={{ duration: 1 }}
            >
              {boat.name}
            </motion.div>
          ))}

          {showFire && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-accent-coral bg-opacity-30"
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-6xl"
              >
                🔥
              </motion.div>
            </motion.div>
          )}
        </div>
      </DndContext>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-accent-coral text-sm font-bold uppercase tracking-wider"
        >
          {t('fireAttackSuccess')}
        </motion.div>
      )}
    </div>
  );
};

export default FireAttack;
