'use client';

import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { useContent } from '../ContentProvider';
import SectionHeader from '../components/SectionHeader';
import ContactCard from '../components/ContactCard';
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
            <ContactCard icon={Mail} label="Email" value={contact.email} href={`mailto:${contact.email}`} delay={0.2} />
            <ContactCard icon={Phone} label="Phone" value={contact.phone} href={`tel:${contact.phone}`} delay={0.3} />
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}
