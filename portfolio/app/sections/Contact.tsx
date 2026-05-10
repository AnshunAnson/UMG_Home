'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import { useContent } from '../ContentProvider';
import SectionHeader from '../components/SectionHeader';
import Footer from './Footer';

export default function Contact() {
  const { contact } = useContent();

  return (
    <section id="contact" className="py-32 px-6 md:px-12 lg:px-20">
      <div className="w-full">
        <SectionHeader label="GET IN TOUCH" title="联系我" />

        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl md:text-2xl text-white/70 mb-12 leading-relaxed"
          >
            {contact.description}
          </motion.p>

          <div className="space-y-6">
            <motion.a
              href={`mailto:${contact.email}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group flex items-center gap-4 p-6 rounded-2xl bg-white/3 border border-white/10 hover:border-[#00d4aa]/30 transition-all"
            >
              <Mail className="w-6 h-6 text-[#00d4aa]" />
              <div className="flex-1">
                <p className="text-white/50 text-sm uppercase tracking-wide mb-1">Email</p>
                <p className="text-xl text-white group-hover:text-[#00d4aa] transition-colors">
                  {contact.email}
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-[#00d4aa] transition-colors group-hover:translate-x-1 group-hover:-translate-y-1" />
            </motion.a>

            <motion.a
              href={`tel:${contact.phone}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group flex items-center gap-4 p-6 rounded-2xl bg-white/3 border border-white/10 hover:border-[#00d4aa]/30 transition-all"
            >
              <Phone className="w-6 h-6 text-[#00d4aa]" />
              <div className="flex-1">
                <p className="text-white/50 text-sm uppercase tracking-wide mb-1">Phone</p>
                <p className="text-xl text-white group-hover:text-[#00d4aa] transition-colors">
                  {contact.phone}
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-[#00d4aa] transition-colors group-hover:translate-x-1 group-hover:-translate-y-1" />
            </motion.a>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}