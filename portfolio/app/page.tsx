'use client';

import { useSmoothScroll } from './hooks/useSmoothScroll';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Footer from './sections/Footer';

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
        className="relative overflow-x-hidden bg-transparent text-white pt-16"
      >
        <Hero />
        <Skills />
        <Projects />
        <Footer />
      </main>
    </>
  );
}