'use client';

import { motion } from 'framer-motion';
import { Code2, Globe, AtSign, Mail, ArrowUp } from 'lucide-react';
import { footerContent } from '../config/content';

// 图标映射
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Globe,
  AtSign,
  Mail,
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 bg-[#0d0d0d] border-t border-[#2a2a2a]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="text-xl font-bold text-white">
              {footerContent.logo}<span className="text-[#00d4aa]">{footerContent.logoHighlight}</span>
            </span>
            <p className="text-[#8a8a8a] text-sm mt-1">
              {footerContent.tagline}
            </p>
          </motion.div>

          {/* Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-8"
          >
            {footerContent.navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#8a8a8a] hover:text-[#00d4aa] transition-colors duration-200 text-sm"
              >
                {link.label}
              </a>
            ))}
          </motion.nav>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex gap-4"
          >
            {footerContent.socialLinks.map((social) => {
              const IconComponent = iconMap[social.icon];
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded bg-[#1a1a1a] border border-[#2a2a2a] 
                           flex items-center justify-center text-[#8a8a8a]
                           hover:border-[#00d4aa] hover:text-[#00d4aa]
                           transition-all duration-200"
                  whileHover={{ y: -2 }}
                  aria-label={social.label}
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                </motion.a>
              );
            })}
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-[#2a2a2a] text-center"
        >
          <p className="text-[#8a8a8a] text-sm">
            {footerContent.copyright}
          </p>
        </motion.div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-10 h-10 rounded bg-[#00d4aa] text-[#0d0d0d]
                 flex items-center justify-center shadow-lg
                 hover:bg-[#00b894] transition-colors duration-200 z-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="返回顶部"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
}
