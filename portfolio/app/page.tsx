'use client';

import { useSmoothScroll } from './hooks/useSmoothScroll';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
import About from './sections/About';
import Skills from './sections/Skills';
import Contact from './sections/Contact';

export default function Home() {
  useSmoothScroll();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#00d4aa] focus:text-black focus:font-semibold focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:ring-offset-2 focus:ring-offset-[#0a0a0f]"
      >
        跳转到主要内容
      </a>

      <main
        id="main-content"
        className="relative overflow-x-hidden bg-transparent text-white"
      >
        <div className="pointer-events-none fixed inset-y-0 left-6 z-0 hidden w-px bg-white/[0.05] lg:block" />
        <div className="pointer-events-none fixed inset-y-0 right-6 z-0 hidden w-px bg-white/[0.05] lg:block" />
        <Hero />
        <Projects />
        <About />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
