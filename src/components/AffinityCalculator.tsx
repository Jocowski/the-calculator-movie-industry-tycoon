"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import affinities from "@/data";
import SelectInput from "@/components/SelectInput";
import AffinityResult from "@/components/AffinityResult";
import AgeRatingRadio from "@/components/AgeRatingRadio";
import GenresInput from "@/components/GenresInput";
import { sendGTMEvent } from "@next/third-parties/google";
import useFormTracking from '@/hooks/useFormTracking';
import ClearButton from '@/components/ClearButton';

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
  const getTranslatedKey = (prefix: string, key: string): string => {
    const translationKey = `${prefix}_${key.replace(/-/g, '_').toUpperCase()}`;
    return (t as Record<string, string>)[translationKey] || key;
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
  const [filledFields, setFilledFields] = useState<Set<string>>(new Set());
  const [formStartTime, setFormStartTime] = useState<number>(0);

  const [gtagReady, setGtagReady] = useState(false);

  useEffect(() => {
    const checkGtag = () => {
      if (typeof window.gtag === 'function') {
        setGtagReady(true);
        return true;
      }
      return false;
    };

    if (!checkGtag()) {
      const timer = setInterval(() => {
        if (checkGtag()) {
          clearInterval(timer);
        }
      }, 500);
      return () => clearInterval(timer);
    }
  }, []);

  const safeGtag = (event: string, params: Record<string, any>) => {
    if (gtagReady && typeof window.gtag === 'function') {
      window.gtag('event', event, params);
    } else {
      console.warn('[GTAG] Evento não enviado:', event, params);
    }
  };

  useFormTracking({
    filledFields,
    formName: 'affinity_calculator',
    delay: 15000
  });

  // Função para rastrear mudanças nos campos do formulário
  const trackFieldChange = (fieldName: string, value: string, label: string) => {
    const newFilled = new Set(filledFields);
    newFilled.add(fieldName);
    setFilledFields(newFilled);

    if (!formStarted) {
      setFormStarted(true);
      safeGtag("form_start", { // ← Usando a função segura
        form_name: "affinity_calculator",
        initial_field: fieldName,
        initial_label: label
      });
    }

    safeGtag("form_field_change", { // ← Usando a função segura
      form_name: "affinity_calculator",
      field_name: fieldName,
      field_value: value,
      field_label: label,
      filled_fields_count: newFilled.size,
      filled_fields: Array.from(newFilled).join(',')
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
        label: getTranslatedKey('THEME', theme),
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
      label: getTranslatedKey('RATING', rating)
    }));
    setRatingsOptions(translatedRatings);
  }, [ratings, t]);

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

          // Determinar o label baseado no combinedSeasonMultiplier em vez do adjustedScore
          const label = getAffinityLabel(combinedSeasonMultiplier);

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
          genre1: {
            value: genre1,
            label: getTranslatedKey('GENRE', genre1)
          },
          genre2: {
            value: genre2 || 'none',
            label: genre2 ? getTranslatedKey('GENRE', genre2) : 'none'
          },
          theme: {
            value: theme,
            label: getTranslatedKey('THEME', theme)
          },
          rating: {
            value: rating,
            label: getTranslatedKey('RATING', rating)
          },
          score: finalBaseScore.toFixed(2),
          completion_time: Date.now() - formStartTime,
          filled_fields: Array.from(filledFields).join(',')
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

  const handleClearAll = () => {
    // Reset states
    setGenre1("");
    setGenre2("");
    setTheme("");
    setRating("");
    setResult(null);
    setSeasonResults([]);

    // Reset tracking states
    setFormStarted(false);
    setFilledFields(new Set());
    setFormStartTime(0);

    // Track event
    safeGtag("form_reset", {
      form_name: "affinity_calculator",
      filled_fields_before_reset: Array.from(filledFields).join(',')
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
          options={themes} // ← Já está ordenado
          value={theme}
          onChange={(value) => {
            setTheme(value);
            trackFieldChange('theme', value, getTranslatedKey('THEME', value));
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
              trackFieldChange('genre1', value, getTranslatedKey('GENRE', value));
            }}
          />

          <GenresInput
            name="genre2"
            label={t.genre2}
            options={genres2}
            value={genre2}
            onChange={(value) => {
              setGenre2(value);
              trackFieldChange('genre2', value, getTranslatedKey('GENRE', value));
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
            const label = ratingsOptions.find(opt => opt.value === value)?.label || value;
            trackFieldChange('rating', value, label);
          }}
        />

        {result !== null && (
          <div className="result-actions pt-4">
            <ClearButton
              onClear={handleClearAll}
              label={t.clearAll}
              testId="clear-all-button"
            />
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
        />
      </div>
    </div>
  );
};

export default AffinityCalculator;