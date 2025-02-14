"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const LanguageSelector: React.FC = () => {
  const { locale, setLocale } = useLanguage();

  const languages = [
    { code: "pt", label: "Português" },
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
    { code: "es", label: "Español" },
    { code: "ja", label: "日本語" },
    { code: "ko", label: "한국어" },
    { code: "zh-CN", label: "中文（简体）" },
    { code: "zh-TW", label: "中文（繁體）" },
    { code: "tr", label: "Türkçe" }
  ];

  return (
    <select
      id="language-selector"
      value={locale}
      onChange={(e) => setLocale(e.target.value)}
      className="w-32 py-1 px-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 dark:bg-darkBackground dark:text-darkForeground dark:border-darkBorder focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-300"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;