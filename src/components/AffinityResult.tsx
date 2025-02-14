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
  const getAffinityLabel = (score: number | null) => {
    if (score === null) return t.noResult;
    switch (score) {
      case 0: return t.bad;
      case 1: return t.medium;
      case 2: return t.good;
      case 3: return t.great;
      default: return t.noResult;
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md shadow-md transition-all duration-300"
      style={{ minHeight: "80px" }}>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          {/* Spinner de carregamento */}
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">{t.result}</h3>
          <p className="text-xl dark:text-gray-300">{getAffinityLabel(result)}</p>
        </>
      )}
    </div>
  );
};

export default AffinityResult;