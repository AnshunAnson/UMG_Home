'use client';

import { useEffect } from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';

// Sections
import Hero from './sections/Hero';
import About from './sections/About';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Contact from './sections/Contact';

export default function Home() {
  // Initialize smooth scrolling
  useSmoothScroll();

  return (
    <main className="bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Hero Section - 首屏 */}
      <Hero />

      {/* About Section - 关于我 */}
      <About />

      {/* Experience Section - 工作经历 */}
      <Experience />

      {/* Projects Section - 项目展示 */}
      <Projects />

      {/* Skills Section - 技能 */}
      <Skills />

      {/* Contact Section - 联系 */}
      <Contact />
    </main>
  );
}
