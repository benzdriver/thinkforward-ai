/**
 * 测试辅助函数集合
 */
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// 创建带有t函数的请求模拟
const createMockRequest = (overrides = {}) => {
  return {
    user: null,
    headers: {},
    body: {},
    params: {},
    query: {},
    t: (key, defaultValue) => defaultValue || key,
    ...overrides
  };
};

// 创建响应模拟
const createMockResponse = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  res.send = sinon.stub().returns(res);
  return res;
};

// 用于调试测试过程中的对象
const inspect = (obj, name = 'Object') => {
  console.log(`\n----- ${name} -----`);
  try {
    console.log(JSON.stringify(obj, null, 2));
  } catch (e) {
    console.log(`${name} contains circular reference or non-serializable values`);
    console.log(obj);
  }
  console.log(`----- End ${name} -----\n`);
};

let mongoServer;

/**
 * Connect to in-memory MongoDB for testing
 */
const connectToTestDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected, using existing connection');
      return mongoose.connection;
    }
    
    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      
      const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };
      
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(uri, mongooseOpts);
        console.log('Connected to in-memory MongoDB for testing');
      }
    }
    return mongoose.connection;
  } catch (error) {
    console.error('Error connecting to test database:', error);
    throw error;
  }
};

/**
 * Disconnect from in-memory MongoDB
 */
const disconnectFromTestDatabase = async () => {
  try {
    if (mongoServer) {
      await mongoose.disconnect();
      await mongoServer.stop();
      mongoServer = null;
      console.log('Disconnected from in-memory MongoDB');
    }
  } catch (error) {
    console.error('Error disconnecting from test database:', error);
  }
};

/**
 * Create a test user for integration tests
 * @returns {Promise<Object>} Test user object
 */
const createTestUser = async () => {
  if (!mongoose.connection.readyState) {
    await connectToTestDatabase();
  }
  
  const testUser = {
    _id: new mongoose.Types.ObjectId(),
    id: 'test-user-123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
    isVerified: true
  };
  
  try {
    const User = mongoose.model('User');
    const user = new User(testUser);
    await user.save();
    return user;
  } catch (error) {
    return testUser;
  }
};

/**
 * Generate an authentication token for a test user
 * @param {Object} user - Test user object
 * @returns {String} JWT token
 */
const generateAuthToken = (user) => {
  return jwt.sign(
    { 
      id: user.id || user._id.toString(),
      email: user.email,
      role: user.role || 'user'
    },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

/**
 * Mock the authentication middleware for testing
 * @returns {Function} Mocked auth middleware
 */
const mockAuthMiddleware = (user) => {
  return (req, res, next) => {
    req.user = user;
    next();
  };
};

module.exports = {
  createMockRequest,
  createMockResponse,
  inspect,
  createTestUser,
  generateAuthToken,
  connectToTestDatabase,
  disconnectFromTestDatabase,
  mockAuthMiddleware
};     