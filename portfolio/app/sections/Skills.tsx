'use client';

import { motion } from 'framer-motion';
import { skillsContent as defaultSkillsContent } from '../config/content';
import { useContent } from '../ContentProvider';

export default function Skills() {
  const { skills } = useContent();
  const content = skills || defaultSkillsContent;

  return (
    <section id="skills" className="relative border-t border-white/10 bg-transparent">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[minmax(240px,0.68fr)_minmax(0,1.32fr)]">
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
            <p className="mt-8 max-w-sm text-base leading-8 text-white/56">
              除了具体项目，我也把自己的能力拆成可组合的技术模块，方便在不同类型的产品、工具和实验任务里快速切换。
            </p>

            <div className="mt-12 border-y border-white/10 py-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/34">Toolchain</p>
              <p className="mt-4 text-sm leading-8 text-white/48">
                {content.techStack.join(' / ')}
              </p>
            </div>
          </motion.div>

          <div className="border-t border-white/10">
            {content.categories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-90px' }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.04 }}
                className="grid gap-8 border-b border-white/10 py-8 lg:grid-cols-[220px_minmax(0,1fr)]"
              >
                <div>
                  <p className="font-mono text-xs tracking-[0.24em] text-[#00d4aa]">
                    {String(categoryIndex + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-display mt-3 text-2xl tracking-[-0.04em] text-white">
                    {category.title}
                  </h3>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {category.skills.map((skill) => (
                    <div key={`${category.title}-${skill.name}`} className="space-y-3">
                      <div className="flex items-end justify-between gap-6">
                        <span className="text-base text-white/72">{skill.name}</span>
                        <span className="font-mono text-sm text-white/36">{skill.level}</span>
                      </div>
                      <div className="h-px bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.55 }}
                          className="h-px bg-gradient-to-r from-[#00d4aa] to-transparent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
