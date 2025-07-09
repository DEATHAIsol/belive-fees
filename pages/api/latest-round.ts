import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise, { inMemoryDB } from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    if (clientPromise && inMemoryDB === null) {
      const client = await clientPromise;
      const db = client.db('belive-jackpot');
      const roundsCollection = db.collection('rounds');

      // Get the latest round
      const latestRound = await roundsCollection
        .find({})
        .sort({ round: -1 })
        .limit(1)
        .toArray();

      if (latestRound.length === 0) {
        return res.status(200).json({
          round: 1,
          timestamp: new Date().toISOString(),
          winner: '',
          rewardAmount: '0',
          holders: []
        });
      }

      res.status(200).json(latestRound[0]);
    } else {
      // Fallback response when MongoDB is not available
      res.status(200).json({
        round: 1,
        timestamp: new Date().toISOString(),
        winner: '',
        rewardAmount: '0',
        holders: []
      });
    }
  } catch (error) {
    console.error('Error fetching latest round:', error);
    // Fallback response on error
    res.status(200).json({
      round: 1,
      timestamp: new Date().toISOString(),
      winner: '',
      rewardAmount: '0',
      holders: []
    });
  }
} 