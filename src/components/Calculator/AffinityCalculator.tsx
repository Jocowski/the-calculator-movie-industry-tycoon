// src/components/Calculator/AffinityCalculator.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import SelectInput from "@/components/Inputs/SelectInput";
import AffinityResult from "./AffinityResult";
import AgeRatingRadio from "@/components/Inputs/AgeRatingRadio";
import GenresInput from "@/components/Inputs/GenresInput";
import ClearButton from "@/components/Buttons/ClearButton";
import useFormTracking from "@/hooks/useFormTracking";
import { useGtag } from "@/hooks/useGtag";
import { useCalculateAffinity } from "@/hooks/useCalculateAffinity";
import { useCalculateProduction } from "@/hooks/useCalculateProduction";
import affinities from "@/data";
import { getThemeScores, getAffinityLabel, calculateGenreScores } from "@/utils/affinityCalculations";

const AffinityCalculator: React.FC = () => {
  const { translations: t, locale } = useLanguage();
  const { safeGtag } = useGtag();

  const [genres] = useState<string[]>(affinities.genreRelations.header);
  const [genre1, setGenre1] = useState("");
  const [genre2, setGenre2] = useState("");
  const [theme, setTheme] = useState("");
  const [rating, setRating] = useState("");
  const [formStartTime, setFormStartTime] = useState(0);
  const [filledFields, setFilledFields] = useState<Set<string>>(new Set());

  const ratingsOptions = Object.keys(affinities.ratingImpact.items).map((ratingKey) => ({
    value: ratingKey,
    label:
      (t as Record<string, string>)[`RATING_${ratingKey.replace("-", "_").toUpperCase()}`] ||
      ratingKey,
  }));

  const [genresOptions1, setGenresOptions1] = useState<
    { genre: string; score: number; label: string }[]
  >([]);
  const [genresOptions2, setGenresOptions2] = useState<
    { genre: string; score: number; label: string }[]
  >([]);

  useFormTracking({ filledFields, formName: "affinity_calculator", delay: 15000 });

  const { result, seasonResults, loading } = useCalculateAffinity({
    genre1,
    genre2,
    theme,
    rating,
    genres,
    translations: t,
    locale,
    formStartTime,
    filledFields,
    safeGtag,
  });

  // Chama o hook de produção e pós-produção e lê seus valores
  const { production, postProduction } = useCalculateProduction(genre1, genre2);

  // Atualiza as opções de gênero dinamicamente
  useEffect(() => {
    if (theme) {
      const themeScores = getThemeScores(
        theme,
        affinities,
        genres,
        (score: number) => getAffinityLabel(score, t as Record<string, string>)
      );

      if (!genre2) {
        setGenresOptions1([...themeScores].sort((a, b) => b.score - a.score));
      } else {
        setGenresOptions1(
          themeScores
            .filter((item: { genre: string }) => item.genre !== genre2)
            .sort((a, b) => b.score - a.score)
        );
      }

      if (genre1) {
        const combinedScores = calculateGenreScores(
          genre1,
          themeScores,
          affinities,
          genres,
          (score: number) => getAffinityLabel(score, t as Record<string, string>)
        );
        setGenresOptions2(
          combinedScores
            .filter((item: { genre: string }) => item.genre !== genre1)
            .sort((a, b) => b.score - a.score)
        );
      } else {
        setGenresOptions2([...themeScores].sort((a, b) => b.score - a.score));
      }
    } else {
      setGenresOptions1(
        affinities.genreRelations.header.map((genre) => ({ genre, score: 0, label: "" }))
      );
      setGenresOptions2(
        affinities.genreRelations.header.map((genre) => ({ genre, score: 0, label: "" }))
      );
    }
  }, [theme, genre1, genre2, genres, t]);

  const handleClearAll = () => {
    setGenre1("");
    setGenre2("");
    setTheme("");
    setRating("");
    setFilledFields(new Set());
    setFormStartTime(0);
    safeGtag("form_reset", {
      form_name: "affinity_calculator",
      filled_fields_before_reset: Array.from(filledFields).join(","),
    });
  };

  return (
    <div className="affinity-form-container flex flex-col gap-6 w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
      <h2 className="text-l font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
        {t.subtitle}
      </h2>

      <div className="flex flex-col gap-4">
        <SelectInput
          name="theme"
          label={t.theme}
          options={Object.keys(affinities.thematicRelations.items).sort((a, b) => {
            // Função auxiliar para obter a tradução do tema usando toLowerCase
            const getThemeLabel = (key: string): string =>
              ((t as Record<string, string>)[`THEME_${key.toLowerCase()}`] || key).toLowerCase();

            return getThemeLabel(a).localeCompare(getThemeLabel(b));
          })}
          value={theme}
          onChange={(value) => setTheme(value)}
          required
        />

        <div className="grid md:grid-cols-2 gap-4">
          <GenresInput
            name="genre1"
            label={t.genre1}
            options={genresOptions1}
            value={genre1}
            onChange={(value) => setGenre1(value)}
          />

          <GenresInput
            name="genre2"
            label={t.genre2}
            options={genresOptions2}
            value={genre2}
            onChange={(value) => setGenre2(value)}
            isOptional
          />
        </div>

        <AgeRatingRadio
          label={t.rating}
          options={ratingsOptions}
          selectedValue={rating}
          onChange={(value) => setRating(value)}
        />

        {result !== null && (
          <div className="result-actions pt-4">
            <ClearButton onClear={handleClearAll} label={t.clearAll} testId="clear-all-button" />
            <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
          </div>
        )}

        <AffinityResult
          result={result}
          loading={loading}
          genre1={genre1}
          genre2={genre2}
          theme={theme}
          rating={rating}
          seasonResults={seasonResults}
          production={production}
          postProduction={postProduction}
        />
      </div>
    </div>
  );
};

export default AffinityCalculator;
