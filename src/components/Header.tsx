import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-blue-600 text-white p-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-xl font-bold">LAK Exchange</div>
          <h1 className="text-lg text-center">老撾基普 (LAK) 即時換匯報價</h1>
        </div>
      </div>
    </header>
  );
} 