'use client';

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { CardProps } from '@/app/types/project';

export function AchievementsCard({ project, className }: CardProps) {
  return (
    <div 
      className={`h-full p-6 rounded-2xl ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(30,30,40,0.6) 0%, rgba(15,15,20,0.8) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <Trophy className="w-4 h-4" style={{ color: project.color }} />
        <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider">
          项目业绩
        </h3>
      </div>

      <ul className="space-y-3">
        {project.achievements.map((achievement, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 group"
          >
            <span 
              className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ 
                background: `${project.color}20`,
                color: project.color,
              }}
            >
              {index + 1}
            </span>
            <span className="text-white/70 text-sm leading-relaxed group-hover:text-white/90 transition-colors">
              {achievement}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
