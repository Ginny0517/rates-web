import React, { useEffect, useState } from "react";
import { fetchBinanceP2P } from "@/utils/binance";
import { fetchBitoProTWD } from "@/utils/bitopro";

export default function RatesPanel() {
  const [usdtLak, setUsdtLak] = useState<string | number>("-");
  const [usdtCny, setUsdtCny] = useState<string | number>("-");
  const [usdtTwd, setUsdtTwd] = useState<string | number>("-");
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    setUsdtLak(await fetchBinanceP2P("USDT", "LAK", "SELL"));
    setUsdtCny(await fetchBinanceP2P("USDT", "CNY", "BUY"));
    setUsdtTwd(await fetchBitoProTWD());
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 600000); // 每10分鐘自動更新
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow-md max-w-md mx-auto my-6">
      <h2 className="text-lg font-bold mb-4">即時匯率</h2>
      {loading ? (
        <p>載入中...</p>
      ) : (
        <ul className="space-y-2">
          <li>幣安 USDT/LAK (SELL): <span className="font-mono">{usdtLak}</span></li>
          <li>幣安 USDT/CNY (BUY): <span className="font-mono">{usdtCny}</span></li>
          <li>BitoPro USDT/TWD: <span className="font-mono">{usdtTwd}</span></li>
        </ul>
      )}
      <button onClick={fetchAll} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">手動更新</button>
    </div>
  );
} 