// src/hooks/useCalculateAffinity.ts
import { useEffect, useState, useCallback } from "react";
import { getAffinityLabel, calculateGenreScores, getThemeScores, GenreScore, SeasonResult } from "@/utils/affinityCalculations";
import affinities from "@/data";

interface UseCalculateAffinityProps {
  genre1: string;
  genre2: string;
  theme: string;
  rating: string;
  genres: string[];
  translations: Record<string, string>;
  locale: string;
  formStartTime: number;
  filledFields: Set<string>;
  safeGtag: (event: string, params: Record<string, any>) => void;
}

interface AffinityResultData {
  result: number | null;
  seasonResults: SeasonResult[];
  loading: boolean;
}

export const useCalculateAffinity = ({
  genre1,
  genre2,
  theme,
  rating,
  genres,
  translations,
  locale,
  formStartTime,
  filledFields,
  safeGtag
}: UseCalculateAffinityProps): AffinityResultData => {
  const [result, setResult] = useState<number | null>(null);
  const [seasonResults, setSeasonResults] = useState<SeasonResult[]>([]);
  const [loading, setLoading] = useState(false);

  const getLabel = (score: number) => getAffinityLabel(score, translations);

  const calculate = useCallback(() => {
    if (genre1 && theme && rating) {
      setLoading(true);
      const genre1Index = genres.indexOf(genre1);
      const genre2Index = genre2 ? genres.indexOf(genre2) : -1;
      const themeScoreGenre1 = affinities.thematicRelations.items[theme]?.[genre1Index] || 0;
      const themeScoreGenre2 = genre2Index >= 0 ? affinities.thematicRelations.items[theme]?.[genre2Index] || 0 : 0;
      const ratingScoreGenre1 = affinities.ratingImpact.items[rating]?.[genre1Index] || 0;
      const ratingScoreGenre2 = genre2Index >= 0 ? affinities.ratingImpact.items[rating]?.[genre2Index] || 0 : 0;
      const genreScore = genre2Index >= 0 ? (affinities.genreRelations.items[genre1]?.[genre2Index] || 0) : 0;
      const baseScore = themeScoreGenre1 + themeScoreGenre2 + ratingScoreGenre1 + ratingScoreGenre2 + genreScore;
      const finalBaseScore = baseScore * affinities.scriptConfig.scriptAffinityModMult + affinities.scriptConfig.scriptAffinityModOffset;

      const themeScores = getThemeScores(theme, affinities, genres, getLabel);
      let combinedScores: GenreScore[] = [];
      if (genre2) {
        combinedScores = calculateGenreScores(genre2, themeScores, affinities, genres, getLabel);
      }

      const seasonalData = Object.entries(affinities.seasonalWindows.items).map(
        ([season, values]) => {
          const seasonMultiplierGenre1 = values[genre1Index] || 0;
          const seasonMultiplierGenre2 = genre2Index >= 0 ? values[genre2Index] || 0 : 0;
          const combinedMultiplier = (seasonMultiplierGenre1 + seasonMultiplierGenre2) / (genre2 ? 2 : 1);
          const adjustedScore = Number((finalBaseScore * combinedMultiplier).toFixed(2));
          const label = getLabel(combinedMultiplier);
          return { season, score: adjustedScore, label };
        }
      );
      seasonalData.sort((a, b) => b.score - a.score);

      setTimeout(() => {
        setResult(finalBaseScore);
        setSeasonResults(seasonalData);
        setLoading(false);
        safeGtag("form_completion", {
          form_name: "affinity_calculator",
          genre1,
          genre2: genre2 || 'none',
          theme,
          rating,
          score: finalBaseScore.toFixed(2),
          completion_time: Date.now() - formStartTime,
          filled_fields: Array.from(filledFields).join(',')
        });
      }, 300);
    } else {
      setResult(null);
      setSeasonResults([]);
    }
  }, [genre1, genre2, theme, rating, genres, translations, formStartTime, filledFields, safeGtag]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  return { result, seasonResults, loading };
};
