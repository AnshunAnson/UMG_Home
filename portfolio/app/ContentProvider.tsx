'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  heroContent as defaultHero, 
  aboutContent as defaultAbout, 
  projectsContent as defaultProjects, 
  skillsContent as defaultSkills, 
  contactContent as defaultContact,
  footerContent as defaultFooter 
} from './config/content';

interface EditedContent {
  hero: typeof defaultHero;
  about: typeof defaultAbout;
  projects: typeof defaultProjects;
  skills: typeof defaultSkills;
  contact: typeof defaultContact;
  footer: typeof defaultFooter;
}

const ContentContext = createContext<EditedContent | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<EditedContent>({
    hero: defaultHero,
    about: defaultAbout,
    projects: defaultProjects,
    skills: defaultSkills,
    contact: defaultContact,
    footer: defaultFooter
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('portfolio-content');
      if (stored) {
        const parsed = JSON.parse(stored);
        setContent({
          hero: parsed.hero || defaultHero,
          about: parsed.about || defaultAbout,
          projects: parsed.projects || defaultProjects,
          skills: parsed.skills || defaultSkills,
          contact: parsed.contact || defaultContact,
          footer: defaultFooter
        });
      }
    } catch (e) {
      console.error('读取编辑内容失败:', e);
    }
  }, []);

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
