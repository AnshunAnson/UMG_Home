'use client';

import { motion } from 'framer-motion';
import { useProjectHover } from '../context/ProjectHoverContext';

export default function GlobalVignette() {
  const { hoveredId, themeColor } = useProjectHover();
  const isActive = hoveredId !== null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-40"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isActive ? 1 : 0,
      }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{
        background: `
          radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 25%,
            ${themeColor ? `${themeColor}08` : 'transparent'} 40%,
            rgba(0,0,0,0.5) 70%,
            rgba(0,0,0,0.85) 100%
          )
        `,
      }}
    >
      {/* Additional vignette layer for depth */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              circle at center,
              transparent 0%,
              transparent 20%,
              rgba(0,0,0,0.3) 60%,
              rgba(0,0,0,0.7) 100%
            )
          `,
        }}
        animate={{
          opacity: isActive ? 1 : 0,
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {/* Corner darkening for cinematic effect */}
      <div className="absolute inset-0">
        {/* Top edge */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-32"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
          }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
        {/* Bottom edge */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
          }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
        {/* Left edge */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-32"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 100%)',
          }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
        {/* Right edge */}
        <motion.div
          className="absolute top-0 bottom-0 right-0 w-32"
          style={{
            background: 'linear-gradient(to left, rgba(0,0,0,0.6) 0%, transparent 100%)',
          }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Subtle blur overlay */}
      <motion.div
        className="absolute inset-0 backdrop-blur-[1px]"
        animate={{ opacity: isActive ? 0.3 : 0 }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
}
