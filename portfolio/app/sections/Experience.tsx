'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, Sparkles, Layers, Code2, Zap, Car, ChevronRight } from 'lucide-react';

interface ExperienceItem {
  id: number;
  company: string;
  position: string;
  period: string;
  type: 'current' | 'past';
  coreWorks: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    details?: string[];
  }[];
  subProject?: {
    title: string;
    period: string;
    achievements: string[];
    highlights: string[];
  };
}

const experiences: ExperienceItem[] = [
  {
    id: 1,
    company: '深圳普修汽车资讯有限公司',
    position: 'UE4开发',
    period: '2023.04 - 至今',
    type: 'current',
    coreWorks: [
      { title: 'UI材质动效制作', icon: Sparkles },
      { title: 'UMG重构', icon: Layers },
      { title: '蓝图编辑器工具编写', icon: Code2 },
      { title: 'Niagara粒子动态效果', icon: Zap },
    ],
    subProject: {
      title: '汽车渲染项目',
      period: '2023.12 - 至今',
      achievements: [
        '根据UI效果需求编写材质',
        '搭建汽车渲染输出流水线',
        '定制汽车模型整理规范',
      ],
      highlights: [
        '高性能半透明材质',
        '材质实例优化',
        '摩尔纹消除',
      ],
    },
  },
];

// 脉冲动画节点
function TimelineNode({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* 外圈脉冲 */}
      {isActive && (
        <>
          <motion.div
            className="absolute w-6 h-6 rounded-full border-2 border-[#00d4aa]"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
          <motion.div
            className="absolute w-6 h-6 rounded-full border-2 border-[#00d4aa]"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.6,
            }}
          />
        </>
      )}
      {/* 主节点 */}
      <motion.div
        className={`relative w-4 h-4 rounded-full z-10 ${
          isActive
            ? 'bg-[#00d4aa] shadow-[0_0_20px_rgba(0,212,170,0.6)]'
            : 'bg-[#2a2a2a] border-2 border-[#3a3a3a]'
        }`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, ease: 'backOut' }}
      />
    </div>
  );
}

// 核心工作项卡片
function CoreWorkCard({
  work,
  index,
}: {
  work: ExperienceItem['coreWorks'][0];
  index: number;
}) {
  const Icon = work.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, x: 4 }}
      className="flex items-center gap-3 p-3 rounded-lg bg-[#12121a] border border-[#1f1f2e] 
                 hover:border-[#00d4aa]/30 hover:bg-[#151520] transition-all duration-300 group"
    >
      <div className="w-8 h-8 rounded-md bg-[#1a1a2e] flex items-center justify-center
                      group-hover:bg-[#00d4aa]/10 transition-colors duration-300">
        <Icon className="w-4 h-4 text-[#8a8a9a] group-hover:text-[#00d4aa] transition-colors duration-300" />
      </div>
      <span className="text-sm text-[#b0b0c0] group-hover:text-white transition-colors duration-300">
        {work.title}
      </span>
    </motion.div>
  );
}

// 子项目卡片
function SubProjectCard({ project }: { project: ExperienceItem['subProject'] }) {
  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-6 p-5 rounded-xl bg-gradient-to-br from-[#0d1f1a] to-[#0a1512] 
                 border border-[#00d4aa]/20 relative overflow-hidden group"
    >
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d4aa]/5 rounded-full blur-3xl" />
      
      {/* 标题区域 */}
      <div className="relative flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#00d4aa]/10 flex items-center justify-center">
          <Car className="w-5 h-5 text-[#00d4aa]" />
        </div>
        <div>
          <h4 className="text-white font-semibold">{project.title}</h4>
          <span className="text-xs text-[#00d4aa] font-mono">{project.period}</span>
        </div>
      </div>

      {/* 成就列表 */}
      <div className="space-y-2 mb-4">
        {project.achievements.map((achievement, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.4 + idx * 0.1 }}
            className="flex items-start gap-2"
          >
            <ChevronRight className="w-4 h-4 text-[#00d4aa] mt-0.5 flex-shrink-0" />
            <span className="text-sm text-[#9a9aaa]">{achievement}</span>
          </motion.div>
        ))}
      </div>

      {/* 业绩亮点 */}
      <div className="pt-4 border-t border-[#00d4aa]/10">
        <p className="text-xs text-[#00d4aa]/70 uppercase tracking-wider mb-3 font-mono">
          业绩亮点
        </p>
        <div className="flex flex-wrap gap-2">
          {project.highlights.map((highlight, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.6 + idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1.5 text-xs rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/30
                         text-[#00d4aa] hover:bg-[#00d4aa]/20 transition-colors duration-300"
            >
              {highlight}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// 经历卡片
function ExperienceCard({ experience, index }: { experience: ExperienceItem; index: number }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative"
    >
      {/* 时间线连接线 */}
      <div className="absolute left-[7px] top-8 bottom-0 w-[2px] bg-gradient-to-b from-[#00d4aa] to-[#1a1a2e]" />

      <div className="flex gap-6 md:gap-8">
        {/* 左侧时间线节点 */}
        <div className="flex-shrink-0 pt-2">
          <TimelineNode isActive={experience.type === 'current'} />
        </div>

        {/* 右侧内容 */}
        <div className="flex-1 pb-12">
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="p-6 md:p-8 rounded-2xl bg-[#0f0f16] border border-[#1f1f2e] 
                       hover:border-[#00d4aa]/30 hover:shadow-[0_0_40px_rgba(0,212,170,0.08)]
                       transition-all duration-500 group"
          >
            {/* 头部信息 */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a1a2e] to-[#0f0f16] 
                                flex items-center justify-center border border-[#2a2a3e]
                                group-hover:border-[#00d4aa]/30 transition-colors duration-300">
                  <Briefcase className="w-6 h-6 text-[#00d4aa]" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#00d4aa] 
                                 transition-colors duration-300">
                    {experience.company}
                  </h3>
                  <p className="text-[#8a8a9a] mt-1">{experience.position}</p>
                </div>
              </div>
              
              {/* 时间标签 */}
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 rounded-full text-sm font-mono
                               bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20">
                  {experience.period}
                </span>
                {experience.type === 'current' && (
                  <span className="px-2 py-1 rounded text-xs font-medium
                                 bg-[#00d4aa] text-[#0a0a0f]">
                    在职
                  </span>
                )}
              </div>
            </div>

            {/* 核心工作 */}
            <div className="mb-2">
              <h4 className="text-sm text-[#6a6a7a] uppercase tracking-wider mb-4 font-mono">
                核心工作
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {experience.coreWorks.map((work, idx) => (
                  <CoreWorkCard key={work.title} work={work} index={idx} />
                ))}
              </div>
            </div>

            {/* 子项目 */}
            {experience.subProject && (
              <SubProjectCard project={experience.subProject} />
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="experience"
      className="py-24 md:py-32 bg-[#0a0a0f] relative overflow-hidden"
      ref={sectionRef}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 网格背景 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,170,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,170,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* 渐变光晕 */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#00d4aa]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#00a8e8]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: 48 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-[2px] bg-[#00d4aa]"
            />
            <span className="text-[#6a6a7a] text-sm uppercase tracking-[0.2em] font-mono">
              Career Path
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              工作经历
              <span className="text-[#00d4aa]">.</span>
            </h2>
            <p className="text-[#6a6a7a] max-w-md text-sm md:text-base">
              专注于UE4开发与技术美术，在汽车可视化与交互设计领域持续深耕
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl">
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              index={index}
            />
          ))}
        </div>

        {/* 底部装饰 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 flex items-center justify-center gap-4"
        >
          <div className="h-[1px] flex-1 max-w-[200px] bg-gradient-to-r from-transparent to-[#2a2a3e]" />
          <div className="w-2 h-2 rounded-full bg-[#2a2a3e]" />
          <div className="h-[1px] flex-1 max-w-[200px] bg-gradient-to-l from-transparent to-[#2a2a3e]" />
        </motion.div>
      </div>
    </section>
  );
}
