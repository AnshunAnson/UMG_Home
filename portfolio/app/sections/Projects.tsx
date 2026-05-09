'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, ExternalLink, Folder } from 'lucide-react';
import { useState } from 'react';
import { projectsContent as defaultProjectsContent } from '../config/content';
import { useContent } from '../ContentProvider';

const basePath = process.env.NODE_ENV === 'production' ? '/UMG_Home' : '';

function resolveAssetPath(src: string) {
  if (!src.startsWith('/')) {
    return src;
  }
  return `${basePath}${src}`;
}

function ProjectModal({ project, isOpen, onClose }: { project: any; isOpen: boolean; onClose: () => void }) {
  const firstImage = project.images?.[0] || project.subProjects?.[0]?.images?.[0];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative z-50 w-full max-w-5xl max-h-[90vh] overflow-hidden mx-4 my-8 bg-[#0d1016] rounded-2xl border border-white/10"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-white/10 bg-[#0d1016]">
              <div>
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                {project.period && (
                  <p className="text-sm text-white/50">{project.period}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Hero Image */}
              {firstImage && (
                <div className="relative aspect-video w-full">
                  <Image
                    src={resolveAssetPath(firstImage.src)}
                    alt={firstImage.alt || project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-6 space-y-8">
                {/* Category & Tech */}
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="px-3 py-1 text-xs font-mono tracking-wider rounded-full"
                    style={{
                      backgroundColor: `${project.color}20`,
                      color: project.color
                    }}
                  >
                    {project.category?.split(' ')[0] || 'Project'}
                  </span>
                  {project.tech && project.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech: string, i: number) => (
                        <span key={i} className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                {project.description && (
                  <div>
                    <h4 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
                      项目介绍
                    </h4>
                    <p className="text-white/70 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                )}

                {/* Project Images */}
                {project.images && project.images.length > 1 && (
                  <div>
                    <h4 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">
                      项目截图
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {project.images.map((img: any, i: number) => (
                        <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10">
                          <Image
                            src={resolveAssetPath(img.src)}
                            alt={img.alt || `Screenshot ${i + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub Projects */}
                {project.subProjects && project.subProjects.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">
                      子项目
                    </h4>
                    <div className="space-y-4">
                      {project.subProjects.map((sub: any, i: number) => (
                        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <h5 className="font-medium text-white mb-2">{sub.title}</h5>
                          {sub.period && (
                            <p className="text-sm text-white/40 mb-3">{sub.period}</p>
                          )}
                          {sub.images && sub.images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                              {sub.images.map((img: any, j: number) => (
                                <div key={j} className="relative aspect-video rounded-lg overflow-hidden bg-white/5">
                                  <Image
                                    src={resolveAssetPath(img.src)}
                                    alt={img.alt || `${sub.title} ${j + 1}`}
                                    fill
                                    className="object-cover"
                                  />
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
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
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
                  </div>
                )}

                {/* Links */}
                {project.links && project.links.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
                      项目链接
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {project.links.map((link: any, i: number) => (
                        <a
                          key={i}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ProjectCard({ project, index, onClick }: { project: any; index: number; onClick: () => void }) {
  const firstImage = project.images?.[0] || project.subProjects?.[0]?.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div 
        className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
        onClick={onClick}
      >
        {/* Project Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {firstImage ? (
            <Image
              src={resolveAssetPath(firstImage.src)}
              alt={firstImage.alt || project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5">
              <Folder className="w-16 h-16 text-white/30" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Project Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
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
            
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#00d4aa] transition-colors">
              {project.title}
            </h3>
            
            {project.tech && project.tech.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tech.slice(0, 4).map((tech: string, i: number) => (
                  <span key={i} className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
                {project.tech.length > 4 && (
                  <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">
                    +{project.tech.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const { projects: contentProjects } = useContent();
  const projectData = contentProjects || defaultProjectsContent;
  const [selectedProject, setSelectedProject] = useState<any>(null);

  return (
    <>
      <section id="projects" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-[#00d4aa] font-mono text-sm tracking-widest">
              SELECTED WORK
            </span>
            <h2 className="text-5xl md:text-7xl font-display font-bold mt-4">
              项目作品
            </h2>
            <p className="text-white/50 mt-4 text-lg max-w-2xl">
              点击项目卡片查看详细内容
            </p>
          </motion.div>

          <div className="space-y-8">
            {projectData.projects.map((project: any, index: number) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      <ProjectModal 
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}