import { motion } from 'framer-motion';

interface MapProps {
  period: number;
}

const Map: React.FC<MapProps> = ({ period }) => {
  const mapColors = [
    '#e8613a', // Period 1: Coral
    '#c8a85c', // Period 2: Gold
    '#e8613a', // Period 3: Coral
    '#c8a85c', // Period 4: Gold
    '#e8613a', // Period 5: Coral
  ];

  const currentColor = mapColors[period - 1] || '#e8613a';

  return (
    <div className="w-full h-64 bg-surface-2 mb-6 flex items-center justify-center overflow-hidden border border-border">
      <motion.div
        key={period}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <svg viewBox="0 0 400 200" className="w-3/4 h-3/4">
          {/* Simplified China map representation */}
          <motion.path
            d="M50,100 Q100,50 200,60 Q300,70 350,100 Q300,150 200,140 Q100,130 50,100"
            fill={currentColor}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            stroke="#cdccca"
            strokeWidth="2"
          />

          {/* Region markers based on period */}
          {period >= 2 && (
            <motion.circle
              cx="120"
              cy="80"
              r="8"
              fill="#1c1b19"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            />
          )}

          {period >= 3 && (
            <motion.circle
              cx="200"
              cy="100"
              r="8"
              fill="#1c1b19"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            />
          )}

          {period >= 4 && (
            <motion.circle
              cx="280"
              cy="90"
              r="8"
              fill="#1c1b19"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, duration: 0.3 }}
            />
          )}
        </svg>

        <div className="absolute bottom-4 right-4 bg-surface border border-border px-3 py-1 text-xs font-bold uppercase tracking-wider">
          Period {period}
        </div>
      </motion.div>
    </div>
  );
};

export default Map;
