'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useCallback } from 'react';
import type { Project } from '@/app/types/content';
import { ModalHeader } from './ModalHeader';
import { BentoGrid } from './BentoGrid';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeIn' }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0f]/95 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ 
          duration: 0.3, 
          ease: [0.22, 1, 0.36, 1]
        }}
        className="relative w-full max-w-7xl max-h-[90vh] overflow-hidden rounded-3xl"
        style={{
          background: 'linear-gradient(145deg, rgba(20,20,28,0.95) 0%, rgba(10,10,15,0.98) 100%)',
          border: '1px solid rgba(0, 240, 255, 0.15)',
          boxShadow: `
            0 0 80px ${project.color}15,
            0 25px 50px -12px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.05)
          `,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${project.color}10 0%, transparent 50%, ${project.color}05 100%)`,
          }}
        />
        
        <div 
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${project.color} 50%, transparent 100%)`,
          }}
        />

        <div className="relative z-10 flex flex-col max-h-[90vh]">
          <ModalHeader project={project} onClose={onClose} />
          
          <div className="overflow-y-auto custom-scrollbar">
            <BentoGrid project={project} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
