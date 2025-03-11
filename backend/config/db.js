const mongoose = require('mongoose');
const logger = require('../utils/logger');

// 连接选项
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10
};

// 连接函数
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, options);
    
    logger.info(`MongoDB 已连接: ${conn.connection.host}`);
    
    // 监听连接事件
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB 连接错误: ${err.message}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB 连接断开，尝试重新连接');
      setTimeout(connectDB, 5000);
    });
    
    return conn;
  } catch (error) {
    logger.error(`MongoDB 连接失败: ${error.message}`);
    // 重试连接
    logger.info('5秒后尝试重新连接...');
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB; 