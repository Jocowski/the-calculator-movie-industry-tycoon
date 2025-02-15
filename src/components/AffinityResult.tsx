"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

type AffinityResultProps = {
  result: number | null;
  loading: boolean;
};

const AffinityResult: React.FC<AffinityResultProps> = ({ result, loading }) => {
  const { translations: t } = useLanguage();

  // Função para determinar o rótulo com base na pontuação
  const getAffinityLabel = (score: number | null): string => {
    if (score === null) return t.noResult; // Quando não há resultado
    if (score < 0.5) return t.bad; // Resultado ruim
    if (score < 1.5) return t.medium; // Resultado médio
    if (score < 2.5) return t.good; // Resultado bom
    if (score >= 2.5) return t.great; // Resultado ótimo
    return t.noResult; // Valor padrão
  };

  return (
    <div className="border rounded-md p-4 mt-4 text-center bg-gray-100 dark:bg-gray-800">
      {loading ? (
        // Componente de Loading
        <div className="flex flex-col items-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500">
            {/* Spinner de carregamento */}
          </div>
          <p className="text-gray-500 dark:text-gray-300 mt-2">{t.loading}</p>
        </div>
      ) : (
        // Exibição do Resultado
        <div className="result-content">
          <p className="text-l">{t.result}</p>
          <h2 className="text-xl font-bold mt-2">{getAffinityLabel(result)}</h2>
          {/* Exibe o valor numérico do resultado para depuração, se necessário */}
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {t.score}: {result?.toFixed(2) || "-.--"}
          </p>
        </div>
      )}
    </div>
  );
};

export default AffinityResult;