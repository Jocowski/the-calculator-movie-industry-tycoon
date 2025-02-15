"use client";

import { useLanguage } from "@/context/LanguageContext"; // Importa o contexto de idioma
import AffinityCalculator from "@/components/AffinityCalculator";

export default function Home() {
  const { translations: t } = useLanguage(); // Acessa as traduções pelo contexto

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-2 w-full overflow-x-hidden">
      <h1 className="text-3xl font-bold mb-6 text-center">{t.title}</h1>
      <AffinityCalculator />
    </main>
  );
}
