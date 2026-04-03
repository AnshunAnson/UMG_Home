'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectSection from './components/ProjectSection';
import ProjectNavigation from './components/ProjectNavigation';
import ScrollController from './components/ScrollController';
import { projectsContent } from '../config/content';

// Import 3D scenes
import {
  Car3DScene,
  Particle3DScene,
  Design3DScene,
  Weapon3DScene,
  UI3DScene,
} from '../components/3d-scenes';

// Project configurations
const projects = [
  {
    ...projectsContent.projects[0],
    subtitle: 'Digital Cockpit',
    scene: Car3DScene,
    scenePosition: 'right' as const,
    themeColor: '#00d4aa',
  },
  {
    ...projectsContent.projects[1],
    subtitle: 'Particle Symphony',
    scene: Particle3DScene,
    scenePosition: 'left' as const,
    themeColor: '#00a8e8',
  },
  {
    ...projectsContent.projects[2],
    subtitle: 'Design Excellence',
    scene: Design3DScene,
    scenePosition: 'right' as const,
    themeColor: '#9d4edd',
  },
  {
    ...projectsContent.projects[3],
    subtitle: 'Combat Zone',
    scene: Weapon3DScene,
    scenePosition: 'center' as const,
    themeColor: '#ff6b35',
  },
  {
    ...projectsContent.projects[4],
    subtitle: 'Interface Revolution',
    scene: UI3DScene,
    scenePosition: 'center' as const,
    themeColor: '#ff006e',
  },
];

export default function ProjectsPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle section change
  const handleSectionChange = useCallback((index: number) => {
    setCurrentSection(index);
  }, []);

  // Handle progress change
  const handleProgressChange = useCallback((progress: number) => {
    setScrollProgress(progress);
  }, []);

  // Scroll to specific section
  const scrollToSection = useCallback((index: number) => {
    const targetY = index * window.innerHeight;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  }, []);

  // Initialize GSAP ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Create scroll triggers for each section
    projects.forEach((_, index) => {
      ScrollTrigger.create({
        trigger: `#project-section-${index}`,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setCurrentSection(index),
        onEnterBack: () => setCurrentSection(index),
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main ref={containerRef} className="relative bg-[#0a0a0f]">
      {/* Scroll Controller */}
      <ScrollController
        totalSections={projects.length}
        onSectionChange={handleSectionChange}
        onProgressChange={handleProgressChange}
      />

      {/* Project Sections */}
      {projects.map((project, index) => (
        <ProjectSection
          key={project.id}
          index={index}
          title={project.title}
          subtitle={project.subtitle}
          description={project.description}
          tech={project.tech}
          achievements={project.achievements}
          themeColor={project.themeColor}
          Scene3D={project.scene}
          scenePosition={project.scenePosition}
        />
      ))}

      {/* Navigation */}
      <ProjectNavigation
        total={projects.length}
        current={currentSection}
        onNavigate={scrollToSection}
        themeColors={projects.map((p) => p.themeColor)}
      />

      {/* Back to Home Link */}
      <a
        href="/"
        className="fixed top-8 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all"
      >
        <span className="text-sm">返回首页</span>
      </a>
    </main>
  );
}
