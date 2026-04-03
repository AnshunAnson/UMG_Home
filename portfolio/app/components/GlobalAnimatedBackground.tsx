'use client';

import { motion } from 'framer-motion';
import { useProjectHover, themeColors } from '../context/ProjectHoverContext';

// Animated grid lines
function AnimatedGrid({ isActive, color }: { isActive: boolean; color: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="w-full h-full opacity-20">
        <defs>
          <pattern id="globalGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              opacity={0.3}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#globalGrid)" />
      </svg>
      
      {/* Animated horizontal lines */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            top: `${20 + i * 15}%`,
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{
            opacity: isActive ? [0, 0.5, 0] : 0,
            scaleX: isActive ? [0, 1, 0] : 0,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Animated vertical lines */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px"
          style={{
            background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
            left: `${20 + i * 15}%`,
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{
            opacity: isActive ? [0, 0.5, 0] : 0,
            scaleY: isActive ? [0, 1, 0] : 0,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5 + 0.25,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Floating particles
function FloatingParticles({ isActive, color }: { isActive: boolean; color: string }) {
  const particles = [...Array(isActive ? 30 : 15)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * (isActive ? 4 : 2) + 1,
    delay: Math.random() * 3,
    duration: Math.random() * 4 + 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            boxShadow: `0 0 ${particle.size * 2}px ${color}`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, (Math.random() - 0.5) * 50, 0],
            opacity: [0, isActive ? 0.8 : 0.3, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Radial glow orbs
function GlowOrbs({ isActive, color }: { isActive: boolean; color: string }) {
  const orbs = [
    { x: '20%', y: '30%', size: 300, delay: 0 },
    { x: '80%', y: '70%', size: 400, delay: 0.5 },
    { x: '50%', y: '50%', size: 500, delay: 1 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: isActive ? [1, 1.2, 1] : [1, 1.1, 1],
            opacity: isActive ? [0.3, 0.6, 0.3] : [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: orb.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Connection lines between abstract nodes
function ConnectionLines({ isActive, color }: { isActive: boolean; color: string }) {
  const nodes = [
    { x: 10, y: 20 },
    { x: 30, y: 40 },
    { x: 50, y: 30 },
    { x: 70, y: 50 },
    { x: 90, y: 25 },
    { x: 20, y: 70 },
    { x: 60, y: 80 },
    { x: 85, y: 75 },
  ];

  return (
    <svg className="absolute inset-0 w-full h-full">
      {nodes.map((node, i) => (
        nodes.slice(i + 1).map((targetNode, j) => {
          const distance = Math.sqrt(
            Math.pow(targetNode.x - node.x, 2) + Math.pow(targetNode.y - node.y, 2)
          );
          if (distance > 40) return null;
          
          return (
            <motion.line
              key={`${i}-${j}`}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${targetNode.x}%`}
              y2={`${targetNode.y}%`}
              stroke={color}
              strokeWidth="0.5"
              initial={{ opacity: 0 }}
              animate={{
                opacity: isActive ? [0, 0.3, 0] : 0,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: (i + j) * 0.2,
              }}
            />
          );
        })
      ))}
      
      {nodes.map((node, i) => (
        <motion.circle
          key={`node-${i}`}
          cx={`${node.x}%`}
          cy={`${node.y}%`}
          r="3"
          fill={color}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: isActive ? [0.2, 0.6, 0.2] : 0,
            scale: isActive ? [1, 1.5, 1] : 0,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </svg>
  );
}

export default function GlobalAnimatedBackground() {
  const { hoveredId, themeColor } = useProjectHover();
  const isActive = hoveredId !== null;
  const activeColor = themeColor || '#00d4aa';

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0d0d0d]">
      {/* Base gradient that changes with hover */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: isActive
            ? `radial-gradient(ellipse at center, ${activeColor}08 0%, #0d0d0d 60%)`
            : 'radial-gradient(ellipse at center, transparent 0%, #0d0d0d 60%)',
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {/* Animated grid */}
      <AnimatedGrid isActive={isActive} color={activeColor} />

      {/* Floating particles */}
      <FloatingParticles isActive={isActive} color={activeColor} />

      {/* Glow orbs */}
      <GlowOrbs isActive={isActive} color={activeColor} />

      {/* Connection lines */}
      <ConnectionLines isActive={isActive} color={activeColor} />

      {/* Noise texture overlay for depth */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Bottom gradient for depth */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-64"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
