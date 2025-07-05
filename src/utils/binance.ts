export async function fetchBinanceP2P(asset: string, fiat: string, tradeType: string = "SELL") {
  const url = `/api/binance-p2p?asset=${asset}&fiat=${fiat}&tradeType=${tradeType}`;
  const res = await fetch(url);
  if (!res.ok) return "#NO_DATA";
  const json = await res.json();
  
  // 處理新的 API 回應格式
  if (json.finalPrice) {
    return json.finalPrice;
  }
  
  // 回退到舊格式（如果有的話）
  return json?.data?.[0]?.adv?.price || "#NO_DATA";
} 