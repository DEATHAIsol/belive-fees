import type { NextApiRequest, NextApiResponse } from 'next';

const SYMBOLS = [
  'bonk', // Bonk Dog (win symbol)
  'banana',
  'rug',
  'fire',
  'diamond',
  'rocket',
  'skull',
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Simulate a jackpot spin
  const reels = [0, 0, 0, 0, 0];
  res.status(200).json({
    reels,
    symbols: reels.map(i => SYMBOLS[i]),
    winType: 'jackpot',
  });
} 