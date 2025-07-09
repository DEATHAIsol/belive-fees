import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise, { inMemoryDB } from '../../lib/mongodb';
import { getTokenHolders, getWalletBalance, selectWinner } from '../../lib/solana-tracker';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verify cron secret if needed
  const cronSecret = req.headers.authorization;
  if (process.env.CRON_SECRET && cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const rewardWallet = process.env.REWARD_WALLET;

    if (!tokenAddress || !rewardWallet) {
      return res.status(500).json({ message: 'Environment variables not configured' });
    }

    // Get current data
    const holders = await getTokenHolders(tokenAddress);
    const balance = await getWalletBalance(rewardWallet);

    if (holders.length === 0) {
      return res.status(400).json({ message: 'No eligible holders found' });
    }

    // Select winner
    const winner = selectWinner(holders);

    if (clientPromise && inMemoryDB === null) {
      // Get current round number
      const client = await clientPromise;
      if (!client) {
        throw new Error('Failed to connect to database');
      }
      const db = client.db('belive-jackpot');
      const roundsCollection = db.collection('rounds');

      const latestRound = await roundsCollection
        .find({})
        .sort({ round: -1 })
        .limit(1)
        .toArray();

      const nextRoundNumber = latestRound.length > 0 ? latestRound[0].round + 1 : 1;

      // Create round data
      const roundData = {
        round: nextRoundNumber,
        timestamp: new Date().toISOString(),
        winner,
        rewardAmount: balance.balance,
        holders: holders.slice(0, 10), // Store top 10 for display
        totalHolders: holders.length,
        totalTickets: holders.reduce((sum, holder) => sum + holder.tickets, 0)
      };

      // Save to database
      await roundsCollection.insertOne(roundData);

      console.log(`Round ${nextRoundNumber} completed. Winner: ${winner}`);

      res.status(200).json({
        success: true,
        round: nextRoundNumber,
        winner,
        rewardAmount: balance.balance
      });
    } else {
      // Fallback when MongoDB is not available
      console.log('MongoDB not available, skipping round processing');
      res.status(200).json({
        success: false,
        message: 'Database not available'
      });
    }
  } catch (error) {
    console.error('Error processing round:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 