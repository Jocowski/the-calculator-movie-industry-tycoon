// src/hooks/useCalculateProduction.ts
import { useEffect, useState } from "react";
import affinities from "@/data"; // affinities.productionPlanning está definido em src/data/index.ts

type ProductionValues = {
  writing: number;
  costume: number;
  setdesign: number;
};

type PostProductionValues = {
  specialeffect: number;
  sound: number;
  editing: number;
};

type UseCalculateProductionResult = {
  production: ProductionValues | null;
  postProduction: PostProductionValues | null;
};

/**
 * Calcula os valores de planejamento para Produção (writing, costume, setdesign)
 * e Pós-Produção (specialeffect, sound, editing), com base nos dados de affinities.productionPlanning.
 * Cada grupo é escalonado para que sua soma esteja entre 85 e 100.
 * Cada recurso é arredondado para o múltiplo de 5 mais próximo e limitado entre 10 e 50.
 *
 * @param genre1 - Gênero principal selecionado
 * @param genre2 - (Opcional) Segundo gênero para média
 * @returns Objeto contendo { production, postProduction } ou ambos null se genre1 não estiver definido.
 */
export function useCalculateProduction(genre1: string, genre2?: string): UseCalculateProductionResult {
  const [result, setResult] = useState<UseCalculateProductionResult>({
    production: null,
    postProduction: null,
  });

  useEffect(() => {
    if (!genre1) {
      setResult({ production: null, postProduction: null });
      return;
    }

    const planning = affinities.productionPlanning; // { header, items }
    const header = planning.header; // ex.: ["action", "adventure", "animation", ...]
    const items = planning.items;   // ex.: { writing: [...], costume: [...], setdesign: [...], specialeffect: [...], sound: [...], editing: [...] }

    const indexG1 = header.indexOf(genre1);
    const indexG2 = genre2 ? header.indexOf(genre2) : -1;
    if (indexG1 < 0 && indexG2 < 0) {
      setResult({ production: null, postProduction: null });
      return;
    }

    // Helper para obter o valor de um recurso
    function getValue(resource: string, index: number): number {
      if (index < 0) return 0;
      return items[resource]?.[index] || 0;
    }

    // Calcula o valor para um recurso; se houver gênero 2, faz média simples
    function calcResource(resource: string): number {
      const val1 = getValue(resource, indexG1);
      const val2 = genre2 ? getValue(resource, indexG2) : 0;
      return genre2 ? (val1 + val2) / 2 : val1;
    }

    // Valores para Produção
    let writingVal = calcResource("writing");
    let costumeVal = calcResource("costume");
    let setdesignVal = calcResource("setdesign");

    // Valores para Pós-Produção
    let specialVal = calcResource("specialeffect");
    let soundVal = calcResource("sound");
    let editingVal = calcResource("editing");

    // Função para escalonar um grupo de 3 recursos para que a soma fique entre 85 e 100
    function scaleGroup(values: number[]): number[] {
      let sum = values.reduce((acc, cur) => acc + cur, 0);
      if (sum < 85) {
        const factor = 85 / sum;
        return values.map(v => v * factor);
      } else if (sum > 100) {
        const factor = 100 / sum;
        return values.map(v => v * factor);
      }
      return values;
    }

    // Escalonar cada grupo
    [writingVal, costumeVal, setdesignVal] = scaleGroup([writingVal, costumeVal, setdesignVal]);
    [specialVal, soundVal, editingVal] = scaleGroup([specialVal, soundVal, editingVal]);

    // Função para arredondar para o múltiplo de 5 e limitar entre 10 e 50
    function roundClamp(value: number): number {
      const remainder = value % 5;
      let newVal = remainder >= 2.5 ? value - remainder + 5 : value - remainder;
      if (newVal < 10) newVal = 10;
      if (newVal > 50) newVal = 50;
      return Math.round(newVal);
    }

    writingVal = roundClamp(writingVal);
    costumeVal = roundClamp(costumeVal);
    setdesignVal = roundClamp(setdesignVal);

    specialVal = roundClamp(specialVal);
    soundVal = roundClamp(soundVal);
    editingVal = roundClamp(editingVal);

    setResult({
      production: {
        writing: writingVal,
        costume: costumeVal,
        setdesign: setdesignVal,
      },
      postProduction: {
        specialeffect: specialVal,
        sound: soundVal,
        editing: editingVal,
      },
    });
  }, [genre1, genre2]);

  return result;
}
