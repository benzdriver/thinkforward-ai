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
    // 创建一个更完整的 Clerk mock
    clerkMock = {
      verifyToken: sinon.stub().resolves({ sub: 'clerk_123' })
    };
    
    // 正确模拟 @clerk/clerk-sdk-node
    auth = proxyquire('../../../middleware/auth', {
      '@clerk/clerk-sdk-node': {
        Clerk: function() {
          return clerkMock;
        }
      },
      '../config/logger': {
        error: sinon.stub(),
        info: sinon.stub()
      }
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
    
    // 模拟数据库查询
    sinon.stub(User, 'findOne').resolves(mockUser);
    
    // 创建请求
    const req = httpMocks.createRequest({
      headers: {
        authorization: 'Bearer valid-token'
      }
    });
    const res = httpMocks.createResponse();
    const next = sinon.spy();
    
    await auth(req, res, next);
    
    expect(next.calledOnce).to.be.true;
    expect(req.user).to.equal(mockUser);
  });
  
  it('应该在没有提供令牌时返回401', async function() {
    // 创建没有授权头的请求对象
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = sinon.spy();
    
    await auth(req, res, next);
    
    const data = JSON.parse(res._getData());
    
    expect(res._getStatusCode()).to.equal(401);
    expect(data).to.have.property('success', false);
    expect(data.error).to.include('没有令牌');
    expect(next.called).to.be.false;
  });
  
  it('应该在令牌无效时返回401', async function() {
    // 创建请求对象
    const req = httpMocks.createRequest({
      headers: {
        authorization: 'Bearer invalid-token'
      }
    });
    const res = httpMocks.createResponse();
    const next = sinon.spy();
    
    // 模拟令牌验证抛出错误
    sinon.stub(AuthService.prototype, 'verifyToken').throws(new Error('Invalid token'));
    
    await auth(req, res, next);
    
    const data = JSON.parse(res._getData());
    
    expect(res._getStatusCode()).to.equal(401);
    expect(data).to.have.property('success', false);
    expect(data.error).to.include('无效的令牌');
    expect(next.called).to.be.false;
  });
  
  it('应该在用户不存在时返回401', async function() {
    // 创建请求对象
    const req = httpMocks.createRequest({
      headers: {
        authorization: 'Bearer valid-token'
      }
    });
    const res = httpMocks.createResponse();
    const next = sinon.spy();
    
    // 模拟令牌验证返回有效负载
    const payload = {
      id: '507f1f77bcf86cd799439011',
      role: 'Client'
    };
    sinon.stub(AuthService.prototype, 'verifyToken').returns(payload);
    
    // 模拟用户不存在
    sinon.stub(User, 'findById').resolves(null);
    
    await auth(req, res, next);
    
    const data = JSON.parse(res._getData());
    
    expect(res._getStatusCode()).to.equal(401);
    expect(data).to.have.property('success', false);
    expect(data.error).to.include('用户不存在');
    expect(next.called).to.be.false;
  });
}); 