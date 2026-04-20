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
  jobTitle: string;
  coreSkills: CoreSkill[];
}

export interface ProjectImage {
  src: string;
  alt: string;
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
  links?: ProjectLink[];
  images?: ProjectImage[];
}

export interface Project {
  id: number;
  icon: string;
  title: string;
  period: string;
  category: string;
  description: string;
  details: string[];
  achievements: string[];
  tech: string[];
  color: string;
  images?: ProjectImage[];
  links?: ProjectLink[];
  subProjects?: ProjectSubProject[];
}

export interface ProjectsContent {
  sectionTitle: string;
  sectionSubtitle: string;
  projects: Project[];
}

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

export interface ContactContent {
  sectionTitle: string;
  sectionSubtitle: string;
  description: string;
  email: string;
  phone: string;
  location: string;
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

export interface PortfolioContent {
  heroContent: HeroContent;
  aboutContent: AboutContent;
  projectsContent: ProjectsContent;
  skillsContent: SkillsContent;
  contactContent: ContactContent;
  footerContent: FooterContent;
}
