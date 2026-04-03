'use client';

import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { ExternalLink } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const viewportConfigSmall = {
  once: true,
  amount: 0.3,
};

export interface Project {
  id: number;
  icon: string;
  title: string;
  company: string;
  period: string;
  category: string;
  description: string;
  details: string[];
  achievements: string[];
  tech: string[];
  featured: boolean;
  color: string;
}

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);

  return (
    <motion.div
      ref={() => setIsInView(true)}
      initial={fadeInUp.initial}
      animate={isInView ? fadeInUp.animate : fadeInUp.initial}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={viewportConfigSmall}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: 'linear-gradient(145deg, rgba(20,20,25,0.9) 0%, rgba(10,10,15,0.95) 100%)',
        border: `1px solid ${isHovered ? project.color : 'rgba(255,255,255,0.08)'}`,
        transition: 'border-color 0.3s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${project.color}10 0%, transparent 60%)`,
        }}
      />
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-4">
          <span
            className="text-xs font-mono px-3 py-1 rounded-full border"
            style={{
              color: project.color,
              borderColor: `${project.color}40`,
              background: `${project.color}10`,
            }}
          >
            {project.category}
          </span>
          <ExternalLink
            className="w-5 h-5 text-[#8a8a8a] opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: isHovered ? project.color : undefined }}
          />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
        <p className="text-[#8a8a8a] text-sm mb-1">{project.company}</p>
        <p className="text-[#5a5a6a] text-xs font-mono mb-4">{project.period}</p>
        <p className="text-[#a0a0a0] text-sm leading-relaxed line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tech.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[10px] px-2 py-1 rounded bg-white/5 text-[#8a8a8a] border border-white/10"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
