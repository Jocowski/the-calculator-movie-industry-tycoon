"use client";

import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons';
import { useLanguage } from '@/context/LanguageContext';

type GenresInputProps = {
  label: string;
  name: string;
  options: { genre: string; score: number; label: string }[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  isOptional?: boolean;
};

const GenresInput = ({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  isOptional = false,
}: GenresInputProps) => {
  const { translations: t } = useLanguage();

  const handleValueChange = (value: string) => {
    const cleanedValue = value === "unselected" ? "" : value;
    onChange(cleanedValue);
    window.gtag('event', 'form_field_change', {
      form_name: 'affinity_calculator',
      field_name: name,
      field_value: cleanedValue,
    });
  };

  // Função para determinar a cor de fundo com base no label
  const getScoreBgColor = (label: string): string => {
    switch (label.toLowerCase()) {
      case t.bad.toLowerCase():
        return "bg-red-500";
      case t.medium.toLowerCase():
        return "bg-yellow-400";
      case t.good.toLowerCase():
        return "bg-blue-500";
      case t.great.toLowerCase():
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  // Função para determinar a cor do texto com base no label
  const getTextColor = (label: string): string => {
    if (label.toLowerCase() === t.medium.toLowerCase()) {
      return "text-gray-900"; // Médio
    }
    return "text-white"; // Ruim, Bom ou Ótimo
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <Select.Root value={value} onValueChange={handleValueChange}>
        <Select.Trigger
          className="w-full flex items-center justify-between px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-formBackgroundDark text-gray-900 dark:text-darkForeground border-gray-300 dark:border-formBorderDark"
          aria-label={label}
        >
          <Select.Value placeholder={t.select} />
          <Select.Icon className="text-gray-500 dark:text-gray-400">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="z-50 bg-white dark:bg-formBackgroundDark rounded-md shadow-lg border border-gray-200 dark:border-formBorderDark">
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white dark:bg-formBackgroundDark text-gray-500 cursor-default">
              <ChevronDownIcon />
            </Select.ScrollUpButton>

            <Select.Viewport className="p-2">
              {isOptional && (
                <Select.Item
                  value="unselected" // Violação da regra de valores não vazios
                  className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <Select.ItemText>{t.clearSelection}</Select.ItemText>
                </Select.Item>
              )}

              {options.map((option) => (
                <Select.Item
                  key={option.genre}
                  value={option.genre}
                  className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <Select.ItemText>
                    <span className={option.label ? `text-l font-bold my-2 py-1 px-2 rounded ${getScoreBgColor(option.label)} ${getTextColor(option.label)}` : ''}>
                      {option.genre}
                    </span>
                  </Select.ItemText>
                  <Select.ItemIndicator className="ml-auto">
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>

            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white dark:bg-formBackgroundDark text-gray-500 cursor-default">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {isOptional && (
        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
          {t.optinSelect}
        </span>
      )}
    </div>
  );
};

export default GenresInput;