'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ModalProps } from '@/app/types/project';

export function ModalHeader({ project, onClose }: ModalProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
      <div className="flex items-center gap-3">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ background: project.color, boxShadow: `0 0 10px ${project.color}` }}
        />
        <span className="text-white/40 text-sm font-mono">PROJECT #{project.id.toString().padStart(2, '0')}</span>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
      >
        <X className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
