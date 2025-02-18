"use client";

import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { sendGTMEvent } from '@next/third-parties/google';
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { translations: t } = useLanguage();

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme();

    sendGTMEvent({
      event: 'theme_change',
      event_category: 'User Interaction',
      event_label: newTheme
    });
  };

  return (
    <div className="group relative">
      <button
        onClick={handleToggleTheme}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={t.themeToggle}
      >
        {theme === "dark" ? (
          <SunIcon className="h-5 w-5 text-yellow-400" />
        ) : (
          <MoonIcon className="h-5 w-5 text-indigo-800" />
        )}
      </button>

      {/* Tooltip com posicionamento ajustado */}
      <div className="absolute top-full right-0 mt-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-800 whitespace-nowrap py-1 px-2 rounded-md shadow-lg w-max pointer-events-none">
        {theme === "dark" ? t.lightModeTooltip : t.darkModeTooltip}
        {/* Seta do tooltip */}
        <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-700 dark:bg-gray-200 transform rotate-45" />
      </div>
    </div>
  );
};

export default ThemeToggle;