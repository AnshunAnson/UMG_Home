'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface GameAnimationProps {
  isActive?: boolean;
}

// Blueprint for Game Character
function CharacterBlueprint({ isActive = false }: { isActive?: boolean }) {
  const components = [
    { name: 'Skeletal Mesh', type: 'Character', color: '#00a8e8' },
    { name: 'Camera', type: 'FirstPerson', color: '#ffd700' },
    { name: 'Movement', type: 'Component', color: '#00d4aa' },
    { name: 'Weapon', type: 'Actor', color: '#ff006e' },
    { name: 'Health', type: 'Variable', color: '#ff6b35' },
  ];

  return (
    <motion.div
      className="absolute bg-[#1a1a1a] border border-[#3a3a3a] rounded overflow-hidden"
      animate={{
        opacity: isActive ? 1 : 0,
        x: isActive ? 0 : -100,
        scale: isActive ? 1 : 0.8,
      }}
      style={{
        top: '5%',
        left: '3%',
        width: 200,
      }}
    >
      <div className="bg-[#2a2a2a] px-3 py-2 flex items-center justify-between">
        <span className="text-[10px] text-white font-mono">BP_FPSCharacter</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-[#00a8e8]" />
          <div className="w-2 h-2 rounded-full bg-[#8a8a8a]" />
        </div>
      </div>

      <div className="p-2 space-y-1">
        <div className="text-[8px] text-[#8a8a8a] font-mono mb-1">COMPONENTS</div>
        {components.map((comp, i) => (
          <motion.div
            key={comp.name}
            className="flex items-center gap-2 py-1 px-2 rounded"
            style={{ backgroundColor: `${comp.color}10` }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="w-2 h-2 rounded" style={{ backgroundColor: comp.color }} />
            <div className="flex-1">
              <div className="text-[8px] text-white">{comp.name}</div>
              <div className="text-[7px] text-[#8a8a8a]">{comp.type}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Functions */}
      <div className="px-3 py-2 border-t border-[#2a2a2a]">
        <div className="text-[8px] text-[#8a8a8a] font-mono mb-1">FUNCTIONS</div>
        {['FireWeapon', 'Reload', 'TakeDamage', 'Respawn'].map((func, i) => (
          <motion.div
            key={func}
            className="flex items-center gap-2 py-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#9d4edd]" />
            <span className="text-[8px] text-[#8a8a8a]">{func}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Animation Blueprint Panel
function AnimBlueprintPanel({ isActive = false }: { isActive?: boolean }) {
  const states = [
    { name: 'Idle', color: '#00d4aa', active: true },
    { name: 'Run', color: '#00a8e8', active: false },
    { name: 'Jump', color: '#ffd700', active: false },
    { name: 'Fire', color: '#ff006e', active: false },
    { name: 'Reload', color: '#ff6b35', active: false },
  ];

  return (
    <motion.div
      className="absolute bg-[#1a1a1a] border border-[#3a3a3a] rounded overflow-hidden"
      animate={{
        opacity: isActive ? 1 : 0,
        x: isActive ? 0 : 100,
        scale: isActive ? 1 : 0.8,
      }}
      style={{
        top: '5%',
        right: '3%',
        width: 180,
      }}
    >
      <div className="bg-[#2a2a2a] px-3 py-2">
        <span className="text-[10px] text-white font-mono">ABP_FPSCharacter</span>
      </div>

      <div className="p-2">
        <div className="text-[8px] text-[#8a8a8a] font-mono mb-2">ANIMATION STATES</div>
        <div className="space-y-1">
          {states.map((state, i) => (
            <motion.div
              key={state.name}
              className="flex items-center justify-between py-1 px-2 rounded"
              style={{ 
                backgroundColor: state.active ? `${state.color}30` : '#1a1a1a',
                border: `1px solid ${state.active ? state.color : '#2a2a2a'}`
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 20 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-[9px]" style={{ color: state.active ? state.color : '#8a8a8a' }}>
                {state.name}
              </span>
              {state.active && (
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: state.color }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Blend Space */}
        <div className="mt-3">
          <div className="text-[8px] text-[#8a8a8a] font-mono mb-1">BLEND SPACE</div>
          <div className="h-16 bg-[#0d0d0d] rounded border border-[#2a2a2a] relative">
            {/* Grid */}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="absolute w-full h-px bg-[#2a2a2a]" style={{ top: `${(i + 1) * 25}%` }} />
            ))}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="absolute h-full w-px bg-[#2a2a2a]" style={{ left: `${(i + 1) * 25}%` }} />
            ))}
            
            {/* Current position */}
            <motion.div
              className="absolute w-2 h-2 rounded-full bg-[#00d4aa]"
              animate={{
                left: ['20%', '70%', '20%'],
                top: ['60%', '30%', '60%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Labels */}
            <span className="absolute bottom-0.5 right-1 text-[6px] text-[#8a8a8a]">Speed</span>
            <span className="absolute top-0.5 left-1 text-[6px] text-[#8a8a8a]">Direction</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Crosshair Component
function Crosshair({ isActive = false, mousePos }: { isActive?: boolean; mousePos: { x: number; y: number } }) {
  return (
    <motion.div
      className="absolute pointer-events-none z-10"
      animate={{
        left: `${mousePos.x}%`,
        top: `${mousePos.y}%`,
        x: '-50%',
        y: '-50%',
        scale: isActive ? 1.5 : 1,
      }}
      transition={{ type: 'spring', damping: 30 }}
    >
      {/* Crosshair lines */}
      <motion.div 
        className="absolute top-1/2 left-0 h-px bg-[#ff006e]"
        animate={{ width: isActive ? 32 : 16 }}
        style={{ transform: 'translateY(-50%)' }}
      />
      <motion.div 
        className="absolute top-0 left-1/2 w-px bg-[#ff006e]"
        animate={{ height: isActive ? 32 : 16 }}
        style={{ transform: 'translateX(-50%)' }}
      />
      
      {/* Center dot */}
      <motion.div 
        className="absolute top-1/2 left-1/2 bg-[#ff006e] rounded-full -translate-x-1/2 -translate-y-1/2"
        animate={{ 
          width: isActive ? 6 : 4, 
          height: isActive ? 6 : 4,
          boxShadow: isActive ? '0 0 10px #ff006e' : 'none'
        }}
      />
      
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 border border-[#ff006e]/50 rounded-full"
        style={{
          width: isActive ? 40 : 24,
          height: isActive ? 40 : 24,
          left: isActive ? -20 : -12,
          top: isActive ? -20 : -12,
        }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />

      {/* Hit marker effect when active */}
      {isActive && (
        <>
          <motion.div
            className="absolute top-1/2 left-1/2 w-8 h-px bg-[#ffd700]"
            style={{ transform: 'translate(-50%, -50%) rotate(45deg)' }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 1.5, 0], opacity: [1, 0] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 1 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-8 h-px bg-[#ffd700]"
            style={{ transform: 'translate(-50%, -50%) rotate(-45deg)' }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 1.5, 0], opacity: [1, 0] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 1 }}
          />
        </>
      )}
    </motion.div>
  );
}

export default function GameAnimation({ isActive = false }: GameAnimationProps) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = (e.target as HTMLElement).closest('.project-card')?.getBoundingClientRect();
      if (rect) {
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Character Blueprint */}
      <CharacterBlueprint isActive={isActive} />
      
      {/* Animation Blueprint */}
      <AnimBlueprintPanel isActive={isActive} />

      {/* Crosshair following mouse */}
      <Crosshair isActive={isActive} mousePos={mousePos} />

      {/* Shooting sparks */}
      <motion.div
        animate={{
          scale: isActive ? 1.5 : 1,
          opacity: isActive ? 1 : 0.6,
        }}
      >
        {[...Array(isActive ? 10 : 5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#ff006e] rounded-full"
            style={{
              left: `${20 + i * (isActive ? 8 : 15)}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              scale: [0, isActive ? 1.5 : 1, 0],
              opacity: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * (isActive ? 100 : 50)],
              y: [0, (Math.random() - 0.5) * (isActive ? 100 : 50)],
            }}
            transition={{
              duration: isActive ? 0.5 : 0.3,
              repeat: Infinity,
              delay: i * (isActive ? 0.2 : 0.5),
              repeatDelay: isActive ? 0.3 : 1,
            }}
          />
        ))}
      </motion.div>

      {/* Game UI Elements */}
      <motion.div 
        className="absolute top-4 left-4 space-y-2"
        animate={{
          opacity: isActive ? 0.3 : 1,
          x: isActive ? -20 : 0,
        }}
      >
        {/* Health Bar */}
        <motion.div 
          className="w-24"
          animate={{ scale: isActive ? 0.9 : 1 }}
        >
          <div className="flex justify-between text-[8px] text-[#ff006e] font-mono mb-1">
            <span>HP</span>
            <span>100/100</span>
          </div>
          <div className="h-2 bg-[#2a2a2a] rounded overflow-hidden border border-[#ff006e]/30">
            <motion.div
              className="h-full bg-gradient-to-r from-[#ff006e] to-[#ff4d9e]"
              initial={{ width: '100%' }}
              animate={{ width: ['100%', '80%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Ammo Counter */}
        <motion.div 
          className="flex items-center gap-2"
          animate={{ scale: isActive ? 0.9 : 1 }}
        >
          <span className="text-lg font-bold text-[#ff006e] font-mono">30</span>
          <span className="text-xs text-[#8a8a8a] font-mono">/ 90</span>
        </motion.div>
      </motion.div>

      {/* Minimap */}
      <motion.div 
        className="absolute top-4 right-4 bg-[#1a1a1a] border border-[#ff006e]/30 rounded-full overflow-hidden"
        animate={{
          width: isActive ? 80 : 64,
          height: isActive ? 80 : 64,
          opacity: isActive ? 0.3 : 1,
          x: isActive ? 20 : 0,
        }}
      >
        <motion.div
          className="absolute top-1/2 left-1/2 w-1 h-1 bg-[#ff006e] rounded-full"
          style={{ transform: 'translate(-50%, -50%)' }}
        />
        {/* Minimap dots */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#ff006e]/50 rounded-full"
            style={{
              left: `${20 + i * 25}%`,
              top: `${20 + (i % 2) * 40}%`,
            }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
        {/* Radar sweep */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#ff006e]/50 to-transparent"
          style={{ transformOrigin: 'left center' }}
          animate={{ rotate: 360 }}
          transition={{ duration: isActive ? 2 : 4, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Kill Feed */}
      <motion.div 
        className="absolute top-1/3 right-4 space-y-1"
        animate={{
          opacity: isActive ? 0.2 : 1,
          x: isActive ? 30 : 0,
        }}
      >
        {[
          { action: 'HEADSHOT', player: 'Enemy', color: '#ffd700' },
          { action: 'KILL', player: 'Target', color: '#ff006e' },
        ].map((feed, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2 text-[10px] font-mono"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.5 + 1 }}
          >
            <span style={{ color: feed.color }}>{feed.action}</span>
            <span className="text-[#8a8a8a]">{feed.player}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Network Visualization */}
      <motion.div 
        className="absolute bottom-4 left-4"
        animate={{
          opacity: isActive ? 0.3 : 1,
          y: isActive ? 20 : 0,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-[#00d4aa]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <span className="text-[8px] text-[#00d4aa] font-mono">PING: 24ms</span>
        </div>
        {/* Network nodes */}
        <svg width="60" height="30" viewBox="0 0 60 30">
          {[0, 20, 40, 60].map((x, i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={15}
              r="3"
              fill="#00d4aa"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
          <motion.path
            d="M 0 15 Q 10 5 20 15 Q 30 25 40 15 Q 50 5 60 15"
            fill="none"
            stroke="#00d4aa"
            strokeWidth="1"
            strokeDasharray="4,4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      </motion.div>

      {/* Weapon Icon */}
      <motion.div
        className="absolute"
        animate={{ 
          y: [0, -2, 0],
          scale: isActive ? 1.3 : 1,
          opacity: isActive ? 0.3 : 0.6,
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
        style={{ bottom: isActive ? '8%' : '4%', right: isActive ? '2%' : '4%' }}
      >
        <svg width={isActive ? 60 : 40} height={isActive ? 30 : 20} viewBox="0 0 40 20" className="opacity-80">
          <rect x="0" y="8" width="25" height="6" fill="#8a8a8a" />
          <rect x="25" y="6" width="12" height="10" fill="#8a8a8a" />
          <rect x="5" y="14" width="8" height="4" fill="#8a8a8a" />
          <motion.rect
            x="37"
            y="8"
            width="3"
            height="4"
            fill="#ff006e"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 0.5 }}
          />
        </svg>
      </motion.div>

      {/* Screen shake effect indicator */}
      <motion.div
        className="absolute inset-0 border-2"
        animate={{ 
          borderColor: isActive 
            ? ['rgba(255,0,110,0)', 'rgba(255,0,110,0.3)', 'rgba(255,0,110,0)'] 
            : ['rgba(255,0,110,0)', 'rgba(255,0,110,0.1)', 'rgba(255,0,110,0)']
        }}
        transition={{ duration: isActive ? 0.1 : 0.2, repeat: Infinity, repeatDelay: 2 }}
      />

      {/* FPS Counter */}
      <motion.div
        className="absolute top-1/2 left-4 text-[10px] font-mono"
        animate={{
          opacity: isActive ? 1 : 0.3,
        }}
      >
        <div className="text-[#8a8a8a]">FPS</div>
        <motion.div 
          className="text-[#00d4aa] text-lg font-bold"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          144
        </motion.div>
      </motion.div>

      {/* Game Mode Label */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#ff006e]/10 border border-[#ff006e]/30 rounded"
        animate={{
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 20,
        }}
      >
        <span className="text-sm text-[#ff006e] font-mono">FPS Multiplayer Game</span>
      </motion.div>
    </div>
  );
}
