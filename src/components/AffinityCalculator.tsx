"use client";

import React, { useEffect, useState, useCallback } from "react";
import SelectInput from "@/components/SelectInput";
import AffinityResult from "@/components/AffinityResult";
import AgeRatingRadio from "@/components/AgeRatingRadio";
import { useLanguage } from "@/context/LanguageContext";

interface AffinitiesData {
  affinities: {
    "loc-prefix": string;
    "script-affinity-mod-mult": number;
    "script-affinity-mod-offset": number;
    "genre-vs-genre": {
      header: string[];
      items: {
        [genre: string]: number[];
      };
    };
    "genre-vs-rating": {
      header: string[];
      items: {
        [rating: string]: number[];
      };
    };
    "genre-vs-theme": {
      header: string[];
      items: {
        [theme: string]: number[];
      };
    };
  };
}

const AffinityCalculator: React.FC = () => {
  const { translations: t } = useLanguage();
  const [genres, setGenres] = useState<string[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [ratings, setRatings] = useState<string[]>([]);
  const [affinities, setAffinities] = useState<AffinitiesData | null>(null);

  const [genre1, setGenre1] = useState<string>("");
  const [genre2, setGenre2] = useState<string>("");
  const [theme, setTheme] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/affinities");
        const jsonData: AffinitiesData = await response.json();
        setGenres(jsonData.affinities["genre-vs-genre"].header || []);
        setThemes(Object.keys(jsonData.affinities["genre-vs-theme"].items || {}));
        setRatings(Object.keys(jsonData.affinities["genre-vs-rating"].items || {}));
        setAffinities(jsonData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    fetchData();
  }, []);

  const calculateAffinity = useCallback(() => {
    if (genre1 && theme && rating && affinities) {
      setLoading(true);

      const genre1Index = genres.indexOf(genre1);
      const genre2Index = genre2 ? genres.indexOf(genre2) : -1;

      // Cálculo dos scores
      const themeScore =
        ((affinities.affinities["genre-vs-theme"].items[theme]?.[genre1Index] || 0) +
          (genre2Index >= 0 ? affinities.affinities["genre-vs-theme"].items[theme]?.[genre2Index] || 0 : 0)) /
        (genre2 ? 2 : 1);

      const ratingScore =
        ((affinities.affinities["genre-vs-rating"].items[rating]?.[genre1Index] || 0) +
          (genre2Index >= 0 ? affinities.affinities["genre-vs-rating"].items[rating]?.[genre2Index] || 0 : 0)) /
        (genre2 ? 2 : 1);

      let genreScore = 0;
      if (genre2Index >= 0) {
        genreScore =
          (affinities.affinities["genre-vs-genre"].items[genre1]?.[genre2Index] || 0);
      }

      // Divisor ajustado
      const divisor = genre2 ? 2.5 : 2;
      const totalScore = (genreScore + themeScore + ratingScore) / divisor;

      const finalScore =
        totalScore * affinities.affinities["script-affinity-mod-mult"] +
        affinities.affinities["script-affinity-mod-offset"];

      setTimeout(() => {
        setResult(finalScore);
        setLoading(false);
      }, 800);
    } else {
      setResult(null);
    }
  }, [genre1, genre2, theme, rating, affinities, genres]);

  useEffect(() => {
    calculateAffinity();
  }, [calculateAffinity]);

  return (
    <div className="affinity-form-container">
      <p className="text-l text-center mb-4 dark:text-gray-100">{t.subtitle}</p>

      <SelectInput
        label={t.genre1}
        name="genre1"
        options={genres}
        value={genre1}
        onChange={(e) => setGenre1(e.target.value)}
        required
      />

      <SelectInput
        label={t.genre2}
        name="genre2"
        options={["", ...genres.filter((g) => g !== genre1)]}
        value={genre2}
        onChange={(e) => setGenre2(e.target.value)}
        isOptional={true}
      />

      <SelectInput
        label={t.theme}
        name="theme"
        options={themes}
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        required
      />

      <div className="my-4">
        <label className="block text-sm font-medium mb-2 dark:text-gray-300">
          {t.rating}
        </label>
        <AgeRatingRadio
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
      </div>

      <AffinityResult result={result} loading={loading} />
    </div>
  );
};

export default AffinityCalculator;