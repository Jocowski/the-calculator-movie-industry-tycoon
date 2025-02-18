"use client";

import { useLanguage } from "@/context/LanguageContext";
import AffinityCalculator from "@/components/AffinityCalculator";
import Script from 'next/script';

export default function Home() {
  const { translations: t } = useLanguage();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-2 w-full overflow-x-hidden">
      {/* Título principal da página */}
      <h1 className="text-3xl font-bold mb-6 text-center">{t.title}</h1>

      {/* Componente da calculadora */}
      <AffinityCalculator />

      {/* Mensagem sobre novidades */}
      <div className="mt-8 p-4 text-center text-sm text-gray-600 dark:text-gray-300  w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <p className="">{t.newFeatureMessage}</p>
        <p className="mt-1 font-bold text-blue-500 dark:text-blue-300">{t.nextFeatureMessage}</p>
      </div>

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