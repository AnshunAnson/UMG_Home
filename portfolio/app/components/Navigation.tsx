'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const sections = [
  { id: 'hero', label: '首页' },
  { id: 'skills', label: '技能' },
  { id: 'projects', label: '作品' },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id)
      })).filter(s => s.element) as { id: string; element: HTMLElement }[];
      
      const current = sectionElements.find(section => {
        const rect = section.element.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom >= 150;
      });
      
      if (current) {
        setActiveSection(current.id);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="px-6 md:px-12 lg:px-20 h-16 flex items-center justify-between w-full">
        <div className="text-xl font-bold text-white cursor-pointer" onClick={() => handleClick('hero')}>
          安顺
        </div>
        
        <div className="flex items-center gap-8">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleClick(section.id)}
              className={`text-sm transition-all duration-200 relative group ${
                activeSection === section.id ? 'text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {section.label}
              {activeSection === section.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#00d4aa]"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
