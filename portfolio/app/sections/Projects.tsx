'use client';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Link2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { projectsContent as defaultProjectsContent } from '../config/content';
import { useContent } from '../ContentProvider';
import type { Project, ProjectImage, ProjectLink, ProjectSubProject } from '../types/content';

const basePath = process.env.NODE_ENV === 'production' ? '/UMG_Home' : '';
const MEDIA_SIZE_HINTS: Record<string, number> = {
  '/gifs/DesaysvFX/audio.gif': 211825,
  '/gifs/DesaysvFX/SEQ_Flow7.gif': 546250,
  '/gifs/DesaysvFX/SEQ_Render_thm2_prob4.gif': 765575,
  '/gifs/DesaysvFX/Wellness02.gif': 1837382,
  '/gifs/Niagara_Materials/比亚迪入场动画.gif': 1839380,
  '/gifs/ProjectNotes/Dog.gif': 3479249,
  '/gifs/DesaysvFX/IP台来电.gif': 4637462,
  '/gifs/DesaysvFX/入场_爆破_溅射.gif': 6018873,
  '/gifs/DesaysvFX/SEQ_Loading01.gif': 6327121,
  '/gifs/DesaysvFX/IP台开机动效.gif': 7074965,
  '/gifs/ProjectNotes/audi.gif': 7640136,
  '/gifs/DesaysvFX/SEQ_Mind.gif': 7877037,
  '/gifs/DesaysvFX/SEQ_Music.gif': 8086280,
  '/gifs/DesaysvFX/SEQ_Scene_Switching.gif': 10881631,
  '/gifs/Mobile_terminal/UMG_1080.gif': 45998418,
  '/gifs/FPS.high.gif': 97164780,
};

function resolveAssetPath(src: string) {
  if (!src.startsWith('/')) {
    return src;
  }
  return `${basePath}${src}`;
}

function getMediaWeight(src: string) {
  return MEDIA_SIZE_HINTS[src] ?? Number.MAX_SAFE_INTEGER;
}

function formatMediaWeight(size: number) {
  if (!Number.isFinite(size) || size === Number.MAX_SAFE_INTEGER) {
    return '';
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(0)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(size >= 20 * 1024 * 1024 ? 1 : 2)} MB`;
}

function getMediaActionText(src: string) {
  return src.toLowerCase().endsWith('.gif') ? '点击弹窗播放当前 GIF' : '点击弹窗查看当前图片';
}

function getMediaLoadText(src: string) {
  return src.toLowerCase().endsWith('.gif') ? '点击播放 GIF' : '点击查看图片';
}

function getLinkHost(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return href;
  }
}

interface ActiveMedia {
  src: string;
  alt: string;
  color: string;
  label: string;
  weight: string;
  mode: 'default' | 'cinematic';
}

function getMediaDisplayMode(src: string): ActiveMedia['mode'] {
  if (src.includes('/gifs/DesaysvFX/') || src.includes('/gifs/Niagara_Materials/')) {
    return 'cinematic';
  }

  return 'default';
}

function MediaLightbox({
  media,
  onClose,
}: {
  media: ActiveMedia | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {media ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/88 px-4 py-6 backdrop-blur-md md:px-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full max-h-[94vh] w-full max-w-[1720px] flex-col border border-white/12 bg-[#07090d]/96"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-3 md:px-6">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/34">{media.label}</p>
                <h3 className="mt-2 text-base leading-7 text-white md:text-lg">{media.alt}</h3>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {media.weight ? (
                  <span
                    className="hidden border px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/54 md:inline-flex"
                    style={{
                      borderColor: `${media.color}46`,
                      color: media.color,
                      backgroundColor: `${media.color}14`,
                    }}
                  >
                    {media.weight}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 w-11 items-center justify-center border border-white/12 text-white/72 transition-colors duration-300 hover:text-white"
                  aria-label="关闭媒体弹窗"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black px-4 py-4 md:px-6 md:py-6">
              <div className="flex h-full w-full items-center justify-center">
                <Image
                  src={resolveAssetPath(media.src)}
                  alt={media.alt}
                  width={1920}
                  height={1080}
                  unoptimized
                  sizes="100vw"
                  className="h-auto max-h-full w-auto max-w-full object-contain"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ProjectPreviewRail({
  images,
  keyPrefix,
  label = '',
  color = '#ffffff',
  loadedPreviewIds,
  onEnsurePreviewLoaded,
  loadedThumbRailIds,
  onEnsureThumbsLoaded,
  onOpenLightbox,
}: {
  images?: ProjectImage[];
  keyPrefix: string;
  label?: string;
  color?: string;
  loadedPreviewIds: string[];
  onEnsurePreviewLoaded: (id: string) => void;
  loadedThumbRailIds: string[];
  onEnsureThumbsLoaded: (id: string) => void;
  onOpenLightbox: (media: ActiveMedia) => void;
}) {
  const media = [...(images || [])].sort((a, b) => getMediaWeight(a.src) - getMediaWeight(b.src));
  const [activeIndex, setActiveIndex] = useState(0);

  if (!media.length) {
    return null;
  }

  const selectedIndex = activeIndex >= media.length ? 0 : activeIndex;
  const selectedImage = media[selectedIndex];
  const selectedWeight = formatMediaWeight(getMediaWeight(selectedImage.src));
  const previewEnabled = loadedPreviewIds.includes(keyPrefix);
  const thumbsEnabled = loadedThumbRailIds.includes(keyPrefix);

  return (
    <div className="space-y-3">
      {label && (
        <p className="text-xs uppercase tracking-[0.28em] text-white/34">
          {label} {media.length > 1 ? `(${media.length})` : ''}
        </p>
      )}

      <motion.figure
        key={`${keyPrefix}-featured-${selectedIndex}`}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.35 }}
      >
        <div
          className="relative min-h-[220px] overflow-hidden border bg-white/[0.03] md:min-h-[300px]"
          style={{
            borderColor: `${color}3f`,
            boxShadow: `inset 0 0 0 1px ${color}12`,
          }}
        >
          {previewEnabled ? (
            <button
              type="button"
              onClick={() =>
                onOpenLightbox({
                  src: selectedImage.src,
                  alt: selectedImage.alt,
                  color,
                  label,
                  weight: selectedWeight,
                  mode: getMediaDisplayMode(selectedImage.src),
                })
              }
              className="group relative block h-full min-h-[220px] w-full md:min-h-[300px]"
              aria-label={`打开 ${selectedImage.alt} 的媒体弹窗`}
            >
              <Image
                src={resolveAssetPath(selectedImage.src)}
                alt={selectedImage.alt}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-contain p-2 md:p-3"
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onEnsurePreviewLoaded(keyPrefix);
                onOpenLightbox({
                  src: selectedImage.src,
                  alt: selectedImage.alt,
                  color,
                  label,
                  weight: selectedWeight,
                  mode: getMediaDisplayMode(selectedImage.src),
                });
              }}
              className="flex h-full min-h-[220px] w-full flex-col items-center justify-center gap-3 px-4 py-6 text-center transition-colors duration-300 hover:bg-white/[0.02] md:min-h-[300px]"
            >
              <span
                className="inline-flex items-center justify-center border px-4 py-2 text-[11px] uppercase tracking-[0.24em]"
                style={{
                  borderColor: `${color}55`,
                  color,
                  backgroundColor: `${color}14`,
                }}
              >
                查看
              </span>
            </button>
          )}
        </div>
      </motion.figure>

      {media.length > 1 ? (
        <div>
          {thumbsEnabled ? (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {media.map((image, index) => {
                const isActive = index === selectedIndex;
                const shouldLoadThumb = Math.abs(index - selectedIndex) <= 1;

                return (
                  <button
                    key={`${keyPrefix}-preview-${index}`}
                    type="button"
                    onClick={() => {
                      setActiveIndex(index);
                      onEnsureThumbsLoaded(keyPrefix);
                      onEnsurePreviewLoaded(keyPrefix);
                    }}
                    className="group shrink-0 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <div
                      className="relative h-20 w-32 overflow-hidden border bg-white/[0.03] transition-all duration-300 group-hover:-translate-y-0.5 md:h-24 md:w-40"
                      style={{
                        borderColor: isActive ? color : 'rgba(255,255,255,0.12)',
                        boxShadow: isActive ? `0 0 0 1px ${color}` : 'none',
                      }}
                    >
                      {shouldLoadThumb ? (
                        <Image
                          src={resolveAssetPath(image.src)}
                          alt={image.alt}
                          fill
                          unoptimized
                          sizes="200px"
                          className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-[10px] uppercase tracking-[0.24em] text-white/34">
                            {index + 1}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onEnsureThumbsLoaded(keyPrefix)}
              className="inline-flex items-center gap-3 border px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/62 transition-colors duration-300 hover:text-white"
              style={{
                borderColor: `${color}3f`,
                backgroundColor: `${color}10`,
              }}
            >
              <span>显示缩略图</span>
              <span style={{ color }}>{media.length}</span>
            </button>
          )}
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
  loadedPreviewIds,
  onEnsurePreviewLoaded,
  loadedThumbRailIds,
  onEnsureThumbsLoaded,
  onOpenLightbox,
}: {
  subProject: ProjectSubProject;
  projectColor: string;
  projectId: number;
  index: number;
  loadedPreviewIds: string[];
  onEnsurePreviewLoaded: (id: string) => void;
  loadedThumbRailIds: string[];
  onEnsureThumbsLoaded: (id: string) => void;
  onOpenLightbox: (media: ActiveMedia) => void;
}) {
  const hasMedia = (subProject.images?.length || 0) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="border p-4 md:p-5"
      style={{
        borderColor: `${projectColor}36`,
        background: `linear-gradient(180deg, ${projectColor}14 0%, rgba(255,255,255,0.02) 100%)`,
      }}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-lg font-semibold leading-tight text-white truncate">
              {subProject.title}
            </h4>
            {subProject.period && (
              <p className="text-xs text-white/42 mt-1">{subProject.period}</p>
            )}
          </div>
        </div>

        {hasMedia && (
          <ProjectPreviewRail
            images={subProject.images}
            keyPrefix={`${projectId}-sub-${index}`}
            label=""
            color={projectColor}
            loadedPreviewIds={loadedPreviewIds}
            onEnsurePreviewLoaded={onEnsurePreviewLoaded}
            loadedThumbRailIds={loadedThumbRailIds}
            onEnsureThumbsLoaded={onEnsureThumbsLoaded}
            onOpenLightbox={onOpenLightbox}
          />
        )}

        {subProject.links?.length ? (
          <div className="flex flex-wrap gap-2">
            {subProject.links.map((link, linkIndex) => (
              <a
                key={`${projectId}-sub-${index}-link-${linkIndex}`}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border px-2.5 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/60 hover:text-white transition-colors"
                style={{ borderColor: `${projectColor}40`, backgroundColor: `${projectColor}10` }}
              >
                <ArrowUpRight className="h-3 w-3" />
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

function ProjectEntry({
  project,
  index,
  loadedPreviewIds,
  onEnsurePreviewLoaded,
  loadedThumbRailIds,
  onEnsureThumbsLoaded,
  onOpenLightbox,
}: {
  project: Project;
  index: number;
  loadedPreviewIds: string[];
  onEnsurePreviewLoaded: (id: string) => void;
  loadedThumbRailIds: string[];
  onEnsureThumbsLoaded: (id: string) => void;
  onOpenLightbox: (media: ActiveMedia) => void;
}) {
  const projectIndex = String(index + 1).padStart(2, '0');
  const tech = project.tech || [];
  const links = project.links || [];
  const subProjects = project.subProjects || [];
  const hasMedia = (project.images?.length || 0) > 0 || subProjects.some(sp => (sp.images?.length || 0) > 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.45 }}
      className="border-t border-white/10 py-12 xl:py-16"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1180px' }}
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-baseline gap-4">
              <p
                className="font-mono text-sm tracking-[0.24em] shrink-0"
                style={{ color: project.color }}
              >
                {projectIndex}
              </p>
              <h3 className="font-display text-2xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-4xl 2xl:text-5xl truncate">
                {project.title}
              </h3>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <p
                className="text-xs uppercase tracking-[0.28em]"
                style={{ color: project.color }}
              >
                {project.category}
              </p>
              {project.period && (
                <span className="text-sm text-white/42">
                  {project.period}
                </span>
              )}
            </div>
          </div>
        </div>

        {hasMedia && (
          <ProjectPreviewRail
            images={project.images}
            keyPrefix={`${project.id}`}
            color={project.color}
            loadedPreviewIds={loadedPreviewIds}
            onEnsurePreviewLoaded={onEnsurePreviewLoaded}
            loadedThumbRailIds={loadedThumbRailIds}
            onEnsureThumbsLoaded={onEnsureThumbsLoaded}
            onOpenLightbox={onOpenLightbox}
          />
        )}

        {subProjects.length ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subProjects.map((subProject, subProjectIndex) => (
                <ProjectSubProjectBlock
                  key={`${project.id}-sub-${subProjectIndex}`}
                  subProject={subProject}
                  projectColor={project.color}
                  projectId={project.id}
                  index={subProjectIndex}
                  loadedPreviewIds={loadedPreviewIds}
                  onEnsurePreviewLoaded={onEnsurePreviewLoaded}
                  loadedThumbRailIds={loadedThumbRailIds}
                  onEnsureThumbsLoaded={onEnsureThumbsLoaded}
                  onOpenLightbox={onOpenLightbox}
                />
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-4 pt-2">
          {tech.length ? (
            <div className="flex flex-wrap gap-2">
              {tech.map((item) => (
                <span
                  key={`${project.id}-${item}`}
                  className="border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/44"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : null}
          
          {links.length ? (
            <div className="flex flex-wrap gap-2">
              {links.map((link, linkIndex) => (
                <a
                  key={`${project.id}-link-${linkIndex}`}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white/60 hover:text-white transition-colors"
                  style={{ borderColor: `${project.color}40`, backgroundColor: `${project.color}10` }}
                >
                  <ArrowUpRight className="h-3 w-3" />
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const { projects: contentProjects } = useContent();
  const projectData = contentProjects || defaultProjectsContent;
  const [loadedPreviewIds, setLoadedPreviewIds] = useState<string[]>([]);
  const [loadedThumbRailIds, setLoadedThumbRailIds] = useState<string[]>([]);
  const [activeMedia, setActiveMedia] = useState<ActiveMedia | null>(null);

  useEffect(() => {
    if (!activeMedia) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMedia(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeMedia]);

  const handleEnsurePreviewLoaded = (id: string) => {
    setLoadedPreviewIds((current) => (current.includes(id) ? current : [...current, id]));
  };
  const handleEnsureThumbsLoaded = (id: string) => {
    setLoadedThumbRailIds((current) => (current.includes(id) ? current : [...current, id]));
  };

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
            <ProjectEntry
              key={project.id}
              project={project}
              index={index}
              loadedPreviewIds={loadedPreviewIds}
              onEnsurePreviewLoaded={handleEnsurePreviewLoaded}
              loadedThumbRailIds={loadedThumbRailIds}
              onEnsureThumbsLoaded={handleEnsureThumbsLoaded}
              onOpenLightbox={setActiveMedia}
            />
          ))}
        </div>
      </div>

      <MediaLightbox media={activeMedia} onClose={() => setActiveMedia(null)} />
    </section>
  );
}
