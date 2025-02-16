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
  const [loading, setLoading] = useState(false);

  // Inicializa dados estáticos
  useEffect(() => {
    setGenres(affinities.genreRelations.header);
    setThemes(Object.keys(affinities.thematicRelations.items));
    setRatings(Object.keys(affinities.ratingImpact.items));
  }, []);

  // Calcula a afinidade
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

      setTimeout(() => {
        setResult(finalScore);
        setLoading(false);
      }, 800);
    } else {
      setResult(null);
    }
  }, [genre1, genre2, theme, rating, genres]);

  useEffect(() => {
    calculateAffinity();
  }, [calculateAffinity]);

  return (
    <div className="affinity-form-container flex flex-col gap-6 w-full max-w-3xl mx-auto p-6 rounded-xl shadow-lg">
      <h2 className="text-lg font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
        {t.subtitle}
      </h2>

      <div className="flex flex-col gap-4 md:flex-row">
        {/* Gênero 1 e Gênero 2 */}
        <div className="flex flex-col gap-4 md:flex-row md:w-full">
          <SelectInput
            name="genre1"
            label={t.genre1}
            options={genres}
            value={genre1}
            onChange={(e) => setGenre1(e.target.value)}
            required
            className="flex-1"
          />

          <SelectInput
            name="genre2"
            label={t.genre2}
            options={genres.filter((g) => g !== genre1)}
            value={genre2}
            onChange={(e) => setGenre2(e.target.value)}
            isOptional
            className="flex-1"
          />
        </div>

        {/* Tema */}
        <SelectInput
          name="theme"
          label={t.theme}
          options={themes}
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          required
          className="w-full"
        />
      </div>

      {/* Classificação Etária */}
      <AgeRatingRadio
        label={t.rating}
        options={ratings.map((rating) => ({
          value: rating,
          label: rating.toUpperCase(),
          color:
            rating === "pg"
              ? "bg-green-500"
              : rating === "pg-13"
                ? "bg-yellow-500"
                : "bg-red-500",
        }))}
        selectedValue={rating}
        onChange={setRating}
      />

      {/* Resultado */}
      <AffinityResult
        result={result}
        loading={loading}
        locPrefix={affinities.scriptConfig.locPrefix}
      />
    </div>
  );
};

export default AffinityCalculator;