'use client';

import { createContext, useContext } from 'react';
import {
  heroContent,
  aboutContent,
  projectsContent,
  skillsContent,
  contactContent,
  footerContent,
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

const content: EditedContent = {
  hero: heroContent,
  about: aboutContent,
  projects: projectsContent,
  skills: skillsContent,
  contact: contactContent,
  footer: footerContent,
};

export function ContentProvider({ children }: { children: React.ReactNode }) {
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
