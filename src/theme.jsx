import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getCookie, setCookie, COOKIE_THEME } from './lib/cookies';

/**
 * Light / dark theme, persisted in a first-party cookie.
 *
 * Resolution order:
 *   1. an explicit choice the visitor made before (cookie)
 *   2. their operating-system preference (prefers-color-scheme)
 *   3. dark
 *
 * The inline script in index.html applies the same logic before first paint,
 * so there is never a flash of the wrong colours. Until the visitor picks a
 * side themselves we keep following the OS, so flipping the system theme
 * flips the site live.
 */
const ThemeContext = createContext(null);

const isTheme = (v) => v === 'light' || v === 'dark';

function systemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function initialTheme() {
  const saved = getCookie(COOKIE_THEME);
  if (isTheme(saved)) return saved;
  // Trust whatever the pre-paint script already resolved, if anything.
  if (typeof document !== 'undefined') {
    const current = document.documentElement.getAttribute('data-theme');
    if (isTheme(current)) return current;
  }
  return systemTheme();
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(initialTheme);
  // Has the visitor made a deliberate choice this visit, or previously?
  const explicit = useRef(isTheme(getCookie(COOKIE_THEME)));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // keep the browser UI (mobile address bar) in step with the page
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f2f4f9' : '#0a0d1a');
  }, [theme]);

  // Follow the OS until the visitor overrides it.
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e) => {
      if (!explicit.current) setThemeState(e.matches ? 'light' : 'dark');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const setTheme = useCallback((next) => {
    if (!isTheme(next)) return;
    explicit.current = true;
    setCookie(COOKIE_THEME, next);
    setThemeState(next);
  }, []);

  const toggle = useCallback(
    () => setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'),
    [setTheme]
  );

  return <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
