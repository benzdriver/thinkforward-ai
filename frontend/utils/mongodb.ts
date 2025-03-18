import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thinkforward';
const MONGODB_DB = process.env.MONGODB_DB || 'thinkforward';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  // If we already have a connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Create a new connection
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);

  // Cache the connection
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Helper function to convert string ID to ObjectId
export function toObjectId(id: string) {
  const { ObjectId } = require('mongodb');
  return new ObjectId(id);
}

// Helper function to handle MongoDB errors
export function handleMongoError(error: any) {
  console.error('MongoDB Error:', error);
  if (error.code === 11000) {
    // Duplicate key error
    return { success: false, error: 'Duplicate entry found' };
  }
  return { success: false, error: 'Database operation failed' };
}

// Close database connection when the app is shutting down
process.on('SIGINT', async () => {
  if (cachedClient) {
    await cachedClient.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
}); 