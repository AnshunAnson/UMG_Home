'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';
import { ExternalLink, X, Award, Car, Sparkles, Zap, Monitor, Gamepad2 } from 'lucide-react';
import { projectsContent as defaultProjectsContent } from '../config/content';
import { useContent } from '../ContentProvider';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  'Car': Car,
  'Sparkles': Sparkles,
  'Zap': Zap,
  'Award': Award,
  'Monitor': Monitor,
  'Gamepad2': Gamepad2,
};

export default function Projects() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const content = useContent();
  const projectsContent = content?.projects || defaultProjectsContent;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const { sectionTitle, sectionSubtitle, projects } = projectsContent;

  return (
    <section id="projects" className="py-24 relative bg-[#0a0a0f]" ref={sectionRef}>
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00d4aa]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d4aa]/3 rounded-full blur-[120px]" />
        </div>
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 212, 170, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 170, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-[2px] bg-[#00d4aa]" />
            <span className="text-[#8a8a8a] text-sm uppercase tracking-wider font-mono">
              {sectionSubtitle}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            {sectionTitle}
          </h2>
        </motion.div>

        {/* Asymmetric Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured Project - Car Rendering (Takes up 8 columns) */}
          <div className="lg:col-span-8">
            <FeaturedProjectCard
              project={projects[0]}
              isInView={isInView}
              index={0}
              isHovered={hoveredId === projects[0].id}
              onHover={() => setHoveredId(projects[0].id)}
              onLeave={() => setHoveredId(null)}
              onClick={() => setSelectedProject(projects[0])}
            />
          </div>

          {/* Side Projects Stack (Takes up 4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {projects.slice(1, 3).map((project, index) => (
              <SideProjectCard
                key={project.id}
                project={project}
                isInView={isInView}
                index={index + 1}
                isHovered={hoveredId === project.id}
                onHover={() => setHoveredId(project.id)}
                onLeave={() => setHoveredId(null)}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>

          {/* Bottom Full Width Project */}
          <div className="lg:col-span-12">
            <BottomProjectCard
              project={projects[3]}
              isInView={isInView}
              index={3}
              isHovered={hoveredId === projects[3]?.id}
              onHover={() => setHoveredId(projects[3]?.id || null)}
              onLeave={() => setHoveredId(null)}
              onClick={() => setSelectedProject(projects[3])}
            />
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// Project type
interface Project {
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
  color: string;
}

// Featured Project Card (Large)
interface FeaturedProjectCardProps {
  project: Project;
  isInView: boolean;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

function FeaturedProjectCard({ 
  project, 
  isInView, 
  index, 
  isHovered,
  onHover,
  onLeave,
  onClick 
}: FeaturedProjectCardProps) {
  const IconComponent = iconMap[project.icon] || Car;
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const rotX = (y - 0.5) * -8;
    const rotY = (x - 0.5) * 8;
    
    setRotateX(rotX);
    setRotateY(rotY);
    setMousePos({ x: x * 100, y: y * 100 });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
      className="h-full"
      style={{ perspective: '1000px' }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      <motion.div
        className="relative h-full min-h-[400px] rounded-2xl overflow-hidden cursor-pointer group"
        style={{
          background: 'linear-gradient(145deg, rgba(20,20,25,0.9) 0%, rgba(10,10,15,0.95) 100%)',
          border: `1px solid ${isHovered ? project.color : 'rgba(255,255,255,0.08)'}`,
          transformStyle: 'preserve-3d',
          transform: isHovered 
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0)',
          transition: 'transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease',
          boxShadow: isHovered ? `0 25px 50px -12px ${project.color}20, 0 0 80px ${project.color}10` : '0 25px 50px -12px rgba(0,0,0,0.5)',
        }}
      >
        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Gradient Background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${project.color}20 0%, transparent 50%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full p-8 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ 
                  background: `${project.color}15`,
                  border: `1px solid ${isHovered ? project.color : `${project.color}40`}`,
                }}
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <IconComponent className="w-7 h-7" style={{ color: project.color }} />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
                <span className="text-[#8a8a8a] text-sm font-mono">{project.period}</span>
              </div>
            </div>
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
          </div>

          {/* Description */}
          <p className="text-[#a0a0a0] mb-8 text-lg leading-relaxed">
            {project.description}
          </p>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-8 flex-1">
            {/* Work Content */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: project.color }} />
                工作内容
              </h4>
              <ul className="space-y-3">
                {project.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#8a8a8a] text-sm">
                    <span className="text-[#00d4aa] mt-0.5">›</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Achievements */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Award className="w-4 h-4" style={{ color: project.color }} />
                项目业绩
              </h4>
              <ul className="space-y-3">
                {project.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#8a8a8a] text-sm">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: project.color }} />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-3 py-1.5 rounded-md bg-white/5 text-[#8a8a8a] border border-white/10"
                >
                  {tech}
                </span>
              ))}
            </div>
            <motion.div 
              className="flex items-center gap-2 text-[#00d4aa]"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-sm font-medium">查看详情</span>
              <ExternalLink className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Side Project Card (Compact)
interface SideProjectCardProps {
  project: Project;
  isInView: boolean;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

function SideProjectCard({ 
  project, 
  isInView, 
  index, 
  isHovered,
  onHover,
  onLeave,
  onClick 
}: SideProjectCardProps) {
  const IconComponent = iconMap[project.icon] || Car;
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const rotX = (y - 0.5) * -6;
    const rotY = (x - 0.5) * 6;
    
    setRotateX(rotX);
    setRotateY(rotY);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
      style={{ perspective: '1000px' }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      <motion.div
        className="relative rounded-xl overflow-hidden cursor-pointer group h-full"
        style={{
          background: 'linear-gradient(145deg, rgba(20,20,25,0.9) 0%, rgba(10,10,15,0.95) 100%)',
          border: `1px solid ${isHovered ? project.color : 'rgba(255,255,255,0.08)'}`,
          transformStyle: 'preserve-3d',
          transform: isHovered 
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0)',
          transition: 'transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease',
          boxShadow: isHovered ? `0 20px 40px -10px ${project.color}15` : '0 10px 30px -10px rgba(0,0,0,0.5)',
        }}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <motion.div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ 
                background: `${project.color}15`,
                border: `1px solid ${project.color}40`,
              }}
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <IconComponent className="w-5 h-5" style={{ color: project.color }} />
            </motion.div>
            <ExternalLink className="w-4 h-4 text-[#8a8a8a] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
          <p className="text-[#8a8a8a] text-sm mb-4 line-clamp-2">{project.description}</p>

          {/* Tech Tags */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.tech.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-2 py-1 rounded bg-white/5 text-[#8a8a8a] border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Hover Glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${project.color}10 0%, transparent 60%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// Bottom Project Card (Wide)
interface BottomProjectCardProps {
  project: Project;
  isInView: boolean;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

function BottomProjectCard({ 
  project, 
  isInView, 
  index, 
  isHovered,
  onHover,
  onLeave,
  onClick 
}: BottomProjectCardProps) {
  const IconComponent = iconMap[project.icon] || Car;
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const rotX = (y - 0.5) * -5;
    const rotY = (x - 0.5) * 5;
    
    setRotateX(rotX);
    setRotateY(rotY);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
      style={{ perspective: '1000px' }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      <motion.div
        className="relative rounded-xl overflow-hidden cursor-pointer group"
        style={{
          background: 'linear-gradient(145deg, rgba(20,20,25,0.9) 0%, rgba(10,10,15,0.95) 100%)',
          border: `1px solid ${isHovered ? project.color : 'rgba(255,255,255,0.08)'}`,
          transformStyle: 'preserve-3d',
          transform: isHovered 
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0)',
          transition: 'transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease',
          boxShadow: isHovered ? `0 20px 40px -10px ${project.color}15` : '0 10px 30px -10px rgba(0,0,0,0.5)',
        }}
      >
        <div className="p-6 flex items-center gap-6">
          {/* Icon */}
          <motion.div 
            className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ 
              background: `${project.color}15`,
              border: `1px solid ${project.color}40`,
            }}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <IconComponent className="w-8 h-8" style={{ color: project.color }} />
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-white">{project.title}</h3>
              <span 
                className="text-xs font-mono px-2 py-0.5 rounded border"
                style={{ 
                  color: project.color,
                  borderColor: `${project.color}40`,
                  background: `${project.color}10`,
                }}
              >
                {project.category}
              </span>
            </div>
            <p className="text-[#8a8a8a] text-sm">{project.description}</p>
          </div>

          {/* Tech Stack */}
          <div className="hidden md:flex flex-wrap gap-2 max-w-[200px]">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-1 rounded bg-white/5 text-[#8a8a8a] border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Arrow */}
          <motion.div
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ExternalLink className="w-5 h-5 text-[#8a8a8a] group-hover:text-[#00d4aa] transition-colors" />
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5"
          style={{ background: project.color }}
          initial={{ width: '0%' }}
          animate={{ width: isHovered ? '100%' : '0%' }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </motion.div>
  );
}

// Project Modal
interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
  const IconComponent = iconMap[project.icon] || Car;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0f]/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, rgba(20,20,25,0.98) 0%, rgba(10,10,15,0.99) 100%)',
          border: `1px solid ${project.color}40`,
          boxShadow: `0 25px 50px -12px ${project.color}20`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 pb-0">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ 
                  background: `${project.color}15`,
                  border: `1px solid ${project.color}40`,
                }}
              >
                <IconComponent className="w-7 h-7" style={{ color: project.color }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
                <span className="text-[#8a8a8a] text-sm font-mono">
                  {project.period}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8a8a8a]
                       hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <span 
            className="inline-block text-sm font-mono px-3 py-1 rounded-full border mb-6"
            style={{ 
              color: project.color,
              borderColor: `${project.color}40`,
              background: `${project.color}10`,
            }}
          >
            {project.category}
          </span>

          <p className="text-[#a0a0a0] mb-8">{project.description}</p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 space-y-8">
          {/* Work Content */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: project.color }} />
              工作内容
            </h4>
            <ul className="space-y-3">
              {project.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-3 text-[#8a8a8a]">
                  <span className="text-[#00d4aa] mt-1">›</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Achievements */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Award className="w-4 h-4" style={{ color: project.color }} />
              项目业绩
            </h4>
            <ul className="space-y-3">
              {project.achievements.map((achievement, i) => (
                <li key={i} className="flex items-start gap-3 text-[#8a8a8a]">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: project.color }} />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-white font-semibold mb-4">技术栈</h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="text-sm px-4 py-2 rounded-lg bg-white/5 text-[#8a8a8a] border border-white/10
                           hover:border-[#00d4aa]/50 hover:text-white transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
