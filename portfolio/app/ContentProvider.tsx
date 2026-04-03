'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
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

const defaultContent: EditedContent = {
  hero: defaultHero,
  about: defaultAbout,
  projects: defaultProjects,
  skills: defaultSkills,
  contact: defaultContact,
  footer: defaultFooter
};

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<EditedContent>(defaultContent);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const basePath = typeof window !== 'undefined' && window.location.pathname.startsWith('/UMG_Home') ? '/UMG_Home' : '';

    fetch(`${basePath}/content.json`)
      .then(res => res.json())
      .then(json => {
        setContent(prev => ({
          hero: json.heroContent ? { ...prev.hero, ...json.heroContent } : prev.hero,
          about: json.aboutContent ? { ...prev.about, ...json.aboutContent } : prev.about,
          projects: json.projectsContent ? { ...prev.projects, ...json.projectsContent } : prev.projects,
          skills: json.skillsContent ? { ...prev.skills, ...json.skillsContent } : prev.skills,
          contact: json.contactContent ? { ...prev.contact, ...json.contactContent } : prev.contact,
          footer: prev.footer,
        }));
      })
      .catch(() => {});

    try {
      const stored = localStorage.getItem('portfolio-content');
      if (stored) {
        const parsed = JSON.parse(stored);
        setContent(prev => ({
          hero: parsed.heroContent ? { ...prev.hero, ...parsed.heroContent } : prev.hero,
          about: parsed.aboutContent ? { ...prev.about, ...parsed.aboutContent } : prev.about,
          projects: parsed.projectsContent ? { ...prev.projects, ...parsed.projectsContent } : prev.projects,
          skills: parsed.skillsContent ? { ...prev.skills, ...parsed.skillsContent } : prev.skills,
          contact: parsed.contactContent ? { ...prev.contact, ...parsed.contactContent } : prev.contact,
          footer: prev.footer,
        }));
      }
    } catch {}
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
