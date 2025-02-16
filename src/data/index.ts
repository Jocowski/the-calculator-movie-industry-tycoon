// src/data/index.ts
import genreData from './genre.json';
import ratingData from './rating.json';
import planningData from './planning.json';
import themeData from './theme.json';
import seasonsData from './seasons.json';
import scriptData from './script-affinity.json';

export type AffinityMatrix = {
  header: string[];
  items: Record<string, number[]>;
};

export type ScriptConfig = {
  locPrefix: string;
  scriptAffinityModMult: number;
  scriptAffinityModOffset: number;
};

export type AffinitiesData = {
  genreRelations: AffinityMatrix;
  ratingImpact: AffinityMatrix;
  productionPlanning: AffinityMatrix;
  thematicRelations: AffinityMatrix;
  seasonalVariations: AffinityMatrix;
  scriptConfig: ScriptConfig;
};

const affinities: AffinitiesData = {
  genreRelations: genreData['genre-vs-genre'],
  ratingImpact: ratingData['genre-vs-rating'],
  productionPlanning: planningData['genre-vs-planning'],
  thematicRelations: themeData['genre-vs-theme'],
  seasonalVariations: seasonsData['season-vs-genre'],
  scriptConfig: {
    locPrefix: scriptData.affinities['loc-prefix'],
    scriptAffinityModMult: scriptData.affinities['script-affinity-mod-mult'],
    scriptAffinityModOffset: scriptData.affinities['script-affinity-mod-offset']
  }
};

export default affinities;