'use client';

import { Clock, Tag, Briefcase } from 'lucide-react';
import type { Project } from '@/app/types/content';

interface CardProps {
  project: Project;
  className?: string;
}

export function QuickInfoCard({ project, className }: CardProps) {
  const infoItems = [
    { icon: Clock, label: '项目周期', value: project.period },
    { icon: Tag, label: '项目类型', value: project.category },
    { icon: Briefcase, label: '所属公司', value: project.company },
  ];

  return (
    <div 
      className={`h-full p-6 rounded-2xl ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(30,30,40,0.6) 0%, rgba(15,15,20,0.8) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="space-y-4">
        {infoItems.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: `${project.color}10`,
              }}
            >
              <item.icon className="w-4 h-4" style={{ color: project.color }} />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">
                {item.label}
              </p>
              <p className="text-sm text-white/80 leading-tight line-clamp-2">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
