import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise, { inMemoryDB } from '../../lib/mongodb';

const SYMBOLS = ['Bonk Dog', 'Banana', 'Rug', 'Fire', 'Diamond', 'Rocket', 'Skull'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { wallet } = req.body;
  if (!wallet) return res.status(400).json({ message: 'Wallet required' });

  try {
    // Generate random reels
    const reels = Array.from({ length: 5 }, () => Math.floor(Math.random() * SYMBOLS.length));
    const symbols = reels.map(i => SYMBOLS[i]);
    
    // Simple win logic for demo
    const winChance = Math.random();
    let result = 'none';
    let winType = 'none';
    
    if (winChance < 0.01) { // 1% chance
      result = 'jackpot';
      winType = 'jackpot';
    } else if (winChance < 0.05) { // 4% chance
      result = 'major';
      winType = 'major';
    } else if (winChance < 0.15) { // 10% chance
      result = 'minor';
      winType = 'minor';
    }

    if (clientPromise && inMemoryDB === null) {
      // Use MongoDB if available
      const client = await clientPromise;
      const db = client.db();
      
      // Update jackpot state
      await db.collection('jackpot_state').updateOne(
        { status: 'open' },
        { 
          $inc: { spins: 1 },
          $set: { lastUpdated: new Date() }
        }
      );

      // Log winner if applicable
      if (result !== 'none') {
        await db.collection('spin_logs').insertOne({
          wallet,
          result,
          timestamp: new Date(),
          symbols,
          spinRoll: Math.floor(Math.random() * 10000)
        });
      }
    } else if (inMemoryDB) {
      // Use in-memory storage as fallback
      const jackpotCollection = await inMemoryDB.collection('jackpotState');
      const jackpotState = await jackpotCollection.findOne({});
      
      // Update state
      await jackpotCollection.updateOne({}, {
        $set: {
          pool: jackpotState.pool + 0.01,
          burned: jackpotState.burned + 0.002,
          spins: jackpotState.spins + 1
        }
      });

      // Log winner if applicable
      if (result !== 'none') {
        const winnersCollection = await inMemoryDB.collection('winners');
        await winnersCollection.insertOne({
          wallet,
          winType,
          timestamp: new Date().toISOString(),
          spinId: Date.now().toString(),
          prizeAmount: result === 'jackpot' ? 5.0 : undefined
        });
      }
    }

    res.status(200).json({ 
      result, 
      reels, 
      symbols,
      winType 
    });
  } catch (error) {
    console.error('Error processing spin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 