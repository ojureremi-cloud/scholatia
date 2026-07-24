'use client';

import { useEffect, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'scholatia-theme-mode';

export default function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>('system');

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (saved) {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    const applyTheme = (mode: ThemeMode) => {
      const root = document.documentElement;
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const activeTheme = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;
      root.dataset.theme = activeTheme;
      window.localStorage.setItem(STORAGE_KEY, mode);
    };

    applyTheme(theme);

    const listener = (event: MediaQueryListEvent) => {
      if (theme === 'system') {
        document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  const resolvedTheme = useMemo(() => {
    if (theme === 'system') {
      return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return { theme, resolvedTheme, setTheme, toggleTheme };
}
