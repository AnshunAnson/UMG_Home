// 统一内容类型定义
// 前端展示和 edit 页面共享此类型定义

// Hero 区域
export interface HeroStat {
  icon: string;
  label: string;
}

export interface HeroContent {
  badge: string;
  name: string;
  nameHighlightLength: number;
  subtitle: string;
  stats: HeroStat[];
  cornerLeft: string;
  cornerRight: string;
}

// About 区域
export interface AboutStat {
  label: string;
  value: number;
  suffix: string;
}

export interface CoreSkill {
  title: string;
  description: string;
}

export interface AboutContent {
  sectionTitle: string;
  sectionSubtitle: string;
  bio: string[];
  age: number;
  location: string;
  experience: number;
  currentCompany: string;
  jobTitle: string;
  stats: AboutStat[];
  coreSkills: CoreSkill[];
}

// Projects 区域
export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  id: number;
  icon: string;
  title: string;
  company: string;
  period: string;
  category: string;
  description: string;
  details: string[];
  achievements: string[];
  tech: string[];
  color: string;
  images?: ProjectImage[];
}

export interface ProjectsContent {
  sectionTitle: string;
  sectionSubtitle: string;
  projects: Project[];
}

// Skills 区域
export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface SkillsContent {
  sectionTitle: string;
  sectionSubtitle: string;
  categories: SkillCategory[];
  techStack: string[];
}

// Contact 区域
export interface ContactContent {
  sectionTitle: string;
  sectionSubtitle: string;
  description: string;
  email: string;
  phone: string;
  location: string;
}

// Footer 区域
export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  icon: string;
  href: string;
  label: string;
}

export interface FooterContent {
  logo: string;
  logoHighlight: string;
  tagline: string;
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  copyright: string;
}

// 统一导出
export interface PortfolioContent {
  heroContent: HeroContent;
  aboutContent: AboutContent;
  projectsContent: ProjectsContent;
  skillsContent: SkillsContent;
  contactContent: ContactContent;
  footerContent: FooterContent;
}
