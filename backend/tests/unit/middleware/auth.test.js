const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
// 使用我们的增强版 httpMocks
const httpMocks = require('../../helpers/mock-request');
const AuthService = require('../../../services/authService');
const auth = require('../../../middleware/auth');
const User = require('../../../models/User');

// 使用 sinon 代替 jest 进行模拟
describe('Auth Middleware', function() {
  let clerkMock;
  let auth;
  
  beforeEach(function() {
    // 创建模拟响应和请求对象的辅助函数
    this.res = httpMocks.createResponse();
    this.next = sinon.spy();
    
    // 重置模拟
    clerkMock = {
      users: {
        getUser: sinon.stub()
      },
      verifyToken: sinon.stub()
    };
    
    // 模拟日志系统避免错误输出
    const loggerMock = {
      error: sinon.stub(),
      info: sinon.stub()
    };
    
    // 使用proxyquire替换clerk依赖
    auth = proxyquire('../../../middleware/auth', {
      '@clerk/clerk-sdk-node': {
        Clerk: function() {
          return clerkMock;
        }
      },
      '../config/logger': loggerMock
    });
  });
  
  afterEach(function() {
    sinon.restore();
  });

  it('应该在有效令牌的情况下设置req.user', async function() {
    // 创建有效的用户
    const mockUser = { 
      _id: '507f1f77bcf86cd799439011', 
      email: 'test@example.com',
      role: 'Client'
    };
    
    // 模拟 clerk.verifyToken 返回有效负载
    clerkMock.verifyToken.resolves({ sub: 'clerk_123' });
    
    // 模拟 clerk.users.getUser 返回 Clerk 用户
    clerkMock.users.getUser.resolves({
      id: 'clerk_123',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      firstName: 'Test',
      lastName: 'User'
    });
    
    // 模拟数据库查询返回用户
    sinon.stub(User, 'findOne').resolves(mockUser);
    
    // 创建请求
    const req = httpMocks.createRequest({
      headers: {
        authorization: 'Bearer valid-token'
      }
    });
    
    await auth(req, this.res, this.next);
    
    expect(this.next.calledOnce).to.be.true;
    expect(req.user).to.equal(mockUser);
  });

  it('应该在没有提供令牌时返回401', async function() {
    // 创建没有令牌的请求
    const req = httpMocks.createRequest();
    
    // 直接调用中间件
    await auth(req, this.res, this.next);
    
    expect(this.res.statusCode).to.equal(401);
    const data = JSON.parse(this.res._getData());
    
    expect(data).to.have.property('success', false);
    expect(data.error).to.be.a('string');
    expect(this.next.called).to.be.false;
  });

  it('应该在令牌无效时返回401', async function() {
    // 创建带有无效令牌的请求
    const req = httpMocks.createRequest({
      headers: {
        authorization: 'Bearer invalid-token'
      }
    });
    
    // 模拟令牌验证抛出错误
    clerkMock.verifyToken.rejects(new Error('Invalid token'));
    
    await auth(req, this.res, this.next);
    
    expect(this.res.statusCode).to.equal(401);
    const data = JSON.parse(this.res._getData());
    
    expect(data).to.have.property('success', false);
    expect(data.error).to.be.a('string');
    expect(this.next.called).to.be.false;
  });
  
  it('应该在用户不存在时返回401', async function() {
    // 创建请求对象
    const req = httpMocks.createRequest({
      headers: {
        authorization: 'Bearer valid-token'
      }
    });
    
    // 模拟令牌验证返回有效负载
    clerkMock.verifyToken.resolves({ sub: 'clerk_123' });
    
    // 模拟 clerk.users.getUser 返回 Clerk 用户
    clerkMock.users.getUser.resolves({
      id: 'clerk_123',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      firstName: 'Test',
      lastName: 'User'
    });
    
    // 模拟用户不存在
    sinon.stub(User, 'findOne').resolves(null);
    
    await auth(req, this.res, this.next);
    
    expect(this.res.statusCode).to.equal(401);
    const data = JSON.parse(this.res._getData());
    
    expect(data).to.have.property('success', false);
    expect(data.error).to.be.a('string');
    expect(this.next.called).to.be.false;
  });
}); 