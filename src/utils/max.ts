export async function fetchMaxTWD(side: "last" | "buy" | "sell" = "last") {
  const url = "/api/max-twd";
  const res = await fetch(url);
  if (!res.ok) return "#MAX_ERR";
  const j = await res.json();
  const tkr = j.ticker ? j.ticker : j;
  if (!tkr.buy || !tkr.sell || !tkr.last) return "#MAX_ERR";
  if (side === "buy") return Number(tkr.buy);
  if (side === "sell") return Number(tkr.sell);
  return Number(tkr.last);
} 