"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

type AffinityResultProps = {
  result: number | null;
  loading: boolean;
  locPrefix: string;
};

const AffinityResult: React.FC<AffinityResultProps> = ({ result, loading, locPrefix }) => {
  const { translations: t } = useLanguage();

  // Determina a mensagem de afinidade com base no resultado
  const getAffinityLabel = (score: number | null): string => {
    if (score === null) return t.noResult;
    if (score < 0.5) return t.bad;
    if (score < 1.5) return t.medium;
    if (score < 2.5) return t.good;
    if (score >= 2.5) return t.great;
    return t.noResult;
  };

  return (
    <div className="result-container flex flex-col items-center justify-center">
      {loading ? (
        // Exibe o spinner durante o carregamento
        <div className="spinner w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      ) : result !== null ? (
        <>
          <p>{`${t.result}`}</p>
          <p className="font-bold">{getAffinityLabel(result)}</p>
          <p>{`${t.score}: ${result?.toFixed(2) || "-.--"}`}</p>
        </>
      ) : (
        <p>{`${t.noResult}`}</p>
      )}
    </div>
  );
};

export default AffinityResult;