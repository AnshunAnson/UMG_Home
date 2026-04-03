'use client';

import { motion, useMotionValue, useTransform, MotionValue } from 'framer-motion';
import { ReactNode, useState, useCallback } from 'react';

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'pink' | 'purple';
  hoverScale?: number;
}

const glowColors = {
  cyan: 'rgba(0, 240, 255, 0.5)',
  pink: 'rgba(255, 0, 160, 0.5)',
  purple: 'rgba(112, 0, 255, 0.5)',
};

const borderColors = {
  cyan: 'rgba(0, 240, 255, 0.3)',
  pink: 'rgba(255, 0, 160, 0.3)',
  purple: 'rgba(112, 0, 255, 0.3)',
};

export default function NeonCard({
  children,
  className = '',
  glowColor = 'cyan',
  hoverScale = 1.02,
}: NeonCardProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl glass ${className}`}
      style={{
        borderColor: borderColors[glowColor],
      }}
      whileHover={{
        scale: hoverScale,
        boxShadow: `0 0 30px ${glowColors[glowColor]}, 0 0 60px ${glowColors[glowColor]}`,
      }}
      whileFocus={{
        scale: hoverScale,
        boxShadow: `0 0 30px ${glowColors[glowColor]}, 0 0 60px ${glowColors[glowColor]}`,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      tabIndex={0}
      role="button"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColors[glowColor]} 0%, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
