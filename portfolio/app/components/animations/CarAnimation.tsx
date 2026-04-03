'use client';

import { motion } from 'framer-motion';

interface CarAnimationProps {
  isActive?: boolean;
}

export default function CarAnimation({ isActive = false }: CarAnimationProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large 3D Car Wireframe - Dominant Visual */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ 
          scale: isActive ? 1.2 : 0.8,
          opacity: isActive ? 1 : 0.3,
        }}
        transition={{ duration: 0.6 }}
      >
        <svg
          viewBox="0 0 400 200"
          className="w-[500px] h-[250px]"
        >
          {/* Car Body Wireframe */}
          <motion.path
            d="M 50 140 L 80 100 L 150 80 L 250 80 L 320 100 L 350 140 L 350 160 L 320 170 L 250 170 L 200 175 L 150 170 L 80 170 L 50 160 Z"
            fill="none"
            stroke="#00d4aa"
            strokeWidth="1.5"
            strokeDasharray="8,4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Car Windows */}
          <motion.path
            d="M 90 105 L 150 85 L 240 85 L 300 105 L 290 130 L 100 130 Z"
            fill="none"
            stroke="#00d4aa"
            strokeWidth="1"
            strokeDasharray="4,4"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Wheels with Rotation */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '100px 165px' }}
          >
            <circle cx="100" cy="165" r="25" fill="none" stroke="#00d4aa" strokeWidth="1.5" />
            <line x1="100" y1="140" x2="100" y2="190" stroke="#00d4aa" strokeWidth="1" />
            <line x1="75" y1="165" x2="125" y2="165" stroke="#00d4aa" strokeWidth="1" />
          </motion.g>
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '300px 165px' }}
          >
            <circle cx="300" cy="165" r="25" fill="none" stroke="#00d4aa" strokeWidth="1.5" />
            <line x1="300" y1="140" x2="300" y2="190" stroke="#00d4aa" strokeWidth="1" />
            <line x1="275" y1="165" x2="325" y2="165" stroke="#00d4aa" strokeWidth="1" />
          </motion.g>

          {/* Blueprint Grid Overlay */}
          <defs>
            <pattern id="carGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00d4aa" strokeWidth="0.3" opacity="0.3" />
            </pattern>
          </defs>
          <rect x="40" y="70" width="320" height="120" fill="url(#carGrid)" opacity="0.2" />
        </svg>
      </motion.div>

      {/* Blueprint Nodes - Top Left */}
      <motion.div
        className="absolute top-8 left-8"
        animate={{ opacity: isActive ? 1 : 0.5 }}
        transition={{ duration: 0.4 }}
      >
        {[
          { title: 'Event BeginPlay', x: 0, y: 0, delay: 0 },
          { title: 'Create Widget', x: 160, y: 0, delay: 0.2 },
          { title: 'Add to Viewport', x: 320, y: 0, delay: 0.4 },
        ].map((node) => (
          <motion.div
            key={node.title}
            className="absolute bg-[#1a1a1a] border border-[#00d4aa] rounded px-3 py-2"
            style={{ left: node.x, top: node.y }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isActive ? 1 : 0.6, 
              scale: isActive ? 1 : 0.9,
              boxShadow: isActive ? '0 0 20px rgba(0, 212, 170, 0.4)' : 'none'
            }}
            transition={{ delay: node.delay }}
          >
            <div className="text-[10px] text-white font-mono flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00d4aa]" />
              {node.title}
            </div>
          </motion.div>
        ))}

        {/* Connection Lines */}
        <svg className="absolute top-0 left-0 w-[500px] h-[100px] pointer-events-none">
          <motion.path
            d="M 140 20 Q 150 20 160 20"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <motion.path
            d="M 300 20 Q 310 20 320 20"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          
          {/* Data Flow Animation */}
          {isActive && (
            <>
              <motion.circle r="3" fill="#00d4aa">
                <animateMotion dur="1s" repeatCount="indefinite" path="M 140 20 Q 150 20 160 20" />
              </motion.circle>
              <motion.circle r="3" fill="#00d4aa">
                <animateMotion dur="1s" repeatCount="indefinite" begin="0.5s" path="M 300 20 Q 310 20 320 20" />
              </motion.circle>
            </>
          )}
        </svg>
      </motion.div>

      {/* Material Spheres - Bottom Left */}
      <motion.div
        className="absolute bottom-8 left-8 flex gap-4"
        animate={{ opacity: isActive ? 1 : 0.5 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {[
          { color: '#c0c0c0', label: 'Metallic' },
          { color: '#ff0000', label: 'Paint' },
          { color: '#4169e1', label: 'Glass' },
          { color: '#ffd700', label: 'Gold' },
        ].map((mat, i) => (
          <motion.div
            key={mat.label}
            className="flex flex-col items-center"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          >
            <div 
              className="w-14 h-14 rounded-full border-2 border-[#3a3a3a]"
              style={{ 
                background: `radial-gradient(circle at 30% 30%, ${mat.color}, #1a1a1a)`,
                boxShadow: isActive ? `0 0 30px ${mat.color}60` : 'none'
              }}
            />
            <span className="text-[9px] text-[#8a8a8a] mt-1 font-mono">{mat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* UMG Designer Panel - Bottom Right */}
      <motion.div
        className="absolute bottom-8 right-8 w-64 h-40 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg overflow-hidden"
        animate={{ 
          opacity: isActive ? 1 : 0.4,
          scale: isActive ? 1 : 0.9
        }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-[#1a1a1a] px-3 py-1.5 text-[10px] text-white font-mono flex justify-between">
          <span>UMG Designer</span>
          <span className="text-[#8a8a8a]">1920x1080</span>
        </div>
        <div className="relative w-full h-full p-3">
          {/* Canvas Panel */}
          <motion.div
            className="absolute inset-3 border border-dashed border-[#00d4aa]/50 bg-[#00d4aa]/5 rounded"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* UI Elements */}
          <div className="absolute top-6 left-6 w-20 h-6 bg-[#2a2a2a] rounded flex items-center justify-center">
            <span className="text-[8px] text-[#8a8a8a]">Text Block</span>
          </div>
          <div className="absolute top-14 left-6 w-16 h-12 bg-[#2a2a2a] rounded flex items-center justify-center">
            <span className="text-[8px] text-[#8a8a8a]">Image</span>
          </div>
          <div className="absolute top-6 right-6 w-12 h-8 bg-[#00d4aa]/20 rounded flex items-center justify-center">
            <span className="text-[8px] text-[#00d4aa]">Button</span>
          </div>
        </div>
      </motion.div>

      {/* Material Editor - Top Right */}
      <motion.div
        className="absolute top-8 right-8 w-48 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg overflow-hidden"
        animate={{ 
          opacity: isActive ? 1 : 0.4,
          scale: isActive ? 1 : 0.9
        }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="bg-[#1a1a1a] px-3 py-1.5 text-[10px] text-white font-mono">
          M_CarPaint
        </div>
        <div className="p-3 space-y-2">
          <div className="text-[9px] text-[#8a8a8a] font-mono">Base Color</div>
          <div className="h-3 bg-gradient-to-r from-[#ff0000] via-[#00ff00] to-[#0000ff] rounded" />
          
          <div className="text-[9px] text-[#8a8a8a] font-mono">Metallic</div>
          <div className="h-1.5 bg-[#2a2a2a] rounded overflow-hidden">
            <motion.div 
              className="h-full bg-[#00d4aa]"
              animate={{ width: ['0%', '80%', '80%'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          
          <div className="text-[9px] text-[#8a8a8a] font-mono">Roughness</div>
          <div className="h-1.5 bg-[#2a2a2a] rounded overflow-hidden">
            <motion.div 
              className="h-full bg-[#00d4aa]"
              animate={{ width: ['0%', '30%', '30%'] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Light Sweep Effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        initial={{ x: '-100%' }}
        animate={{ x: isActive ? '200%' : '-100%' }}
        transition={{ duration: 2, repeat: isActive ? Infinity : 0, repeatDelay: 3 }}
      >
        <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-[#00d4aa]/10 to-transparent transform -skew-x-12" />
      </motion.div>

      {/* Compiling Shaders Notification */}
      {isActive && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0d0d0d] border border-[#00d4aa] rounded-lg px-6 py-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
        >
          <div className="text-xs text-[#00d4aa] font-mono mb-2">Compiling Shaders...</div>
          <div className="w-40 h-1 bg-[#2a2a2a] rounded overflow-hidden">
            <motion.div
              className="h-full bg-[#00d4aa]"
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
