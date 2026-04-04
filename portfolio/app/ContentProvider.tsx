'use client';

import { createContext, useContext, useState } from 'react';
import { 
  heroContent as defaultHero, 
  aboutContent as defaultAbout, 
  projectsContent as defaultProjects, 
  skillsContent as defaultSkills,
  contactContent as defaultContact,
  footerContent as defaultFooter 
} from './config/content';
import type {
  HeroContent,
  AboutContent,
  ProjectsContent,
  SkillsContent,
  ContactContent,
  FooterContent,
} from './types/content';

interface EditedContent {
  hero: HeroContent;
  about: AboutContent;
  projects: ProjectsContent;
  skills: SkillsContent;
  contact: ContactContent;
  footer: FooterContent;
}

const ContentContext = createContext<EditedContent | null>(null);

const defaultContent: EditedContent = {
  hero: defaultHero,
  about: defaultAbout,
  projects: defaultProjects,
  skills: defaultSkills,
  contact: defaultContact,
  footer: defaultFooter
};

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content] = useState<EditedContent>(defaultContent);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
