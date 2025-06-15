import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('https://max-api.maicoin.com/api/v2/tickers/usdttwd');
    const data = await response.json();
    res.status(200).json(data.ticker.last);
  } catch {
    res.status(500).json({ error: 'Failed to fetch TWD rate' });
  }
} 