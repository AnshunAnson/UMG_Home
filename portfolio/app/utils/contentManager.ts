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
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('读取编辑内容失败:', e);
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
