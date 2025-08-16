import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/THB');
    const data = await response.json();
    
    if (!data.rates || !data.rates.LAK) {
      return res.status(404).json({ error: 'LAK rate not found' });
    }
    
    // 返回 LAK 匯率（相對於 THB）
    const lakRate = data.rates.LAK;
    
    res.status(200).json({
      rate: lakRate,
      base_currency: 'THB',
      target_currency: 'LAK',
      timestamp: data.time_last_update_utc
    });
  } catch (error) {
    console.error('Error fetching LAK rate:', error);
    res.status(500).json({ error: 'Failed to fetch LAK rate' });
  }
}
