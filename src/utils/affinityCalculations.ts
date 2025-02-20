// src/utils/affinityCalculations.ts
export interface GenreScore {
  genre: string;
  score: number;
  label: string;
}

export interface SeasonResult {
  season: string;
  score: number;
  label: string;
}

export const getAffinityLabel = (score: number, translations: Record<string, string>): string => {
  if (score < 0.5) return translations.bad;
  if (score < 1.5) return translations.medium;
  if (score < 2.5) return translations.good;
  if (score >= 2.5) return translations.great;
  return translations.noResult;
};

export const calculateGenreScores = (
  sourceGenre: string | null,
  themeScores: GenreScore[] | null,
  affinities: any,
  genres: string[],
  getAffinityLabelFn: (score: number) => string
): GenreScore[] => {
  if (!sourceGenre) return themeScores || [];
  const genreScores = affinities.genreRelations.header.map((genre: string) => ({
    genre,
    score: affinities.genreRelations.items[sourceGenre]?.[genres.indexOf(genre)] || 0,
    label: getAffinityLabelFn(affinities.genreRelations.items[sourceGenre]?.[genres.indexOf(genre)] || 0)
  }));
  if (!themeScores) return genreScores;
  return themeScores.map((genre) => ({
    genre: genre.genre,
    score:
      (themeScores[genres.indexOf(genre.genre)].score +
        genreScores[genres.indexOf(genre.genre)].score) /
      2,
    label: getAffinityLabelFn(
      (themeScores[genres.indexOf(genre.genre)].score +
        genreScores[genres.indexOf(genre.genre)].score) /
      2
    )
  }));
};

export const getThemeScores = (
  theme: string,
  affinities: any,
  genres: string[],
  getAffinityLabelFn: (score: number) => string
): GenreScore[] => {
  return affinities.thematicRelations.header.map((genre: string) => ({
    genre,
    score: affinities.thematicRelations.items[theme]?.[genres.indexOf(genre)] || 0,
    label: getAffinityLabelFn(affinities.thematicRelations.items[theme]?.[genres.indexOf(genre)] || 0)
  }));
};
