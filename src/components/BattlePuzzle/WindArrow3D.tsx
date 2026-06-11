import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box, Cylinder } from '@react-three/drei';
import { motion } from 'framer-motion';

interface WindArrow3DProps {
  onComplete: () => void;
}

const WindArrow3D: React.FC<WindArrow3DProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [rotation, setRotation] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleRotate = (delta: number) => {
    const newRotation = rotation + delta;
    setRotation(newRotation);

    // Check if rotation is approximately 135 degrees (southeast)
    const normalizedRotation = ((newRotation % 360) + 360) % 360;
    if (Math.abs(normalizedRotation - 135) < 10) {
      setShowFeedback(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">
        {t('windDirection')}
      </h3>
      <p className="text-text text-sm mb-6">
        {t('windArrowInstruction')}
      </p>

      <div className="relative w-full h-96 bg-surface-2 border border-border mb-4">
        <Canvas>
          <OrbitControls enableZoom={false} enablePan={false} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          {/* Compass labels */}
          <Text position={[0, 3, 0]} fontSize={0.5} color="#797876">
            N
          </Text>
          <Text position={[0, -3, 0]} fontSize={0.5} color="#797876">
            S
          </Text>
          <Text position={[-3, 0, 0]} fontSize={0.5} color="#797876">
            W
          </Text>
          <Text position={[3, 0, 0]} fontSize={0.5} color="#797876">
            E
          </Text>

          {/* Wind arrow */}
          <group rotation={[0, (rotation * Math.PI) / 180, 0]}>
            <Box position={[0, 0, 0]} args={[0.2, 0.05, 2]}>
              <meshStandardMaterial color="#e8613a" />
            </Box>
            <Cylinder position={[0, 0, 1]} args={[0.3, 0.1, 0.1, 8]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#e8613a" />
            </Cylinder>
          </group>

          {/* Target zone indicator */}
          <Box position={[2, 0, -2]} args={[1, 0.1, 1]}>
            <meshStandardMaterial color="#c8a85c" transparent opacity={0.3} />
          </Box>
        </Canvas>
      </div>

      {/* Rotation controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleRotate(-15)}
          className="px-4 py-2 bg-surface text-text text-xs font-bold uppercase tracking-wider border border-border hover:border-accent-coral"
        >
          Rotate Left
        </button>
        <button
          onClick={() => handleRotate(15)}
          className="px-4 py-2 bg-surface text-text text-xs font-bold uppercase tracking-wider border border-border hover:border-accent-coral"
        >
          Rotate Right
        </button>
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-accent-coral text-sm font-bold uppercase tracking-wider mt-4"
        >
          {t('windArrowSuccess')}
        </motion.div>
      )}
    </div>
  );
};

export default WindArrow3D;
