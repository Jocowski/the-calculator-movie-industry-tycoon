"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

type BaseScoreResultProps = {
  result: number;
  genre1: string;
  genre2?: string;
  theme: string;
  rating: string;
};

const getScoreBgColor = (score: number): string => {
  if (score < 1.5) return "bg-red-500";
  if (score < 2.5) return "bg-yellow-400";
  if (score < 3.5) return "bg-blue-500";
  return "bg-green-500";
};

const getTextColor = (score: number): string => {
  if (score >= 1.5 && score < 2.5) return "text-gray-900"; // Médio
  return "text-white"; // Ruim, Bom ou Ótimo
};

const BaseScoreResult: React.FC<BaseScoreResultProps> = ({
  result,
  genre1,
  genre2,
  theme,
  rating,
}) => {
  const { translations: t } = useLanguage();

  const getAffinityLabel = (score: number): string => {
    if (score < 1.5) return `${t.bad}`;
    if (score < 2.5) return `${t.medium}`;
    if (score < 3.5) return `${t.good}`;
    return `${t.great}`;
  };

  const renderTranslatedMessage = (message: string, values: { [key: string]: string }) => {
    const regex = /\[([^\]]+)\]/g; // Expressão regular para encontrar os placeholders no formato [key]
    const parts = message.split(regex); // Divide o texto em partes com base nos placeholders

    return parts.map((part, index) =>
      values[part] ? <strong key={index}>{values[part]}</strong> : part // Substitui o placeholder pelo valor correspondente ou mantém o texto normal
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
      <p className="text-l text-gray-800 dark:text-gray-200 mb-2">
        {renderTranslatedMessage(
          genre2 ? t.resultMessageTwoGenres : t.resultMessageOneGenre,
          { genre1, genre2: genre2 || "", theme, rating }
        )}
      </p>
      <span className={`text-xl px-2 py-1 rounded ${getScoreBgColor(result)} ${getTextColor(result)}`}>
        <strong>{getAffinityLabel(result)}</strong>{" "}
        <span className="text-xs">(Score: {result.toFixed(2)})</span>
      </span>
    </div>
  );
};

export default BaseScoreResult;