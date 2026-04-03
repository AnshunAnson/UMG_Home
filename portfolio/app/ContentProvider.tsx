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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadContent() {
      let result = { ...defaultContent };
      const basePath = typeof window !== 'undefined' && window.location.pathname.startsWith('/UMG_Home') ? '/UMG_Home' : '';

      try {
        const res = await fetch(`${basePath}/content.json`);
        if (res.ok) {
          const json = await res.json();
          if (json.heroContent) result.hero = { ...defaultContent.hero, ...json.heroContent };
          if (json.aboutContent) result.about = { ...defaultContent.about, ...json.aboutContent };
          if (json.projectsContent) result.projects = { ...defaultContent.projects, ...json.projectsContent };
          if (json.skillsContent) result.skills = { ...defaultContent.skills, ...json.skillsContent };
          if (json.contactContent) result.contact = { ...defaultContent.contact, ...json.contactContent };
        }
      } catch (e) {
        console.info('content.json not found, using defaults');
      }

      try {
        const stored = localStorage.getItem('portfolio-content');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.heroContent) result.hero = { ...result.hero, ...parsed.heroContent };
          if (parsed.aboutContent) result.about = { ...result.about, ...parsed.aboutContent };
          if (parsed.projectsContent) result.projects = { ...result.projects, ...parsed.projectsContent };
          if (parsed.skillsContent) result.skills = { ...result.skills, ...parsed.skillsContent };
          if (parsed.contactContent) result.contact = { ...result.contact, ...parsed.contactContent };
        }
      } catch (e) {
        console.error('读取localStorage失败:', e);
      }

      setContent(result);
      setLoaded(true);
    }

    loadContent();
  }, []);

  if (!loaded) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#0a0a0f' }} />
    );
  }

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
