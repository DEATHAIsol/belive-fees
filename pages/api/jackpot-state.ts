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
      const state = await db.collection('jackpot_state').findOne({ status: 'open' });
      if (!state) {
        return res.status(404).json({ message: 'No open jackpot state' });
      }
      res.status(200).json({
        jackpotRoll: state.jackpotRoll,
        majorRolls: state.majorRolls,
        minorRolls: state.minorRolls,
        hitMajors: state.hitMajors,
        hitMinors: state.hitMinors,
        status: state.status,
        createdAt: state.createdAt,
        lastUpdated: state.lastUpdated,
        progress: {
          minors: state.hitMinors.length / 100,
          majors: state.hitMajors.length / 10,
        },
      });
    } else if (inMemoryDB) {
      // Use in-memory storage as fallback
      const collection = await inMemoryDB.collection('jackpotState');
      const state = await collection.findOne({});
      res.status(200).json({
        pool: state.pool,
        burned: state.burned,
        spins: state.spins,
        progress: state.progress,
      });
    } else {
      res.status(500).json({ message: 'Database not available' });
    }
  } catch (error) {
    console.error('Error fetching jackpot state:', error);
    // Fallback to in-memory data
    res.status(200).json({
      pool: 0,
      burned: 0,
      spins: 0,
      progress: { minors: 0, majors: 0 }
    });
  }
} 