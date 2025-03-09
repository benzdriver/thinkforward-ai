// 测试配置文件
require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const dotenv = require('dotenv');
const path = require('path');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');

let mongoServer;

// 加载测试环境变量
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

// 确保NODE_ENV设置为test
process.env.NODE_ENV = 'test';

// 验证关键环境变量
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test_jwt_secret';
}

// 设置 Mongoose 选项
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thinkforward_test';

// 添加 Sinon-Chai 插件
chai.use(sinonChai);

// 创建一个简单的翻译函数模拟
global.t = (key, defaultValue) => defaultValue || key;

/**
 * 启动内存数据库
 */
async function setupDatabase() {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_TEST_URI = mongoUri;
  
  console.log(`MongoDB Memory Server running at ${mongoUri}`);
  
  await mongoose.connect(mongoUri);
  return mongoUri;
}

/**
 * 关闭内存数据库
 */
async function teardownDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}

/**
 * 清空所有集合
 */
async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

// 在测试环境中模拟i18n功能的替代方法
function createMockRequest(overrides = {}) {
  return {
    user: null,
    headers: {},
    body: {},
    params: {},
    query: {},
    t: (key, defaultValue) => defaultValue || key,
    ...overrides
  };
}

function createMockResponse() {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  res.send = sinon.stub().returns(res);
  return res;
}

module.exports = {
  setupDatabase,
  teardownDatabase,
  clearDatabase,
  createMockRequest,
  createMockResponse
}; 