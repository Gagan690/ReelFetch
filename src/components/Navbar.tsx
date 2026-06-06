'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-md transition-all duration-300 dark:border-gray-800/50 dark:bg-gray-950/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/20">
            <svg
              className="h-5 w-5 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </div>
          <span className="bg-linear-to-r from-rose-500 via-purple-500 to-amber-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
            ReelFetch
          </span>
        </div>

        {/* Action Button & Theme Toggle */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 transition-all duration-200 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-850"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              // Sun Icon
              <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m2.828-9.9a5 5 0 117.07 7.07l-7.07-7.07z"
                />
              </svg>
            ) : (
              // Moon Icon
              <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
          
          <span className="hidden text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 sm:inline">
            Free Video Downloader
          </span>
        </div>
      </div>
    </header>
  );
}
