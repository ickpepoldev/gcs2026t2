import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import { territoriesByPeriod, kingdomColors, periodNames } from '../../data/territories';

interface Map3DProps {
  period: number;
}

const Map3D: React.FC<Map3DProps> = ({ period }) => {
  const currentTerritories = territoriesByPeriod[period - 1] || territoriesByPeriod[0];

  return (
    <div className="w-full h-96 bg-surface-2 border border-border mb-8 relative">
      <Canvas>
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* Base plane - China map outline */}
        <Box position={[0, -0.5, 0]} args={[10, 0.1, 8]}>
          <meshStandardMaterial color="#1c1b19" />
        </Box>

        {/* Territories */}
        {currentTerritories.map((territory) => (
          <group key={territory.id}>
            {/* Territory shape - simplified as box for 3D representation */}
            <Box
              position={[
                (territory.points[0][0] + territory.points[2][0]) / 2,
                0,
                (territory.points[0][1] + territory.points[2][1]) / 2
              ]}
              args={[
                Math.abs(territory.points[2][0] - territory.points[0][0]),
                0.3,
                Math.abs(territory.points[2][1] - territory.points[0][1])
              ]}
            >
              <meshStandardMaterial
                color={kingdomColors[territory.kingdom]}
                transparent
                opacity={0.8}
              />
            </Box>

            {/* Territory label */}
            <Text
              position={[
                (territory.points[0][0] + territory.points[2][0]) / 2,
                0.5,
                (territory.points[0][1] + territory.points[2][1]) / 2
              ]}
              fontSize={0.3}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {territory.name}
            </Text>
          </group>
        ))}

        {/* Kingdom labels */}
        <Text position={[-3, 2, 0]} fontSize={0.4} color={kingdomColors.wei}>
          魏 Wei
        </Text>
        <Text position={[-3, -2, 0]} fontSize={0.4} color={kingdomColors.shu}>
          蜀 Shu
        </Text>
        <Text position={[3, -2, 0]} fontSize={0.4} color={kingdomColors.wu}>
          吳 Wu
        </Text>
      </Canvas>

      {/* Period indicator */}
      <div className="absolute top-4 left-4 bg-surface px-4 py-2 border border-border">
        <p className="text-xs font-bold uppercase tracking-wider text-accent-coral">
          {periodNames[period - 1] || periodNames[0]}
        </p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-surface px-4 py-2 border border-border">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3" style={{ backgroundColor: kingdomColors.wei }}></div>
            <span className="text-xs text-text">Wei 魏</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3" style={{ backgroundColor: kingdomColors.shu }}></div>
            <span className="text-xs text-text">Shu 蜀</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3" style={{ backgroundColor: kingdomColors.wu }}></div>
            <span className="text-xs text-text">Wu 吳</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3" style={{ backgroundColor: kingdomColors.other }}></div>
            <span className="text-xs text-text">Other</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map3D;
