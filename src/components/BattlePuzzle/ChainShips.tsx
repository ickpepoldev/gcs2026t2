import { useState } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ChainShipsProps {
  onComplete: () => void;
}

const ChainShips: React.FC<ChainShipsProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [linkedShips, setLinkedShips] = useState<Set<number>>(new Set());
  const [showFeedback, setShowFeedback] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const ships = [
    { id: 1, name: 'Wei 1' },
    { id: 2, name: 'Wei 2' },
    { id: 3, name: 'Wei 3' },
    { id: 4, name: 'Wei 4' },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && over.id !== active.id) {
      const shipId = Number(active.id);
      setLinkedShips((prev) => new Set([...prev, shipId]));

      if (linkedShips.size >= 3) {
        setShowFeedback(true);
        setTimeout(() => {
          onComplete();
        }, 1500);
      }
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">
        {t('chainShips')}
      </h3>
      <p className="text-text text-sm mb-6">
        {t('chainShipsInstruction')}
      </p>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="relative w-full h-64 bg-surface-2 border border-border mb-4">
          {ships.map((ship) => (
            <div
              key={ship.id}
              id={`ship-${ship.id}`}
              className={`absolute w-20 h-12 bg-accent-coral flex items-center justify-center text-text text-xs font-bold uppercase tracking-wider cursor-grab ${linkedShips.has(ship.id) ? 'opacity-50' : ''
                }`}
              style={{
                left: `${ship.id * 25 - 10}%`,
                top: '40%',
              }}
            >
              {ship.name}
            </div>
          ))}

          {ships.map((ship, index) => (
            <div
              key={`zone-${ship.id}`}
              id={`zone-${ship.id}`}
              className={`absolute w-24 h-16 border-2 border-dashed flex items-center justify-center text-xs font-bold uppercase tracking-wider ${linkedShips.has(ship.id) ? 'border-accent-coral bg-surface' : 'border-border'
                }`}
              style={{
                left: `${ship.id * 25 - 12}%`,
                top: index % 2 === 0 ? '60%' : '10%',
              }}
            >
              {linkedShips.has(ship.id) ? '✓' : 'DROP'}
            </div>
          ))}
        </div>
      </DndContext>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-accent-coral text-sm font-bold uppercase tracking-wider"
        >
          {t('chainShipsSuccess')}
        </motion.div>
      )}
    </div>
  );
};

export default ChainShips;
