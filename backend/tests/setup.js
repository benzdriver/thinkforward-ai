// 测试配置文件
require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// 在所有测试之前启动内存数据库
before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_TEST_URI = mongoUri;
  
  console.log(`MongoDB Memory Server running at ${mongoUri}`);
});

// 在所有测试之后关闭内存数据库
after(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}); 