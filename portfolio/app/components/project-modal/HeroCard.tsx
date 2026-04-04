'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CardProps } from '@/app/types/project';
import { iconMap } from './iconMap';

export function HeroCard({ project, className }: CardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = project.images || [];
  const hasImages = images.length > 0;
  const IconComponent = iconMap[project.icon];

  const basePath = process.env.NODE_ENV === 'production' ? '/UMG_Home' : '';
  const resolvedImages = images.map(img => ({
    ...img,
    src: `${basePath}${img.src}`,
  }));

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className={`relative h-full min-h-[300px] lg:min-h-[400px] rounded-2xl overflow-hidden group ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(30,30,40,0.8) 0%, rgba(15,15,20,0.9) 100%)',
        border: `1px solid ${project.color}30`,
      }}
    >
      {hasImages ? (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center p-6"
            >
              <img
                src={resolvedImages[currentIndex].src}
                alt={resolvedImages[currentIndex].alt}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </motion.div>
          </AnimatePresence>

          {resolvedImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {resolvedImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      background: idx === currentIndex ? project.color : 'rgba(255,255,255,0.3)',
                      transform: idx === currentIndex ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div 
            className="w-24 h-24 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: `${project.color}15`,
              border: `1px solid ${project.color}40`,
              boxShadow: `0 0 40px ${project.color}20`,
            }}
          >
            {IconComponent && <IconComponent className="w-12 h-12" style={{ color: project.color }} />}
          </div>
          <p className="text-white/50 text-sm">暂无预览图片</p>
        </div>
      )}

      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: `inset 0 0 30px ${project.color}10`,
        }}
      />
    </div>
  );
}
