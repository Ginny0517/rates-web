import React, { useState, useEffect } from 'react';
import { Rate } from '@/lib/useRates';
import { translations, Language } from '@/lib/translations';

interface CalculatorProps {
  rates: Rate[];
  currentLang: Language;
}

export default function Calculator({ rates, currentLang }: CalculatorProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [selectedMethod, setSelectedMethod] = useState<string>('現金');
  const [amount, setAmount] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  // 過濾出唯一的貨幣選項
  const uniqueCurrencies = Array.from(new Set(rates?.map(rate => rate.currency) || []));
  
  // 根據選擇的貨幣獲取可用的支付方式
  const availableMethods = Array.from(
    new Set(
      rates
        ?.filter(rate => rate.currency === selectedCurrency)
        .map(rate => rate.method) || []
    )
  );

  // 當貨幣改變時，重置支付方式為第一個可用的選項
  useEffect(() => {
    if (availableMethods.length > 0) {
      setSelectedMethod(availableMethods[0]);
    }
  }, [selectedCurrency]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (amount && rates) {
        const rate = rates.find(r => r.currency === selectedCurrency && r.method === selectedMethod);
        if (rate) {
          setResult(Number(amount) * rate.rate);
        }
      } else {
        setResult(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [amount, selectedCurrency, selectedMethod, rates]);

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {translations[currentLang].currency}
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {uniqueCurrencies.map((currency) => (
                <option key={currency} value={currency} className="dark:bg-gray-700 dark:text-white">
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {translations[currentLang].paymentMethod}
            </label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={availableMethods.length === 0}
            >
              {availableMethods.map((method) => (
                <option key={method} value={method} className="dark:bg-gray-700 dark:text-white">
                  {translations[currentLang][method as keyof typeof translations['zh-TW']]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {translations[currentLang].amount}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder={translations[currentLang].amount}
          />
        </div>

        {result !== null && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-md">
            <p className="text-lg font-medium text-blue-900 dark:text-blue-100">
              {translations[currentLang].result.replace('{amount}', result.toLocaleString())}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 