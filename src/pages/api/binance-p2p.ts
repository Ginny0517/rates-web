import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { asset = 'USDT', fiat = 'LAK' } = req.query;
  const url = "https://c2c.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";
  
  // 根據法幣類型決定是否比較 BUY 和 SELL
  const fiatType = String(fiat).toUpperCase();
  
  if (fiatType === 'CNY') {
    // CNY 需要比較 BUY 和 SELL 價格
    const buyPayload = {
      page: 1,
      rows: 1,
      asset: String(asset).toUpperCase(),
      tradeType: 'BUY',
      fiat: fiatType,
      payTypes: []
    };

    const sellPayload = {
      page: 1,
      rows: 1,
      asset: String(asset).toUpperCase(),
      tradeType: 'SELL',
      fiat: fiatType,
      payTypes: []
    };

    console.log('Binance P2P API Request (CNY - comparing BUY/SELL):', {
      url,
      buyPayload,
      sellPayload,
      query: req.query
    });

    try {
      // 並行請求 BUY 和 SELL 匯率
      const [buyResponse, sellResponse] = await Promise.all([
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buyPayload)
        }),
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sellPayload)
        })
      ]);

      const buyData = await buyResponse.json();
      const sellData = await sellResponse.json();
      
      console.log('Binance P2P API Response (CNY):', {
        buyStatus: buyResponse.status,
        sellStatus: sellResponse.status,
        buyData: buyData,
        sellData: sellData
      });

      // 提取匯率並比較
      const buyPrice = buyData?.data?.[0]?.adv?.price;
      const sellPrice = sellData?.data?.[0]?.adv?.price;

      let finalPrice = null;
      let selectedType = null;
      
      if (buyPrice && sellPrice) {
        if (parseFloat(buyPrice) > parseFloat(sellPrice)) {
          finalPrice = buyPrice;
          selectedType = 'BUY';
        } else {
          finalPrice = sellPrice;
          selectedType = 'SELL';
        }
      } else if (buyPrice) {
        finalPrice = buyPrice;
        selectedType = 'BUY';
      } else if (sellPrice) {
        finalPrice = sellPrice;
        selectedType = 'SELL';
      }

      const result = {
        buyPrice,
        sellPrice,
        finalPrice,
        selectedType,
        buyData,
        sellData
      };

      res.status(200).json(result);
    } catch (error) {
      console.error('Binance P2P API Error (CNY):', error);
      res.status(500).json({ error: "Failed to fetch Binance API" });
    }
  } else {
    // 其他法幣（如 USD/LAK）只使用 SELL 數據
    const payload = {
      page: 1,
      rows: 1,
      asset: String(asset).toUpperCase(),
      tradeType: 'SELL',
      fiat: fiatType,
      payTypes: []
    };

    console.log('Binance P2P API Request (SELL only):', {
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
      
      console.log('Binance P2P API Response (SELL only):', {
        status: response.status,
        data: data
      });

      const sellPrice = data?.data?.[0]?.adv?.price;

      const result = {
        sellPrice,
        finalPrice: sellPrice,
        selectedType: 'SELL',
        sellData: data
      };

      res.status(200).json(result);
    } catch (error) {
      console.error('Binance P2P API Error (SELL only):', error);
      res.status(500).json({ error: "Failed to fetch Binance API" });
    }
  }
} 