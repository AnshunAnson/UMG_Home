'use client';

import { motion } from 'framer-motion';
import { footerContent as defaultFooterContent } from '../config/content';
import { useContent } from '../ContentProvider';

export default function Footer() {
  const { footer } = useContent();
  const content = footer || defaultFooterContent;

  return (
    <footer className="bg-transparent">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-12 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <p className="font-display text-2xl font-semibold tracking-[-0.05em] text-white">
              {content.logo}
              <span className="text-[#00d4aa]">{content.logoHighlight}</span>
            </p>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/42">{content.tagline}</p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2">
            <motion.nav
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.06 }}
              className="flex flex-wrap gap-x-6 gap-y-2 text-sm uppercase tracking-[0.22em] text-white/50"
            >
              {content.navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </motion.nav>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="flex flex-wrap gap-x-6 gap-y-2 text-sm uppercase tracking-[0.22em] text-white/50"
            >
              {content.socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="transition-colors duration-300 hover:text-white"
                >
                  {social.label}
                </a>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/8 pt-6 text-sm text-white/34 md:flex-row md:items-center md:justify-between">
          <p>{content.copyright}</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-left uppercase tracking-[0.24em] transition-colors duration-300 hover:text-white"
          >
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
