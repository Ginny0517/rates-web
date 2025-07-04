import React from 'react';
import { Rate } from '@/lib/useRates';
import { translations, Language } from '@/lib/translations';

interface QuoteTableProps {
  rates: Rate[];
  currentLang: Language;
}

export default function QuoteTable({ rates, currentLang }: QuoteTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left">{translations[currentLang].currency}</th>
            <th className="px-6 py-3 text-left">{translations[currentLang].paymentMethod}</th>
            <th className="px-6 py-3 text-left">LAK</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {rates?.map((rate) => (
            <tr key={`${rate.currency}-${rate.method}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4">{rate.currency}</td>
              <td className="px-6 py-4">{translations[currentLang][rate.method as keyof typeof translations['zh-TW']]}</td>
              <td className="px-6 py-4">{rate.rate.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 