import { useState, useEffect } from 'react';
import { fetchBinanceP2P } from '@/utils/binance';
import { fetchBitoProTWD } from '@/utils/bitopro';
import { logger } from '@/utils/logger';

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
  TWD: ["現金", "街口支付/全支付/轉帳"]
} as const;

// 匯率計算函數
function calculateRate(apiRate: number, currency: string, method: string, cnyRate?: number, twdRate?: number): number {
  // LAK/USD 匯率
  const lakUsdRate = Number(apiRate);

  logger.debug(`Calculating rate for ${currency} (${method}):`, {
    apiRate,
    lakUsdRate,
    cnyRate,
    twdRate
  });

  switch (currency) {
    case "USD":
      return Math.floor(lakUsdRate * 0.99 / 10) * 10;
    
    case "CNY":
      if (!cnyRate) {
        logger.error('CNY rate is required for CNY calculation');
        return 0;
      }
      // CNY 匯率 = LAK/USD 除以 USDT/CNY 匯率
      const cnyFinalRate = Math.floor(lakUsdRate / (cnyRate + 0.01) * 0.99 / 5) * 5;
      
      // 如果是支付寶/微信，匯率加 50
      if (method === "支付寶/微信") {
        const adjustedRate = cnyFinalRate + 5;
        logger.debug('CNY rate calculation (支付寶/微信):', {
          lakUsdRate,
          cnyApiRate: cnyRate,
          baseCnyRate: cnyFinalRate,
          adjustedRate
        });
        return adjustedRate;
      }

      logger.debug('CNY rate calculation (現金):', {
        lakUsdRate,
        cnyApiRate: cnyRate,
        finalCnyRate: cnyFinalRate
      });
      return cnyFinalRate;
    
    case "TWD":
      if (!twdRate) {
        logger.error('TWD rate is required for TWD calculation');
        return 0;
      }
      // TWD 匯率 = LAK/USD 除以 BitoPro 的 USDT/TWD 匯率
      const twdFinalRate = Math.floor(lakUsdRate / twdRate * 0.992 / 2) * 2;
      
      // 如果是街口支付，匯率加 10
      if (method === "街口支付/全支付/轉帳") {
        const adjustedRate = twdFinalRate + 0.5;
        logger.debug('TWD rate calculation (街口支付):', {
          lakUsdRate,
          twdApiRate: twdRate,
          baseTwdRate: twdFinalRate,
          adjustedRate
        });
        return adjustedRate;
      }

      logger.debug('TWD rate calculation (現金):', {
        lakUsdRate,
        twdApiRate: twdRate,
        finalTwdRate: twdFinalRate
      });
      return twdFinalRate;
    
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
      logger.info('Fetching rates...');
      
      // 獲取實時匯率
      const usdtLak = await fetchBinanceP2P("USDT", "LAK", "SELL");
      logger.rates('USDT/LAK rate:', usdtLak);
      
      const usdtCny = await fetchBinanceP2P("USDT", "CNY");
      logger.rates('USDT/CNY rate:', usdtCny);
      
      const usdtTwd = await fetchBitoProTWD();
      logger.rates('USDT/TWD rate:', usdtTwd);

      const baseRate = Number(usdtLak);
      const cnyRate = Number(usdtCny);
      const twdRate = Number(usdtTwd);

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
              currency === "TWD" ? twdRate : undefined
            ),
            lastUpdate: new Date().toISOString()
          });
        });
      });

      logger.debug('Final calculated rates:', updatedRates);

      setRates(updatedRates);
      setIsLoading(false);
    } catch (error) {
      logger.error('Error fetching rates:', error);
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