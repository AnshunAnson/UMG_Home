'use client';

import { motion } from 'framer-motion';
import { skillsContent as defaultSkillsContent } from '../config/content';
import { useContent } from '../ContentProvider';

function SkillTag({ skill, delay }: { skill: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="px-4 py-2 rounded-full border border-white/20 text-white/70 text-sm hover:border-[#00d4aa]/50 hover:text-[#00d4aa] transition-colors cursor-default"
    >
      {skill}
    </motion.span>
  );
}

export default function Skills() {
  const { skills } = useContent();
  const content = skills || defaultSkillsContent;

  return (
    <section id="skills" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-[#00d4aa] font-mono text-sm tracking-widest">
            CAPABILITIES
          </span>
          <h2 className="text-5xl md:text-7xl font-display font-bold mt-4">
            技术能力
          </h2>
        </motion.div>

        <div className="space-y-12">
          {content.categories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="bg-white/3 rounded-2xl border border-white/10 p-8"
            >
              <h3 className="text-xl font-bold text-white mb-6">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <SkillTag
                    key={skill.name}
                    skill={skill.name}
                    delay={skillIndex * 0.05}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-white/40 text-sm"
        >
          {content.techStack.join(' · ')}
        </motion.div>
      </div>
    </section>
  );
}