import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkModeState] = useState(false);

  // Check initial dark mode state from HTML
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    console.log('[ThemeContext] Initial dark mode:', isDark);
    setDarkModeState(isDark);
  }, []);

  // Update HTML class when dark mode changes
  useEffect(() => {
    console.log('[ThemeContext] Setting dark mode:', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    console.log('[ThemeContext] Toggling dark mode from:', darkMode, 'to:', !darkMode);
    setDarkModeState(prev => !prev);
  };

  const setDarkMode = (dark: boolean) => {
    console.log('[ThemeContext] Setting dark mode to:', dark);
    setDarkModeState(dark);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
