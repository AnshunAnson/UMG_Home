'use client';

import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { ExternalLink } from 'lucide-react';
import { fadeInUp, viewportConfigSmall } from '../lib/animations';

// 项目数据类型
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
  index: number;
  isInView: boolean;
  onSelect: (project: Project) => void;
  variant?: 'featured' | 'side' | 'bottom';
  iconMap: Record<string, React.ComponentType<{ className?: string }>>;
}

export default function ProjectCard({
  project,
  index,
  isInView,
  onSelect,
  variant = 'side',
  iconMap,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePosition({ x: -y, y: x });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  }, []);

  const IconComponent = iconMap[project.icon];

  // 根据变体设置样式
  const getVariantStyles = () => {
    switch (variant) {
      case 'featured':
        return 'md:col-span-8 md:row-span-2';
      case 'side':
        return 'md:col-span-4';
      case 'bottom':
        return 'md:col-span-12';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={fadeInUp.initial}
      animate={isInView ? fadeInUp.animate : fadeInUp.initial}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.15 }}
      viewport={viewportConfigSmall}
      className={getVariantStyles()}
    >
      <motion.div
        className="relative h-full bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 
                   cursor-pointer overflow-hidden group"
        style={{
          transform: isHovered
            ? `rotateX(${mousePosition.x}deg) rotateY(${mousePosition.y}deg) translateZ(10px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0)',
          transition: 'transform 0.15s ease-out, border-color 0.3s ease',
          borderColor: isHovered ? `${project.color}30` : undefined,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect(project)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Hover Glow Effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x * 20 + 50}% ${mousePosition.y * 20 + 50}%, ${project.color}10, transparent 40%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${project.color}15` }}
            >
              {IconComponent && <IconComponent className="w-6 h-6" />}
            </div>
            <motion.div
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1, borderColor: project.color }}
            >
              <ExternalLink className="w-4 h-4" style={{ color: project.color }} />
            </motion.div>
          </div>

          {/* Title & Meta */}
          <div className="mb-4">
            <span className="text-xs text-[#6b7280] font-mono">{project.period}</span>
            <h3 className="text-xl font-bold text-white mt-1 group-hover:text-[#00d4aa] transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-[#6b7280] mt-1">{project.company}</p>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.category.split(' / ').map((cat, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-full border border-white/10 text-[#9ca3af]"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm text-[#9ca3af] mb-4 flex-grow line-clamp-3">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tech.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-md font-mono"
                style={{
                  backgroundColor: `${project.color}10`,
                  color: project.color,
                }}
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-md text-[#6b7280]">
                +{project.tech.length - 3}
              </span>
            )}
          </div>

          {/* Achievements Preview */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex flex-wrap gap-2">
              {project.achievements.slice(0, 2).map((achievement, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-full bg-[#00d4aa]/5 text-[#00d4aa] border border-[#00d4aa]/10"
                >
                  {achievement}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
