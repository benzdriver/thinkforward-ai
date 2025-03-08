const auth = require('../../middleware/auth');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../../models/User');

describe('认证中间件测试', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = httpMocks.createRequest({
      t: (key) => key
    });
    res = httpMocks.createResponse();
    next = sinon.spy();
  });
  
  it('无令牌时应拒绝访问', () => {
    auth(req, res, next);
    
    expect(res.statusCode).to.equal(401);
    expect(next.called).to.be.false;
  });
  
  it('令牌无效时应拒绝访问', () => {
    req.headers.authorization = 'Bearer invalid_token';
    
    sinon.stub(jwt, 'verify').throws(new Error('invalid token'));
    
    auth(req, res, next);
    
    expect(res.statusCode).to.equal(401);
    expect(next.called).to.be.false;
    
    jwt.verify.restore();
  });
  
  it('有效令牌时应设置用户信息并继续', async () => {
    const mockUser = { _id: '123456', email: 'test@example.com', role: 'Client' };
    
    // 创建有效令牌
    const token = jwt.sign({ id: mockUser._id }, config.jwtSecret, { expiresIn: '1h' });
    req.headers.authorization = `Bearer ${token}`;
    
    // 模拟User.findById
    sinon.stub(User, 'findById').resolves(mockUser);
    
    await auth(req, res, next);
    
    expect(req.user).to.deep.equal(mockUser);
    expect(next.calledOnce).to.be.true;
    
    User.findById.restore();
  });
  
  it('公共路由无需认证', async () => {
    req.path = '/api/user/login';
    
    await auth(req, res, next);
    
    expect(next.calledOnce).to.be.true;
  });
}); 