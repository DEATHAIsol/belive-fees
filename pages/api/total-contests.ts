import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('belive-jackpot');
    const roundsCollection = db.collection('rounds');

    // Count total rounds
    const totalContests = await roundsCollection.countDocuments();

    res.status(200).json({ totalContests });
  } catch (error) {
    console.error('Error fetching total contests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 