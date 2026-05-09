'use client';

import { motion } from 'framer-motion';
import { useContent } from '../ContentProvider';

export default function About() {
  const { about } = useContent();
  const content = about;

  return (
    <section id="about" className="py-32 px-6 md:px-12 lg:px-20">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-[#00d4aa] font-mono text-sm tracking-widest">
            ABOUT
          </span>
          <h2 className="text-5xl md:text-7xl font-display font-bold mt-4">
            关于我
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
              {content.bio[0]}
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
              <span className="text-white">{content.jobTitle}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-white/50 text-sm uppercase tracking-wide">Experience</span>
              <span className="text-white">{content.experience} 年</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/50 text-sm uppercase tracking-wide">Age</span>
              <span className="text-white">{content.age}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}