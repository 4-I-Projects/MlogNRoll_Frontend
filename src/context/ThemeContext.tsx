import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes } from '../themes';

interface ThemeContextType {
  themeId: string;
  setThemeId: (id: string) => void;
  currentTheme: typeof themes.happy;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState(() => {
    return localStorage.getItem('app-theme') || 'happy';
  });

  const setThemeId = (id: string) => {
    setThemeIdState(id);
  };

  useEffect(() => {
    localStorage.setItem('app-theme', themeId);
    const root = window.document.documentElement;
    root.setAttribute('data-theme', themeId);
  }, [themeId]);

  const currentTheme = themes[themeId as keyof typeof themes] || themes.happy;

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}