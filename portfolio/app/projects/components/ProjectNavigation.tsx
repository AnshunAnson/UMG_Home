'use client';

import { motion } from 'framer-motion';

interface ProjectNavigationProps {
  total: number;
  current: number;
  onNavigate: (index: number) => void;
  themeColors: string[];
}

export default function ProjectNavigation({
  total,
  current,
  onNavigate,
  themeColors,
}: ProjectNavigationProps) {
  return (
    <>
      {/* Right Side Dots Navigation */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {Array.from({ length: total }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => onNavigate(index)}
            className="relative w-3 h-3 rounded-full transition-all duration-300"
            style={{
              background: index === current ? themeColors[index] : 'rgba(255,255,255,0.2)',
              boxShadow: index === current ? `0 0 20px ${themeColors[index]}` : 'none',
            }}
            whileHover={{ scale: 1.5 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to project ${index + 1}`}
          >
            {index === current && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: themeColors[index] }}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Bottom Progress Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6">
        {/* Current Project Number */}
        <span 
          className="text-2xl font-bold font-mono"
          style={{ color: themeColors[current] }}
        >
          {String(current + 1).padStart(2, '0')}
        </span>

        {/* Progress Bar Container */}
        <div className="relative w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          {/* Progress Fill */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: themeColors[current] }}
            initial={{ width: '0%' }}
            animate={{ width: `${((current + 1) / total) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full blur-sm"
            style={{ 
              background: themeColors[current],
              width: `${((current + 1) / total) * 100}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Total Projects */}
        <span className="text-2xl font-bold font-mono text-white/30">
          {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Scroll Hint */}
      <motion.div
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <span className="text-xs text-white/40 uppercase tracking-widest">
          {current === total - 1 ? '已到最后' : '滚动浏览'}
        </span>
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: themeColors[current] }}
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Project Title Indicator */}
      <motion.div
        className="fixed top-8 left-8 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-[2px]"
            style={{ background: themeColors[current] }}
          />
          <span className="text-sm text-white/60 uppercase tracking-widest">
            项目展示
          </span>
        </div>
      </motion.div>

      {/* Keyboard Navigation Hint */}
      <motion.div
        className="fixed bottom-8 right-8 z-50 hidden lg:flex items-center gap-4 text-xs text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 rounded bg-white/10">↑</kbd>
          <kbd className="px-2 py-1 rounded bg-white/10">↓</kbd>
          <span>导航</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 rounded bg-white/10">Space</kbd>
          <span>下一步</span>
        </div>
      </motion.div>
    </>
  );
}
