'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { MapPin, Briefcase, Calendar } from 'lucide-react';
import { aboutContent as defaultAboutContent } from '../config/content';
import { useContent } from '../ContentProvider';

// 动画计数器组件
function AnimatedCounter({ value, suffix = '', duration = 2000 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const steps = 60;
      const increment = value / steps;
      const stepDuration = duration / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(Math.floor(increment * step), value);
        setCount(current);
        
        if (step >= steps) {
          clearInterval(timer);
          setCount(value);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

// 数据卡片组件
function StatCard({ 
  icon: Icon, 
  value, 
  suffix = '', 
  label, 
  sublabel,
  delay = 0 
}: { 
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix?: string;
  label: string;
  sublabel?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative bg-[#13131a] border border-[#1f1f2e] rounded-xl p-8 lg:p-10 overflow-hidden
                 hover:border-[#00d4aa]/50 transition-colors duration-300"
    >
      {/* 背景光效 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00d4aa]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* 顶部装饰线 */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d4aa]/50 to-transparent 
                      scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-14 rounded-lg bg-[#00d4aa]/10 border border-[#00d4aa]/20 
                          flex items-center justify-center group-hover:bg-[#00d4aa]/20 transition-colors duration-300">
            <Icon className="w-6 h-6 text-[#00d4aa]" />
          </div>
          <span className="text-[#6b7280] text-sm font-medium">{label}</span>
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className="text-5xl md:text-6xl font-bold text-white tracking-tight">
            <AnimatedCounter value={value} suffix={suffix} />
          </span>
        </div>
        
        {sublabel && (
          <p className="mt-2 text-[#4b5563] text-sm">{sublabel}</p>
        )}
      </div>
    </motion.div>
  );
}

// 时间线项目组件
function TimelineItem({ 
  year, 
  title, 
  subtitle,
  delay = 0 
}: { 
  year: string;
  title: string;
  subtitle: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex gap-4 group"
    >
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-[#00d4aa] ring-4 ring-[#00d4aa]/20 group-hover:ring-[#00d4aa]/40 transition-all duration-300" />
        <div className="w-[2px] flex-1 bg-gradient-to-b from-[#00d4aa]/30 to-transparent mt-2" />
      </div>
      <div className="pb-8">
        <span className="text-[#00d4aa] text-sm font-mono">{year}</span>
        <h4 className="text-white font-semibold mt-1">{title}</h4>
        <p className="text-[#6b7280] text-sm mt-1">{subtitle}</p>
      </div>
    </motion.div>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  
  const content = useContent();
  const aboutContent = content?.about || defaultAboutContent;
  const { 
    sectionTitle, 
    sectionSubtitle, 
    bio, 
    age, 
    location, 
    experience, 
    currentCompany, 
    jobTitle,
    stats 
  } = aboutContent;

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="relative py-32 lg:py-40 bg-[#0a0a0f] overflow-hidden"
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        {/* 网格背景 */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 212, 170, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 170, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* 渐变光晕 */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#00d4aa]/5 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#00d4aa]/3 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        {/* 区域标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-24 lg:mb-32"
        >
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-[2px] bg-[#00d4aa]" />
            <span className="text-[#00d4aa] text-sm font-mono uppercase tracking-widest">
              {sectionSubtitle}
            </span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white">
            {sectionTitle.split('').map((char, index) => (
              <span key={index} className={char === '我' ? 'text-[#00d4aa]' : ''}>
                {char}
              </span>
            ))}
          </h2>
        </motion.div>

        {/* 主要内容区域 */}
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32">
          {/* 左侧：文字介绍 */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-10"
          >
            {/* 问候语 */}
            <div className="space-y-4">
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-2xl text-[#6b7280] font-light"
              >
                你好，我是
              </motion.p>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl md:text-5xl font-bold text-white"
              >
                {jobTitle}
              </motion.h3>
            </div>

            {/* 自我介绍 */}
            <div className="space-y-8 text-[#9ca3af] leading-relaxed text-xl">
              {bio.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* 时间线 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-8 border-t border-[#1f1f2e]"
            >
              <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#00d4aa]" />
                工作经历
              </h4>
              <div className="space-y-2">
                <TimelineItem 
                  year={`${2024 - experience} - 至今`} 
                  title={currentCompany}
                  subtitle={`${jobTitle} · 汽车渲染平台`}
                  delay={0.9}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* 右侧：数据可视化 */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            {/* 大数字展示 */}
            <div className="grid grid-cols-2 gap-8">
              <StatCard 
                icon={Calendar}
                value={age}
                suffix=""
                label="年龄"
                sublabel="岁的无限可能"
                delay={0.4}
              />
              <StatCard 
                icon={Briefcase}
                value={experience}
                suffix="年"
                label="工作经验"
                sublabel="UMG开发深耕"
                delay={0.5}
              />
            </div>

            {/* 所在城市 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-[#13131a] border border-[#1f1f2e] rounded-xl p-6 flex items-center gap-4
                         hover:border-[#00d4aa]/30 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-[#00d4aa]/10 border border-[#00d4aa]/20 
                              flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#00d4aa]" />
              </div>
              <div>
                <span className="text-[#6b7280] text-sm">所在城市</span>
                <p className="text-xl font-semibold text-white">{location}</p>
              </div>
            </motion.div>

            {/* 求职意向 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="relative bg-gradient-to-br from-[#00d4aa]/10 to-transparent border border-[#00d4aa]/20 
                         rounded-xl p-8 overflow-hidden group hover:border-[#00d4aa]/40 transition-colors duration-300"
            >
              {/* 装饰背景 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d4aa]/5 rounded-full blur-3xl group-hover:bg-[#00d4aa]/10 transition-colors duration-300" />
              
              <div className="relative z-10">
                <span className="text-[#00d4aa] text-sm font-mono uppercase tracking-wider">求职意向</span>
                <h4 className="text-3xl font-bold text-white mt-2">UMG重构</h4>
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="px-3 py-1 bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-full text-[#00d4aa] text-sm">
                    UE4/UE5
                  </span>
                  <span className="px-3 py-1 bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-full text-[#00d4aa] text-sm">
                    期望薪资 11-22K
                  </span>
                  <span className="px-3 py-1 bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-full text-[#00d4aa] text-sm">
                    {location}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* 当前工作状态 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-[#13131a] border border-[#1f1f2e] rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-3 h-3 bg-[#00d4aa] rounded-full" />
                  <div className="absolute inset-0 w-3 h-3 bg-[#00d4aa] rounded-full animate-ping" />
                </div>
                <span className="text-[#00d4aa] text-sm font-medium">目前就职</span>
              </div>
              <h4 className="text-xl font-bold text-white">{currentCompany}</h4>
              <p className="text-[#6b7280] mt-2">
                担任{jobTitle}，负责汽车渲染平台的界面重构与架构设计工作。
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 底部装饰线 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1f1f2e] to-transparent" />
    </section>
  );
}
