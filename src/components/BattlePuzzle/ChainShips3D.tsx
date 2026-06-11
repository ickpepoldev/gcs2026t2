import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import { motion } from 'framer-motion';

interface ChainShips3DProps {
  onComplete: () => void;
}

const ChainShips3D: React.FC<ChainShips3DProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [linkedShips, setLinkedShips] = useState<Set<number>>(new Set());
  const [showFeedback, setShowFeedback] = useState(false);

  const ships = [
    { id: 1, position: [-3, 0, 0] },
    { id: 2, position: [0, 0, 0] },
    { id: 3, position: [3, 0, 0] },
  ];

  const handleShipClick = (shipId: number) => {
    const newLinkedShips = new Set(linkedShips);
    newLinkedShips.add(shipId);
    setLinkedShips(newLinkedShips);

    if (newLinkedShips.size === ships.length) {
      setShowFeedback(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
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

      <div className="relative w-full h-96 bg-surface-2 border border-border mb-4">
        <Canvas>
          <OrbitControls enableZoom={false} enablePan={false} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          {/* Ships */}
          {ships.map((ship) => (
            <Box
              key={ship.id}
              position={ship.position as [number, number, number]}
              args={[2, 0.5, 1]}
              onClick={() => handleShipClick(ship.id)}
            >
              <meshStandardMaterial
                color={linkedShips.has(ship.id) ? "#797876" : "#e8613a"}
                transparent={linkedShips.has(ship.id)}
                opacity={linkedShips.has(ship.id) ? 0.5 : 1}
              />
            </Box>
          ))}

          {/* Chain lines when ships are linked */}
          {linkedShips.size > 1 && (
            <>
              <Box position={[-1.5, 0.3, 0]} args={[2, 0.1, 0.1]}>
                <meshStandardMaterial color="#c8a85c" />
              </Box>
              <Box position={[1.5, 0.3, 0]} args={[2, 0.1, 0.1]}>
                <meshStandardMaterial color="#c8a85c" />
              </Box>
            </>
          )}
        </Canvas>
      </div>

      <p className="text-text-muted text-xs mt-4 text-center">
        Click on ships to link them together
      </p>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-accent-coral text-sm font-bold uppercase tracking-wider mt-4"
        >
          {t('chainShipsSuccess')}
        </motion.div>
      )}
    </div>
  );
};

export default ChainShips3D;
