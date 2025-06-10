import React, { useState, useEffect } from 'react';
import { Rate } from '@/lib/useRates';

interface CalculatorProps {
  rates: Rate[];
}

export default function Calculator({ rates }: CalculatorProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [amount, setAmount] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (amount && rates) {
        const rate = rates.find(r => r.currency === selectedCurrency);
        if (rate) {
          setResult(Number(amount) * rate.rate);
        }
      } else {
        setResult(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [amount, selectedCurrency, rates]);

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            選擇貨幣
          </label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {rates?.map((rate) => (
              <option key={rate.currency} value={rate.currency}>
                {rate.currency}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            輸入金額
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="請輸入金額"
          />
        </div>

        {result !== null && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-md">
            <p className="text-lg font-medium text-blue-900 dark:text-blue-100">
              可換得：{result.toLocaleString()} LAK
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 