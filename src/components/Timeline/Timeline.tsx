import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import timelineContent from '../../content/timeline.json';

const Timeline: React.FC = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [currentPeriod, setCurrentPeriod] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const scrollPosition = container.scrollTop;
      const containerHeight = container.clientHeight;
      const totalHeight = container.scrollHeight;
      const scrollProgress = scrollPosition / (totalHeight - containerHeight);

      const periodIndex = Math.min(
        Math.floor(scrollProgress * timelineContent.periods.length) + 1,
        timelineContent.periods.length
      );

      setCurrentPeriod(periodIndex);
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-5xl font-display italic text-accent-coral mb-12 leading-tight">
        {t('historicalTimeline')}
      </h2>

      {/* Period indicator */}
      <div className="bg-surface border border-border p-4 mb-8">
        <p className="text-text-muted text-sm">Current Period: {currentPeriod}</p>
      </div>

      <div
        ref={containerRef}
        className="space-y-8 max-h-[600px] overflow-y-auto pr-4 scroll-smooth relative"
      >
        {/* Timeline line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-border"></div>

        {timelineContent.periods.map((period, index) => (
          <motion.div
            key={period.id}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="relative pl-12"
          >
            {/* Timeline dot */}
            <div className="absolute left-0 top-6 w-3 h-3 bg-accent-coral transform -translate-x-1/2"></div>

            <div className="border-l-2 border-accent-coral bg-surface p-8 hover:bg-surface-2 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-display italic text-text group-hover:text-accent-coral transition-colors duration-300">
                  {period.name[language as keyof typeof period.name]}
                </h3>
                <span className="text-accent-coral text-sm font-bold uppercase tracking-wider bg-surface-2 px-3 py-1">
                  {period.year}
                </span>
              </div>
              <p className="text-text leading-relaxed mb-6 text-sm">
                {period.fact[language as keyof typeof period.fact]}
              </p>
              <div className="border-l-4 border-accent-gold pl-4 bg-surface-2 py-4">
                <p className="text-text-muted italic text-sm leading-relaxed">
                  {period.quote[language as keyof typeof period.quote]}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
