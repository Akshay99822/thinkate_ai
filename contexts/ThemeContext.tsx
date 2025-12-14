import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppTheme, ThemeColor, FontFamily, FontSize, UIStyle } from '../types';
import { THEME_PRESETS } from '../constants';

interface ThemeContextType {
  theme: AppTheme;
  toggleDarkMode: () => void;
  setColorTheme: (color: ThemeColor) => void;
  setFontFamily: (font: FontFamily) => void;
  setFontSize: (size: FontSize) => void;
  setUIStyle: (style: UIStyle) => void;
}

const defaultTheme: AppTheme = {
  isDarkMode: false,
  colorTheme: 'blue',
  fontFamily: 'Inter',
  fontSize: 'normal',
  uiStyle: 'standard',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('studybuddy-theme');
    return saved ? JSON.parse(saved) : defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem('studybuddy-theme', JSON.stringify(theme));
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (currentTheme: AppTheme) => {
    const root = document.documentElement;
    const colors = THEME_PRESETS[currentTheme.colorTheme];

    // 1. Apply Colors
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    
    // Background/Surface depends on Dark Mode preference mostly, 
    // but Neon theme might override
    if (currentTheme.colorTheme === 'neon') {
       root.style.setProperty('--color-background', '#000000');
       root.style.setProperty('--color-surface', '#111827');
       root.style.setProperty('--color-text', '#e5e7eb');
       if(!currentTheme.isDarkMode) {
          // Force dark mode styles for neon even if toggled off conceptually, or handle hybrid
           root.classList.add('dark');
       }
    } else if (currentTheme.isDarkMode) {
       root.classList.add('dark');
       root.style.setProperty('--color-background', '#111827');
       root.style.setProperty('--color-surface', '#1f2937');
       root.style.setProperty('--color-text', '#f9fafb');
    } else {
       root.classList.remove('dark');
       root.style.setProperty('--color-background', colors.background);
       root.style.setProperty('--color-surface', colors.surface);
       root.style.setProperty('--color-text', '#1f2937');
    }

    // 2. Apply Font
    root.style.setProperty('--font-family', currentTheme.fontFamily);

    // 3. Apply Size (Scaling)
    let scale = '16px';
    if (currentTheme.fontSize === 'large') scale = '18px';
    if (currentTheme.fontSize === 'xlarge') scale = '20px';
    root.style.fontSize = scale;

    // 4. Apply UI Style Classes
    root.classList.remove('ui-minimal', 'ui-glass', 'ui-neon', 'ui-standard');
    root.classList.add(`ui-${currentTheme.uiStyle}`);
  };

  const toggleDarkMode = () => setTheme(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  const setColorTheme = (color: ThemeColor) => setTheme(prev => ({ ...prev, colorTheme: color }));
  const setFontFamily = (font: FontFamily) => setTheme(prev => ({ ...prev, fontFamily: font }));
  const setFontSize = (size: FontSize) => setTheme(prev => ({ ...prev, fontSize: size }));
  const setUIStyle = (style: UIStyle) => setTheme(prev => ({ ...prev, uiStyle: style }));

  return (
    <ThemeContext.Provider value={{ theme, toggleDarkMode, setColorTheme, setFontFamily, setFontSize, setUIStyle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};