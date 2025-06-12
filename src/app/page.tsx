'use client';

import { useRates } from '@/lib/useRates';
import Header from '@/components/Header';
import QuoteTable from '@/components/QuoteTable';
import Calculator from '@/components/Calculator';
import LanguageToggle from '@/components/LanguageToggle';
import { useState, useEffect } from 'react';
import { translations, Language } from '@/lib/translations';

export default function Home() {
  const { rates, isLoading, isError } = useRates();
  const [currentLang, setCurrentLang] = useState<Language>('zh-TW');

  // 初始化時設置深色模式
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="container mx-auto p-4">
          <div className="text-center text-white">{translations[currentLang].loading}</div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="container mx-auto p-4">
          <div className="text-center text-red-600">{translations[currentLang].error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto p-4 space-y-8">
        <QuoteTable rates={rates || []} currentLang={currentLang} />
        <Calculator rates={rates || []} currentLang={currentLang} />
        <div className="text-center text-sm text-gray-400">
          {translations[currentLang].lastUpdate.replace('{time}', new Date().toLocaleString())}
        </div>
      </main>
      <LanguageToggle currentLang={currentLang} onLanguageChange={handleLanguageChange} />
    </div>
  );
}
