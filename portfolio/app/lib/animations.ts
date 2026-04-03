// 公共动画配置文件
// 统一管理和复用动画配置

import { Variants, Transition } from 'framer-motion';

// 淡入上移动画
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
};

// 淡入左移动画
export const fadeInLeft = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
};

// 淡入右移动画
export const fadeInRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
};

// 缩放淡入动画
export const scaleFadeIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
};

// 交错容器动画
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// 交错子元素动画
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

// 字母逐字动画容器
export const letterContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

// 字母逐字动画
export const letterItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    rotateX: -90 
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100
    }
  }
};

// 脉冲动画
export const pulseAnimation = {
  initial: { scale: 1, opacity: 0.8 },
  animate: { 
    scale: 2.5, 
    opacity: 0,
    transition: { duration: 2, repeat: Infinity, ease: 'easeOut' }
  }
};

// 悬停上浮效果
export const hoverLift = {
  whileHover: { 
    y: -5, 
    transition: { duration: 0.2 } 
  }
};

// 卡片3D倾斜效果
export const card3DTilt = (rotateX: number, rotateY: number, isHovered: boolean) => ({
  transform: isHovered 
    ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
    : 'rotateX(0deg) rotateY(0deg) translateZ(0)',
  transition: 'transform 0.15s ease-out'
});

// 默认过渡配置
export const defaultTransition: Transition = {
  duration: 0.6,
  ease: [0.25, 0.46, 0.45, 0.94]
};

// 视口动画配置
export const viewportConfig = {
  once: true,
  margin: '-100px' as const
};

// 视口动画配置（小margin）
export const viewportConfigSmall = {
  once: true,
  margin: '-50px' as const
};
