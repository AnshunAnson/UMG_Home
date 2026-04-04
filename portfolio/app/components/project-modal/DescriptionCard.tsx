'use client';

import { FileText } from 'lucide-react';
import { CardProps } from '@/app/types/project';

export function DescriptionCard({ project, className }: CardProps) {
  return (
    <div 
      className={`h-full p-6 rounded-2xl ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(30,30,40,0.6) 0%, rgba(15,15,20,0.8) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4" style={{ color: project.color }} />
        <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider">
          项目描述
        </h3>
      </div>

      <p className="text-white/60 text-sm leading-relaxed">
        {project.description}
      </p>
    </div>
  );
}
