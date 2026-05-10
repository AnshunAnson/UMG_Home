'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ContactCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
  delay: number;
}

export default function ContactCard({ icon: Icon, label, value, href, delay }: ContactCardProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group flex items-center gap-4 p-6 rounded-2xl bg-white/3 border border-white/10 hover:border-[#00d4aa]/30 transition-all"
    >
      <Icon className="w-6 h-6 text-[#00d4aa]" />
      <div className="flex-1">
        <p className="text-white/50 text-sm uppercase tracking-wide mb-1">{label}</p>
        <p className="text-xl text-white group-hover:text-[#00d4aa] transition-colors">{value}</p>
      </div>
      <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-[#00d4aa] transition-colors group-hover:translate-x-1 group-hover:-translate-y-1" />
    </motion.a>
  );
}
