'use client';

import { motion } from 'framer-motion';
import { aboutContent as defaultAboutContent } from '../config/content';
import { useContent } from '../ContentProvider';

export default function About() {
  const { about } = useContent();
  const content = about || defaultAboutContent;
  const leadParagraph = content.bio[0] || '';
  const supportingParagraphs = content.bio.slice(1);

  return (
    <section id="about" className="relative border-t border-white/10 bg-transparent">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[minmax(220px,0.72fr)_minmax(0,1.28fr)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-20 lg:self-start"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-[#00d4aa]">
              {content.sectionSubtitle}
            </p>
            <h2 className="font-display mt-5 text-4xl font-semibold tracking-[-0.06em] text-white md:text-6xl">
              {content.sectionTitle}
            </h2>

            <div className="mt-10 space-y-4 border-y border-white/10 py-6 text-sm text-white/44">
              <div className="flex items-center justify-between gap-6">
                <span className="uppercase tracking-[0.2em]">Role</span>
                <span className="text-right text-white/74">{content.jobTitle}</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="uppercase tracking-[0.2em]">Experience</span>
                <span className="text-right text-white/74">{content.experience} 年</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="uppercase tracking-[0.2em]">Age</span>
                <span className="text-right text-white/74">{content.age}</span>
              </div>
            </div>
          </motion.div>

          <div className="space-y-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="space-y-8"
            >
              <p className="font-display max-w-5xl text-3xl leading-tight tracking-[-0.05em] text-white md:text-5xl">
                {leadParagraph}
              </p>

              {supportingParagraphs.map((paragraph, index) => (
                <p
                  key={`about-bio-${index}`}
                  className="max-w-4xl text-lg leading-9 text-white/62 md:text-[1.18rem]"
                >
                  {paragraph}
                </p>
              ))}
            </motion.div>

            <div className="grid gap-6 border-t border-white/10 pt-8 md:grid-cols-2">
              {content.coreSkills.map((skill, index) => (
                <motion.div
                  key={skill.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="border-b border-white/8 pb-6"
                >
                  <p className="font-mono text-xs tracking-[0.24em] text-[#00d4aa]">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-3 text-xl font-medium text-white">{skill.title}</p>
                  <p className="mt-3 text-base leading-8 text-white/56">
                    {skill.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
