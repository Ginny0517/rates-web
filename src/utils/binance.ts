export async function fetchBinanceP2P(asset: string, fiat: string, tradeType: string = "SELL") {
  const url = `/api/binance-p2p?asset=${asset}&fiat=${fiat}&tradeType=${tradeType}`;
  const res = await fetch(url);
  if (!res.ok) return "#NO_DATA";
  const json = await res.json();
  return json?.data?.[0]?.adv?.price || "#NO_DATA";
} 