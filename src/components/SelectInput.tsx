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
  isOptional?: boolean; // Nova prop para indicar se o campo é opcional
};

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  isOptional = false,
}) => {
  const { translations: t } = useLanguage();

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full py-2 px-3 border rounded-md shadow-sm transition-colors duration-300 appearance-none pr-10
                   bg-white text-gray-900 border-gray-300 dark:bg-formBackgroundDark dark:text-darkForeground dark:border-formBorderDark"
      >
        <option value="">{t.select}</option>
        {options.map((option) => (
          <option key={option} value={option} className="text-gray-900 dark:text-gray-100">
            {option}
          </option>
        ))}
      </select>
      {/* Texto auxiliar abaixo do select */}
      {isOptional && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {t.optinSelect}
        </p>
      )}
    </div>
  );
};

export default SelectInput;
