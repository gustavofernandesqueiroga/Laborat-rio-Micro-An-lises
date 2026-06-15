
import React, { createContext, useContext, useState, useEffect } from 'react';

type FontSize = 'small' | 'medium' | 'large';

interface ThemeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const AccessibleThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const saved = localStorage.getItem('jaja-font-size');
    return (saved as FontSize) || 'medium';
  });

  const isDarkMode = false;
  const toggleDarkMode = () => {};

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem('jaja-font-size', size);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-small', 'text-medium', 'text-large');
    root.classList.add(`text-${fontSize}`);
    root.classList.remove('dark'); // Always ensure dark is removed
  }, [fontSize]);

  return (
    <ThemeContext.Provider value={{ fontSize, setFontSize, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAccessibleTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAccessibleTheme must be used within an AccessibleThemeProvider');
  }
  return context;
};
