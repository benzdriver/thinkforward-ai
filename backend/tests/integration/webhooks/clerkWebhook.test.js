const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app');
const User = require('../../../models/User');
const crypto = require('crypto');
const { ROLES } = require('../../../constants/roles');
const config = require('../../../config');

const sinon = require('sinon');
const { clerkClient } = require('@clerk/clerk-sdk-node');

sinon.stub(clerkClient.users, 'getUser').callsFake((userId) => {
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
});

describe('Clerk Webhook Tests', function() {
  const { expect } = require('chai');
  
  before(async function() {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/test_db');
  });

  after(async function() {
    await mongoose.connection.close();
  });

  beforeEach(async function() {
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

  it('should correctly handle user.created event', async function() {
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
      
    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
    
    const user = await User.findOne({ clerkId: 'clerk_user_123' });
    expect(user).to.exist;
    expect(user.email).to.equal('john.doe@example.com');
    expect(user.firstName).to.equal('John');
    expect(user.lastName).to.equal('Doe');
    expect(user.role).to.equal(ROLES.CLIENT);
  });

  it('should correctly handle user.updated event', async function() {
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
      
    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
    
    const user = await User.findOne({ clerkId: 'clerk_user_456' });
    expect(user).to.exist;
    expect(user.email).to.equal('new.email@example.com');
    expect(user.firstName).to.equal('New');
    expect(user.lastName).to.equal('Name');
  });

  it('should correctly handle user.deleted event', async function() {
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
      
    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
    
    const user = await User.findOne({ clerkId: 'clerk_user_789' });
    expect(user).to.exist;
    expect(user.isDeleted).to.be.true;
    expect(user.deletedAt).to.exist;
  });

  it('should reject requests with invalid signatures', async function() {
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
      
    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal('Invalid signature');
    
    const userCount = await User.countDocuments();
    expect(userCount).to.equal(0);
  });
});                