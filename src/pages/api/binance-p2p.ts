import type { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@/utils/logger';

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

    logger('debug', {
      msg: 'Binance P2P API Request (CNY - comparing BUY/SELL)',
      meta: {
        url,
        buyPayload,
        sellPayload,
        query: req.query
      }
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
      
      logger('debug', {
        msg: 'Binance P2P API Response (CNY)',
        meta: {
          buyStatus: buyResponse.status,
          sellStatus: sellResponse.status,
          buyData: buyData,
          sellData: sellData
        }
      });

      // 提取匯率並比較
      const buyPrice = buyData?.data?.[0]?.adv?.price;
      const sellPrice = sellData?.data?.[0]?.adv?.price;

      // 打印 CNY 數據列
      console.log('=== CNY PRICE DATA ===');
      console.log('Buy Data:', JSON.stringify(buyData, null, 2));
      console.log('Sell Data:', JSON.stringify(sellData, null, 2));
      console.log('Buy Price:', buyPrice);
      console.log('Sell Price:', sellPrice);
      console.log('=====================');

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

      // 打印最終 CNY 結果
      console.log('=== CNY FINAL RESULT ===');
      console.log('Final Price:', finalPrice);
      console.log('Selected Type:', selectedType);
      console.log('Result:', JSON.stringify(result, null, 2));
      console.log('========================');

      res.status(200).json(result);
    } catch (error) {
      logger('error', { msg: 'Binance P2P API Error (CNY)', meta: { error } });
      res.status(500).json({ error: "Failed to fetch Binance API" });
    }
  } else {
    // 其他法幣（如 USD/LAK）只使用 SELL 數據，抓取第二個數據
    const payload = {
      page: 1,
      rows: 2,  // 改為 2，獲取前兩個數據
      asset: String(asset).toUpperCase(),
      tradeType: 'SELL',
      fiat: fiatType,
      payTypes: []
    };

    logger('debug', {
      msg: 'Binance P2P API Request (SELL only - getting second data)',
      meta: {
        url,
        payload,
        query: req.query
      }
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      // 取第二個數據（索引 1）
      const sellPrice = data?.data?.[1]?.adv?.price;
      
      // 如果第二個數據不存在，回退到第一個
      const fallbackPrice = data?.data?.[0]?.adv?.price;
      const finalSellPrice = sellPrice || fallbackPrice;
      
      // 打印 sellPrice 數據列
      console.log('=== SELL PRICE DATA ===');
      console.log('Raw API Response:', JSON.stringify(data, null, 2));
      console.log('Data Array Length:', data?.data?.length || 0);
      console.log('First Price (index 0):', data?.data?.[0]?.adv?.price);
      console.log('Second Price (index 1):', data?.data?.[1]?.adv?.price);
      console.log('Selected sellPrice:', sellPrice);
      console.log('Fallback Price:', fallbackPrice);
      console.log('Final Sell Price:', finalSellPrice);
      console.log('========================');
      
      logger('debug', {
        msg: 'Binance P2P API Response (SELL only - second data)',
        meta: {
          status: response.status,
          dataCount: data?.data?.length || 0,
          firstPrice: data?.data?.[0]?.adv?.price,
          secondPrice: data?.data?.[1]?.adv?.price,
          selectedPrice: finalSellPrice,
          selectedIndex: sellPrice ? 1 : 0
        }
      });

      const result = {
        sellPrice: finalSellPrice,
        finalPrice: finalSellPrice,
        selectedType: 'SELL',
        selectedIndex: sellPrice ? 1 : 0,  // 記錄使用的數據索引
        sellData: data
      };

      // 打印最終 USD/LAK 結果
      console.log('=== USD/LAK FINAL RESULT ===');
      console.log('Final Sell Price:', finalSellPrice);
      console.log('Selected Index:', sellPrice ? 1 : 0);
      console.log('Result:', JSON.stringify(result, null, 2));
      console.log('============================');

      res.status(200).json(result);
    } catch (error) {
      logger('error', { msg: 'Binance P2P API Error (SELL only)', meta: { error } });
      res.status(500).json({ error: "Failed to fetch Binance API" });
    }
  }
} 