import { MongoClient } from 'mongodb';

// Fallback in-memory storage for development when MongoDB is not available
class InMemoryDB {
  private data: any = {
    jackpotState: {
      pool: 0,
      burned: 0,
      spins: 0,
      progress: { minors: 0, majors: 0 }
    },
    winners: {
      jackpotWinners: [],
      majorWinners: [],
      minorWinners: []
    }
  };

  async collection(name: string) {
    return {
      findOne: async (query: any) => {
        if (name === 'jackpotState') return this.data.jackpotState;
        if (name === 'winners') return this.data.winners;
        return null;
      },
      updateOne: async (query: any, update: any) => {
        if (name === 'jackpotState') {
          this.data.jackpotState = { ...this.data.jackpotState, ...update.$set };
        }
        return { modifiedCount: 1 };
      },
      insertOne: async (doc: any) => {
        if (name === 'winners') {
          if (doc.winType === 'jackpot') {
            this.data.winners.jackpotWinners.unshift(doc);
            this.data.winners.jackpotWinners = this.data.winners.jackpotWinners.slice(0, 10);
          } else if (doc.winType === 'major') {
            this.data.winners.majorWinners.unshift(doc);
            this.data.winners.majorWinners = this.data.winners.majorWinners.slice(0, 10);
          } else if (doc.winType === 'minor') {
            this.data.winners.minorWinners.unshift(doc);
            this.data.winners.minorWinners = this.data.winners.minorWinners.slice(0, 10);
          }
        }
        return { insertedId: Date.now().toString() };
      }
    };
  }
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;
let inMemoryDB: InMemoryDB | null = null;

// Check if MongoDB URI is available
if (process.env.MONGODB_URI) {
  try {
    const uri = process.env.MONGODB_URI;
    const options = {};

    if (process.env.NODE_ENV === 'development') {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
      };

      if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
      }
      clientPromise = globalWithMongo._mongoClientPromise;
    } else {
      // In production mode, it's best to not use a global variable.
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
  } catch (error) {
    console.log('MongoDB connection failed, using in-memory storage:', error);
    inMemoryDB = new InMemoryDB();
  }
} else {
  // Fallback to in-memory storage
  console.log('MongoDB URI not found, using in-memory storage');
  inMemoryDB = new InMemoryDB();
}

export default clientPromise;
export { inMemoryDB }; 