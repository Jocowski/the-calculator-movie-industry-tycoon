//src/components/AffinityCalculator.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import affinities from "@/data";
import SelectInput from "@/components/SelectInput";
import AffinityResult from "@/components/AffinityResult";
import AgeRatingRadio from "@/components/AgeRatingRadio";
import GenresInput from "@/components/GenresInput";
import { sendGTMEvent } from "@next/third-parties/google";

interface GenreScore {
  genre: string;
  score: number;
  label: string;
}

interface SeasonResult {
  season: string;
  score: number;
  label: string;
}

const AffinityCalculator: React.FC = () => {
  const { translations: t, locale } = useLanguage();

  // Função helper para traduções de temas
  const getThemeTranslation = (theme: string): string => {
    return (t as Record<string, string>)[`THEME_${theme}`] || theme;
  };

  const [genres, setGenres] = useState<string[]>([]);
  const [genres1, setGenres1] = useState<GenreScore[]>([]);
  const [genres2, setGenres2] = useState<GenreScore[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [ratings, setRatings] = useState<string[]>([]);
  const [ratingsOptions, setRatingsOptions] = useState<{ value: string; label: string }[]>([]); // Adicione esta linha
  const [genre1, setGenre1] = useState("");
  const [genre2, setGenre2] = useState("");
  const [theme, setTheme] = useState("");
  const [rating, setRating] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [seasonResults, setSeasonResults] = useState<SeasonResult[]>([]);
  const [loading, setLoading] = useState(false);

  const [formStarted, setFormStarted] = useState(false);

  // Função para rastrear mudanças nos campos do formulário
  const trackFieldChange = (fieldName: string, value: string) => {
    if (!formStarted) {
      setFormStarted(true);
      window.gtag("event", "form_start", {
        form_name: "affinity_calculator",
      });
    }

    window.gtag("event", "form_field_change", {
      form_name: "affinity_calculator",
      field_name: fieldName,
      field_value: value,
    });
  };

  // Ordenação alfabética dos temas com base no idioma
  useEffect(() => {
    setGenres(affinities.genreRelations.header);

    const initialGenres = affinities.genreRelations.header.map((genre) => ({
      genre: genre,
      score: 0,
      label: "",
    }));
    setGenres1(initialGenres);
    setGenres2(initialGenres);

    // Ordena os temas alfabeticamente de acordo com as traduções no idioma atual
    const sortedThemes = Object.keys(affinities.thematicRelations.items)
      .map((theme) => ({
        key: theme,
        label: getThemeTranslation(theme), // Usa a função helper
      }))
      .sort((a, b) => a.label.localeCompare(b.label, locale, { sensitivity: "base" }))
      .map((item) => item.key);

    setThemes(sortedThemes);

    setRatings(Object.keys(affinities.ratingImpact.items));
  }, [locale, t]);

  // Adicione este novo useEffect (após o que ordena os temas):
  useEffect(() => {
    const translatedRatings = ratings.map(rating => ({
      value: rating,
      label: (t as Record<string, string>)[`RATING_${rating.replace("-", "_")}`] || rating
    }));
    setRatingsOptions(translatedRatings);
  }, [ratings, t]); // Dependências importantes

  // Função para obter o rótulo de afinidade
  const getAffinityLabel = (score: number): string => {
    if (score < 0.5) return t.bad;
    if (score < 1.5) return t.medium;
    if (score < 2.5) return t.good;
    if (score >= 2.5) return t.great;
    return t.noResult;
  };

  // Função para calcular os scores dos gêneros
  const calculateGenreScores = (
    sourceGenre: string | null,
    themeScores: GenreScore[] | null
  ): GenreScore[] => {
    if (!sourceGenre) return themeScores || [];

    const genreScores = affinities.genreRelations.header.map((genre) => ({
      genre,
      score:
        affinities.genreRelations.items[sourceGenre]?.[
        genres.indexOf(genre)
        ] || 0,
      label: getAffinityLabel(
        affinities.genreRelations.items[sourceGenre]?.[
        genres.indexOf(genre)
        ] || 0
      ),
    }));

    if (!themeScores) return genreScores;

    return themeScores.map((genre) => ({
      genre: genre.genre,
      score:
        (themeScores[genres.indexOf(genre.genre)].score +
          genreScores[genres.indexOf(genre.genre)].score) /
        2,
      label: getAffinityLabel(
        (themeScores[genres.indexOf(genre.genre)].score +
          genreScores[genres.indexOf(genre.genre)].score) /
        2
      ),
    }));
  };

  // Função para calcular os scores dos temas
  const getThemeScores = (theme: string): GenreScore[] => {
    return affinities.thematicRelations.header.map((genre) => ({
      genre,
      score:
        affinities.thematicRelations.items[theme]?.[
        genres.indexOf(genre)
        ] || 0,
      label: getAffinityLabel(
        affinities.thematicRelations.items[theme]?.[
        genres.indexOf(genre)
        ] || 0
      ),
    }));
  };

  // Função para calcular a afinidade
  const calculateAffinity = useCallback(() => {
    if (theme) {
      const themeScores = getThemeScores(theme);

      if (!genre2) {
        setGenres1([...themeScores].sort((a, b) => b.score - a.score));
      }

      if (genre1) {
        const combinedScores = calculateGenreScores(genre1, themeScores)
          .sort((a, b) => b.score - a.score)
          .filter((genre) => genre.genre !== genre1);
        setGenres2(combinedScores);
      }

      if (genre1 && genre2) {
        const combinedScores = calculateGenreScores(genre2, themeScores)
          .sort((a, b) => b.score - a.score)
          .filter((genre) => genre.genre !== genre2);
        setGenres1(combinedScores);
      }
    }

    if (!theme) {
      if (genre1) {
        const genreScores = calculateGenreScores(genre1, null)
          .sort((a, b) => b.score - a.score)
          .filter((genre) => genre.genre !== genre1);

        setGenres2(genreScores);
      }

      if (genre2) {
        const genreScores = calculateGenreScores(genre2, null)
          .sort((a, b) => b.score - a.score)
          .filter((genre) => genre.genre !== genre2);

        setGenres1(genreScores);
      } else {
        setGenres1(
          affinities.genreRelations.header.map((genre) => ({
            genre,
            score: 0,
            label: "",
          }))
        );
      }
    }

    if (genre1 && theme && rating) {
      setLoading(true);

      const genre1Index = genres.indexOf(genre1);
      const genre2Index = genre2 ? genres.indexOf(genre2) : -1;

      // Cálculo individualizado
      const genreScore = genre2Index >= 0
        ? (affinities.genreRelations.items[genre1]?.[genre2Index] || 0)
        : 0;

      const themeScoreGenre1 = affinities.thematicRelations.items[theme]?.[genre1Index] || 0;
      const themeScoreGenre2 = genre2Index >= 0 ? affinities.thematicRelations.items[theme]?.[genre2Index] || 0 : 0;

      const ratingScoreGenre1 = affinities.ratingImpact.items[rating]?.[genre1Index] || 0;
      const ratingScoreGenre2 = genre2Index >= 0 ? affinities.ratingImpact.items[rating]?.[genre2Index] || 0 : 0;

      // Soma dos valores para calcular o base score
      const baseScore =
        themeScoreGenre1 +
        themeScoreGenre2 +
        ratingScoreGenre1 +
        ratingScoreGenre2 +
        genreScore;

      // Ajuste final com multiplicador e offset
      const finalBaseScore =
        baseScore * affinities.scriptConfig.scriptAffinityModMult +
        affinities.scriptConfig.scriptAffinityModOffset;

      // Cálculo dos scores sazonais (bônus aplicado ao base score)
      const seasonalData = Object.entries(affinities.seasonalWindows.items).map(
        ([season, values]) => {
          const seasonMultiplierGenre1 = values[genre1Index] || 0;
          const seasonMultiplierGenre2 = genre2Index >= 0 ? values[genre2Index] || 0 : 0;

          // Média ponderada dos multiplicadores
          const combinedSeasonMultiplier =
            (seasonMultiplierGenre1 + seasonMultiplierGenre2) / (genre2 ? 2 : 1);

          // Score ajustado para o evento sazonal, formatado com 2 casas decimais
          const adjustedScore = Number((finalBaseScore * combinedSeasonMultiplier).toFixed(2));

          // Determinar o label baseado no score ajustado
          const label = getAffinityLabel(adjustedScore);

          return {
            season,
            score: adjustedScore,
            label,
          };
        }
      );

      seasonalData.sort((a, b) => b.score - a.score);

      setTimeout(() => {
        setResult(finalBaseScore); // Apenas o base score
        setSeasonResults(seasonalData); // Scores ajustados por evento sazonal
        setLoading(false);

        sendGTMEvent({
          event: 'form_submission',
          form_name: 'affinity_calculator',
          genre1: genre1,
          genre2: genre2 || 'none',
          theme: theme,
          rating: rating,
          score: finalBaseScore.toFixed(2), // Alterado para 2 casas decimais
        });
      }, 300);
    } else {
      setResult(null);
      setSeasonResults([]);
    }
  }, [genre1, genre2, theme, rating, genres]);

  useEffect(() => {
    calculateAffinity();
  }, [calculateAffinity]);

  return (
    <div className="affinity-form-container flex flex-col gap-6 w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
      <h2 className="text-l font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
        {t.subtitle}
      </h2>

      <div className="flex flex-col gap-4">
        <SelectInput
          name="theme"
          label={t.theme}
          options={themes} // ← Já está ordenado
          value={theme}
          onChange={(value) => {
            setTheme(value);
            trackFieldChange('theme', value);
          }}
          required
        />

        <div className="grid md:grid-cols-2 gap-4">
          <GenresInput
            name="genre1"
            label={t.genre1}
            options={genres1}
            value={genre1}
            onChange={(value) => {
              setGenre1(value);
              trackFieldChange('genre1', value);
            }}
          />

          <GenresInput
            name="genre2"
            label={t.genre2}
            options={genres2}
            value={genre2}
            onChange={(value) => {
              setGenre2(value);
              trackFieldChange('genre2', value);
            }}
            isOptional
          />
        </div>

        <AgeRatingRadio
          label={t.rating}
          options={ratingsOptions} // ← Agora usando o estado dedicado
          selectedValue={rating}
          onChange={(value) => {
            setRating(value);
            trackFieldChange('rating', value);
          }}
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