// src/hooks/useCalculateAffinity.ts

import { useEffect, useState, useCallback } from "react";
import {
  getAffinityLabel,
  calculateGenreScores,
  getThemeScores,
  GenreScore,
  SeasonResult
} from "@/utils/affinityCalculations";
import affinities from "@/data";

/**
 * Interface que descreve as propriedades necessárias para o cálculo de afinidade.
 */
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

/**
 * Interface que descreve os dados de resultado retornados pelo hook.
 */
interface AffinityResultData {
  result: number | null;
  seasonResults: SeasonResult[];
  loading: boolean;
}

/**
 * Hook para calcular a afinidade do filme com base nas escolhas do usuário.
 * 
 * A lógica do cálculo envolve:
 * 
 * 1. Verificar se os campos obrigatórios (genre1, theme e rating) estão preenchidos.
 * 2. Calcular scores para o tema, rating e a relação entre gêneros:
 *    - Obtém os índices dos gêneros selecionados na lista geral (genres).
 *    - Busca os scores do tema para o gênero 1 (e gênero 2, se definido).
 *    - Busca os scores da classificação (rating) para os gêneros.
 *    - Calcula o score de afinidade entre gêneros, se aplicável.
 * 3. Soma todos esses scores para obter um "baseScore".
 * 4. Aplica um multiplicador e um offset (definidos em affinities.scriptConfig) para obter o score final.
 * 5. Calcula os resultados sazonais:
 *    - Para cada temporada, usa os multiplicadores sazonais para ajustar o score final.
 *    - Converte o multiplicador em um rótulo de afinidade.
 * 6. Ordena os resultados sazonais e atualiza os estados após um delay de 300ms.
 * 7. Envia um evento de rastreamento via safeGtag.
 *
 * @param props - Propriedades necessárias para o cálculo de afinidade.
 * @returns Objeto contendo o resultado final (result), os resultados sazonais e o estado de carregamento.
 */
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

  // Função auxiliar para obter o rótulo de afinidade usando as traduções
  const getLabel = (score: number) => getAffinityLabel(score, translations);

  /**
   * Função de cálculo que é executada sempre que os inputs essenciais mudam.
   */
  const calculate = useCallback(() => {
    // Se os campos obrigatórios não estão preenchidos, limpa os resultados
    if (genre1 && theme && rating) {
      setLoading(true);

      // Obtém os índices dos gêneros selecionados
      const genre1Index = genres.indexOf(genre1);
      const genre2Index = genre2 ? genres.indexOf(genre2) : -1;

      // Busca os scores do tema para os gêneros selecionados
      const themeScoreGenre1 = affinities.thematicRelations.items[theme]?.[genre1Index] || 0;
      const themeScoreGenre2 = genre2Index >= 0 ? affinities.thematicRelations.items[theme]?.[genre2Index] || 0 : 0;

      // Busca os scores da classificação para os gêneros selecionados
      const ratingScoreGenre1 = affinities.ratingImpact.items[rating]?.[genre1Index] || 0;
      const ratingScoreGenre2 = genre2Index >= 0 ? affinities.ratingImpact.items[rating]?.[genre2Index] || 0 : 0;

      // Calcula o score de afinidade entre gêneros (caso haja um segundo gênero)
      const genreScore = genre2Index >= 0 ? (affinities.genreRelations.items[genre1]?.[genre2Index] || 0) : 0;

      // Soma os scores para obter o baseScore
      const baseScore =
        themeScoreGenre1 + themeScoreGenre2 + ratingScoreGenre1 + ratingScoreGenre2 + genreScore;

      // Aplica multiplicador e offset para obter o score final
      const finalBaseScore =
        baseScore * affinities.scriptConfig.scriptAffinityModMult +
        affinities.scriptConfig.scriptAffinityModOffset;

      // Obtém os scores derivados do tema para cada gênero
      const themeScores = getThemeScores(theme, affinities, genres, getLabel);
      let combinedScores: GenreScore[] = [];
      if (genre2) {
        // Combina os scores do tema com os scores de afinidade entre gêneros, se genre2 estiver definido
        combinedScores = calculateGenreScores(genre2, themeScores, affinities, genres, getLabel);
      }

      // Calcula os resultados sazonais para cada temporada
      const seasonalData = Object.entries(affinities.seasonalWindows.items).map(
        ([season, values]) => {
          // Obtém os multiplicadores sazonais para os gêneros selecionados
          const seasonMultiplierGenre1 = values[genre1Index] || 0;
          const seasonMultiplierGenre2 = genre2Index >= 0 ? values[genre2Index] || 0 : 0;
          // Faz média se houver dois gêneros
          const combinedMultiplier =
            (seasonMultiplierGenre1 + seasonMultiplierGenre2) / (genre2 ? 2 : 1);
          // Ajusta o score final para a temporada
          const adjustedScore = Number((finalBaseScore * combinedMultiplier).toFixed(2));
          // Obtém o rótulo correspondente ao multiplicador
          const label = getLabel(combinedMultiplier);
          return { season, score: adjustedScore, label };
        }
      );
      // Ordena os resultados sazonais do maior para o menor score
      seasonalData.sort((a, b) => b.score - a.score);

      // Simula um pequeno delay para processamento e envia dados de rastreamento
      setTimeout(() => {
        setResult(finalBaseScore);
        setSeasonResults(seasonalData);
        setLoading(false);
        safeGtag("form_completion", {
          form_name: "affinity_calculator",
          genre1,
          genre2: genre2 || "none",
          theme,
          rating,
          score: finalBaseScore.toFixed(2),
          completion_time: Date.now() - formStartTime,
          filled_fields: Array.from(filledFields).join(",")
        });
      }, 300);
    } else {
      // Se os campos obrigatórios não estão preenchidos, limpa os resultados
      setResult(null);
      setSeasonResults([]);
    }
  }, [genre1, genre2, theme, rating, genres, translations, formStartTime, filledFields, safeGtag]);

  // Executa o cálculo sempre que as dependências mudam
  useEffect(() => {
    calculate();
  }, [calculate]);

  return { result, seasonResults, loading };
};
