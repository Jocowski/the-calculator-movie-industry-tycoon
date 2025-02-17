"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import affinities from "@/data";
import SelectInput from "@/components/SelectInput";
import AffinityResult from "@/components/AffinityResult";
import AgeRatingRadio from "@/components/AgeRatingRadio";

const AffinityCalculator: React.FC = () => {
  const { translations: t } = useLanguage();

  const [genres, setGenres] = useState<string[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [ratings, setRatings] = useState<string[]>([]);
  const [genre1, setGenre1] = useState("");
  const [genre2, setGenre2] = useState("");
  const [theme, setTheme] = useState("");
  const [rating, setRating] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [seasonResults, setSeasonResults] = useState<
    { season: string; score: number; label: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setGenres(affinities.genreRelations.header);
    setThemes(Object.keys(affinities.thematicRelations.items));
    setRatings(Object.keys(affinities.ratingImpact.items));
  }, []);

  const getAffinityLabel = (score: number): string => {
    if (score < 0.5) return t.bad;
    if (score < 1.5) return t.medium;
    if (score < 2.5) return t.good;
    if (score >= 2.5) return t.great;
    return t.noResult;
  };

  const calculateAffinity = useCallback(() => {
    if (genre1 && theme && rating) {
      setLoading(true);
      const genre1Index = genres.indexOf(genre1);
      const genre2Index = genre2 ? genres.indexOf(genre2) : -1;

      const themeScore = (
        (affinities.thematicRelations.items[theme]?.[genre1Index] || 0) +
        (genre2Index >= 0 ? affinities.thematicRelations.items[theme]?.[genre2Index] || 0 : 0)
      ) / (genre2 ? 2 : 1);

      const ratingScore = (
        (affinities.ratingImpact.items[rating]?.[genre1Index] || 0) +
        (genre2Index >= 0 ? affinities.ratingImpact.items[rating]?.[genre2Index] || 0 : 0)
      ) / (genre2 ? 2 : 1);

      let genreScore = genre2Index >= 0 ? affinities.genreRelations.items[genre1]?.[genre2Index] || 0 : 0;

      const divisor = genre2 ? 2.5 : 2;
      const totalScore = (genreScore + themeScore + ratingScore) / divisor;
      const finalScore =
        totalScore * affinities.scriptConfig.scriptAffinityModMult +
        affinities.scriptConfig.scriptAffinityModOffset;

      const seasonalData = Object.entries(affinities.seasonalWindows.items).map(
        ([season, values]) => {
          const seasonMultiplier = values[genre1Index] || 1;
          const adjustedScore = finalScore * seasonMultiplier;
          return {
            season,
            score: adjustedScore,
            label: getAffinityLabel(adjustedScore),
          };
        }
      );

      seasonalData.sort((a, b) => b.score - a.score);

      setTimeout(() => {
        setResult(finalScore);
        setSeasonResults(seasonalData);
        setLoading(false);
      }, 800);
    } else {
      setResult(null);
      setSeasonResults([]);
    }
  }, [genre1, genre2, theme, rating, genres]);

  useEffect(() => {
    calculateAffinity();
  }, [calculateAffinity]);

  return (
    <div className="affinity-form-container flex flex-col gap-6 w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-l font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
        {t.subtitle}
      </h2>

      <div className="flex flex-col gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <SelectInput
            name="genre1"
            label={t.genre1}
            options={genres}
            value={genre1}
            onChange={(e) => setGenre1(e.target.value)}
            required
          />

          <SelectInput
            name="genre2"
            label={t.genre2}
            options={genres.filter((g) => g !== genre1)}
            value={genre2}
            onChange={(e) => setGenre2(e.target.value)}
            isOptional
          />
        </div>

        <SelectInput
          name="theme"
          label={t.theme}
          options={themes}
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          required
        />

        <AgeRatingRadio
          label={t.rating}
          options={ratings.map((rating) => ({
            value: rating,
            label: rating.toUpperCase(),
            color: rating === "pg" ? "bg-green-500" :
              rating === "pg-13" ? "bg-yellow-500" : "bg-red-500"
          }))}
          selectedValue={rating}
          onChange={setRating}
        />

        <AffinityResult
          result={result}
          loading={loading}
          genre1={genre1}
          genre2={genre2}
          theme={theme}
          rating={rating}
          seasonResults={seasonResults}
        />
      </div>
    </div>
  );
};

export default AffinityCalculator;