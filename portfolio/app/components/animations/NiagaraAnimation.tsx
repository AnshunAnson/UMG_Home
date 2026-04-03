'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface NiagaraAnimationProps {
  isActive?: boolean;
}

// Niagara System Editor Panel
function NiagaraEditorPanel({ isActive = false }: { isActive?: boolean }) {
  const modules = [
    { name: 'Spawn Rate', value: 1000, color: '#00d4aa' },
    { name: 'Lifetime', value: 2.5, color: '#00a8e8' },
    { name: 'Velocity', value: 150, color: '#9d4edd' },
    { name: 'Color', value: 'Gradient', color: '#ff6b35' },
    { name: 'Size', value: 5.0, color: '#ffd700' },
  ];

  return (
    <motion.div
      className="absolute bg-[#1a1a1a] border border-[#3a3a3a] rounded overflow-hidden"
      animate={{
        opacity: isActive ? 1 : 0,
        x: isActive ? 0 : -100,
      }}
      style={{
        top: '5%',
        left: '3%',
        width: 220,
      }}
    >
      {/* Panel Header */}
      <div className="bg-[#2a2a2a] px-3 py-2 flex items-center justify-between">
        <span className="text-[10px] text-white font-mono">Niagara System</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-[#00d4aa]" />
          <div className="w-2 h-2 rounded-full bg-[#8a8a8a]" />
        </div>
      </div>

      {/* Emitter Stack */}
      <div className="p-2">
        <div className="text-[8px] text-[#8a8a8a] mb-2 font-mono">EMITTER PROPERTIES</div>
        {modules.map((module, i) => (
          <motion.div
            key={module.name}
            className="flex items-center justify-between py-1 px-2 rounded mb-1"
            style={{ backgroundColor: `${module.color}10` }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded" style={{ backgroundColor: module.color }} />
              <span className="text-[9px] text-white">{module.name}</span>
            </div>
            <span className="text-[9px] text-[#8a8a8a] font-mono">{module.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Simulation Status */}
      <div className="px-3 py-2 border-t border-[#2a2a2a]">
        <div className="flex items-center justify-between text-[8px]">
          <span className="text-[#8a8a8a]">Active Particles</span>
          <motion.span 
            className="text-[#00d4aa] font-mono"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            2,847
          </motion.span>
        </div>
        <div className="flex items-center justify-between text-[8px] mt-1">
          <span className="text-[#8a8a8a]">GPU Sim</span>
          <span className="text-[#00d4aa]">● ON</span>
        </div>
      </div>
    </motion.div>
  );
}

// Curve Editor Visualization
function CurveEditor({ isActive = false }: { isActive?: boolean }) {
  return (
    <motion.div
      className="absolute bg-[#1a1a1a] border border-[#3a3a3a] rounded overflow-hidden"
      animate={{
        opacity: isActive ? 1 : 0,
        x: isActive ? 0 : 100,
      }}
      style={{
        top: '5%',
        right: '3%',
        width: 200,
        height: 150,
      }}
    >
      <div className="bg-[#2a2a2a] px-3 py-2">
        <span className="text-[10px] text-white font-mono">Curve Editor - Size Over Life</span>
      </div>
      <div className="p-3 h-full">
        <svg viewBox="0 0 180 100" className="w-full h-24">
          {/* Grid */}
          {[...Array(5)].map((_, i) => (
            <line
              key={`h${i}`}
              x1="0"
              y1={i * 25}
              x2="180"
              y2={i * 25}
              stroke="#2a2a2a"
              strokeWidth="0.5"
            />
          ))}
          {[...Array(7)].map((_, i) => (
            <line
              key={`v${i}`}
              x1={i * 30}
              y1="0"
              x2={i * 30}
              y2="100"
              stroke="#2a2a2a"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Curve */}
          <motion.path
            d="M 0 100 Q 45 80, 90 40 T 180 10"
            fill="none"
            stroke="#00d4aa"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isActive ? 1 : 0 }}
            transition={{ duration: 1.5 }}
          />
          
          {/* Keyframes */}
          {[
            { x: 0, y: 100 },
            { x: 90, y: 40 },
            { x: 180, y: 10 },
          ].map((point, i) => (
            <motion.circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#00d4aa"
              initial={{ scale: 0 }}
              animate={{ scale: isActive ? 1 : 0 }}
              transition={{ delay: 0.5 + i * 0.2 }}
            />
          ))}
        </svg>
      </div>
    </motion.div>
  );
}

// Particle Burst Effect
function ParticleBurst({ isActive = false }: { isActive?: boolean }) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    angle: number;
    distance: number;
    color: string;
    size: number;
  }>>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = [...Array(30)].map((_, i) => ({
        id: i,
        angle: (i / 30) * 360 + Math.random() * 30,
        distance: 100 + Math.random() * 150,
        color: ['#9d4edd', '#00d4aa', '#00a8e8', '#ff6b35'][i % 4],
        size: 2 + Math.random() * 6,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isActive]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: '50%',
            top: '50%',
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
          }}
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 0,
            scale: 0 
          }}
          animate={{ 
            x: Math.cos((particle.angle * Math.PI) / 180) * particle.distance,
            y: Math.sin((particle.angle * Math.PI) / 180) * particle.distance,
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0.5],
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// Vector Field Visualization
function VectorField({ isActive = false }: { isActive?: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      animate={{ opacity: isActive ? 0.3 : 0 }}
    >
      <svg className="w-full h-full">
        {[...Array(8)].map((_, row) => (
          [...Array(12)].map((_, col) => {
            const x = col * 80 + 40;
            const y = row * 60 + 30;
            const angle = (row + col) * 15 + (isActive ? 45 : 0);
            return (
              <motion.g key={`${row}-${col}`}>
                <motion.line
                  x1={x}
                  y1={y}
                  x2={x + Math.cos((angle * Math.PI) / 180) * 20}
                  y2={y + Math.sin((angle * Math.PI) / 180) * 20}
                  stroke="#00d4aa"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: isActive ? 1 : 0 }}
                  transition={{ delay: (row + col) * 0.02 }}
                />
                <motion.circle
                  cx={x + Math.cos((angle * Math.PI) / 180) * 20}
                  cy={y + Math.sin((angle * Math.PI) / 180) * 20}
                  r="2"
                  fill="#00d4aa"
                  initial={{ scale: 0 }}
                  animate={{ scale: isActive ? 1 : 0 }}
                  transition={{ delay: 0.1 + (row + col) * 0.02 }}
                />
              </motion.g>
            );
          })
        ))}
      </svg>
    </motion.div>
  );
}

export default function NiagaraAnimation({ isActive = false }: NiagaraAnimationProps) {
  // Generate random particles
  const particles = [...Array(isActive ? 40 : 20)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * (isActive ? 8 : 4) + 2,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
    color: ['#9d4edd', '#00d4aa', '#00a8e8'][i % 3],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Niagara Editor Panel */}
      <NiagaraEditorPanel isActive={isActive} />
      
      {/* Curve Editor */}
      <CurveEditor isActive={isActive} />
      
      {/* Vector Field Background */}
      <VectorField isActive={isActive} />

      {/* Particle Burst on Activate */}
      <ParticleBurst isActive={isActive} />

      {/* Main Particle System */}
      <motion.div
        animate={{
          scale: isActive ? 1.5 : 1,
          opacity: isActive ? 1 : 0.6,
        }}
        className="absolute inset-0"
      >
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
              boxShadow: `0 0 ${particle.size * (isActive ? 4 : 2)}px ${particle.color}`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * (isActive ? 200 : 100), 0],
              y: [0, (Math.random() - 0.5) * (isActive ? 200 : 100), 0],
              opacity: [0, 1, 0],
              scale: [0.5, isActive ? 2 : 1.5, 0.5],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Ripple Effects */}
      <motion.div
        animate={{
          scale: isActive ? 1.5 : 1,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        {[...Array(isActive ? 5 : 3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
            style={{
              borderColor: `rgba(157, 78, 221, ${0.3 - i * 0.05})`,
            }}
            initial={{ width: 0, height: 0 }}
            animate={{ 
              width: isActive ? 500 : 300, 
              height: isActive ? 500 : 300, 
              opacity: 0 
            }}
            transition={{
              duration: isActive ? 4 : 3,
              repeat: Infinity,
              delay: i * (isActive ? 0.6 : 1),
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>

      {/* Audio Visualizer */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-1"
        animate={{
          height: isActive ? 120 : 64,
          opacity: isActive ? 1 : 0.5,
        }}
      >
        {[...Array(isActive ? 20 : 12)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-gradient-to-t from-[#9d4edd] to-[#00d4aa] rounded-full"
            animate={{
              height: [20, Math.random() * (isActive ? 100 : 60) + 20, 20],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.05,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Flowing Lines */}
      <motion.svg 
        className="absolute inset-0 w-full h-full"
        animate={{ opacity: isActive ? 1 : 0.5 }}
      >
        {[...Array(isActive ? 8 : 5)].map((_, i) => (
          <motion.path
            key={i}
            d={`M ${50 + i * 20} 0 Q ${100 + i * 30} 100 ${50 + i * 20} 200`}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth={isActive ? 2 : 1}
            strokeDasharray="10,10"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, isActive ? 0.8 : 0.5, 0] }}
            transition={{
              duration: isActive ? 2 : 3,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9d4edd" stopOpacity="0" />
            <stop offset="50%" stopColor="#00d4aa" stopOpacity={isActive ? 0.8 : 0.5} />
            <stop offset="100%" stopColor="#00a8e8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Distance Field Visualization */}
      <motion.div 
        className="absolute top-4 right-4"
        animate={{
          scale: isActive ? 1.5 : 1,
          opacity: isActive ? 0.3 : 0.6,
          x: isActive ? 50 : 0,
        }}
        style={{ width: isActive ? 150 : 96, height: isActive ? 150 : 96 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Concentric circles representing distance field */}
          {[...Array(isActive ? 8 : 5)].map((_, i) => (
            <motion.circle
              key={i}
              cx="50"
              cy="50"
              r={10 + i * (isActive ? 10 : 8)}
              fill="none"
              stroke="#9d4edd"
              strokeWidth="0.5"
              strokeDasharray={`${2 + i} ${4 + i}`}
              initial={{ opacity: 0.2 }}
              animate={{ 
                opacity: [0.2, isActive ? 0.8 : 0.5, 0.2], 
                scale: [1, isActive ? 1.1 : 1.05, 1] 
              }}
              transition={{
                duration: isActive ? 1.5 : 2,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
          {/* Center glow */}
          <motion.circle
            cx="50"
            cy="50"
            r="5"
            fill="#9d4edd"
            animate={{ 
              scale: [1, isActive ? 2 : 1.5, 1], 
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ duration: isActive ? 1 : 1.5, repeat: Infinity }}
          />
        </svg>
      </motion.div>

      {/* Sound Wave Rings */}
      <motion.div
        animate={{
          scale: isActive ? 1.5 : 1,
          opacity: isActive ? 1 : 0.5,
        }}
        className="absolute top-1/4 right-1/4"
      >
        {[...Array(isActive ? 6 : 4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#00d4aa]"
            style={{
              left: -4,
              top: -4,
            }}
            animate={{
              scale: [1, isActive ? 6 : 4],
              opacity: [1, 0],
            }}
            transition={{
              duration: isActive ? 1.5 : 2,
              repeat: Infinity,
              delay: i * (isActive ? 0.3 : 0.5),
            }}
          />
        ))}
      </motion.div>

      {/* GPU Particles Label */}
      <motion.div
        className="absolute bottom-8 right-8 px-4 py-2 bg-[#9d4edd]/10 border border-[#9d4edd]/30 rounded"
        animate={{
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 20,
        }}
      >
        <span className="text-sm text-[#9d4edd] font-mono">GPU Particle System</span>
      </motion.div>

      {/* Simulation Time */}
      <motion.div
        className="absolute bottom-8 left-8 text-[10px] font-mono"
        animate={{
          opacity: isActive ? 1 : 0.3,
        }}
      >
        <div className="text-[#8a8a8a]">Sim Time</div>
        <motion.div 
          className="text-[#00d4aa]"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          00:00:12.847
        </motion.div>
      </motion.div>
    </div>
  );
}
