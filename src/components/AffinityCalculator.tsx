"use client";

import React, { useEffect, useState, useCallback } from "react";
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

  const calculateAffinity = useCallback(() => {
    if (genre1 && theme && rating && affinities) {
      setLoading(true);

      const genre1Index = genres.indexOf(genre1);
      const genre2Index = genre2 ? genres.indexOf(genre2) : -1;

      const themeScore = affinities["genre-vs-theme"]?.[theme]?.[genre1Index] || 0;
      const ratingScore = affinities["genre-vs-rating"]?.[rating]?.[genre1Index] || 0;

      let genreScore = 0;
      if (genre2Index >= 0) {
        genreScore = affinities["genre-vs-genre"]?.data?.[genre1Index]?.[genre2Index] || 0;
      }

      const divisor = genre2 ? 3 : 2;
      const totalScore = (genreScore + themeScore + ratingScore) / divisor;

      console.log("genreScore:", genreScore);
      console.log("themeScore:", themeScore);
      console.log("ratingScore:", ratingScore);
      console.log("divisor:", divisor);
      console.log("totalScore:", totalScore);

      setTimeout(() => {
        setResult(totalScore);
        setLoading(false);
      }, 800);
    } else {
      setResult(null);
    }
  }, [genre1, genre2, theme, rating, affinities, genres]);

  useEffect(() => {
    calculateAffinity();
  }, [calculateAffinity]);

  const handleGenre1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGenre1 = e.target.value;
    setGenre1(newGenre1);
    if (newGenre1 === genre2) {
      setGenre2("");
    }
  };

  const handleGenre2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGenre2 = e.target.value;
    setGenre2(newGenre2);
  };

  const getGenre1Options = () => genres;

  const getGenre2Options = () => {
    return ["", ...genres.filter(genre => genre !== genre1)];
  };

  return (
    <div className="affinity-form-container">
      <p className="text-l text-center mb-4 dark:text-gray-100">{t.subtitle}</p>

      <SelectInput
        label={t.genre1}
        name="genre1"
        options={getGenre1Options()}
        value={genre1}
        onChange={handleGenre1Change}
        required
      />

      <SelectInput
        label={t.genre2}
        name="genre2"
        options={getGenre2Options()}
        value={genre2}
        onChange={handleGenre2Change}
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