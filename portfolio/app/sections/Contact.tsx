'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { contactContent as defaultContactContent } from '../config/content';
import { useContent } from '../ContentProvider';
import Footer from './Footer';

export default function Contact() {
  const { contact } = useContent();
  const content = contact || defaultContactContent;

  const contactRows = [
    { label: 'Email', value: content.email, href: `mailto:${content.email}` },
    { label: 'Phone', value: content.phone, href: `tel:${content.phone}` },
    { label: 'Base', value: content.location },
  ];

  return (
    <section id="contact" className="relative border-t border-white/10 bg-transparent">
      <div className="mx-auto max-w-7xl px-6 pt-24 lg:px-12 lg:pt-32">
        <div className="grid gap-16 border-y border-white/10 py-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(300px,0.72fr)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="text-xs uppercase tracking-[0.35em] text-[#00d4aa]">
              {content.sectionSubtitle}
            </p>
            <h2 className="font-display mt-5 text-[clamp(3.4rem,8vw,7.2rem)] font-semibold leading-[0.92] tracking-[-0.08em] text-white">
              {content.sectionTitle}
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-9 text-white/62 md:text-[1.18rem]">
              {content.description}
            </p>

            <a
              href={`mailto:${content.email}`}
              className="group mt-12 inline-flex max-w-full items-end gap-4 text-white transition-colors duration-300 hover:text-[#00d4aa]"
            >
              <span className="font-display break-all text-[clamp(2rem,5.4vw,4.6rem)] leading-[0.92] tracking-[-0.06em]">
                {content.email}
              </span>
              <ArrowUpRight className="mb-2 h-6 w-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="flex flex-col justify-between gap-10"
          >
            <div className="space-y-6 border-l border-white/10 pl-6">
              {contactRows.map((row) => (
                <div key={row.label} className="border-b border-white/8 pb-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/34">
                    {row.label}
                  </p>
                  {row.href ? (
                    <a
                      href={row.href}
                      className="mt-3 inline-block text-lg text-white/78 transition-colors duration-300 hover:text-[#00d4aa]"
                    >
                      {row.value}
                    </a>
                  ) : (
                    <p className="mt-3 text-lg text-white/78">{row.value}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-6 text-sm uppercase tracking-[0.28em] text-white/34">
              Open to technical collaboration across project delivery, interface systems,
              tools, visuals and validation work.
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </section>
  );
}
