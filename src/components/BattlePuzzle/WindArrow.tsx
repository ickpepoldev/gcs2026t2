import { useState } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface WindArrowProps {
  onComplete: () => void;
}

const WindArrow: React.FC<WindArrowProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [rotation, setRotation] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    if (over && over.id === 'target') {
      const normalizedRotation = ((rotation % 360) + 360) % 360;
      if (normalizedRotation >= 120 && normalizedRotation <= 150) {
        setShowFeedback(true);
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 1000);
      }
    }
  };

  const handleRotate = (delta: number) => {
    setRotation((prev) => prev + delta);
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">
        {t('windDirection')}
      </h3>
      <p className="text-text text-sm mb-6">
        {t('windArrowInstruction')}
      </p>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="relative w-full h-64 bg-surface-2 border border-border mb-4">
          <div className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider text-text-muted">N</div>
          <div className="absolute bottom-4 right-4 text-xs font-bold uppercase tracking-wider text-text-muted">S</div>
          <div className="absolute top-1/2 left-4 text-xs font-bold uppercase tracking-wider text-text-muted">W</div>
          <div className="absolute top-1/2 right-4 text-xs font-bold uppercase tracking-wider text-text-muted">E</div>

          <div
            id="target"
            className="absolute bottom-8 right-8 w-24 h-24 border-2 border-accent-coral border-dashed flex items-center justify-center"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-accent-coral">SE</span>
          </div>

          <motion.div
            animate={{ rotate: rotation }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-grab"
          >
            <div className="w-16 h-4 bg-accent-coral relative">
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-16 border-transparent border-l-accent-coral" />
            </div>
          </motion.div>

          <div className="absolute bottom-4 left-4 bg-surface border border-border px-3 py-2 text-xs">
            <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1">Current: {Math.round(rotation)}°</p>
            <p className="text-text-muted text-xs">Target: 135° SE</p>
          </div>
        </div>
      </DndContext>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => handleRotate(-45)}
          className="px-4 py-2 bg-surface text-text text-xs font-bold uppercase tracking-wider border border-border hover:border-accent-coral"
        >
          Rotate Left
        </button>
        <button
          onClick={() => handleRotate(45)}
          className="px-4 py-2 bg-surface text-text text-xs font-bold uppercase tracking-wider border border-border hover:border-accent-coral"
        >
          Rotate Right
        </button>
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-accent-coral text-sm font-bold uppercase tracking-wider"
        >
          {t('windArrowSuccess')}
        </motion.div>
      )}
    </div>
  );
};

export default WindArrow;
