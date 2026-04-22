'use client';

import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useMousePosition } from '../hooks/useMousePosition';
import { heroContent as defaultHeroContent } from '../config/content';
import { useContent } from '../ContentProvider';

const ParticleField = dynamic(() => import('../components/ParticleField'), {
  ssr: false,
});

const heroKeywords = ['Technical Art', 'Real-time Visuals', 'Workflow'];
const heroLinks = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Capabilities', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function Hero() {
  const mousePosition = useMousePosition();
  const { hero } = useContent();
  const heroData = hero || defaultHeroContent;
  const {
    badge,
    name,
    nameHighlightLength,
    subtitle,
    stats,
    cornerLeft,
    cornerRight,
  } = heroData;
  const leadingName = name.slice(0, nameHighlightLength);
  const trailingName = name.slice(nameHighlightLength);

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-transparent"
    >
      <div className="absolute inset-0 opacity-70">
        <ParticleField mousePosition={mousePosition} />
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, rgba(0,212,170,0.16) 0%, rgba(0,212,170,0.06) 28%, transparent 66%)',
          x: mousePosition.x ? mousePosition.x - 380 : 0,
          y: mousePosition.y ? mousePosition.y - 380 : 0,
        }}
        transition={{ type: 'spring', damping: 24, stiffness: 72 }}
      />

      <div className="relative z-10">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-10 pt-20 lg:px-12 lg:pb-14 lg:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-3 border-y border-white/10 py-4 text-[11px] uppercase tracking-[0.32em] text-white/40 lg:grid-cols-[1fr_auto_auto]"
          >
            <span>{badge}</span>
            <span>{cornerLeft}</span>
            <span>{cornerRight}</span>
          </motion.div>

          <div className="flex flex-1 items-center">
            <div className="grid w-full gap-16 py-12 lg:grid-cols-[minmax(0,1.16fr)_minmax(300px,0.84fr)] lg:py-16">
              <div className="space-y-10">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 }}
                  className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.32em] text-[#00d4aa]/82"
                >
                  {heroKeywords.map((keyword) => (
                    <span key={keyword}>{keyword}</span>
                  ))}
                </motion.div>

                <div>
                  <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.12 }}
                    className="max-w-lg text-sm uppercase tracking-[0.28em] text-white/34"
                  >
                    Technical artist profile
                  </motion.p>

                  <motion.h1
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.72, delay: 0.16 }}
                    className="font-display mt-5 max-w-5xl text-[clamp(4rem,11vw,8.8rem)] font-semibold leading-[0.88] tracking-[-0.08em] text-white"
                  >
                    <span className="text-[#00d4aa]">{leadingName}</span>
                    {trailingName}
                  </motion.h1>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.24 }}
                  className="max-w-3xl text-lg leading-8 text-white/64 md:text-[1.36rem] md:leading-9"
                >
                  {subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.32 }}
                  className="flex flex-wrap items-center gap-5 border-t border-white/10 pt-7"
                >
                  <a
                    href="#projects"
                    className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#06070a]"
                  >
                    <span className="bg-[#00d4aa] px-6 py-3">进入项目</span>
                    <ArrowDownRight className="h-4 w-4 text-[#00d4aa] transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1" />
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-white/52 transition-colors duration-300 hover:text-white"
                  >
                    联系我
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.4 }}
                  className="grid gap-5 border-t border-white/10 pt-8 md:grid-cols-3"
                >
                  {stats.map((stat, index) => (
                    <div key={stat.label} className="border-b border-white/8 pb-5 md:border-b-0 md:pb-0">
                      <p className="font-mono text-xs tracking-[0.24em] text-[#00d4aa]">
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <p className="mt-3 text-base text-white/68">{stat.label}</p>
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.aside
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.28 }}
                className="flex flex-col justify-between gap-10 lg:pl-10"
              >
                <div className="space-y-8 border-l border-white/10 pl-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/34">
                      Positioning
                    </p>
                    <p className="font-display mt-4 text-3xl leading-tight tracking-[-0.05em] text-white md:text-4xl">
                      从材质、特效、实时渲染到工具流程，一页看清我作为技术美术解决问题的方式。
                    </p>
                  </div>

                  <div className="space-y-3">
                    {heroLinks.map((link, index) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="flex items-center justify-between border-b border-white/8 pb-3 text-sm uppercase tracking-[0.26em] text-white/48 transition-colors duration-300 hover:text-white"
                      >
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <span>{link.label}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.32em] text-white/32 md:grid-cols-2">
                  <span>Scroll to selected work</span>
                  <span className="text-left text-[#00d4aa]/74 md:text-right">
                    Editorial layout
                  </span>
                </div>
              </motion.aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
