'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ProjectSectionProps {
  index: number;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  achievements: string[];
  themeColor: string;
  Scene3D: React.ComponentType<{ isActive: boolean; scrollProgress: number }>;
  scenePosition: 'left' | 'right' | 'center';
  onViewDetails?: () => void;
}

export default function ProjectSection({
  index,
  title,
  subtitle,
  description,
  tech,
  achievements,
  themeColor,
  Scene3D,
  scenePosition,
  onViewDetails,
}: ProjectSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.5 });

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (!sectionRef.current || !contentRef.current || !sceneRef.current) return;

    const ctx = gsap.context(() => {
      // Content animation
      gsap.fromTo(
        contentRef.current,
        { 
          opacity: 0, 
          x: scenePosition === 'left' ? 100 : -100 
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'center center',
            scrub: 1,
          },
        }
      );

      // Scene animation
      gsap.fromTo(
        sceneRef.current,
        { 
          opacity: 0, 
          scale: 0.8,
          x: scenePosition === 'left' ? -100 : 100 
        },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'center center',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [scenePosition]);

  const isSceneLeft = scenePosition === 'left';
  const isSceneCenter = scenePosition === 'center';

  return (
    <section
      ref={sectionRef}
      id={`project-section-${index}`}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at ${isSceneLeft ? 'right' : 'left'} center, ${themeColor}08 0%, transparent 50%), #0a0a0f`,
      }}
    >
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(${themeColor}20 1px, transparent 1px),
            linear-gradient(90deg, ${themeColor}20 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className={`flex items-center gap-12 ${isSceneCenter ? 'flex-col text-center' : isSceneLeft ? 'flex-row-reverse' : 'flex-row'}`}>
          
          {/* Text Content */}
          <motion.div
            ref={contentRef}
            className={`flex-1 ${isSceneCenter ? 'max-w-2xl' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0.3 }}
            transition={{ duration: 0.8 }}
          >
            {/* Project Number */}
            <div 
              className="text-8xl font-bold font-mono mb-4 opacity-20"
              style={{ color: themeColor }}
            >
              {String(index + 1).padStart(2, '0')}
            </div>

            {/* Subtitle */}
            <motion.p
              className="text-sm uppercase tracking-[0.3em] mb-4"
              style={{ color: themeColor }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {subtitle}
            </motion.p>

            {/* Title */}
            <motion.h2
              className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {title}
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-lg text-gray-400 mb-8 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {description}
            </motion.p>

            {/* Tech Stack */}
            <motion.div
              className="flex flex-wrap gap-3 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {tech.map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 text-sm font-mono rounded-full border"
                  style={{
                    borderColor: `${themeColor}40`,
                    color: themeColor,
                    background: `${themeColor}10`,
                  }}
                >
                  {item}
                </span>
              ))}
            </motion.div>

            {/* Achievements */}
            <motion.div
              className="space-y-2 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {achievements.slice(0, 2).map((achievement, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-400">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ background: themeColor }}
                  />
                  <span className="text-sm">{achievement}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.button
              onClick={onViewDetails}
              className="group flex items-center gap-3 px-8 py-4 rounded-full font-medium transition-all duration-300"
              style={{
                background: themeColor,
                color: '#0a0a0f',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              查看详情
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* 3D Scene */}
          <motion.div
            ref={sceneRef}
            className={`${isSceneCenter ? 'w-full h-[50vh]' : 'flex-1 h-[60vh]'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0.5 }}
            transition={{ duration: 0.8 }}
          >
            <Scene3D isActive={isInView} scrollProgress={0} />
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${themeColor}40, transparent)`,
        }}
      />
    </section>
  );
}
