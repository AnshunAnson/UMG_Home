'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  label: string;
  title: string;
}

export default function SectionHeader({ label, title }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <span className="text-[#00d4aa] font-mono text-sm tracking-widest">
        {label}
      </span>
      <h2 className="text-6xl md:text-8xl font-bold mt-4">
        {title}
      </h2>
    </motion.div>
  );
}
