"use client";

import React, { useEffect, useState } from "react";
import SelectInput from "@/components/SelectInput";
import AffinityResult from "@/components/AffinityResult";
import AgeRatingRadio from "@/components/AgeRatingRadio";
import { useLanguage } from "@/context/LanguageContext";

const AffinityCalculator: React.FC = () => {
  const { translations: t } = useLanguage();
  const [genres, setGenres] = useState<string[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [ratings, setRatings] = useState<string[]>([]);
  const [affinities, setAffinities] = useState<any>(null);

  const [genre1, setGenre1] = useState<string>("");
  const [genre2, setGenre2] = useState<string>("");
  const [theme, setTheme] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/Affinities.json");
        const jsonData = await response.json();

        setGenres(jsonData["genre-vs-genre"]?.header || []);
        setThemes(
          Object.keys(jsonData["genre-vs-theme"] || {}).filter(
            (key) => key !== "header"
          )
        );
        setRatings(
          Object.keys(jsonData["genre-vs-rating"] || {}).filter(
            (rating) => rating !== "header"
          )
        );
        setAffinities(jsonData);
      } catch (error) {
        console.error("Erro ao carregar o JSON:", error);
      }
    };

    fetchData();
  }, []);

  const calculateAffinity = () => {
    if (genre1 && theme && rating && affinities) {
      setLoading(true);

      const genre1Index = genres.indexOf(genre1);
      const genre2Index = genre2 ? genres.indexOf(genre2) : -1;

      const themeScore = affinities["genre-vs-theme"]?.[theme]?.[genre1Index] || 0;
      const ratingScore = affinities["genre-vs-rating"]?.[rating]?.[genre1Index] || 0;

      const genreScore =
        genre2Index >= 0
          ? affinities["genre-vs-genre"]?.data?.[genre1Index]?.[genre2Index] || 0
          : 0;

      const divisor = genre2 ? 3 : 2;
      const totalScore = (genreScore + themeScore + ratingScore) / divisor;

      setTimeout(() => {
        setResult(Math.round(totalScore));
        setLoading(false);
      }, 800);
    } else {
      setResult(null);
    }
  };

  useEffect(() => {
    calculateAffinity();
  }, [genre1, genre2, theme, rating]);

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
        options={genres}
        value={genre2}
        onChange={(e) => setGenre2(e.target.value)}
        isOptional={true} // Indica que o campo é opcional
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
        <label className="block text-sm font-medium mb-2 dark:text-gray-300">{t.rating}</label>
        <AgeRatingRadio
          options={ratings.map(rating => ({
            value: rating,
            label: rating.toUpperCase(),
            color: rating === "pg" ? "bg-green-500" :
              rating === "pg-13" ? "bg-yellow-500" : "bg-red-500"
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