'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Link2 } from 'lucide-react';
import { useState } from 'react';
import { projectsContent as defaultProjectsContent } from '../config/content';
import { useContent } from '../ContentProvider';
import type { Project, ProjectImage, ProjectLink, ProjectSubProject } from '../types/content';

const basePath = process.env.NODE_ENV === 'production' ? '/UMG_Home' : '';

function resolveAssetPath(src: string) {
  if (!src.startsWith('/')) {
    return src;
  }
  return `${basePath}${src}`;
}

function getLinkHost(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return href;
  }
}

function ProjectPreviewRail({
  images,
  keyPrefix,
  label = '项目预览',
  color = '#ffffff',
}: {
  images?: ProjectImage[];
  keyPrefix: string;
  label?: string;
  color?: string;
}) {
  const media = images || [];
  const [activeIndex, setActiveIndex] = useState(0);

  if (!media.length) {
    return null;
  }

  const selectedIndex = activeIndex >= media.length ? 0 : activeIndex;
  const selectedImage = media[selectedIndex];

  return (
    <div className="space-y-4 border-t border-white/10 pt-6">
      <p className="text-xs uppercase tracking-[0.28em] text-white/34">
        {label} {media.length > 1 ? `(${media.length})` : ''}
      </p>

      <motion.figure
        key={`${keyPrefix}-featured-${selectedIndex}`}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.35 }}
        className="space-y-3"
      >
        <div
          className="relative aspect-[16/10] overflow-hidden border bg-white/[0.03] md:aspect-[16/9]"
          style={{
            borderColor: `${color}3f`,
            boxShadow: `inset 0 0 0 1px ${color}12`,
          }}
        >
          <Image
            src={resolveAssetPath(selectedImage.src)}
            alt={selectedImage.alt}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover"
          />
        </div>
        <figcaption className="text-sm leading-6 text-white/48 md:text-base">
          {selectedImage.alt}
        </figcaption>
      </motion.figure>

      {media.length > 1 ? (
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/28">切换预览</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {media.map((image, index) => {
              const isActive = index === selectedIndex;

              return (
                <button
                  key={`${keyPrefix}-preview-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="group shrink-0 text-left focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <div
                    className="relative aspect-[16/10] w-44 overflow-hidden border bg-white/[0.03] transition-transform duration-300 group-hover:-translate-y-0.5 md:w-48 2xl:w-52"
                    style={{
                      borderColor: isActive ? color : 'rgba(255,255,255,0.12)',
                      boxShadow: isActive ? `0 0 0 1px ${color}` : 'none',
                    }}
                  >
                    <Image
                      src={resolveAssetPath(image.src)}
                      alt={image.alt}
                      fill
                      unoptimized
                      sizes="220px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p
                    className="mt-2 max-w-44 text-xs leading-5 md:max-w-48 2xl:max-w-52"
                    style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.48)' }}
                  >
                    {image.alt}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProjectLinkGrid({
  links,
  color,
  keyPrefix,
}: {
  links?: ProjectLink[];
  color: string;
  keyPrefix: string;
}) {
  const linkItems = links || [];

  if (!linkItems.length) {
    return null;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {linkItems.map((link, index) => (
        <a
          key={`${keyPrefix}-link-${index}`}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="group relative overflow-hidden border p-4 transition-transform duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/20"
          style={{
            borderColor: `${color}44`,
            background: `linear-gradient(135deg, ${color}1c 0%, rgba(255,255,255,0.03) 58%, rgba(255,255,255,0.02) 100%)`,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-base font-medium leading-6 text-white">{link.label}</p>
              <p className="mt-1 truncate text-sm leading-6 text-white/55">
                {getLinkHost(link.href)}
              </p>
            </div>
            <span
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center border transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{
                borderColor: `${color}4f`,
                color,
                backgroundColor: 'rgba(255,255,255,0.04)',
              }}
            >
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}

function ProjectLinksPanel({
  links,
  color,
  keyPrefix,
}: {
  links?: ProjectLink[];
  color: string;
  keyPrefix: string;
}) {
  if (!links?.length) {
    return null;
  }

  return (
    <div className="space-y-3 border-t border-white/10 pt-5">
      <div className="flex items-center gap-3">
        <span
          className="inline-flex h-10 w-10 items-center justify-center border"
          style={{
            borderColor: `${color}44`,
            backgroundColor: `${color}14`,
            color,
          }}
        >
          <Link2 className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-white/38">项目链接</p>
          <p className="text-sm leading-6 text-white/58">直接进入公开展示或补充阅读入口</p>
        </div>
      </div>

      <ProjectLinkGrid links={links} color={color} keyPrefix={keyPrefix} />
    </div>
  );
}

function ProjectSubProjectBlock({
  subProject,
  projectColor,
  projectId,
  index,
}: {
  subProject: ProjectSubProject;
  projectColor: string;
  projectId: number;
  index: number;
}) {
  const details = subProject.details || [];
  const hasSideContent = Boolean(subProject.links?.length || subProject.images?.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="space-y-5 border p-5 md:p-6"
      style={{
        borderColor: `${projectColor}36`,
        background: `linear-gradient(180deg, ${projectColor}14 0%, rgba(255,255,255,0.02) 52%, rgba(255,255,255,0.015) 100%)`,
      }}
    >
      <div
        className={
          hasSideContent
            ? 'grid gap-6 xl:grid-cols-[minmax(0,0.88fr)_minmax(340px,1fr)] xl:gap-8'
            : 'space-y-5'
        }
      >
        <div className="space-y-5">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p
                className="font-mono text-[11px] uppercase tracking-[0.28em]"
                style={{ color: projectColor }}
              >
                子项目 {String(index + 1).padStart(2, '0')}
              </p>
              <h4 className="text-xl font-semibold leading-tight text-white md:text-2xl">
                {subProject.title}
              </h4>
              {subProject.description ? (
                <p className="text-sm leading-7 text-white/62 md:text-base">
                  {subProject.description}
                </p>
              ) : null}
            </div>
            {subProject.period ? (
              <p className="shrink-0 text-sm leading-7 text-white/42">{subProject.period}</p>
            ) : null}
          </div>

          {details.length ? (
            <ul className="grid gap-3">
              {details.map((detail, detailIndex) => (
                <li
                  key={`${projectId}-sub-${index}-detail-${detailIndex}`}
                  className="grid grid-cols-[16px_minmax(0,1fr)] gap-3 text-sm leading-7 text-white/58 md:text-base"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: projectColor }}
                  />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {hasSideContent ? (
          <div className="space-y-5 xl:border-l xl:border-white/10 xl:pl-6">
        {subProject.links?.length ? (
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-white/36">公开链接</p>
                <ProjectLinkGrid
                  links={subProject.links}
                  color={projectColor}
                  keyPrefix={`${projectId}-sub-${index}`}
                />
              </div>
            ) : null}

            <ProjectPreviewRail
              images={subProject.images}
              keyPrefix={`${projectId}-sub-${index}`}
              label="子项目预览"
              color={projectColor}
            />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

function ProjectEntry({ project, index }: { project: Project; index: number }) {
  const projectIndex = String(index + 1).padStart(2, '0');
  const details = project.details || [];
  const achievements = project.achievements || [];
  const tech = project.tech || [];
  const links = project.links || [];
  const subProjects = project.subProjects || [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.45 }}
      className="grid gap-8 border-t border-white/10 py-12 xl:grid-cols-[196px_minmax(0,1fr)] xl:gap-14 xl:py-16 2xl:grid-cols-[228px_minmax(0,1fr)]"
    >
      <div className="flex items-start justify-between gap-6 xl:block">
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
        <p className="text-right text-sm leading-7 text-white/42 xl:mt-10 xl:text-left">
          {project.period || '未单独标注'}
        </p>
      </div>

      <div className="space-y-7">
        <div className="grid gap-6 border-b border-white/10 pb-7 xl:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.48fr)] xl:items-end">
          <div className="space-y-4">
            <h3 className="font-display text-3xl font-semibold leading-[0.96] tracking-[-0.06em] text-white md:text-5xl 2xl:text-6xl">
              {project.title}
            </h3>
            <p className="text-lg leading-8 text-white/64 md:text-[1.3rem] md:leading-9">
              {project.description}
            </p>
          </div>

          <div className="grid gap-3 text-sm leading-7 text-white/48 md:grid-cols-2 xl:grid-cols-1">
            <div className="border-l border-white/10 pl-4">
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/30">类别</p>
              <p className="mt-2 text-white/62">{project.category}</p>
            </div>
            <div className="border-l border-white/10 pl-4">
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/30">范围</p>
              <p className="mt-2 text-white/62">
                {subProjects.length ? `${subProjects.length} 个子项目` : '单项目交付'}
              </p>
            </div>
          </div>
        </div>

        {details.length ? (
          <ul className="grid gap-x-10 gap-y-4 md:grid-cols-2 2xl:grid-cols-3">
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

        {subProjects.length ? (
          <div className="space-y-4 border-t border-white/10 pt-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-white/34">子项目拆分</p>
              <p className="max-w-3xl text-sm leading-6 text-white/56">
                按实际交付阶段拆开展示，避免把不同子项目的内容与预览混写在一起。
              </p>
            </div>

            <div className="grid gap-4 2xl:grid-cols-2">
              {subProjects.map((subProject, subProjectIndex) => (
                <ProjectSubProjectBlock
                  key={`${project.id}-sub-${subProjectIndex}`}
                  subProject={subProject}
                  projectColor={project.color}
                  projectId={project.id}
                  index={subProjectIndex}
                />
              ))}
            </div>
          </div>
        ) : null}

        {achievements.length ? (
          <div className="space-y-3 border-t border-white/10 pt-5">
            <p className="text-xs uppercase tracking-[0.28em] text-white/34">补充成果</p>
            <ul className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
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

        <ProjectLinksPanel links={links} color={project.color} keyPrefix={`${project.id}`} />

        <ProjectPreviewRail
          images={project.images}
          keyPrefix={`${project.id}`}
          color={project.color}
        />

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
      <div className="mx-auto w-full max-w-[1740px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32 2xl:px-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="grid gap-10 border-y border-white/10 py-8 xl:grid-cols-[minmax(0,1.16fr)_minmax(360px,0.7fr)] xl:items-end"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#00d4aa]">
              {projectData.sectionSubtitle}
            </p>
            <h2 className="font-display mt-6 text-[clamp(3.6rem,9vw,8.6rem)] font-semibold leading-[0.9] tracking-[-0.08em] text-white">
              {projectData.sectionTitle}
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            <p className="max-w-xl text-lg leading-8 text-white/58">
              这里聚焦我在实时视觉、材质系统、特效制作、工具流程和多端展示上的核心项目，内容按实际交付与技术能力脉络做了整理。
            </p>
            <p className="text-sm uppercase tracking-[0.28em] text-white/32">
              {projectData.projects.length} 项核心项目，覆盖表现、流程与落地
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
