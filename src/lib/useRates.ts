import { useState, useEffect } from 'react';
import { fetchBinanceP2P } from '@/utils/binance';
import { fetchBitoProTWD } from '@/utils/bitopro';
import { logger } from '@/utils/logger';

// 獲取 LAK 匯率的函數
async function fetchLakRate(): Promise<number> {
  try {
    const response = await fetch('/api/lak-rate');
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    logger('debug', { msg: 'LAK rate fetched successfully', meta: { rate: data.rate } });
    return data.rate;
  } catch (error) {
    logger('error', { msg: 'Failed to fetch LAK rate', meta: { error } });
    throw error;
  }
}

export interface Rate {
  currency: string;
  method: string;
  rate: number;
  lastUpdate?: string;
}

// 支付方式定義
const PAYMENT_METHODS = {
  USD: ["現金"],
  CNY: ["現金", "支付寶/微信"],
  TWD: ["現金", "街口支付/全支付/轉帳"],
  THB: ["現金"]
} as const;

// 匯率計算函數
function calculateRate(apiRate: number, currency: string, method: string, cnyRate?: number, twdRate?: number, lakRate?: number): number {
  // LAK/USD 匯率
  const lakUsdRate = Number(apiRate);

  logger('debug', {
    msg: `Calculating rate for ${currency} (${method})`,
    meta: {
      apiRate,
      lakUsdRate,
      cnyRate,
      twdRate,
      lakRate
    }
  });

  switch (currency) {
    case "USD":
      return Math.floor(lakUsdRate * 0.99 / 10) * 10;
    
    case "CNY":
      if (!cnyRate) {
        logger('error', { msg: 'CNY rate is required for CNY calculation' });
        return 0;
      }
      // CNY 匯率 = LAK/USD 除以 USDT/CNY 匯率
      const cnyFinalRate = Math.floor(lakUsdRate / (cnyRate + 0.01) * 0.99 / 5) * 5;
      
      // 如果是支付寶/微信，匯率加 50
      if (method === "支付寶/微信") {
        const adjustedRate = cnyFinalRate + 5;
        logger('debug', {
          msg: 'CNY rate calculation (支付寶/微信)',
          meta: {
            lakUsdRate,
            cnyApiRate: cnyRate,
            baseCnyRate: cnyFinalRate,
            adjustedRate
          }
        });
        return adjustedRate;
      }

      logger('debug', {
        msg: 'CNY rate calculation (現金)',
        meta: {
          lakUsdRate,
          cnyApiRate: cnyRate,
          finalCnyRate: cnyFinalRate
        }
      });
      return cnyFinalRate;
    
    case "TWD":
      if (!twdRate) {
        logger('error', { msg: 'TWD rate is required for TWD calculation' });
        return 0;
      }
      // TWD 匯率 = LAK/USD 除以 BitoPro 的 USDT/TWD 匯率
      const twdFinalRate = Math.floor(lakUsdRate / (twdRate || 0) * 0.992 * 2) / 2;
      
      // 如果是街口支付，匯率加 10
      if (method === "街口支付/全支付/轉帳") {
        const adjustedRate = twdFinalRate + 0.5;
        logger('debug', {
          msg: 'TWD rate calculation (街口支付)',
          meta: {
            lakUsdRate,
            twdApiRate: twdRate,
            baseTwdRate: twdFinalRate,
            adjustedRate
          }
        });
        return adjustedRate;
      }

      logger('debug', {
        msg: 'TWD rate calculation (現金)',
        meta: {
          lakUsdRate,
          twdApiRate: twdRate,
          finalTwdRate: twdFinalRate
        }
      });
      return twdFinalRate;
    
    case "THB":
      // 新增 THB 匯率計算，直接使用 LAK/THB 匯率
      if (!lakRate) {
        logger('error', { msg: 'LAK rate is required for THB calculation' });
        return 0;
      }
      const thbFinalRate = Math.floor(lakRate * 1.0055 * 2) / 2;
      
      logger('debug', {
        msg: 'THB rate calculation (現金)',
        meta: {
          lakThbRate: lakRate,
          finalThbRate: thbFinalRate
        }
      });
      return thbFinalRate;
    
    default:
      return 0;
  }
}

export function useRates() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchRates = async () => {
    try {
      logger('info', { msg: 'Fetching rates...' });
      
      // 獲取實時匯率
      const usdtLak = await fetchBinanceP2P("USDT", "LAK", "SELL");
      logger('rates', { msg: 'USDT/LAK rate', meta: { rate: usdtLak } });
      
      const usdtCny = await fetchBinanceP2P("USDT", "CNY");
      logger('rates', { msg: 'USDT/CNY rate', meta: { rate: usdtCny } });
      
      const usdtTwd = await fetchBitoProTWD();
      logger('rates', { msg: 'USDT/TWD rate', meta: { rate: usdtTwd } });

      // 新增：獲取 LAK/THB 匯率
      const lakThb = await fetchLakRate();
      logger('rates', { msg: 'LAK/THB rate', meta: { rate: lakThb } });

      const baseRate = Number(usdtLak);
      const cnyRate = Number(usdtCny);
      const twdRate = Number(usdtTwd);
      const lakRate = Number(lakThb);

      // 計算所有匯率組合
      const updatedRates: Rate[] = [];

      // 為每種貨幣添加所有支付方式
      Object.entries(PAYMENT_METHODS).forEach(([currency, methods]) => {
        methods.forEach(method => {
          updatedRates.push({
            currency,
            method,
            rate: calculateRate(
              baseRate,
              currency,
              method,
              currency === "CNY" ? cnyRate : undefined,
              currency === "TWD" ? twdRate : undefined,
              currency === "THB" ? lakRate : undefined
            ),
            lastUpdate: new Date().toISOString()
          });
        });
      });

      logger('debug', { msg: 'Final calculated rates', meta: { rates: updatedRates } });

      setRates(updatedRates);
      setIsLoading(false);
    } catch (error) {
      logger('error', { msg: 'Error fetching rates', meta: { error } });
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 600000); // 每10分鐘更新一次
    return () => clearInterval(interval);
  }, []);

  return { rates, isLoading, isError, refetch: fetchRates };
} 