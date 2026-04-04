'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Mail, MapPin, Phone, GitBranch, Link2, Send, ArrowUpRight } from 'lucide-react';
import { contactContent } from '../config/content';
import Footer from './Footer';

// 磁吸按钮组件
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

function MagneticButton({ children, className = '', onClick, href }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // 磁吸效果强度
    const strength = 0.4;
    x.set(distanceX * strength);
    y.set(distanceY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      ref={ref as any}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </Component>
  );
}

// 社交链接图标组件
interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  delay?: number;
}

function SocialLink({ href, icon, label, delay = 0 }: SocialLinkProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="group relative w-14 h-14 rounded-full bg-[#111118] border border-[#2a2a35] 
                 flex items-center justify-center overflow-hidden
                 hover:border-[#00d4aa] transition-colors duration-300"
    >
      {/* 背景光效 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#00d4aa]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      {/* 图标 */}
      <span className="relative z-10 text-[#8a8a9a] group-hover:text-[#00d4aa] transition-colors duration-300">
        {icon}
      </span>
      {/* 提示文字 */}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-[#00d4aa] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {label}
      </span>
    </motion.a>
  );
}

// 联系信息卡片
interface ContactCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  delay?: number;
}

function ContactCard({ icon, label, value, href, delay = 0 }: ContactCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ x: 5 }}
      className="group flex items-center gap-4 p-4 rounded-xl bg-[#111118]/50 border border-[#2a2a35]/50
                 hover:border-[#00d4aa]/30 hover:bg-[#111118] transition-all duration-300 cursor-pointer"
    >
      <div className="w-12 h-12 rounded-lg bg-[#00d4aa]/10 border border-[#00d4aa]/20
                      flex items-center justify-center flex-shrink-0
                      group-hover:bg-[#00d4aa]/20 group-hover:border-[#00d4aa]/40 transition-all duration-300">
        <span className="text-[#00d4aa]">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#5a5a6a] text-xs uppercase tracking-wider mb-1">{label}</p>
        <p className="text-white text-sm font-medium truncate group-hover:text-[#00d4aa] transition-colors duration-300">
          {value}
        </p>
      </div>
      {href && (
        <ArrowUpRight className="w-4 h-4 text-[#5a5a6a] opacity-0 group-hover:opacity-100 group-hover:text-[#00d4aa] transition-all duration-300" />
      )}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
}

// 浮动粒子背景 - 使用固定值避免hydration mismatch
const PARTICLE_CONFIG = [
  { left: '15%', top: '20%', duration: 12, delay: 0 },
  { left: '30%', top: '45%', duration: 15, delay: 2 },
  { left: '45%', top: '70%', duration: 13, delay: 4 },
  { left: '60%', top: '20%', duration: 17, delay: 1 },
  { left: '75%', top: '45%', duration: 14, delay: 3 },
  { left: '90%', top: '70%', duration: 16, delay: 5 },
];

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLE_CONFIG.map((config, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#00d4aa]/20"
          initial={{
            x: '0%',
            y: '0%',
          }}
          animate={{
            y: ['0%', '-20%', '20%', '0%'],
            x: ['0%', '10%', '-10%', '0%'],
          }}
          transition={{
            duration: config.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: config.delay,
          }}
          style={{
            left: config.left,
            top: config.top,
          }}
        />
      ))}
    </div>
  );
}

// 主组件
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 鼠标跟随光效
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = (sectionRef.current as HTMLElement).getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const { sectionTitle, sectionSubtitle, description, email, phone, location, jobTitle, salary } = contactContent;

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: '邮箱',
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: '电话',
      value: phone,
      href: `tel:${phone}`,
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: '城市',
      value: location,
    },
  ];

  const socialLinks = [
    {
      href: 'https://github.com',
      icon: <GitBranch className="w-5 h-5" />,
      label: 'GitHub',
    },
    {
      href: 'https://linkedin.com',
      icon: <Link2 className="w-5 h-5" />,
      label: 'LinkedIn',
    },
    {
      href: `mailto:${email}`,
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen bg-[#0a0a0f] overflow-hidden"
    >
      {/* 动态背景光效 */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)',
          left: mousePosition.x - 300,
          top: mousePosition.y - 300,
        }}
        animate={{
          left: mousePosition.x - 300,
          top: mousePosition.y - 300,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      />

      {/* 顶部渐变分隔线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d4aa]/30 to-transparent" />

      {/* 浮动粒子 */}
      <FloatingParticles />

      {/* 主要内容区域 */}
      <div className="relative z-10 container mx-auto px-6 py-24 lg:py-32">
        {/* 大字号行动号召 */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#00d4aa]" />
            <span className="text-[#00d4aa] text-sm uppercase tracking-[0.3em] font-mono">
              {sectionSubtitle}
            </span>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#00d4aa]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
          >
            {sectionTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#8a8a9a] text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            {description}
          </motion.p>

          {/* 求职意向标签 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <span className="px-4 py-2 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/30 text-[#00d4aa] text-sm">
              {jobTitle}
            </span>
            <span className="px-4 py-2 rounded-full bg-[#111118] border border-[#2a2a35] text-[#8a8a9a] text-sm">
              期望薪资: {salary}
            </span>
            <span className="px-4 py-2 rounded-full bg-[#111118] border border-[#2a2a35] text-[#8a8a9a] text-sm">
              {location}
            </span>
          </motion.div>

          {/* 磁吸CTA按钮 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton
              href={`mailto:${email}`}
              className="group relative px-10 py-5 rounded-full bg-[#00d4aa] text-[#0a0a0f] font-semibold text-lg
                         flex items-center gap-3 overflow-hidden"
            >
              {/* 按钮背景动画 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#00b894] to-[#00d4aa]"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 flex items-center gap-3">
                <Send className="w-5 h-5" />
                立即联系我
              </span>
            </MagneticButton>

            <MagneticButton
              href={`tel:${phone}`}
              className="px-10 py-5 rounded-full bg-transparent border-2 border-[#2a2a35] text-white font-semibold text-lg
                         hover:border-[#00d4aa] hover:text-[#00d4aa] transition-colors duration-300"
            >
              拨打电话
            </MagneticButton>
          </motion.div>
        </div>

        {/* 联系信息与社交链接 */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto mb-20">
          {/* 联系信息 */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white text-xl font-semibold mb-6 flex items-center gap-3"
            >
              <span className="w-8 h-[2px] bg-[#00d4aa]" />
              联系方式
            </motion.h3>
            <div className="space-y-3">
              {contactInfo.map((info, index) => (
                <ContactCard
                  key={info.label}
                  {...info}
                  delay={0.1 * index}
                />
              ))}
            </div>
          </div>

          {/* 社交链接 */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white text-xl font-semibold mb-6 flex items-center gap-3"
            >
              <span className="w-8 h-[2px] bg-[#00d4aa]" />
              社交媒体
            </motion.h3>
            <div className="flex gap-4">
              {socialLinks.map((link, index) => (
                <SocialLink
                  key={link.label}
                  {...link}
                  delay={0.1 * index}
                />
              ))}
            </div>

            {/* 额外信息卡片 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#111118] to-[#0d0d12] border border-[#2a2a35]/50"
            >
              <p className="text-[#5a5a6a] text-sm mb-2">当前状态</p>
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4aa] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00d4aa]"></span>
                </span>
                <span className="text-white font-medium">正在寻找新机会</span>
              </div>
              <p className="text-[#8a8a9a] text-sm mt-3">
                随时欢迎工作机会和项目合作，期待与您的交流！
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}
