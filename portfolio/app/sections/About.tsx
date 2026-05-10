'use client';

import { motion } from 'framer-motion';
import { useContent } from '../ContentProvider';
import SectionHeader from '../components/SectionHeader';

export default function About() {
  const { about } = useContent();

  return (
    <section id="about" className="py-32 px-6 md:px-12 lg:px-20">
      <div className="w-full">
        <SectionHeader label="ABOUT" title="关于我" />

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
              {about.bio[0]}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white/3 rounded-2xl border border-white/10 p-8 space-y-6"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-white/50 text-sm uppercase tracking-wide">Role</span>
              <span className="text-white">{about.jobTitle}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-white/50 text-sm uppercase tracking-wide">Experience</span>
              <span className="text-white">{about.experience} 年</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/50 text-sm uppercase tracking-wide">Age</span>
              <span className="text-white">{about.age}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}