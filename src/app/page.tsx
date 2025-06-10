'use client';

import { useRates } from '@/lib/useRates';
import Header from '@/components/Header';
import QuoteTable from '@/components/QuoteTable';
import Calculator from '@/components/Calculator';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const { rates, isLoading, isError } = useRates();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto p-4">
          <div className="text-center">載入中...</div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto p-4">
          <div className="text-center text-red-600">載入失敗，請稍後再試</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto p-4 space-y-8">
        <QuoteTable rates={rates || []} />
        <Calculator rates={rates || []} />
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          最近更新：{new Date().toLocaleString()}
        </div>
      </main>
      <ThemeToggle />
      <div>這是測試標記</div>
    </div>
  );
}
