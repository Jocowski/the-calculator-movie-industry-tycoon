"use client";

import { useLanguage } from "@/context/LanguageContext";
import AffinityCalculator from "@/components/AffinityCalculator";
import Script from 'next/script';

export default function Home() {
  const { translations: t } = useLanguage();

  return (
    <main className="flex flex-col items-center justify-center p-2 w-full overflow-x-hidden md:m-16">
      {/* Título principal da página */}
      <h1 className="text-3xl font-bold mb-6 text-center">{t.title}</h1>

      {/* Componente da calculadora */}
      <AffinityCalculator />

      {/* Mensagem sobre novidades */}
      <div className="mt-8 p-4 text-center text-sm text-gray-600 dark:text-gray-300 w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <p>
          {t.nextFeatureMessage}
        </p>
        <p className="font-bold mt-2 text-pink-700 dark:text-pink-500 py-1 px-2 rounded border border-pink-300 bg-pink-100 dark:border-pink-300/10 dark:bg-pink-400/10 md:w-2/3 justify-self-center">
          {t.nextFeature}
        </p>
      </div>

      <p className="text-xs mt-5 text-center">
        {t.messageUpdate1}{' '}
        <a
          href="https://steamcommunity.com/games/2315430/announcements/detail/532090605491192099?snr=2___"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors"
          aria-label={`${t.gameVersion}, ${t.newTab}`}
        >
          {t.gameVersion}
        </a>{' '}
        {t.messageUpdate2}
      </p>
      {/* Dados estruturados para SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "The Calculator - Movie Industry Tycoon",
            "description": "Calculate movie affinities for The Executive: Movie Industry Tycoon",
            "url": "https://the-calculator-movie-industry-tycoon.vercel.app/",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web",
            "author": {
              "@type": "Person",
              "name": "Victor Franco"
            }
          })
        }}
      />
    </main>
  );
}