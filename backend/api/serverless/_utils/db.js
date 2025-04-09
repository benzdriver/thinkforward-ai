const mongoose = require('mongoose');
const logger = require('../../../utils/logger');

let cachedConnection = null;

async function connectToDatabase() {
  if (process.env.NODE_ENV === 'test') {
    logger.info('Test environment detected, using existing MongoDB connection');
    return mongoose.connection;
  }
  
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      const connection = await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      logger.info('Serverless function connected to MongoDB');
      cachedConnection = connection;
      return connection;
    } else {
      logger.info('Using existing MongoDB connection');
      return mongoose.connection;
    }
  } catch (error) {
    logger.error('Serverless function failed to connect to MongoDB:', error);
    throw error;
  }
}

module.exports = { connectToDatabase };
