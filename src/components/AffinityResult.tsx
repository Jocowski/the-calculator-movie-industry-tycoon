"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import CalendarIcon from "@/components/CalendarIcon";
import SuperbowlIcon from "@/components/SuperbowlIcon";
import ValentineIcon from "@/components/ValentineIcon"
import EasterIcon from "@/components/EasterIcon"
import MemorialDayIcon from "@/components/MemorialDayIcon";
import EuroCupIcon from "@/components/EuroCupIcon"
import WorldCupIcon from "@/components/WorldCupIcon"
import SummerIcon from "@/components/SummerIcon"
import HalloweenIcon from "@/components/HalloweenIcon"
import AwardsIcon from "@/components/AwardsIcon"
import ThanksgivingIcon from "@/components/ThanksgivingIcon";
import EOYHolidaysIcon from "@/components/EOYHolidaysIcon";

type AffinityResultProps = {
  result: number | null;
  loading: boolean;
  genre1: string;
  genre2?: string;
  theme: string;
  rating: string;
  seasonResults: { season: string; score: number; label: string }[];
};

const getScoreBgColor = (score: number): string => {
  if (score < 0.5) return "bg-red-500";
  if (score < 1.5) return "bg-yellow-400";
  if (score < 2.5) return "bg-blue-500";
  return "bg-green-500";
};

const getTextColor = (score: number): string => {
  if (score < 1.5) return "text-gray-900";
  return "text-white";
};

const AffinityResult: React.FC<AffinityResultProps> = ({
  result,
  loading,
  genre1,
  genre2,
  theme,
  rating,
  seasonResults,
}) => {
  const { translations: t } = useLanguage();

  const getAffinityLabel = (score: number): string => {
    if (score < 0.5) return `${t.bad}`;
    if (score < 1.5) return `${t.medium}`;
    if (score < 2.5) return `${t.good}`;
    return `${t.great}`;
  };

  const getSeasonIcon = (season: string) => {
    switch (season.toLowerCase()) {
      case "superbowl":
        return <SuperbowlIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "valentine":
        return <ValentineIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "easter":
        return <EasterIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "memorialday":
        return <MemorialDayIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "eurocup":
        return <EuroCupIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "worldcup":
        return <WorldCupIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "summer":
        return <SummerIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "halloween":
        return <HalloweenIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "awards":
        return <AwardsIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "thanksgiving":
        return <ThanksgivingIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "eoyholidays":
        return <EOYHolidaysIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      default:
        return <CalendarIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (result === null) {
    return (
      <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
        {t.noResult}
      </p>
    );
  }

  return (
    <div className="result-container space-y-2">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-l text-gray-800 dark:text-gray-200 mb-2">
          {t.resultMessage}:{" "}
          <strong>
            {genre1}
            {genre2 && ` + ${genre2}`} ({theme}, {rating})
          </strong>{" "}
          {t.generatedScore}:{" "}
        </p>
        <span className={`px-2 py-1 rounded ${getScoreBgColor(result)} ${getTextColor(result)}`}>
          <strong>{getAffinityLabel(result)}</strong> <span className="text-xs">(Score: {result.toFixed(2)})</span>
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {t.bestDatesToLaunch}:
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {seasonResults.map(({ season, score, label }, index) => (
          <div
            key={index}
            className="p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center bg-white dark:bg-gray-800"
          >
            {getSeasonIcon(season)}
            <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
              {season.replace("", "")}
            </span>
            <span className={`text-l font-bold my-2 py-1 px-2 rounded ${getScoreBgColor(score)} ${getTextColor(score)}`}>
              {label}
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Score: {score.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div >
  );
};

export default AffinityResult;