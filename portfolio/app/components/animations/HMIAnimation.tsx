'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface HMIAnimationProps {
  isActive?: boolean;
}

// Digital Gauge Component
function DigitalGauge({ value, max, label, unit, color = '#00a8e8', isActive = false }: { 
  value: number; 
  max: number; 
  label: string; 
  unit: string;
  color?: string;
  isActive?: boolean;
}) {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div 
      className="relative"
      animate={{ 
        scale: isActive ? 1.3 : 1,
        opacity: isActive ? 1 : 0.7 
      }}
      style={{ width: isActive ? 120 : 96, height: isActive ? 120 : 96 }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        {/* Background arc */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="8"
        />
        {/* Progress arc */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className="font-bold font-mono"
          style={{ color, fontSize: isActive ? '28px' : '20px' }}
          key={value}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
        >
          {value}
        </motion.span>
        <span className="text-[8px] text-[#8a8a8a]">{unit}</span>
      </div>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-[#8a8a8a]">{label}</div>
    </motion.div>
  );
}

// Speedometer with needle
function Speedometer({ speed, isActive = false }: { speed: number; isActive?: boolean }) {
  const maxSpeed = 240;
  const angle = -120 + (speed / maxSpeed) * 240;

  return (
    <motion.div 
      className="relative"
      animate={{ 
        scale: isActive ? 1.4 : 1,
        opacity: isActive ? 1 : 0.7 
      }}
      style={{ width: isActive ? 160 : 128, height: isActive ? 160 : 128 }}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full">
        {/* Tick marks */}
        {[...Array(13)].map((_, i) => {
          const tickAngle = -120 + i * 20;
          const rad = (tickAngle * Math.PI) / 180;
          const x1 = 60 + 40 * Math.cos(rad);
          const y1 = 60 + 40 * Math.sin(rad);
          const x2 = 60 + 35 * Math.cos(rad);
          const y2 = 60 + 35 * Math.sin(rad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i > 9 ? '#ff6b35' : '#3a3a3a'}
              strokeWidth={i % 2 === 0 ? 2 : 1}
            />
          );
        })}
        
        {/* Numbers */}
        {[0, 40, 80, 120, 160, 200, 240].map((num, i) => {
          const numAngle = -120 + i * 40;
          const rad = (numAngle * Math.PI) / 180;
          const x = 60 + 48 * Math.cos(rad);
          const y = 60 + 48 * Math.sin(rad);
          return (
            <text
              key={num}
              x={x}
              y={y}
              fill="#8a8a8a"
              fontSize="8"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="JetBrains Mono, monospace"
            >
              {num}
            </text>
          );
        })}

        {/* Needle */}
        <motion.g
          animate={{ rotate: angle }}
          transition={{ type: 'spring', damping: 20 }}
          style={{ transformOrigin: '60px 60px' }}
        >
          <line
            x1="60"
            y1="60"
            x2="60"
            y2="20"
            stroke="#00a8e8"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>
        
        {/* Center dot */}
        <circle cx="60" cy="60" r="4" fill="#00a8e8" />
      </svg>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-[#8a8a8a]">km/h</div>
    </motion.div>
  );
}

// RPM Gauge
function RPMGauge({ rpm, isActive = false }: { rpm: number; isActive?: boolean }) {
  const maxRPM = 8000;
  const angle = -120 + (rpm / maxRPM) * 240;

  return (
    <motion.div 
      className="relative"
      animate={{ 
      scale: isActive ? 1.3 : 1,
      opacity: isActive ? 1 : 0.7 
      }}
      style={{ width: isActive ? 140 : 112, height: isActive ? 140 : 112 }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Red zone */}
        <path
          d="M 50 50 L 50 10 A 40 40 0 0 1 85 25 Z"
          fill="#ff6b3520"
        />
        
        {/* Tick marks */}
        {[...Array(9)].map((_, i) => {
          const tickAngle = -120 + i * 30;
          const rad = (tickAngle * Math.PI) / 180;
          const x1 = 50 + 35 * Math.cos(rad);
          const y1 = 50 + 35 * Math.sin(rad);
          const x2 = 50 + 30 * Math.cos(rad);
          const y2 = 50 + 30 * Math.sin(rad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i > 6 ? '#ff6b35' : '#3a3a3a'}
              strokeWidth="1"
            />
          );
        })}

        {/* Needle */}
        <motion.g
          animate={{ rotate: angle }}
          transition={{ type: 'spring', damping: 15 }}
          style={{ transformOrigin: '50px 50px' }}
        >
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="15"
            stroke={rpm > 6000 ? '#ff6b35' : '#00a8e8'}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>
        
        <circle cx="50" cy="50" r="3" fill="#00a8e8" />
      </svg>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] text-[#8a8a8a]">x1000 RPM</div>
    </motion.div>
  );
}

// Gear Indicator
function GearIndicator({ gear, isActive = false }: { gear: string; isActive?: boolean }) {
  const gears = ['P', 'R', 'N', 'D'];
  
  return (
    <motion.div 
      className="flex gap-1"
      animate={{ scale: isActive ? 1.2 : 1 }}
    >
      {gears.map((g) => (
        <motion.div
          key={g}
          className="w-6 h-8 rounded flex items-center justify-center text-xs font-bold font-mono"
          animate={{
            backgroundColor: gear === g ? '#00a8e8' : '#1a1a1a',
            color: gear === g ? '#0d0d0d' : '#8a8a8a',
            scale: gear === g ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {g}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Audio Spectrum
function AudioSpectrum({ isActive = false }: { isActive?: boolean }) {
  return (
    <motion.div 
      className="flex items-end gap-0.5"
      animate={{ scaleY: isActive ? 1.5 : 1 }}
      style={{ height: isActive ? 48 : 32 }}
    >
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-[#00a8e8] rounded-t"
          animate={{
            height: [4, Math.random() * 24 + 4, 4],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            delay: i * 0.03,
          }}
        />
      ))}
    </motion.div>
  );
}

// UMG Widget Designer Panel
function WidgetDesignerPanel({ isActive = false }: { isActive?: boolean }) {
  return (
    <motion.div
      className="absolute bg-[#1a1a1a] border border-[#3a3a3a] rounded overflow-hidden"
      animate={{
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.8,
        x: isActive ? 0 : -50,
      }}
      style={{
        top: '10%',
        left: '5%',
        width: 200,
        height: 280,
      }}
    >
      {/* Panel Header */}
      <div className="bg-[#2a2a2a] px-3 py-2 flex items-center justify-between">
        <span className="text-[10px] text-white font-mono">Widget Designer</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-[#ff6b35]" />
          <div className="w-2 h-2 rounded-full bg-[#ffd700]" />
          <div className="w-2 h-2 rounded-full bg-[#00d4aa]" />
        </div>
      </div>
      
      {/* Canvas Panel */}
      <div className="p-3 h-full">
        <div className="border-2 border-dashed border-[#00d4aa]/30 rounded bg-[#0d0d0d] h-48 relative">
          {/* Canvas Panel Label */}
          <div className="absolute -top-3 left-2 bg-[#1a1a1a] px-1">
            <span className="text-[8px] text-[#00d4aa]">Canvas Panel</span>
          </div>
          
          {/* Widgets */}
          <div className="p-2 space-y-2">
            {/* Speed Text */}
            <div className="flex items-center gap-2 p-1 bg-[#00a8e8]/10 rounded border border-[#00a8e8]/30">
              <div className="w-3 h-3 rounded bg-[#00a8e8]" />
              <span className="text-[8px] text-[#8a8a8a]">Text Block: Speed</span>
            </div>
            
            {/* RPM Progress Bar */}
            <div className="flex items-center gap-2 p-1 bg-[#00d4aa]/10 rounded border border-[#00d4aa]/30">
              <div className="w-3 h-3 rounded bg-[#00d4aa]" />
              <div className="flex-1 h-1 bg-[#2a2a2a] rounded">
                <div className="w-2/3 h-full bg-[#00d4aa] rounded" />
              </div>
            </div>
            
            {/* Gear Button */}
            <div className="flex items-center gap-2 p-1 bg-[#ff6b35]/10 rounded border border-[#ff6b35]/30">
              <div className="w-3 h-3 rounded bg-[#ff6b35]" />
              <span className="text-[8px] text-[#8a8a8a]">Button: Gear</span>
            </div>
          </div>
        </div>
        
        {/* Properties Panel */}
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-[8px]">
            <span className="text-[#8a8a8a]">Position X</span>
            <span className="text-white font-mono">120.0</span>
          </div>
          <div className="flex justify-between text-[8px]">
            <span className="text-[#8a8a8a]">Position Y</span>
            <span className="text-white font-mono">80.0</span>
          </div>
          <div className="flex justify-between text-[8px]">
            <span className="text-[#8a8a8a]">Size X</span>
            <span className="text-white font-mono">200.0</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Blueprint Nodes for HMI Logic
function BlueprintNodes({ isActive = false }: { isActive?: boolean }) {
  const nodes = [
    { title: 'Event Tick', x: 0, y: 0, delay: 0, inputs: [], outputs: ['Delta Time'] },
    { title: 'Get Speed', x: 160, y: 20, delay: 0.2, inputs: ['Target'], outputs: ['Speed'] },
    { title: 'Set Text', x: 320, y: 0, delay: 0.4, inputs: ['Target', 'Value'], outputs: [] },
    { title: 'Format Text', x: 160, y: 80, delay: 0.6, inputs: ['Format', 'Args'], outputs: ['Result'] },
  ];

  return (
    <motion.div
      className="absolute"
      animate={{
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.8,
      }}
      style={{
        top: '10%',
        right: '5%',
        width: 500,
        height: 200,
      }}
    >
      {nodes.map((node, i) => (
        <motion.div
          key={node.title}
          className="absolute bg-[#1a1a1a] border border-[#3a3a3a] rounded overflow-hidden"
          style={{
            left: node.x,
            top: node.y,
            width: 140,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isActive ? 1 : 0, 
            y: isActive ? 0 : 20,
          }}
          transition={{ delay: node.delay }}
        >
          {/* Node Header */}
          <div className="bg-[#00a8e8] px-2 py-1">
            <span className="text-[10px] text-white font-medium">{node.title}</span>
          </div>
          
          {/* Node Body */}
          <div className="p-2 flex justify-between">
            {/* Inputs */}
            <div className="space-y-1">
              {node.inputs.map((input) => (
                <div key={input} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#ffffff]" />
                  <span className="text-[8px] text-[#8a8a8a]">{input}</span>
                </div>
              ))}
            </div>
            
            {/* Outputs */}
            <div className="space-y-1">
              {node.outputs.map((output) => (
                <div key={output} className="flex items-center gap-1 justify-end">
                  <span className="text-[8px] text-[#8a8a8a]">{output}</span>
                  <div className="w-2 h-2 rounded-full bg-[#00d4aa]" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* Connection Lines */}
      <svg className="absolute inset-0 pointer-events-none" style={{ width: 500, height: 200 }}>
        <motion.path
          d="M 140 30 Q 150 30, 160 40"
          fill="none"
          stroke="#8a8a8a"
          strokeWidth="2"
          animate={{ pathLength: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        <motion.path
          d="M 300 50 Q 310 50, 320 30"
          fill="none"
          stroke="#8a8a8a"
          strokeWidth="2"
          animate={{ pathLength: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
      </svg>
    </motion.div>
  );
}

export default function HMIAnimation({ isActive = false }: HMIAnimationProps) {
  const [speed, setSpeed] = useState(0);
  const [rpm, setRPM] = useState(0);
  const [gear, setGear] = useState('P');

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((prev) => {
        if (prev < 120) return prev + Math.random() * 5;
        return prev - Math.random() * 3;
      });
      
      setRPM((prev) => {
        const target = speed > 0 ? 2000 + Math.random() * 3000 : 800;
        return prev + (target - prev) * 0.1;
      });
      
      setGear((prev) => {
        if (speed === 0) return 'P';
        if (speed < 5) return 'D';
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [speed]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Blueprint Nodes - Background Layer */}
      <BlueprintNodes isActive={isActive} />
      
      {/* Widget Designer Panel */}
      <WidgetDesignerPanel isActive={isActive} />

      {/* Digital Cluster - Main Visual */}
      <motion.div 
        className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-4"
        animate={{
          width: isActive ? 480 : 320,
          borderColor: isActive ? '#00a8e8' : '#2a2a2a',
          boxShadow: isActive ? '0 0 60px #00a8e820' : 'none',
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          {/* Left Gauge - RPM */}
          <RPMGauge rpm={rpm} isActive={isActive} />
          
          {/* Center - Speed */}
          <div className="flex flex-col items-center">
            <Speedometer speed={speed} isActive={isActive} />
            <div className="mt-2">
              <GearIndicator gear={gear} isActive={isActive} />
            </div>
          </div>
          
          {/* Right Gauge - Fuel */}
          <DigitalGauge value={75} max={100} label="Fuel" unit="%" color="#00d4aa" isActive={isActive} />
        </div>
        
        {/* Bottom Info Bar */}
        <motion.div 
          className="flex justify-between mt-4 pt-2 border-t border-[#2a2a2a] text-[10px] text-[#8a8a8a] font-mono"
          animate={{ opacity: isActive ? 0.3 : 1 }}
        >
          <span>ODOMETER: 12,458 km</span>
          <span>TEMP: 24°C</span>
          <span>TIME: 14:32</span>
        </motion.div>
      </motion.div>

      {/* Center Display - Infotainment */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg overflow-hidden"
        animate={{
          width: isActive ? 320 : 256,
          height: isActive ? 200 : 160,
          borderColor: isActive ? '#00a8e8' : '#2a2a2a',
          opacity: isActive ? 1 : 0.6,
        }}
      >
        {/* Header */}
        <div className="bg-[#1a1a1a] px-3 py-2 flex justify-between items-center">
          <span className="text-xs text-white font-mono">Media</span>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00d4aa]" />
            <div className="w-2 h-2 rounded-full bg-[#8a8a8a]" />
            <div className="w-2 h-2 rounded-full bg-[#8a8a8a]" />
          </div>
        </div>
        
        {/* Album Art & Info */}
        <div className="p-3 flex gap-3">
          <motion.div 
            className="bg-gradient-to-br from-[#00a8e8] to-[#00d4aa] rounded flex items-center justify-center"
            animate={{ 
              width: isActive ? 80 : 64, 
              height: isActive ? 80 : 64 
            }}
          >
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
          </motion.div>
          <div className="flex-1">
            <div className="text-xs text-white font-medium">Highway to Hell</div>
            <div className="text-[10px] text-[#8a8a8a]">AC/DC</div>
            <div className="mt-2">
              <AudioSpectrum isActive={isActive} />
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="px-3 pb-3">
          <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#00a8e8]"
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 180, repeat: Infinity }}
            />
          </div>
          <div className="flex justify-between text-[8px] text-[#8a8a8a] mt-1 font-mono">
            <span>1:24</span>
            <span>3:28</span>
          </div>
        </div>
      </motion.div>

      {/* HUD Elements */}
      <motion.div 
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-4"
        animate={{ 
          opacity: isActive ? 0.2 : 1,
          scale: isActive ? 0.9 : 1 
        }}
      >
        {/* Navigation Arrow */}
        <motion.div
          className="w-12 h-12 rounded-full border-2 border-[#00d4aa] flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <svg className="w-6 h-6 text-[#00d4aa]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
          </svg>
        </motion.div>
        
        {/* Distance */}
        <div className="text-center">
          <div className="text-2xl font-bold text-[#00d4aa] font-mono">200</div>
          <div className="text-[10px] text-[#8a8a8a]">m</div>
        </div>
        
        {/* Street Name */}
        <div className="bg-[#00d4aa] text-[#0d0d0d] px-3 py-1 rounded text-xs font-bold">
          右转进入科技路
        </div>
      </motion.div>

      {/* Weather Widget */}
      <motion.div 
        className="absolute top-4 right-4 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-3 w-32"
        animate={{ 
          opacity: isActive ? 0.2 : 1,
          x: isActive ? 50 : 0 
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <div>
              <div className="text-lg font-bold text-white">24°C</div>
              <div className="text-[8px] text-[#8a8a8a]">晴朗</div>
            </div>
          </div>
        </div>
        
        {/* Wiper Indicator */}
        <motion.div
          className="mt-2 flex items-center gap-2 text-[8px] text-[#8a8a8a]"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span>雨刮器: AUTO</span>
        </motion.div>
      </motion.div>

      {/* ADAS Status */}
      <motion.div 
        className="absolute bottom-4 left-4 flex gap-2"
        animate={{ 
          opacity: isActive ? 0.2 : 1,
          y: isActive ? 20 : 0 
        }}
      >
        {[
          { icon: 'LKA', active: true, label: '车道保持' },
          { icon: 'ACC', active: true, label: '自适应巡航' },
          { icon: 'AEB', active: false, label: '自动刹车' },
        ].map((item) => (
          <motion.div
            key={item.icon}
            className="px-2 py-1 rounded text-[10px] font-mono"
            animate={{
              backgroundColor: item.active ? '#00d4aa20' : '#1a1a1a',
              color: item.active ? '#00d4aa' : '#8a8a8a',
              borderColor: item.active ? '#00d4aa' : '#2a2a2a',
            }}
            style={{ border: '1px solid' }}
          >
            {item.icon}
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile Preview */}
      <motion.div 
        className="absolute bottom-4 right-4 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg overflow-hidden"
        animate={{ 
          opacity: isActive ? 0.2 : 0.8,
          scale: isActive ? 0.8 : 1,
          x: isActive ? 30 : 0 
        }}
        style={{ width: 64, height: 112 }}
      >
        <div className="h-full flex flex-col">
          <div className="h-4 bg-[#1a1a1a] flex items-center justify-center">
            <div className="w-8 h-1 bg-[#2a2a2a] rounded-full" />
          </div>
          <div className="flex-1 p-1 space-y-1">
            <div className="h-8 bg-[#00a8e8]/20 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-[#00a8e8]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </div>
            <div className="h-2 bg-[#2a2a2a] rounded w-3/4" />
            <div className="h-2 bg-[#2a2a2a] rounded w-1/2" />
          </div>
        </div>
      </motion.div>
      
      {/* HMI System Label */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#00a8e8]/10 border border-[#00a8e8]/30 rounded"
        animate={{
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 20,
        }}
      >
        <span className="text-sm text-[#00a8e8] font-mono">UMG HMI Dashboard System</span>
      </motion.div>
    </div>
  );
}
