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
    <>
      {/* Skip Link - 跳转到主要内容 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#00d4aa] focus:text-black focus:font-semibold focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:ring-offset-2 focus:ring-offset-[#0a0a0f]"
      >
        跳转到主要内容
      </a>

      <main id="main-content" className="bg-[#0a0a0f] text-white overflow-x-hidden">
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
    </>
  );
}
