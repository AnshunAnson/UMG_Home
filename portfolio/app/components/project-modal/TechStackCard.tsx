'use client';

import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { CardProps } from '@/app/types/project';

export function TechStackCard({ project, className }: CardProps) {
  return (
    <div 
      className={`h-full p-6 rounded-2xl ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(30,30,40,0.6) 0%, rgba(15,15,20,0.8) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-4 h-4" style={{ color: project.color }} />
        <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider">
          技术栈
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {project.tech.map((tech, index) => (
          <motion.span
            key={tech}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105 cursor-default"
            style={{
              background: `${project.color}10`,
              color: project.color,
              border: `1px solid ${project.color}30`,
            }}
            whileHover={{
              background: `${project.color}20`,
              boxShadow: `0 0 15px ${project.color}30`,
            }}
          >
            {tech}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
