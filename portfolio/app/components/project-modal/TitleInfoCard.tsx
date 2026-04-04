'use client';

import { Building2, Calendar } from 'lucide-react';
import type { Project } from '@/app/types/content';

interface CardProps {
  project: Project;
  className?: string;
}
import { iconMap } from './iconMap';

export function TitleInfoCard({ project, className }: CardProps) {
  const IconComponent = iconMap[project.icon];

  return (
    <div 
      className={`h-full p-6 rounded-2xl ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(30,30,40,0.6) 0%, rgba(15,15,20,0.8) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: `${project.color}15`,
            border: `1px solid ${project.color}40`,
          }}
        >
          {IconComponent && <IconComponent className="w-5 h-5" style={{ color: project.color }} />}
        </div>
        <span 
          className="text-xs font-mono px-2 py-1 rounded-full"
          style={{
            color: project.color,
            background: `${project.color}15`,
            border: `1px solid ${project.color}30`,
          }}
        >
          {project.category}
        </span>
      </div>

      <h2 className="text-xl lg:text-2xl font-bold text-white mb-3 leading-tight">
        {project.title}
      </h2>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Building2 className="w-4 h-4" style={{ color: project.color }} />
          <span>{project.company}</span>
        </div>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Calendar className="w-4 h-4" style={{ color: project.color }} />
          <span>{project.period}</span>
        </div>
      </div>
    </div>
  );
}
