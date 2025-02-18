"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import ArrowDownIcon from "@/components/ArrowDownIcon";
import ArrowUpIcon from "@/components/ArrowUpIcon";

type GenreResultsProps = {
  genreResults: { genre: string; label: string }[];
};

const GenreResults: React.FC<GenreResultsProps> = ({ genreResults }) => {
  const [showResults, setShowResults] = useState(false);
  
  const { translations: t } = useLanguage();

  // Função para obter o ícone do gênero
  const getGenreIcon = (genre: string) => {
    switch (genre.toLowerCase()) {
      case "action":
        // return <ActionIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "adventure":
        // return <AdventureIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "animation":
        // return <AnimationIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "biography":
        // return <BiographyIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "comedy":
        // return <ComedyIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "crime":
        // return <CrimeIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "drama":
        // return <DramaIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "family":
        // return <FamilyIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "fantasy":
        // return <FantasyIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "horror":
        // return <HorrorIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "musical":
        // return <MusicalIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "mystery":
        // return <MysteryIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "romance":
        // return <RomanceIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "scifi":
        // return <SciFiIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "thriller":
        // return <ThrillerIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      default:
        // return <CalendarIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
    }
  };

  // Função para determinar a cor de fundo com base no label
  const getScoreBgColor = (label: string): string => {
    switch (label.toLowerCase()) {
      case t.bad.toLowerCase():
        return "bg-red-500";
      case t.medium.toLowerCase():
        return "bg-yellow-400";
      case t.good.toLowerCase():
        return "bg-blue-500";
      case t.great.toLowerCase():
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  // Função para determinar a cor do texto com base no label
  const getTextColor = (label: string): string => {
    if (label.toLowerCase() === t.medium.toLowerCase()) {
      return "text-gray-900"; // Médio
    }
    return "text-white"; // Ruim, Bom ou Ótimo
  };

  return (
    <div>
      <p 
        className="my-2 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1"
        onClick={() => setShowResults((prev) => !prev)}
      >
        {t.bestGenresToLaunch}: 
        {showResults ? (
          <ArrowUpIcon className="w-4 h-4" />
        ) : (
          <ArrowDownIcon className="w-4 h-4" />
        )}
      </p>
      {showResults && !genreResults.length && (
        <div className="result-container">
          <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
            {t.noGenreResults}
          </p>
        </div>
      )}
      {showResults && genreResults.length && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 result-container">
          {genreResults.map(({ genre, label }, index) => (
            <div
              key={index}
              className="p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center bg-white dark:bg-gray-800">
              {/* {getGenreIcon(genre)} */}
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {genre}
              </span>
              <span className={`text-l font-bold my-2 py-1 px-2 rounded ${getScoreBgColor(label)} ${getTextColor(label)}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenreResults;
