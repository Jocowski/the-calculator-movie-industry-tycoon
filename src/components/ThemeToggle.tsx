"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { sendGTMEvent } from '@next/third-parties/google';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { translations: t } = useLanguage();
  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme();
    setTimeout(() => {
      window.gtag('event', 'theme_change', {
        'event_category': 'User Interaction',
        'event_label': newTheme
      });
    }, 0);
  };

  return (
    <div className="relative flex items-center justify-center group">
      {/* Tooltip reposicionado abaixo e alinhado à esquerda do slider */}
      <div className="absolute top-10 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm bg-gray-700 text-white whitespace-nowrap py-1 px-2 rounded-md shadow-lg w-max">
        {theme === "dark" ? t.lightModeTooltip : t.darkModeTooltip}
      </div>
      {/* Slider */}
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={theme === "dark"}
          onChange={handleToggleTheme}
        />
        <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer dark:bg-indigo-500 flex items-center px-2">
          {/* Ícone do Sol (lado esquerdo, branco) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v2m0 14v2m9-9h-2M3 12H1m16.364-6.364l-1.414 1.414M6.05 17.95l-1.414-1.414m0-10.121L4.636 5.636m12.728 12.728l-1.414-1.414M12 8a4 4 0 100 8 4 4 0 000-8z"
            />
          </svg>
          {/* Ícone da Lua (lado direito, azul escuro) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
            />
          </svg>
        </div>
        {/* Bullet */}
        <span className="absolute top-0.5 left-0.5 peer-checked:translate-x-[30px] w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md dark:bg-gray-200"></span>
      </label>
    </div>
  );
};

export default ThemeToggle;