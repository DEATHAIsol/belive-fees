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

      // Count total rounds
      const totalContests = await roundsCollection.countDocuments();

      res.status(200).json({ totalContests });
    } else {
      // Fallback response when MongoDB is not available
      res.status(200).json({ totalContests: 0 });
    }
  } catch (error) {
    console.error('Error fetching total contests:', error);
    // Fallback response on error
    res.status(200).json({ totalContests: 0 });
  }
} 