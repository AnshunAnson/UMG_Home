'use client';

import { motion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

export default function GlitchText({ text, className = '', as: Component = 'span' }: GlitchTextProps) {
  return (
    <motion.div
      className="relative inline-block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Component className={`relative z-10 ${className}`}>
        {text}
      </Component>
      
      <Component
        className={`absolute top-0 left-0 -z-10 text-[#00f0ff] opacity-70 ${className}`}
        style={{
          animation: 'glitch 3s infinite linear alternate-reverse',
          clipPath: 'inset(0 0 0 0)',
        }}
        aria-hidden="true"
      >
        {text}
      </Component>
      
      <Component
        className={`absolute top-0 left-0 -z-10 text-[#ff00a0] opacity-70 ${className}`}
        style={{
          animation: 'glitch-2 2.5s infinite linear alternate-reverse',
          clipPath: 'inset(0 0 0 0)',
        }}
        aria-hidden="true"
      >
        {text}
      </Component>
    </motion.div>
  );
}
