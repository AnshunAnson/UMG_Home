'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useContent } from '../ContentProvider';

export default function Hero() {
  const { hero, about } = useContent();
  const { name, nameHighlightLength, subtitle } = hero;
  const leadingName = name.slice(0, nameHighlightLength);
  const trailingName = name.slice(nameHighlightLength);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#00d4aa]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#506dff]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-6 md:px-12 lg:px-20 py-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[#00d4aa] font-mono text-sm tracking-widest"
            >
              TECHNICAL ARTIST
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight"
            >
              <span className="text-[#00d4aa]">{leadingName}</span>
              <span className="text-white/90">{trailingName}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl md:text-2xl text-white/50 max-w-2xl leading-relaxed"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-4"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white/40 text-sm uppercase tracking-wider">Role</span>
                <span className="text-white/80 text-sm">{about.jobTitle}</span>
              </div>
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white/40 text-sm uppercase tracking-wider">经验</span>
                <span className="text-white/80 text-sm">{about.experience} 年</span>
              </div>
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white/40 text-sm uppercase tracking-wider">年龄</span>
                <span className="text-white/80 text-sm">{about.age}</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors"
            >
              <span className="text-sm font-medium tracking-wide">探索作品</span>
              <ArrowDown className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
