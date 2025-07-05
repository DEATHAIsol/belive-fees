import { NextApiRequest, NextApiResponse } from 'next';
import { getWalletBalance } from '../../lib/solana-tracker';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const rewardWallet = process.env.REWARD_WALLET;
    if (!rewardWallet) {
      return res.status(500).json({ message: 'Reward wallet not configured' });
    }

    const balance = await getWalletBalance(rewardWallet);

    res.status(200).json({
      prizePool: balance.balance,
      symbol: balance.symbol
    });
  } catch (error) {
    console.error('Error fetching prize pool:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 