'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { projectsContent as defaultProjectsContent } from '../config/content';
import { useContent } from '../ContentProvider';
import type { Project } from '../types/content';

const basePath = process.env.NODE_ENV === 'production' ? '/UMG_Home' : '';
const projectTracks = ['Systems', 'Visuals', 'Workflow', 'Validation'];

function resolveAssetPath(src: string) {
  if (!src.startsWith('/')) {
    return src;
  }
  return `${basePath}${src}`;
}

function ProjectMedia({ project }: { project: Project }) {
  const images = project.images || [];

  if (!images.length) {
    return (
      <div className="border-y border-white/10 py-8">
        <p className="text-xs uppercase tracking-[0.28em] text-white/34">
          Key outcomes
        </p>
        <div className="mt-6 space-y-4">
          {project.achievements.map((achievement, index) => (
            <p
              key={`${project.id}-quote-${index}`}
              className={
                index === 0
                  ? 'font-display max-w-4xl text-3xl leading-tight tracking-[-0.04em] text-white md:text-5xl'
                  : 'max-w-3xl text-base leading-8 text-white/56'
              }
            >
              {achievement}
            </p>
          ))}
        </div>
      </div>
    );
  }

  const leadImage = images[0];
  const trailingImages = images.slice(1);

  return (
    <div className="space-y-6">
      <p className="text-xs uppercase tracking-[0.28em] text-white/34">
        Media sequence
      </p>

      <motion.figure
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.45 }}
        className="border-y border-white/10 py-6"
      >
        <Image
          src={resolveAssetPath(leadImage.src)}
          alt={leadImage.alt}
          width={1600}
          height={900}
          unoptimized
          className="h-auto w-full bg-[#050608] object-cover"
        />
        <figcaption className="mt-4 text-sm text-white/44">{leadImage.alt}</figcaption>
      </motion.figure>

      {trailingImages.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {trailingImages.map((image, index) => (
            <motion.figure
              key={`${project.id}-${index + 1}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
            >
              <Image
                src={resolveAssetPath(image.src)}
                alt={image.alt}
                width={1200}
                height={800}
                unoptimized
                className="h-auto w-full bg-[#050608] object-cover"
              />
              <figcaption className="mt-3 text-sm text-white/42">{image.alt}</figcaption>
            </motion.figure>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProjectStory({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const projectIndex = String(index + 1).padStart(2, '0');

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.6 }}
      className="relative border-t border-white/10 py-16 lg:py-24"
    >
      <span className="pointer-events-none absolute right-0 top-8 hidden font-display text-[10rem] leading-none tracking-[-0.08em] text-white/[0.03] lg:block">
        {projectIndex}
      </span>

      <div className="grid gap-10 lg:grid-cols-[64px_minmax(220px,0.72fr)_minmax(0,1.28fr)] lg:gap-12">
        <div className="hidden lg:block">
          <p
            className="font-mono text-sm tracking-[0.24em]"
            style={{ color: project.color }}
          >
            {projectIndex}
          </p>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: project.color }}
          >
            {project.category}
          </p>
          <h3
            className={`font-display mt-5 font-semibold tracking-[-0.06em] text-white ${
              index === 0 ? 'text-5xl leading-[0.92] md:text-7xl' : 'text-4xl leading-[0.96] md:text-6xl'
            }`}
          >
            {project.title}
          </h3>

          <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 text-sm text-white/48">
            <div>
              <p className="uppercase tracking-[0.28em] text-white/30">Period</p>
              <p className="mt-2 text-white/72">{project.period}</p>
            </div>
            <div>
              <p className="uppercase tracking-[0.28em] text-white/30">Stack</p>
              <p className="mt-2 leading-7 text-white/58">{project.tech.join(' / ')}</p>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <p
            className={`max-w-4xl tracking-[-0.03em] text-white ${
              index === 0
                ? 'font-display text-3xl leading-tight md:text-5xl'
                : 'text-2xl leading-tight md:text-[2rem]'
            }`}
          >
            {project.description}
          </p>

          <div className="grid gap-8 border-t border-white/10 pt-8 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/34">Build</p>
              <ol className="mt-5 space-y-5">
                {project.details.map((detail, detailIndex) => (
                  <li
                    key={`${project.id}-detail-${detailIndex}`}
                    className="grid grid-cols-[34px_minmax(0,1fr)] gap-4 border-b border-white/8 pb-5"
                  >
                    <span
                      className="font-mono text-xs tracking-[0.24em]"
                      style={{ color: project.color }}
                    >
                      {String(detailIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base leading-8 text-white/60">{detail}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/34">Results</p>
              <ul className="mt-5 space-y-5">
                {project.achievements.map((achievement, achievementIndex) => (
                  <li
                    key={`${project.id}-achievement-${achievementIndex}`}
                    className="grid grid-cols-[34px_minmax(0,1fr)] gap-4 border-b border-white/8 pb-5"
                  >
                    <span
                      className="font-mono text-xs tracking-[0.24em]"
                      style={{ color: project.color }}
                    >
                      {String(achievementIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base leading-8 text-white/72">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ProjectMedia project={project} />
        </div>
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
          className="grid gap-10 border-y border-white/10 py-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.72fr)] lg:items-end"
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
              这些项目不是单一方向的堆叠，而是我在系统实现、视觉表达、工具流程和技术验证上的综合切片。
            </p>

            <div className="grid gap-3 text-[11px] uppercase tracking-[0.28em] text-white/38 sm:grid-cols-2">
              {projectTracks.map((track) => (
                <span key={track} className="border-b border-white/8 pb-2">
                  {track}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <div>
          {projectData.projects.map((project, index) => (
            <ProjectStory key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
