'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { projectsContent as defaultProjectsContent } from '../config/content';
import { useContent } from '../ContentProvider';
import type { Project } from '../types/content';

const basePath = process.env.NODE_ENV === 'production' ? '/UMG_Home' : '';

function resolveAssetPath(src: string) {
  if (!src.startsWith('/')) {
    return src;
  }
  return `${basePath}${src}`;
}

function ProjectPreviewRail({ project }: { project: Project }) {
  const images = project.images || [];

  if (!images.length) {
    return null;
  }

  return (
    <div className="space-y-3 border-t border-white/10 pt-6">
      <p className="text-xs uppercase tracking-[0.28em] text-white/34">
        项目预览 {images.length > 1 ? `(${images.length})` : ''}
      </p>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {images.map((image, index) => (
          <motion.figure
            key={`${project.id}-preview-${index}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            className="group"
          >
            <div className="relative aspect-[16/10] overflow-hidden border border-white/10 bg-white/[0.03]">
              <Image
                src={resolveAssetPath(image.src)}
                alt={image.alt}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <figcaption className="mt-2 text-sm leading-6 text-white/40">{image.alt}</figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}

function ProjectEntry({ project, index }: { project: Project; index: number }) {
  const projectIndex = String(index + 1).padStart(2, '0');
  const details = project.details || [];
  const achievements = project.achievements || [];
  const tech = project.tech || [];
  const links = project.links || [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.45 }}
      className="grid gap-8 border-t border-white/10 py-12 lg:grid-cols-[164px_minmax(0,1fr)] lg:gap-14 lg:py-16"
    >
      <div className="flex items-start justify-between gap-6 lg:block">
        <div>
          <p
            className="font-mono text-sm tracking-[0.24em]"
            style={{ color: project.color }}
          >
            {projectIndex}
          </p>
          <p
            className="mt-5 text-xs uppercase tracking-[0.3em]"
            style={{ color: project.color }}
          >
            {project.category}
          </p>
        </div>
        <p className="text-right text-sm leading-7 text-white/42 lg:mt-10 lg:text-left">
          {project.period || '未单独标注'}
        </p>
      </div>

      <div className="space-y-7">
        <div className="space-y-4">
          <h3 className="font-display text-3xl font-semibold leading-[0.96] tracking-[-0.06em] text-white md:text-5xl">
            {project.title}
          </h3>
          <p className="max-w-4xl text-lg leading-8 text-white/64 md:text-xl md:leading-9">
            {project.description}
          </p>
        </div>

        {details.length ? (
          <ul className="grid gap-x-8 gap-y-4 border-t border-white/10 pt-6 md:grid-cols-2">
            {details.map((detail, detailIndex) => (
              <li
                key={`${project.id}-detail-${detailIndex}`}
                className="grid grid-cols-[24px_minmax(0,1fr)] gap-4"
              >
                <span
                  className="mt-1 font-mono text-xs tracking-[0.24em]"
                  style={{ color: project.color }}
                >
                  {String(detailIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-base leading-8 text-white/58">{detail}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {achievements.length ? (
          <div className="space-y-3 border-t border-white/10 pt-5">
            <p className="text-xs uppercase tracking-[0.28em] text-white/34">补充成果</p>
            <ul className="grid gap-3 md:grid-cols-2">
              {achievements.map((achievement, achievementIndex) => (
                <li
                  key={`${project.id}-achievement-${achievementIndex}`}
                  className="grid grid-cols-[18px_minmax(0,1fr)] gap-3 text-sm leading-7 text-white/50 md:text-base"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {links.length ? (
          <div className="space-y-3 border-t border-white/10 pt-5">
            <p className="text-xs uppercase tracking-[0.28em] text-white/34">项目链接</p>
            <div className="flex flex-wrap gap-3">
              {links.map((link) => (
                <a
                  key={`${project.id}-${link.href}`}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center border border-white/12 px-4 py-2 text-sm leading-6 text-white/62 transition-colors duration-300 hover:border-white/28 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        <ProjectPreviewRail project={project} />

        {tech.length ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {tech.map((item) => (
              <span
                key={`${project.id}-${item}`}
                className="border border-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white/46"
              >
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const { projects: contentProjects } = useContent();
  const projectData = contentProjects || defaultProjectsContent;

  return (
    <section id="projects" className="relative bg-transparent">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="grid gap-10 border-y border-white/10 py-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(300px,0.7fr)] lg:items-end"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#00d4aa]">
              {projectData.sectionSubtitle}
            </p>
            <h2 className="font-display mt-6 text-[clamp(3.4rem,9vw,7.6rem)] font-semibold leading-[0.92] tracking-[-0.08em] text-white">
              {projectData.sectionTitle}
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            <p className="max-w-md text-lg leading-8 text-white/58">
              这里聚焦我在 UI 架构、工具链、多人玩法、HMI 表现和汽车可视化上的核心项目，内容按实际交付与能力脉络做了整理。
            </p>
            <p className="text-sm uppercase tracking-[0.28em] text-white/32">
              5 项核心项目，覆盖架构到交付
            </p>
          </div>
        </motion.div>

        <div>
          {projectData.projects.map((project, index) => (
            <ProjectEntry key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
