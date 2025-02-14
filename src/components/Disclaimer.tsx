"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const Disclaimer: React.FC = () => {
  const { translations: t } = useLanguage();

  return (
    <footer className="py-2 px-4 text-center text-xs text-gray-500 dark:text-gray-400">
      <p>
        {t.disclaimerPrefix}{' '}
        <a
          href="https://store.steampowered.com/app/2315430/The_Executive__Movie_Industry_Tycoon/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.gameTitleAriaLabel}
          className="text-blue-500 hover:underline"
        >
          {t.gameTitle}
        </a>{' '}
        {t.disclaimerSuffix}
      </p>
    </footer>
  );
};

export default Disclaimer;