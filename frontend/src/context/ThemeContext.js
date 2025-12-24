import React, { createContext, useContext, useState, useEffect } from 'react';
import { initTheme, setTheme as setAppTheme, toggleTheme as toggleAppTheme } from '../utils/theme';

// Create theme context
const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {}
});

// Custom hook to use theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Initialize theme state from localStorage
  const [theme, setThemeState] = useState(() => initTheme());

  // Set theme handler
  const setTheme = (newTheme) => {
    setAppTheme(newTheme);
    setThemeState(newTheme);
  };

  // Toggle theme handler
  const toggleTheme = () => {
    const newTheme = toggleAppTheme();
    setThemeState(newTheme);
    return newTheme;
  };

  // Listen for theme changes from other components
  useEffect(() => {
    const handleThemeChange = () => {
      const storedTheme = localStorage.getItem('theme') || 'light';
      setThemeState(storedTheme);
    };

    window.addEventListener('themeChange', handleThemeChange);
    
    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 