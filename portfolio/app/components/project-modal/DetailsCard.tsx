'use client';

import { motion } from 'framer-motion';
import { ListTodo } from 'lucide-react';
import type { Project } from '@/app/types/content';

interface CardProps {
  project: Project;
  className?: string;
}

export function DetailsCard({ project, className }: CardProps) {
  return (
    <div 
      className={`h-full p-6 rounded-2xl ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(30,30,40,0.6) 0%, rgba(15,15,20,0.8) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <ListTodo className="w-4 h-4" style={{ color: project.color }} />
        <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider">
          工作内容
        </h3>
      </div>

      <ul className="space-y-3">
        {project.details.map((detail, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 group"
          >
            <span 
              className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 transition-all group-hover:scale-150"
              style={{ background: project.color }}
            />
            <span className="text-white/70 text-sm leading-relaxed group-hover:text-white/90 transition-colors">
              {detail}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
