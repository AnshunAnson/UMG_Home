'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface ProjectHoverContextType {
  hoveredId: number | null;
  isLeaving: boolean;
  themeColor: string | null;
  setHoveredId: (id: number | null) => void;
  setIsLeaving: (leaving: boolean) => void;
  handleMouseEnter: (id: number, color: string) => void;
  handleMouseLeave: () => void;
}

const ProjectHoverContext = createContext<ProjectHoverContextType | undefined>(undefined);

const themeColors: Record<number, string> = {
  1: '#00d4aa',
  2: '#00a8e8',
  3: '#9d4edd',
  4: '#ff6b35',
  5: '#ff006e',
};

export function ProjectHoverProvider({ children }: { children: React.ReactNode }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [themeColor, setThemeColor] = useState<string | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((id: number, color: string) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setHoveredId(id);
    setThemeColor(color);
    setIsLeaving(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsLeaving(true);
    // Wait for animation cycle to complete (2 seconds)
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredId(null);
      setThemeColor(null);
      setIsLeaving(false);
    }, 2000);
  }, []);

  return (
    <ProjectHoverContext.Provider
      value={{
        hoveredId,
        isLeaving,
        themeColor,
        setHoveredId,
        setIsLeaving,
        handleMouseEnter,
        handleMouseLeave,
      }}
    >
      {children}
    </ProjectHoverContext.Provider>
  );
}

export function useProjectHover() {
  const context = useContext(ProjectHoverContext);
  if (context === undefined) {
    throw new Error('useProjectHover must be used within a ProjectHoverProvider');
  }
  return context;
}

export { themeColors };
