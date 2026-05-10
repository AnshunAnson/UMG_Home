'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Folder, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useContent } from '../ContentProvider';

const basePath = typeof window !== 'undefined' && window.location.pathname.startsWith('/UMG_Home') ? '/UMG_Home' : '';

function resolveAssetPath(src: string) {
  if (!src.startsWith('/')) {
    return src;
  }
  return `${basePath}${src}`;
}

function isVideo(src: string) {
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(src);
}

function MediaAsset({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const resolvedSrc = resolveAssetPath(src);

  if (isVideo(src)) {
    return (
      <video
        src={resolvedSrc}
        autoPlay
        loop
        muted
        playsInline
        className={className || "w-full h-full object-cover"}
      />
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className || "w-full h-full object-cover"}
    />
  );
}

function ProjectItem({ project, index }: { project: any; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const firstImage = project.images?.[0] || project.subProjects?.[0]?.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={firstImage?.preserveAspectRatio ? "relative overflow-hidden flex items-center justify-center max-h-[300px]" : "relative aspect-[21/9] overflow-hidden"}>
          {firstImage ? (
            <MediaAsset
              src={firstImage.src}
              alt={firstImage.alt || project.title}
              className={firstImage?.preserveAspectRatio ? "max-w-full max-h-[300px] h-auto object-contain transition-transform duration-700 group-hover:scale-105" : "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5">
              <Folder className="w-16 h-16 text-white/30" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="px-3 py-1 text-xs font-mono tracking-wider rounded-full"
                style={{
                  backgroundColor: `${project.color}20`,
                  color: project.color
                }}
              >
                {project.category?.split(' ')[0] || 'Project'}
              </span>
              {project.period && (
                <span className="text-white/50 text-sm">{project.period}</span>
              )}
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 group-hover:text-[#00d4aa] transition-colors">
              {project.title}
            </h3>
            
            {project.tech && project.tech.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.slice(0, 5).map((tech: string, i: number) => (
                  <span key={i} className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-2 text-white/60">
              <span className="text-sm">点击查看详情</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
            onAnimationComplete={() => {
              // 动画完成后通知 lenis 重新计算
              window.dispatchEvent(new Event('resize'));
            }}
          >
            <div className="pt-8 space-y-8">
              {project.description && (
                <div>
                  <p className="text-white/60 text-lg leading-relaxed max-w-3xl">
                    {project.description}
                  </p>
                </div>
              )}
              
              {project.images && project.images.length > 0 && (
                <div>
                  {project.images.length === 1 ? (
                    <div>
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5">
                        <MediaAsset
                          src={project.images[0].src}
                          alt={project.images[0].alt || project.title}
                        />
                      </div>
                      {project.images[0].alt && (
                        <p className="text-sm text-white/40 mt-2 leading-relaxed">{project.images[0].alt}</p>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.images.map((img: any, i: number) => (
                        <div key={i}>
                          <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5">
                            <MediaAsset
                              src={img.src}
                              alt={img.alt || `${project.title} ${i + 1}`}
                            />
                          </div>
                          {img.alt && (
                            <p className="text-sm text-white/40 mt-2 leading-relaxed">{img.alt}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {project.subProjects && project.subProjects.length > 0 && (
                <div className="space-y-4">
                  {project.subProjects.map((sub: any, i: number) => (
                    <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <h4 className="font-medium text-white text-xl mb-2">{sub.title}</h4>
                      {sub.period && (
                        <p className="text-sm text-white/40 mb-4">{sub.period}</p>
                      )}
                      {sub.images && sub.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                          {sub.images.map((img: any, j: number) => (
                            <div key={j}>
                              <div className={img.preserveAspectRatio ? "relative rounded-xl overflow-hidden bg-white/5 flex items-center justify-center max-h-[300px]" : "relative aspect-video rounded-xl overflow-hidden bg-white/5"}>
                                <MediaAsset
                                  src={img.src}
                                  alt={img.alt || `${sub.title} ${j + 1}`}
                                  className={img.preserveAspectRatio ? "max-w-full max-h-[300px] h-auto object-contain" : undefined}
                                />
                              </div>
                              {img.alt && (
                                <p className="text-xs text-white/40 mt-1.5 leading-relaxed">{img.alt}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {sub.links && sub.links.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {sub.links.map((link: any, j: number) => (
                            <a
                              key={j}
                              href={link.href}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {project.links && project.links.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {project.links.map((link: any, i: number) => (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      {link.label}
                    </a>
                  ))}
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
                <span className="text-sm">收起</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Projects() {
  const { projects: contentProjects } = useContent();
  const projectData = contentProjects;

  return (
    <section id="projects" className="py-24 px-6 md:px-12 lg:px-20">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-[#00d4aa] font-mono text-sm tracking-widest">
            SELECTED WORK
          </span>
          <h2 className="text-6xl md:text-8xl font-bold mt-4">
            项目作品
          </h2>
        </motion.div>

        <div>
          {projectData.projects.map((project: any, index: number) => (
            <ProjectItem 
              key={project.id} 
              project={project} 
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}