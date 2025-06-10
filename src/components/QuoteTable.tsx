import React from 'react';
import { Rate } from '@/lib/useRates';

interface QuoteTableProps {
  rates: Rate[];
}

export default function QuoteTable({ rates }: QuoteTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left">支付貨幣</th>
            <th className="px-6 py-3 text-left">支付方式</th>
            <th className="px-6 py-3 text-left">即時報價 (LAK)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {rates?.map((rate, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4">{rate.currency}</td>
              <td className="px-6 py-4">{rate.method}</td>
              <td className="px-6 py-4">{rate.rate.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 