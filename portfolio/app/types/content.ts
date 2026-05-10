export interface HeroContent {
  badge: string;
  name: string;
  nameHighlightLength: number;
  subtitle: string;
}

export interface AboutContent {
  bio: string[];
  age: number;
  experience: number;
  jobTitle: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
  preserveAspectRatio?: boolean;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectSubProject {
  title: string;
  period?: string;
  description?: string;
  details?: string[];
  tech?: string[];
  links?: ProjectLink[];
  images?: ProjectImage[];
  embedUrl?: string;
}

export interface Project {
  id: number;
  icon: string;
  title: string;
  period: string;
  category: string;
  description?: string;
  details?: string[];
  achievements?: string[];
  tech: string[];
  color: string;
  images?: ProjectImage[];
  links?: ProjectLink[];
  subProjects?: ProjectSubProject[];
}

export interface ProjectsContent {
  projects: Project[];
}

export interface Skill {
  name: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface SkillsContent {
  categories: SkillCategory[];
  techStack: string[];
}

export interface ContactContent {
  description: string;
  email: string;
  phone: string;
}

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
