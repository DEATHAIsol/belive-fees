import { NextApiRequest, NextApiResponse } from 'next';
import { getTokenHolders, getTokenInfo } from '../../lib/solana-tracker';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    if (!tokenAddress) {
      return res.status(500).json({ message: 'Token address not configured' });
    }

    const holders = await getTokenHolders(tokenAddress);
    
    // Calculate win chances for each holder
    const totalTickets = holders.reduce((sum, holder) => sum + holder.tickets, 0);
    const holdersWithChances = holders.map(holder => ({
      ...holder,
      winChance: totalTickets > 0 ? ((holder.tickets / totalTickets) * 100).toFixed(2) : '0'
    }));

    res.status(200).json(holdersWithChances); // Return all 100 for leaderboard
  } catch (error) {
    console.error('Error fetching ticket holders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 