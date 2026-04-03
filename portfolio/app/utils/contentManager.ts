// 内容管理工具函数
// 用于读取编辑后的内容或默认配置内容

import {
  heroContent as defaultHero,
  aboutContent as defaultAbout,
  projectsContent as defaultProjects,
  skillsContent as defaultSkills,
  contactContent as defaultContact,
  footerContent as defaultFooter
} from '../config/content';

// 内容结构类型
interface ContentStructure {
  hero: unknown;
  about: unknown;
  projects: unknown;
  skills: unknown;
  contact: unknown;
  footer: unknown;
}

// 类型守卫函数
function isValidContent(obj: unknown): obj is ContentStructure {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  const keys = ['hero', 'about', 'projects', 'skills', 'contact', 'footer'];
  return keys.every(key => key in obj);
}

// 检查是否在浏览器环境
const isBrowser = typeof window !== 'undefined';

// 获取编辑后的内容
export function getEditedContent() {
  if (!isBrowser) {
    return {
      hero: defaultHero,
      about: defaultAbout,
      projects: defaultProjects,
      skills: defaultSkills,
      contact: defaultContact,
      footer: defaultFooter
    };
  }

  try {
    const stored = localStorage.getItem('editedContent');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (isValidContent(parsed)) {
        return parsed;
      }
      console.warn('编辑内容格式无效，使用默认内容');
    }
  } catch (e) {
    console.error('读取编辑内容失败:', e instanceof Error ? e.message : String(e));
  }

  return {
    hero: defaultHero,
    about: defaultAbout,
    projects: defaultProjects,
    skills: defaultSkills,
    contact: defaultContact,
    footer: defaultFooter
  };
}

// 清除编辑内容
export function clearEditedContent() {
  if (isBrowser) {
    localStorage.removeItem('editedContent');
  }
}
