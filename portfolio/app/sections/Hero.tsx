'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useMousePosition } from '../hooks/useMousePosition';
import { heroContent as defaultHeroContent } from '../config/content';
import { useContent } from '../ContentProvider';
import dynamic from 'next/dynamic';

const ParticleField = dynamic(() => import('../components/ParticleField'), {
  ssr: false,
});

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Text animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: -90,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring' as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const content = useContent();
  const heroContent = content?.hero || defaultHeroContent;
  const { name = '', nameHighlightLength = 0, badge = '', subtitle = '', stats = [], cornerLeft = '', cornerRight = '' } = heroContent;

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <ParticleField mousePosition={mousePosition} />
      </div>

      {/* Gradient Orbs following mouse */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, #00d4aa 0%, transparent 70%)',
          x: mousePosition.x - 300,
          y: mousePosition.y - 300,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 50 }}
      />

      {/* Content */}
      <motion.div 
        className="relative z-10 text-center px-6 max-w-6xl mx-auto"
        style={{ y, opacity }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#00d4aa] animate-pulse" />
          <span className="text-sm text-white/70">{badge}</span>
        </motion.div>

        {/* Main Title with letter animation */}
        <motion.h1
          className="text-7xl md:text-9xl lg:text-[12rem] font-bold text-white tracking-tighter mb-6 perspective-1000"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {name.split('').map((char, index) => (
            <motion.span
              key={index}
              className="inline-block"
              variants={letterVariants}
              style={{ 
                transformStyle: 'preserve-3d',
                color: index < nameHighlightLength ? '#00d4aa' : 'white',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-8"
        >
          {subtitle}
        </motion.p>

        {/* Location & Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 text-sm text-white/40"
        >
          {stats.map((stat, index) => (
            <span key={index} className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
              {stat.icon} {stat.label}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-white/40"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 text-white/20 text-xs tracking-widest">
        {cornerLeft}
      </div>
      <div className="absolute top-8 right-8 text-white/20 text-xs tracking-widest">
        {cornerRight}
      </div>
    </section>
  );
}
