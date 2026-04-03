'use client';

import { motion } from 'framer-motion';

interface DesignAnimationProps {
  isActive?: boolean;
}

// 3D Car Wireframe with enhanced detail
function CarWireframe({ isActive = false }: { isActive?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 400 200"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      animate={{
        width: isActive ? '90%' : '70%',
        opacity: isActive ? 0.6 : 0.25,
      }}
    >
      {/* Main body wireframe */}
      <motion.path
        d="M 40 140 L 70 90 L 120 60 L 220 50 L 300 65 L 350 100 L 360 140 L 330 160 L 250 170 L 150 168 L 70 165 L 40 150 Z"
        fill="none"
        stroke="#ff6b35"
        strokeWidth={isActive ? 1.5 : 0.8}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: isActive ? 2 : 3, repeat: Infinity }}
      />
      
      {/* Side profile lines */}
      <motion.path
        d="M 120 60 L 120 90 M 220 50 L 220 80 M 300 65 L 300 95 M 70 90 L 350 100"
        fill="none"
        stroke="#ff6b35"
        strokeWidth="0.5"
        strokeDasharray="5,5"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, isActive ? 0.8 : 0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Window frames */}
      <motion.path
        d="M 125 65 L 215 55 L 215 80 L 125 88 Z M 225 56 L 295 68 L 295 92 L 225 82 Z"
        fill="none"
        stroke="#ff6b35"
        strokeWidth="0.6"
        strokeDasharray="3,2"
        animate={{ opacity: isActive ? 1 : 0.3 }}
      />

      {/* Door lines */}
      <motion.path
        d="M 150 90 L 150 165 M 280 95 L 280 168"
        fill="none"
        stroke="#ff6b35"
        strokeWidth="0.4"
        strokeDasharray="4,4"
      />
      
      {/* Wheels with rotation */}
      <motion.g
        animate={{ rotate: isActive ? 720 : 360 }}
        transition={{ duration: isActive ? 5 : 10, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: '110px 155px' }}
      >
        <circle cx="110" cy="155" r="25" fill="none" stroke="#ff6b35" strokeWidth={isActive ? 1.2 : 0.8} />
        <line x1="110" y1="130" x2="110" y2="180" stroke="#ff6b35" strokeWidth="0.5" />
        <line x1="85" y1="155" x2="135" y2="155" stroke="#ff6b35" strokeWidth="0.5" />
        <line x1="92" y1="137" x2="128" y2="173" stroke="#ff6b35" strokeWidth="0.5" />
        <line x1="128" y1="137" x2="92" y2="173" stroke="#ff6b35" strokeWidth="0.5" />
      </motion.g>
      
      <motion.g
        animate={{ rotate: isActive ? 720 : 360 }}
        transition={{ duration: isActive ? 5 : 10, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: '310px 155px' }}
      >
        <circle cx="310" cy="155" r="25" fill="none" stroke="#ff6b35" strokeWidth={isActive ? 1.2 : 0.8} />
        <line x1="310" y1="130" x2="310" y2="180" stroke="#ff6b35" strokeWidth="0.5" />
        <line x1="285" y1="155" x2="335" y2="155" stroke="#ff6b35" strokeWidth="0.5" />
        <line x1="292" y1="137" x2="328" y2="173" stroke="#ff6b35" strokeWidth="0.5" />
        <line x1="328" y1="137" x2="292" y2="173" stroke="#ff6b35" strokeWidth="0.5" />
      </motion.g>

      {/* Headlights */}
      <motion.path
        d="M 345 105 L 355 110 L 355 120 L 345 125"
        fill="none"
        stroke="#ffd700"
        strokeWidth="1"
        animate={{ 
          opacity: isActive ? [0.5, 1, 0.5] : 0.3,
          strokeWidth: isActive ? [1, 2, 1] : 1
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Light beams when active */}
      {isActive && (
        <motion.path
          d="M 360 110 L 450 80 M 360 125 L 450 155"
          fill="none"
          stroke="url(#lightBeam)"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <defs>
        <linearGradient id="lightBeam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffd700" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}

// Trophy Animation with enhanced effects
function TrophyAnimation({ isActive = false }: { isActive?: boolean }) {
  return (
    <motion.div
      className="absolute"
      animate={{ 
        y: [0, -8, 0], 
        rotate: [0, 5, -5, 0],
        scale: isActive ? 1.3 : 1
      }}
      transition={{ duration: 3, repeat: Infinity }}
      style={{ top: isActive ? '2%' : '4%', right: isActive ? '2%' : '4%' }}
    >
      <svg width={isActive ? 60 : 40} height={isActive ? 75 : 50} viewBox="0 0 40 50" className={isActive ? 'opacity-100' : 'opacity-60'}>
        {/* Trophy cup */}
        <motion.path
          d="M 10 10 L 30 10 L 28 25 Q 28 35 20 38 Q 12 35 12 25 Z"
          fill="url(#goldGradient)"
          stroke="#ffd700"
          strokeWidth="1"
          animate={{ fillOpacity: isActive ? [0.8, 1, 0.8] : [0.6, 1, 0.6] }}
          transition={{ duration: isActive ? 1 : 2, repeat: Infinity }}
        />
        {/* Trophy handles */}
        <path d="M 10 12 Q 5 15 5 22 Q 5 28 10 25" fill="none" stroke="#ffd700" strokeWidth="1.5" />
        <path d="M 30 12 Q 35 15 35 22 Q 35 28 30 25" fill="none" stroke="#ffd700" strokeWidth="1.5" />
        {/* Trophy base */}
        <rect x="15" y="38" width="10" height="3" fill="#ffd700" />
        <rect x="12" y="41" width="16" height="4" fill="#ffd700" />
        
        {/* Sparkles when active */}
        {isActive && (
          <>
            <motion.circle cx="5" cy="5" r="2" fill="#ffd700" animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }} />
            <motion.circle cx="35" cy="8" r="1.5" fill="#ffd700" animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }} />
            <motion.circle cx="8" cy="45" r="1" fill="#ffd700" animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.6 }} />
          </>
        )}
        
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="50%" stopColor="#ffed4e" />
            <stop offset="100%" stopColor="#daa520" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// Design Process Steps
function DesignProcess({ isActive = false }: { isActive?: boolean }) {
  const steps = [
    { icon: '✏️', label: 'Sketch', color: '#ff6b35' },
    { icon: '📐', label: 'Model', color: '#00a8e8' },
    { icon: '🎨', label: 'Render', color: '#00d4aa' },
    { icon: '🏆', label: 'Award', color: '#ffd700' },
  ];

  return (
    <motion.div 
      className="absolute bottom-4 left-4 flex gap-3"
      animate={{
        opacity: isActive ? 0.3 : 1,
        y: isActive ? 20 : 0,
      }}
    >
      {steps.map((step, i) => (
        <motion.div
          key={step.label}
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.3 }}
        >
          <motion.div
            className="w-8 h-8 rounded-full border flex items-center justify-center text-xs"
            style={{ 
              backgroundColor: `${step.color}20`,
              borderColor: `${step.color}50`,
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
          >
            {step.icon}
          </motion.div>
          <span className="text-[8px] mt-1 font-mono" style={{ color: step.color }}>{step.label}</span>
          {i < steps.length - 1 && (
            <motion.div
              className="absolute top-4 h-px bg-[#ff6b35]/50"
              style={{ left: `${(i + 1) * 44 - 4}px`, width: 24 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: i * 0.3 + 0.5 }}
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Blueprint Panel
function BlueprintPanel({ isActive = false }: { isActive?: boolean }) {
  return (
    <motion.div
      className="absolute bg-[#1a1a1a] border border-[#3a3a3a] rounded overflow-hidden"
      animate={{
        opacity: isActive ? 1 : 0,
        x: isActive ? 0 : -100,
        scale: isActive ? 1 : 0.8,
      }}
      style={{
        top: '10%',
        left: '3%',
        width: 180,
      }}
    >
      <div className="bg-[#2a2a2a] px-3 py-2">
        <span className="text-[10px] text-white font-mono">Blueprint: BP_CarDesign</span>
      </div>
      
      <div className="p-2 space-y-2">
        {/* Components */}
        <div className="text-[8px] text-[#8a8a8a] font-mono mb-1">COMPONENTS</div>
        {[
          { name: 'Static Mesh', type: 'Body', color: '#00a8e8' },
          { name: 'Static Mesh', type: 'Wheels', color: '#00a8e8' },
          { name: 'Point Light', type: 'Headlights', color: '#ffd700' },
          { name: 'Material', type: 'Car Paint', color: '#00d4aa' },
        ].map((comp, i) => (
          <motion.div
            key={comp.name + i}
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
    </motion.div>
  );
}

// Render Settings Panel
function RenderSettings({ isActive = false }: { isActive?: boolean }) {
  const settings = [
    { name: 'Ray Tracing', value: 'ON', color: '#00d4aa' },
    { name: 'GI Quality', value: 'High', color: '#00a8e8' },
    { name: 'Samples', value: '4096', color: '#ff6b35' },
    { name: 'Resolution', value: '4K', color: '#ffd700' },
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
        top: '10%',
        right: '3%',
        width: 160,
      }}
    >
      <div className="bg-[#2a2a2a] px-3 py-2">
        <span className="text-[10px] text-white font-mono">Render Settings</span>
      </div>
      
      <div className="p-2 space-y-1">
        {settings.map((setting, i) => (
          <motion.div
            key={setting.name}
            className="flex items-center justify-between py-1 px-2 rounded"
            style={{ backgroundColor: `${setting.color}10` }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 20 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="text-[8px] text-[#8a8a8a]">{setting.name}</span>
            <span className="text-[8px] font-mono" style={{ color: setting.color }}>{setting.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Render Progress */}
      <div className="px-3 py-2 border-t border-[#2a2a2a]">
        <div className="flex justify-between text-[8px] mb-1">
          <span className="text-[#8a8a8a]">Progress</span>
          <motion.span 
            className="text-[#00d4aa] font-mono"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            100%
          </motion.span>
        </div>
        <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#00d4aa]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function DesignAnimation({ isActive = false }: DesignAnimationProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Blueprint Panel */}
      <BlueprintPanel isActive={isActive} />
      
      {/* Render Settings */}
      <RenderSettings isActive={isActive} />

      {/* Car Wireframe Model */}
      <CarWireframe isActive={isActive} />

      {/* Trophy Animation */}
      <TrophyAnimation isActive={isActive} />

      {/* Design Process Steps */}
      <DesignProcess isActive={isActive} />

      {/* Progress Bar */}
      <motion.div 
        className="absolute bottom-16 left-4 w-32"
        animate={{
          opacity: isActive ? 0.3 : 1,
        }}
      >
        <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ff6b35] to-[#ff9f43]"
            initial={{ width: '0%' }}
            animate={{ width: ['0%', '100%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
        <motion.span
          className="text-[8px] text-[#ff6b35] font-mono mt-1 block"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          Rendering...
        </motion.span>
      </motion.div>

      {/* HMI Interface Preview */}
      <motion.div
        className="absolute top-1/3 right-4 bg-[#1a1a1a] border border-[#ff6b35]/30 rounded overflow-hidden"
        animate={{ 
          opacity: isActive ? 0.2 : [0.5, 1, 0.5],
          scale: isActive ? 0.8 : 1,
          x: isActive ? 30 : 0,
        }}
        style={{ width: 80, height: 56 }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="h-full p-1 space-y-1">
          <div className="h-2 bg-[#ff6b35]/30 rounded w-full" />
          <div className="flex gap-1">
            <div className="h-6 w-8 bg-[#ff6b35]/20 rounded" />
            <div className="flex-1 space-y-1">
              <div className="h-2 bg-[#2a2a2a] rounded" />
              <div className="h-2 bg-[#2a2a2a] rounded w-2/3" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Award Badge */}
      <motion.div
        className="absolute"
        animate={{ 
          rotate: [0, 10, -10, 0], 
          scale: isActive ? [1, 1.3, 1] : [1, 1.1, 1] 
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ bottom: isActive ? '8%' : '4%', right: isActive ? '2%' : '4%' }}
      >
        <div 
          className="rounded-full bg-gradient-to-br from-[#ffd700] to-[#ff6b35] flex items-center justify-center text-[#0d0d0d] font-bold text-xs shadow-lg"
          style={{
            width: isActive ? 56 : 40,
            height: isActive ? 56 : 40,
            fontSize: isActive ? 14 : 12,
            boxShadow: isActive ? '0 0 30px #ff6b3560' : '0 0 10px #ff6b3530',
          }}
        >
          3rd
        </div>
      </motion.div>

      {/* Grid Lines */}
      <motion.svg 
        className="absolute inset-0 w-full h-full"
        animate={{ opacity: isActive ? 0.2 : 0.1 }}
      >
        <defs>
          <pattern id="designGrid" width={isActive ? 30 : 20} height={isActive ? 30 : 20} patternUnits="userSpaceOnUse">
            <path d={`M ${isActive ? 30 : 20} 0 L 0 0 0 ${isActive ? 30 : 20}`} fill="none" stroke="#ff6b35" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#designGrid)" />
      </motion.svg>

      {/* Competition Label */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#ff6b35]/10 border border-[#ff6b35]/30 rounded"
        animate={{
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 20,
        }}
      >
        <span className="text-sm text-[#ff6b35] font-mono">China Car Design Competition - 3rd Prize</span>
      </motion.div>
    </div>
  );
}
