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