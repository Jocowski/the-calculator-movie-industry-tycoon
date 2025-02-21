// src/components/Calculator/ProductionResult.tsx
"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

type ProductionProps = {
  writing: number;
  costume: number;
  setdesign: number;
};

type PostProductionProps = {
  specialeffect: number;
  sound: number;
  editing: number;
};

type ProductionResultProps = {
  production: ProductionProps | null;
  postProduction: PostProductionProps | null;
};

const ProductionResult: React.FC<ProductionResultProps> = ({ production, postProduction }) => {
  const { translations: t } = useLanguage();

  if (!production || !postProduction) return null;

  /**
   * Renderiza um "card" para cada slider. O valor numérico fica
   * posicionado abaixo do thumb, calculando a posição em relação
   * ao range (10 a 50).
   */
  const renderSliderCard = (label: string, value: number, testId: string) => {
    // O slider vai de 10 a 50 (intervalo = 40). Calculamos a % para posicionar o valor.
    const leftPos = ((value - 10) / 40) * 90;

    return (
      <div
        key={testId}
        className="p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center bg-white dark:bg-gray-800"
      >
        {/* Label do recurso (ex.: "Roteiro") */}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>

        {/* Container relativo para posicionar o valor abaixo do slider */}
        <div className="w-full mt-2 pb-4 relative">
          <input
            type="range"
            min="10"
            max="50"
            step="5"
            value={value}
            readOnly
            onChange={() => { }}
            className="readonly-slider"
            style={{ pointerEvents: "none" }}
            data-testid={testId}
          />

          {/* Valor posicionado abaixo do thumb */}
          <div
            className="absolute text-xs text-gray-500 dark:text-gray-300 ml-2"
            style={{
              left: `${leftPos}%`,
              transform: "translateX(-50%)",
              top: "calc(100% - 16px)",
            }}
          >
            {value}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="production-result-container rounded-md bg-gray-100 dark:bg-gray-700">
      <h3 className="my-2 text-sm text-gray-600 dark:text-gray-400">
        {t.productionPlanning}
      </h3>

      {/* Seção de Produção */}
      <div className="mb-4">
        <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
          {t.productionLabel}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {renderSliderCard(t.writing, production.writing, "slider-writing")}
          {renderSliderCard(t.costume, production.costume, "slider-costume")}
          {renderSliderCard(t.setdesign, production.setdesign, "slider-setdesign")}
        </div>
      </div>

      {/* Seção de Pós-Produção */}
      <div>
        <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
          {t.postProductionLabel}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {renderSliderCard(t.specialeffect, postProduction.specialeffect, "slider-specialeffect")}
          {renderSliderCard(t.sound, postProduction.sound, "slider-sound")}
          {renderSliderCard(t.editing, postProduction.editing, "slider-editing")}
        </div>
      </div>
    </div>
  );
};

export default ProductionResult;
