import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { asset = 'USDT', fiat = 'LAK', tradeType = 'SELL' } = req.query;
  const url = "https://c2c.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";
  
  // 根據不同的法幣設定不同的交易類型
  let finalTradeType = String(tradeType).toUpperCase();
  if (fiat === 'CNY') {
    finalTradeType = 'BUY'; // CNY 使用 BUY 價格
  }

  const payload = {
    page: 1,
    rows: 1,
    asset: String(asset).toUpperCase(),
    tradeType: finalTradeType,
    fiat: String(fiat).toUpperCase(),
    payTypes: []
  };

  console.log('Binance P2P API Request:', {
    url,
    payload,
    query: req.query
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    
    console.log('Binance P2P API Response:', {
      status: response.status,
      data: data
    });

    res.status(200).json(data);
  } catch (error) {
    console.error('Binance P2P API Error:', error);
    res.status(500).json({ error: "Failed to fetch Binance API" });
  }
} 