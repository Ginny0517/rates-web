export async function fetchBitoProTWD() {
  const url = "https://api.bitopro.com/v3/tickers/USDT_TWD";
  const res = await fetch(url);
  if (!res.ok) return "#BITO_ERR";
  const data = await res.json();
  if (!data.data?.lastPrice) return "#BITO_ERR";
  return Number(data.data.lastPrice);
} 