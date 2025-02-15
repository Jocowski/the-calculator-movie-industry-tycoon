"use client";

import React from "react";

type AgeRatingOption = {
  value: string;
  label: string;
  color: string;
};

type AgeRatingRadioProps = {
  options: AgeRatingOption[];
  selectedValue: string;
  onChange: (value: string) => void;
};

const AgeRatingRadio: React.FC<AgeRatingRadioProps> = ({
  options,
  selectedValue,
  onChange,
}) => {
  return (
    <div className="flex w-full space-x-2">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex-1 h-12 flex items-center justify-center rounded-md border-2 cursor-pointer 
                     transition-colors duration-300 ${selectedValue === option.value
              ? `${option.color} text-white border-transparent`
              : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            } focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500`}
        >
          <input
            type="radio"
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onChange(option.value)}
            className="absolute opacity-0 w-0 h-0" // Mantém o input invisível
          />
          <span className="font-medium">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default AgeRatingRadio;