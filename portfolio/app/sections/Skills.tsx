'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { skillsContent } from '../config/content';

const ICON_MAP: Record<string, string> = {
  'Unreal Engine 4/5': 'UE', '蓝图开发': 'BP', 'C++ 开发': 'C+', '编辑器工具': 'ED',
  'UMG界面开发': 'UI', 'LyraUI框架': 'LY', 'UI架构设计': 'AR', '蓝图模板开发': 'BP',
  'UI材质制作': 'MT', 'Substrate材质': 'SB', 'Niagara粒子': 'NI', 'UI动效实现': 'AN',
  'UI性能优化': 'PF', '移动端适配': 'MB', 'Python自动化': 'PY', 'Perforce/Git': 'VC',
};

const CATEGORY_MAP: Record<string, { id: string; icon: string }> = {
  '引擎与蓝图': { id: 'core', icon: '◆' },
  'UMG与UI': { id: 'core', icon: '◆' },
  '材质与动效': { id: 'vfx', icon: '✦' },
  '性能与工具': { id: 'tools', icon: '□' },
};

const skillsData = skillsContent.categories.flatMap(cat =>
  cat.skills.map(s => ({
    name: s.name,
    level: s.level,
    category: CATEGORY_MAP[cat.title]?.id || 'other',
    icon: ICON_MAP[s.name] || s.name.slice(0, 2).toUpperCase(),
  }))
);

const categories = [
  { id: 'core', name: '核心技能', color: '#00d4aa', icon: '◆' },
  { id: 'vfx', name: '材质/特效', color: '#00d4aa', icon: '✦' },
  { id: 'tools', name: '性能/工具', color: '#00d4aa', icon: '□' },
];

const HEX_POSITIONS = [
  { x: 0, y: 0 },
  { x: 1.1, y: 0 },
  { x: 0.55, y: 0.95 },
  { x: -0.55, y: 0.95 },
  { x: -1.1, y: 0 },
  { x: -0.55, y: -0.95 },
];

function HexagonSkill({
  skill,
  index,
  isActive,
  onHover,
  onLeave,
}: {
  skill: typeof skillsData[0];
  index: number;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const hexRef = useRef(null);
  const isInView = useInView(hexRef, { once: true, margin: '-50px' });

  const baseSize = 145;
  const sizeMultiplier = 0.85 + (skill.level / 100) * 0.35;
  const size = baseSize * sizeMultiplier;

  const hexPath = (s: number) => {
    const w = s;
    const h = s * 0.866;
    return `M${w * 0.5},0 L${w},${h * 0.25} L${w},${h * 0.75} L${w * 0.5},${h} L0,${h * 0.75} L0,${h * 0.25} Z`;
  };

  return (
    <motion.div
      ref={hexRef}
      className="relative cursor-pointer"
      style={{ width: size, height: size * 0.866 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{ scale: 1.1, zIndex: 10 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <svg
        width={size}
        height={size * 0.866}
        viewBox={`0 0 ${size} ${size * 0.866}`}
        className="absolute inset-0"
      >
        <defs>
          <filter id={`glow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4aa" stopOpacity={isActive ? 0.35 : 0.12 } />
            <stop offset="100%" stopColor="#00d4aa" stopOpacity={isActive ? 0.12 : 0.06 } />
          </linearGradient>
        </defs>

        <motion.path
          d={hexPath(size)}
          fill="none"
          stroke="#00d4aa"
          strokeWidth={isActive ? 2.5 : 1.2}
          opacity={isActive ? 1 : 0.5}
          filter={isActive ? `url(#glow-${index})` : undefined}
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
        />

        <motion.path
          d={hexPath(size)}
          fill={`url(#grad-${index})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
        />

        <motion.circle
          cx={size / 2}
          cy={(size * 0.866) / 2}
          r={size * 0.34}
          fill="none"
          stroke="#00d4aa"
          strokeWidth={2.5}
          strokeDasharray={`${2 * Math.PI * size * 0.34 * (skill.level / 100)} ${2 * Math.PI * size * 0.34}`}
          strokeLinecap="round"
          initial={{ rotate: -90, opacity: 0 }}
          animate={isInView ? { rotate: -90, opacity: isActive ? 1 : 0.3 } : {}}
          transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
          style={{ transformOrigin: 'center' }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-[#00d4aa] font-bold text-xl font-mono"
          animate={{ scale: isActive ? 1.2 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {skill.icon}
        </motion.span>
        <motion.span
          className="text-white text-sm mt-1.5 font-medium text-center px-2"
          animate={{ opacity: isActive ? 1 : 0.7 }}
        >
          {skill.level}%
        </motion.span>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-full mt-5 z-20 pointer-events-none"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-[#0f0f14] border border-[#00d4aa]/30 rounded-xl px-5 py-4 whitespace-nowrap">
              <p className="text-white font-semibold text-base">{skill.name}</p>
              <p className="text-[#00d4aa] text-sm mt-1.5">
                {categories.find(c => c.id === skill.category)?.name} · {skill.level}%
              </p>
              <div className="mt-3 h-1.5 bg-[#1a1a1f] rounded-full overflow-hidden w-28">
                <motion.div
                  className="h-full bg-[#00d4aa]"
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SkillCloud() {
  const cloudRef = useRef(null);
  const isInView = useInView(cloudRef, { once: true, margin: '-100px' });
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  return (
    <div ref={cloudRef} className="relative h-[520px] flex items-center justify-center">
      <motion.div
        className="absolute w-[380px] h-[380px] rounded-full border border-[#00d4aa]/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full border border-[#00d4aa]/5"
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative">
        {skillsData.slice(0, HEX_POSITIONS.length).map((skill, index) => {
          const pos = HEX_POSITIONS[index];
          if (!pos) return null;
          const baseSize = 170;

          return (
            <motion.div
              key={skill.name}
              className="absolute"
              style={{
                left: pos.x * baseSize,
                top: pos.y * baseSize * 0.866,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: 'spring',
                stiffness: 100,
              }}
            >
              <HexagonSkill
                skill={skill}
                index={index}
                isActive={activeSkill === skill.name}
                onHover={() => setActiveSkill(skill.name)}
                onLeave={() => setActiveSkill(null)}
              />
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="absolute w-5 h-5 bg-[#00d4aa] rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}) {
  const tabsRef = useRef(null);
  const isInView = useInView(tabsRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={tabsRef}
      className="flex flex-wrap justify-center gap-4 mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        className={`px-6 py-3 rounded-full border text-base font-medium transition-all duration-300 ${
          activeCategory === null
            ? 'bg-[#00d4aa] text-[#0a0a0f] border-[#00d4aa]'
            : 'bg-transparent text-[#8a8a8a] border-[#2a2a2a] hover:border-[#00d4aa]/50'
        }`}
        onClick={() => onCategoryChange(null)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        全部
      </motion.button>
      {categories.map((category) => (
        <motion.button
          key={category.id}
          className={`px-6 py-3 rounded-full border text-base font-medium transition-all duration-300 flex items-center gap-2 ${
            activeCategory === category.id
              ? 'bg-[#00d4aa]/20 text-[#00d4aa] border-[#00d4aa]'
              : 'bg-transparent text-[#8a8a8a] border-[#2a2a2a] hover:border-[#00d4aa]/50'
          }`}
          onClick={() => onCategoryChange(category.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-sm">{category.icon}</span>
          {category.name}
        </motion.button>
      ))}
    </motion.div>
  );
}

function SkillListItem({
  skill,
  index,
}: {
  skill: typeof skillsData[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const category = categories.find(c => c.id === skill.category);

  return (
    <motion.div
      layout
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-5 p-6 rounded-xl bg-[#0f0f14] border border-[#1a1a1f] hover:border-[#00d4aa]/30 transition-all duration-300">
        <div className="w-14 h-14 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center border border-[#00d4aa]/20">
          <span className="text-[#00d4aa] font-bold font-mono text-lg">{skill.icon}</span>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium text-base">{skill.name}</h4>
            <span className="text-[#00d4aa] font-mono text-base font-semibold">{skill.level}%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#8a8a8a]">{category?.name}</span>
            <div className="flex-1 h-2 bg-[#1a1a1f] rounded-full overflow-hidden max-w-[160px]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00d4aa] to-[#00d4aa]/50 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 0.5, delay: index * 0.05 + 0.1 }}
              />
            </div>
          </div>
        </div>

        <motion.div
          className="w-2.5 h-2.5 rounded-full bg-[#00d4aa]"
          animate={{
            scale: isHovered ? 1.5 : 1,
            opacity: isHovered ? 1 : 0.3,
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredSkills = activeCategory
    ? skillsData.filter(s => s.category === activeCategory)
    : skillsData;

  return (
    <section
      id="skills"
      className="py-32 lg:py-40 bg-[#0a0a0f] relative overflow-hidden"
      ref={sectionRef}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-[800px] h-[800px] bg-[#00d4aa]/4 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#00d4aa]/3 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-24"
        >
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-16 h-[2px] bg-[#00d4aa]" />
            <span className="text-[#00d4aa] text-sm font-mono uppercase tracking-widest">
              {skillsContent.sectionSubtitle}
            </span>
            <div className="w-16 h-[2px] bg-[#00d4aa]" />
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6">
            {skillsContent.sectionTitle}
          </h2>
          <p className="text-[#8a8a8a] max-w-2xl mx-auto text-lg leading-relaxed">
            精通虚幻引擎开发，专注于UMG界面设计、材质系统与视觉特效
          </p>
        </motion.div>

        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="sticky top-32">
            <SkillCloud />
          </div>

          <div className="space-y-4 min-h-[520px]">
            {filteredSkills.map((skill, index) => (
              <SkillListItem
                key={`${skill.name}-${skill.category}`}
                skill={skill}
                index={index}
              />
            ))}

            <motion.div
              className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-[#1a1a1f]"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {[
                { label: '平均熟练度', value: '87.5%' },
                { label: '技能数量', value: '14+' },
                { label: '核心领域', value: '3' },
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <motion.div
                    className="text-3xl font-bold text-[#00d4aa] font-mono"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-[#8a8a8a] mt-2">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mt-24"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="text-center text-xl font-semibold text-white mb-10">
            技术栈标签
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {skillsContent.techStack.map((tech, index) => (
              <motion.span
                key={tech}
                className="px-5 py-2.5 rounded-full bg-[#0f0f14] border border-[#1a1a1f] text-[#8a8a8a] text-sm hover:border-[#00d4aa]/50 hover:text-[#00d4aa] transition-all duration-300 cursor-default"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 1 + index * 0.02 }}
                whileHover={{ scale: 1.05 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-28 h-px bg-gradient-to-r from-transparent via-[#00d4aa]/20 to-transparent" />
    </section>
  );
}
