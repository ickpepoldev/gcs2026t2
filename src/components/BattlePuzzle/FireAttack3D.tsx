import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder } from '@react-three/drei';
import { motion } from 'framer-motion';

interface FireAttack3DProps {
  onComplete: () => void;
}

const FireAttack3D: React.FC<FireAttack3DProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [launchedBoats, setLaunchedBoats] = useState<Set<number>>(new Set());
  const [showFire, setShowFire] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const fireBoats = [
    { id: 1, position: [-3, 0, 3] },
    { id: 2, position: [0, 0, 3] },
    { id: 3, position: [3, 0, 3] },
  ];

  const handleBoatClick = (boatId: number) => {
    const newLaunchedBoats = new Set(launchedBoats);
    newLaunchedBoats.add(boatId);
    setLaunchedBoats(newLaunchedBoats);

    if (newLaunchedBoats.size === fireBoats.length) {
      setShowFire(true);
      setTimeout(() => {
        setShowFeedback(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      }, 1000);
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

      <div className="relative w-full h-96 bg-surface-2 border border-border mb-4">
        <Canvas>
          <OrbitControls enableZoom={false} enablePan={false} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          {/* River */}
          <Box position={[0, -0.5, 0]} args={[10, 0.1, 8]}>
            <meshStandardMaterial color="#1c1b19" />
          </Box>

          {/* Target ships */}
          <Box position={[-2, 0, -2]} args={[1.5, 0.5, 0.8]}>
            <meshStandardMaterial color="#e8613a" />
          </Box>
          <Box position={[0, 0, -2]} args={[1.5, 0.5, 0.8]}>
            <meshStandardMaterial color="#e8613a" />
          </Box>
          <Box position={[2, 0, -2]} args={[1.5, 0.5, 0.8]}>
            <meshStandardMaterial color="#e8613a" />
          </Box>

          {/* Launch zone */}
          <Box position={[0, 0, 2]} args={[3, 0.1, 2]}>
            <meshStandardMaterial color="#c8a85c" transparent opacity={0.3} />
          </Box>

          {/* Fire boats */}
          {fireBoats.map((boat) => (
            <group key={boat.id}>
              <Box
                position={boat.position as [number, number, number]}
                args={[0.8, 0.3, 0.4]}
                onClick={() => handleBoatClick(boat.id)}
              >
                <meshStandardMaterial 
                  color={launchedBoats.has(boat.id) ? "#797876" : "#c8a85c"}
                  transparent={launchedBoats.has(boat.id)}
                  opacity={launchedBoats.has(boat.id) ? 0 : 1}
                />
              </Box>
              {launchedBoats.has(boat.id) && (
                <Cylinder position={[boat.position[0], 0.5, boat.position[2]]} args={[0.2, 0.1, 0.5, 8]}>
                  <meshStandardMaterial color="#e8613a" emissive="#e8613a" emissiveIntensity={2} />
                </Cylinder>
              )}
            </group>
          ))}

          {/* Fire effect */}
          {showFire && (
            <>
              <Box position={[-2, 0.5, -2]} args={[1.5, 1, 0.8]}>
                <meshStandardMaterial color="#e8613a" emissive="#e8613a" emissiveIntensity={3} transparent opacity={0.7} />
              </Box>
              <Box position={[0, 0.5, -2]} args={[1.5, 1, 0.8]}>
                <meshStandardMaterial color="#e8613a" emissive="#e8613a" emissiveIntensity={3} transparent opacity={0.7} />
              </Box>
              <Box position={[2, 0.5, -2]} args={[1.5, 1, 0.8]}>
                <meshStandardMaterial color="#e8613a" emissive="#e8613a" emissiveIntensity={3} transparent opacity={0.7} />
              </Box>
            </>
          )}
        </Canvas>
      </div>

      <p className="text-text-muted text-xs mt-4 text-center">
        Click on fire boats to launch them
      </p>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-accent-coral text-sm font-bold uppercase tracking-wider mt-4"
        >
          {t('fireAttackSuccess')}
        </motion.div>
      )}
    </div>
  );
};

export default FireAttack3D;
