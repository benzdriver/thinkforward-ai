const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app');
const User = require('../../../models/User');
const crypto = require('crypto');
const { ROLES } = require('../../../constants/roles');
const config = require('../../../config');

// 模拟clerkClient
jest.mock('@clerk/clerk-sdk-node', () => ({
  clerkClient: {
    users: {
      getUser: jest.fn().mockImplementation((userId) => {
        return Promise.resolve({
          id: userId,
          first_name: 'Test',
          last_name: 'User',
          email_addresses: [
            { id: 'email_123', email_address: 'test@example.com' }
          ],
          primary_email_address_id: 'email_123',
          created_at: new Date().toISOString()
        });
      })
    }
  }
}));

describe('Clerk Webhook Tests', () => {
  beforeAll(async () => {
    // 连接测试数据库
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/test_db');
  });

  afterAll(async () => {
    // 断开数据库连接
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // 清理测试数据
    await User.deleteMany({});
  });

  // 生成有效的Svix签名
  function generateSvixSignature(payload, secret = config.clerk.webhookSecret) {
    const svixId = 'test_id_123';
    const svixTimestamp = Math.floor(Date.now() / 1000).toString();
    const stringifiedPayload = JSON.stringify(payload);
    const payloadToSign = `${svixId}.${svixTimestamp}.${stringifiedPayload}`;
    
    const signature = crypto
      .createHmac('sha256', secret)
      .update(payloadToSign)
      .digest('hex');
      
    return {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': signature
    };
  }

  test('应正确处理user.created事件', async () => {
    // 准备测试数据
    const payload = {
      type: 'user.created',
      data: {
        id: 'clerk_user_123',
        first_name: 'John',
        last_name: 'Doe',
        email_addresses: [
          { id: 'email_123', email_address: 'john.doe@example.com' }
        ],
        primary_email_address_id: 'email_123',
        created_at: new Date().toISOString()
      }
    };
    
    // 生成有效签名
    const headers = generateSvixSignature(payload);
    
    // 发送webhook请求
    const response = await request(app)
      .post('/api/webhooks/clerk')
      .set(headers)
      .send(payload);
      
    // 验证响应
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    // 验证数据库状态
    const user = await User.findOne({ clerkId: 'clerk_user_123' });
    expect(user).toBeTruthy();
    expect(user.email).toBe('john.doe@example.com');
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.role).toBe(ROLES.CLIENT);
  });

  test('应正确处理user.updated事件', async () => {
    // 先创建用户
    await User.create({
      clerkId: 'clerk_user_456',
      email: 'old.email@example.com',
      firstName: 'Old',
      lastName: 'Name',
      role: ROLES.CLIENT
    });
    
    // 准备更新事件
    const payload = {
      type: 'user.updated',
      data: {
        id: 'clerk_user_456',
        first_name: 'New',
        last_name: 'Name',
        email_addresses: [
          { id: 'email_456', email_address: 'new.email@example.com' }
        ],
        primary_email_address_id: 'email_456'
      }
    };
    
    // 生成有效签名
    const headers = generateSvixSignature(payload);
    
    // 发送webhook请求
    const response = await request(app)
      .post('/api/webhooks/clerk')
      .set(headers)
      .send(payload);
      
    // 验证响应
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    // 验证数据库状态
    const user = await User.findOne({ clerkId: 'clerk_user_456' });
    expect(user).toBeTruthy();
    expect(user.email).toBe('new.email@example.com');
    expect(user.firstName).toBe('New');
    expect(user.lastName).toBe('Name');
  });

  test('应正确处理user.deleted事件', async () => {
    // 先创建用户
    await User.create({
      clerkId: 'clerk_user_789',
      email: 'delete.me@example.com',
      firstName: 'Delete',
      lastName: 'User',
      role: ROLES.CLIENT
    });
    
    // 准备删除事件
    const payload = {
      type: 'user.deleted',
      data: {
        id: 'clerk_user_789'
      }
    };
    
    // 生成有效签名
    const headers = generateSvixSignature(payload);
    
    // 发送webhook请求
    const response = await request(app)
      .post('/api/webhooks/clerk')
      .set(headers)
      .send(payload);
      
    // 验证响应
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    // 验证数据库状态 - 应该标记为已删除而不是真正删除
    const user = await User.findOne({ clerkId: 'clerk_user_789' });
    expect(user).toBeTruthy();
    expect(user.isDeleted).toBe(true);
    expect(user.deletedAt).toBeTruthy();
  });

  test('应拒绝无效签名的请求', async () => {
    // 准备测试数据
    const payload = {
      type: 'user.created',
      data: {
        id: 'clerk_user_123',
        // ...其他数据
      }
    };
    
    // 使用错误的密钥生成签名
    const headers = generateSvixSignature(payload, 'wrong_secret');
    
    // 发送webhook请求
    const response = await request(app)
      .post('/api/webhooks/clerk')
      .set(headers)
      .send(payload);
      
    // 验证响应应该是401
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid signature');
    
    // 验证数据库没有改变
    const userCount = await User.countDocuments();
    expect(userCount).toBe(0);
  });
}); 