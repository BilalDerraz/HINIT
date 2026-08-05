import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Light / dark theme. Initial value follows (in order): a saved choice,
 * then the visitor's system preference. The no-flash script in index.html
 * sets data-theme on <html> before paint; here we just keep React in sync.
 */
const ThemeContext = createContext(null);

function initialTheme() {
  if (typeof document !== 'undefined') {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'light' || current === 'dark') return current;
  }
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      /* ignore */
    }
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  }
  return 'dark';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  return <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
