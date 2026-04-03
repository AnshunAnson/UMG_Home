'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { skillsContent } from '../config/content';

// 技能数据配置 - 基于真实简历
const skillsData = [
  { name: 'UMG/Slate', level: 92, category: 'ui', icon: 'UI' },
  { name: 'Material Editor', level: 90, category: 'vfx', icon: 'ME' },
  { name: 'Blueprints', level: 88, category: 'engine', icon: 'BP' },
  { name: 'Niagara VFX', level: 85, category: 'vfx', icon: 'VX' },
  { name: 'Unreal Engine 4/5', level: 95, category: 'engine', icon: 'UE' },
  { name: 'UE C++', level: 75, category: 'programming', icon: 'C++' },
];

// 分类配置
const categories = [
  { id: 'ui', name: 'UI/UMG', color: '#00d4aa', icon: '□' },
  { id: 'vfx', name: '材质/特效', color: '#00d4aa', icon: '✦' },
  { id: 'engine', name: '引擎', color: '#00d4aa', icon: '◆' },
  { id: 'programming', name: '编程', color: '#00d4aa', icon: '</>' },
];

// 蜂窝布局位置 - 移到组件外部避免重复创建
const HEX_POSITIONS = [
  { x: 0, y: 0 },      // 中心
  { x: 1.1, y: 0 },    // 右
  { x: 0.55, y: 0.95 }, // 右下
  { x: -0.55, y: 0.95 }, // 左下
  { x: -1.1, y: 0 },   // 左
  { x: -0.55, y: -0.95 }, // 左上
];

// 六边形技能卡片组件
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

  // 根据等级计算大小
  const baseSize = 120;
  const sizeMultiplier = 0.8 + (skill.level / 100) * 0.4;
  const size = baseSize * sizeMultiplier;

  // 计算六边形路径
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
      {/* 六边形背景 */}
      <svg
        width={size}
        height={size * 0.866}
        viewBox={`0 0 ${size} ${size * 0.866}`}
        className="absolute inset-0"
      >
        {/* 外发光 */}
        <defs>
          <filter id={`glow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4aa" stopOpacity={isActive ? 0.3 : 0.1} />
            <stop offset="100%" stopColor="#00d4aa" stopOpacity={isActive ? 0.1 : 0.05} />
          </linearGradient>
        </defs>

        {/* 边框六边形 */}
        <motion.path
          d={hexPath(size)}
          fill="none"
          stroke="#00d4aa"
          strokeWidth={isActive ? 2 : 1}
          opacity={isActive ? 1 : 0.5}
          filter={isActive ? `url(#glow-${index})` : undefined}
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
        />

        {/* 填充六边形 */}
        <motion.path
          d={hexPath(size)}
          fill={`url(#grad-${index})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
        />

        {/* 进度环 */}
        <motion.circle
          cx={size / 2}
          cy={(size * 0.866) / 2}
          r={size * 0.35}
          fill="none"
          stroke="#00d4aa"
          strokeWidth={2}
          strokeDasharray={`${2 * Math.PI * size * 0.35 * (skill.level / 100)} ${2 * Math.PI * size * 0.35}`}
          strokeLinecap="round"
          initial={{ rotate: -90, opacity: 0 }}
          animate={isInView ? { rotate: -90, opacity: isActive ? 1 : 0.3 } : {}}
          transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
          style={{ transformOrigin: 'center' }}
        />
      </svg>

      {/* 内容 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-[#00d4aa] font-bold text-lg font-mono"
          animate={{ scale: isActive ? 1.2 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {skill.icon}
        </motion.span>
        <motion.span
          className="text-white text-xs mt-1 font-medium text-center px-2"
          animate={{ opacity: isActive ? 1 : 0.7 }}
        >
          {skill.level}%
        </motion.span>
      </div>

      {/* 悬停详情 */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-full mt-4 z-20 pointer-events-none"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-[#0f0f14] border border-[#00d4aa]/30 rounded-lg px-4 py-3 whitespace-nowrap">
              <p className="text-white font-semibold text-sm">{skill.name}</p>
              <p className="text-[#00d4aa] text-xs mt-1">
                {categories.find(c => c.id === skill.category)?.name} · {skill.level}%
              </p>
              <div className="mt-2 h-1 bg-[#1a1a1f] rounded-full overflow-hidden w-24">
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

// 圆形技能云组件
function SkillCloud() {
  const cloudRef = useRef(null);
  const isInView = useInView(cloudRef, { once: true, margin: '-100px' });
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  return (
    <div ref={cloudRef} className="relative h-[400px] flex items-center justify-center">
      {/* 背景装饰圆 */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full border border-[#00d4aa]/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full border border-[#00d4aa]/5"
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      />

      {/* 技能六边形 */}
      <div className="relative">
        {skillsData.map((skill, index) => {
          const pos = HEX_POSITIONS[index];
          const baseSize = 140;

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

      {/* 中心装饰 */}
      <motion.div
        className="absolute w-4 h-4 bg-[#00d4aa] rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

// 分类标签组件
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
      className="flex flex-wrap justify-center gap-3 mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
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
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
            activeCategory === category.id
              ? 'bg-[#00d4aa]/20 text-[#00d4aa] border-[#00d4aa]'
              : 'bg-transparent text-[#8a8a8a] border-[#2a2a2a] hover:border-[#00d4aa]/50'
          }`}
          onClick={() => onCategoryChange(category.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-xs">{category.icon}</span>
          {category.name}
        </motion.button>
      ))}
    </motion.div>
  );
}

// 技能列表项组件
function SkillListItem({
  skill,
  index,
}: {
  skill: typeof skillsData[0];
  index: number;
}) {
  const itemRef = useRef(null);
  const isInView = useInView(itemRef, { once: true, margin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);

  const category = categories.find(c => c.id === skill.category);

  return (
    <motion.div
      ref={itemRef}
      className="relative group"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0f0f14] border border-[#1a1a1f] hover:border-[#00d4aa]/30 transition-all duration-300">
        {/* 图标 */}
        <div className="w-12 h-12 rounded-lg bg-[#00d4aa]/10 flex items-center justify-center border border-[#00d4aa]/20">
          <span className="text-[#00d4aa] font-bold font-mono">{skill.icon}</span>
        </div>

        {/* 信息 */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-white font-medium">{skill.name}</h4>
            <span className="text-[#00d4aa] font-mono text-sm">{skill.level}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8a8a8a]">{category?.name}</span>
            <div className="flex-1 h-1.5 bg-[#1a1a1f] rounded-full overflow-hidden max-w-[120px]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00d4aa] to-[#00d4aa]/50 rounded-full"
                initial={{ width: 0 }}
                animate={isInView ? { width: `${skill.level}%` } : {}}
                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* 悬停指示器 */}
        <motion.div
          className="w-2 h-2 rounded-full bg-[#00d4aa]"
          animate={{
            scale: isHovered ? 1.5 : 1,
            opacity: isHovered ? 1 : 0.3,
          }}
        />
      </div>
    </motion.div>
  );
}

// 主组件
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
      className="py-24 bg-[#0a0a0f]"
      ref={sectionRef}
    >
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-[2px] bg-[#00d4aa]" />
            <span className="text-[#8a8a8a] text-sm uppercase tracking-wider font-mono">
              {skillsContent.sectionSubtitle}
            </span>
            <div className="w-8 h-[2px] bg-[#00d4aa]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {skillsContent.sectionTitle}
          </h2>
          <p className="text-[#8a8a8a] max-w-2xl mx-auto">
            精通虚幻引擎开发，专注于UMG界面设计、材质系统与视觉特效
          </p>
        </motion.div>

        {/* 分类标签 */}
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* 技能展示区域 */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 左侧：六边形技能云 */}
          <SkillCloud />

          {/* 右侧：技能列表 */}
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {filteredSkills.map((skill, index) => (
                <SkillListItem
                  key={skill.name}
                  skill={skill}
                  index={index}
                />
              ))}
            </AnimatePresence>

            {/* 技能统计 */}
            <motion.div
              className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#1a1a1f]"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {[
                { label: '平均熟练度', value: '87.5%' },
                { label: '技能数量', value: '6+' },
                { label: '核心领域', value: '4' },
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <motion.div
                    className="text-2xl font-bold text-[#00d4aa] font-mono"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xs text-[#8a8a8a] mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* 底部技术标签云 */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="text-center text-lg font-semibold text-white mb-8">
            技术栈标签
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {skillsContent.techStack.map((tech, index) => (
              <motion.span
                key={tech}
                className="px-4 py-2 rounded-full bg-[#0f0f14] border border-[#1a1a1f] text-[#8a8a8a] text-sm hover:border-[#00d4aa]/50 hover:text-[#00d4aa] transition-all duration-300 cursor-default"
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

      {/* Section Divider */}
      <div className="mt-24 h-px bg-gradient-to-r from-transparent via-[#00d4aa]/20 to-transparent" />
    </section>
  );
}
