import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise, { inMemoryDB } from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    if (clientPromise && inMemoryDB === null) {
      // Use MongoDB if available
      const client = await clientPromise;
      const db = client.db();

      // Latest jackpot winners
      const jackpotWinners = await db.collection('jackpot_winners')
        .find({})
        .sort({ wonAt: -1 })
        .limit(10)
        .toArray();

      // Latest major/minor winners from spin_logs
      const majorWinners = await db.collection('spin_logs')
        .find({ result: 'major' })
        .sort({ timestamp: -1 })
        .limit(10)
        .toArray();
      const minorWinners = await db.collection('spin_logs')
        .find({ result: 'minor' })
        .sort({ timestamp: -1 })
        .limit(10)
        .toArray();

      res.status(200).json({
        jackpotWinners,
        majorWinners,
        minorWinners,
      });
    } else if (inMemoryDB) {
      // Use in-memory storage as fallback
      const collection = await inMemoryDB.collection('winners');
      const winners = await collection.findOne({});
      res.status(200).json({
        jackpotWinners: winners.jackpotWinners || [],
        majorWinners: winners.majorWinners || [],
        minorWinners: winners.minorWinners || [],
      });
    } else {
      res.status(500).json({ message: 'Database not available' });
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    // Fallback to empty data
    res.status(200).json({
      jackpotWinners: [],
      majorWinners: [],
      minorWinners: [],
    });
  }
} 