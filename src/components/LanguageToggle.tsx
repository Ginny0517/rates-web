import React from 'react';
import { Language } from '@/lib/translations';

interface LanguageToggleProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageToggle({ currentLang, onLanguageChange }: LanguageToggleProps) {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
      <div className="flex space-x-2">
        <button
          onClick={() => onLanguageChange('zh-TW')}
          className={`px-3 py-2 rounded-md ${
            currentLang === 'zh-TW'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          繁體
        </button>
        <button
          onClick={() => onLanguageChange('zh-CN')}
          className={`px-3 py-2 rounded-md ${
            currentLang === 'zh-CN'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          简体
        </button>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onLanguageChange('lo')}
          className={`px-3 py-2 rounded-md ${
            currentLang === 'lo'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          ລາວ
        </button>
        <button
          onClick={() => onLanguageChange('en')}
          className={`px-3 py-2 rounded-md ${
            currentLang === 'en'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
} 