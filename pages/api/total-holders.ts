import { NextApiRequest, NextApiResponse } from 'next';
import { getTokenInfo } from '../../lib/solana-tracker';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    if (!tokenAddress) {
      return res.status(500).json({ message: 'Token address not configured' });
    }

    const tokenInfo = await getTokenInfo(tokenAddress);

    res.status(200).json({ 
      totalHolders: tokenInfo.holders,
      tokenName: tokenInfo.name,
      tokenSymbol: tokenInfo.symbol
    });
  } catch (error) {
    console.error('Error fetching total holders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 