import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Create TTL index for slot locks
    await createTTLIndexes();

  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    throw error; // Throw error instead of exiting, let caller handle it
  }
};

// Create TTL indexes for automatic slot unlocking
const createTTLIndexes = async () => {
  try {
    const db = mongoose.connection.db;

    // TTL index for slot locks (expires after SLOT_LOCK_DURATION seconds)
    await db.collection('slots').createIndex(
      { lockedAt: 1 },
      {
        expireAfterSeconds: parseInt(process.env.SLOT_LOCK_DURATION) || 180,
        partialFilterExpression: {
          status: 'locked',
          lockedAt: { $exists: true }
        }
      }
    );

    logger.info('TTL indexes created successfully');
  } catch (error) {
    logger.warn(`TTL index creation warning: ${error.message}`);
  }
};

export default connectDB;
