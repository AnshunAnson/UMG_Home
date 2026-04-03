'use client';

import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollControllerProps {
  onProgressChange?: (progress: number) => void;
  onSectionChange?: (index: number) => void;
  totalSections: number;
}

export default function ScrollController({
  onProgressChange,
  onSectionChange,
  totalSections,
}: ScrollControllerProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const currentSectionRef = useRef(0);
  const isScrollingRef = useRef(false);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // Calculate current section based on scroll position
  const calculateSection = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const section = Math.round(scrollY / windowHeight);
    return Math.max(0, Math.min(section, totalSections - 1));
  }, [totalSections]);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollY / docHeight;
      onProgressChange?.(progress);

      const newSection = calculateSection();
      if (newSection !== currentSectionRef.current) {
        currentSectionRef.current = newSection;
        onSectionChange?.(newSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [calculateSection, onProgressChange, onSectionChange]);

  // Scroll to specific section
  const scrollToSection = useCallback((index: number) => {
    if (isScrollingRef.current || !lenisRef.current) return;
    
    isScrollingRef.current = true;
    const targetY = index * window.innerHeight;
    
    lenisRef.current.scrollTo(targetY, {
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1500);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrollingRef.current) return;

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          scrollToSection(Math.min(currentSectionRef.current + 1, totalSections - 1));
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          scrollToSection(Math.max(currentSectionRef.current - 1, 0));
          break;
        case 'Home':
          e.preventDefault();
          scrollToSection(0);
          break;
        case 'End':
          e.preventDefault();
          scrollToSection(totalSections - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToSection, totalSections]);

  // Wheel event with snap
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout;
    
    const handleWheel = (e: WheelEvent) => {
      if (isScrollingRef.current) {
        e.preventDefault();
        return;
      }

      clearTimeout(wheelTimeout);
      
      wheelTimeout = setTimeout(() => {
        const direction = e.deltaY > 0 ? 1 : -1;
        const newSection = currentSectionRef.current + direction;
        
        if (newSection >= 0 && newSection < totalSections) {
          scrollToSection(newSection);
        }
      }, 50);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [scrollToSection, totalSections]);

  // Touch events for mobile
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrollingRef.current) return;
      
      touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      
      if (Math.abs(diff) > 50) {
        const direction = diff > 0 ? 1 : -1;
        const newSection = currentSectionRef.current + direction;
        
        if (newSection >= 0 && newSection < totalSections) {
          scrollToSection(newSection);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollToSection, totalSections]);

  return null;
}

// Hook to use scroll progress in child components
export function useScrollProgress(sectionIndex: number) {
  const progressRef = useRef(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: `#project-section-${sectionIndex}`,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    return () => trigger.kill();
  }, [sectionIndex]);

  return progressRef;
}
