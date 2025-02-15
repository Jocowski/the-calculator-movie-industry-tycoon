"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import en from "@/locales/en.json";
import pt from "@/locales/pt.json";
import fr from "@/locales/fr.json";
import de from "@/locales/de.json";
import es from "@/locales/es.json";
import ja from "@/locales/ja.json";
import ko from "@/locales/ko.json";
import zhCN from "@/locales/zh-CN.json";
import zhTW from "@/locales/zh-TW.json";
import tr from "@/locales/tr.json";

type Translations = typeof en;

const translationsMap = {
  en,
  pt,
  fr,
  de,
  es,
  ja,
  ko,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  tr,
};

type LanguageContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  translations: Translations;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<string>("en");

  useEffect(() => {
    // Obtém o idioma do localStorage ou usa 'en' como padrão
    const savedLocale = localStorage.getItem("locale") || "en";
    setLocaleState(savedLocale);
  }, []);

  const translations = translationsMap[locale as keyof typeof translationsMap];
  const safeTranslations = translations || translationsMap["en"];

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale); // Salva o novo idioma no localStorage
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, translations: safeTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage deve ser usado dentro de um LanguageProvider");
  }
  return context;
};