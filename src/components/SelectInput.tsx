"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

type SelectInputProps = {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  isOptional?: boolean;
  className?: string;
};

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  isOptional = false,
  className = "",
}) => {
  const { translations: t } = useLanguage();

  return (
    <div className={`select-input ${className}`}>
      {/* Label do campo */}
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}:
      </label>

      {/* Elemento select */}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
      >
        <option value="" disabled>
          {t.select}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Texto auxiliar abaixo do select */}
      {isOptional && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t.optinSelect}
        </p>
      )}
    </div>
  );
};

export default SelectInput;