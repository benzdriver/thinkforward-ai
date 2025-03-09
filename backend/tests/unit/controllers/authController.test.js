const { expect } = require('chai');
const sinon = require('sinon');
const httpMocks = require('../../helpers/mock-request');
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');
const { OAuth2Client } = require('google-auth-library');

// 直接引入控制器而不是使用proxyquire
const authController = require('../../../controllers/authController');

describe('认证控制器测试', function() {
  beforeEach(function() {
    // 直接模拟OAuth2Client原型方法
    sinon.stub(OAuth2Client.prototype, 'verifyIdToken');
  });

  afterEach(function() {
    sinon.restore();
  });
  
  describe('注册', function() {
    it('应该成功注册新用户', async function() {
      const req = httpMocks.createRequest({
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com',
          password: 'password123',
          role: 'Client'
        }
      });
      const res = httpMocks.createResponse();
      
      // 模拟 User.findOne 返回 null (用户不存在)
      sinon.stub(User, 'findOne').resolves(null);
      
      // 模拟创建的用户
      const newUser = {
        _id: '60d21b4667d0d8992e610c85',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        role: 'Client'
      };
      
      // 模拟 User.create 返回新用户
      sinon.stub(User, 'create').resolves(newUser);
      
      // 模拟 JWT 生成
      sinon.stub(jwt, 'sign').returns('mock.jwt.token');
      
      // 调用控制器方法
      await authController.register(req, res);
      
      // 验证响应
      expect(res.statusCode).to.equal(201);
      const data = res._getJSONData();
      expect(data.success).to.be.true;
      expect(data.token).to.exist;
      expect(data.user).to.deep.include({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com'
      });
    });
    
    it('应该阻止注册已存在的用户', async function() {
      const req = httpMocks.createRequest({
        body: {
          firstName: 'Existing',
          lastName: 'User',
          email: 'existing@example.com',
          password: 'Password123!',
          role: 'Client'
        }
      });
      
      const res = httpMocks.createResponse();
      
      // 模拟User.findOne方法返回已存在用户
      const existingUser = {
        email: 'existing@example.com'
      };
      sinon.stub(User, 'findOne').resolves(existingUser);
      
      await authController.register(req, res);
      
      const data = JSON.parse(res._getData());
      
      expect(res._getStatusCode()).to.equal(400);
      expect(data).to.have.property('success', false);
      expect(data.error).to.include('已注册');
    });
  });
  
  describe('登录', function() {
    it('应该成功验证并登录用户', async function() {
      const req = httpMocks.createRequest({
        body: {
          email: 'test@example.com',
          password: 'Password123!'
        }
      });
      
      const res = httpMocks.createResponse();
      
      // 模拟找到用户
      const user = {
        _id: '507f1f77bcf86cd799439011',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'Client',
        matchPassword: sinon.stub().resolves(true)
      };
      sinon.stub(User, 'findOne').resolves(user);
      
      // 模拟生成令牌
      sinon.stub(AuthService.prototype, 'generateToken').returns('fake-token');
      
      await authController.login(req, res);
      
      const data = JSON.parse(res._getData());
      
      expect(res._getStatusCode()).to.equal(200);
      expect(data).to.have.property('success', true);
      expect(data).to.have.property('token', 'fake-token');
      expect(data.user).to.have.property('email', 'test@example.com');
    });
    
    it('应该拒绝错误的密码', async function() {
      const req = httpMocks.createRequest({
        body: {
          email: 'test@example.com',
          password: 'WrongPassword'
        }
      });
      
      const res = httpMocks.createResponse();
      
      // 模拟找到用户但密码不匹配
      const user = {
        email: 'test@example.com',
        matchPassword: sinon.stub().resolves(false)
      };
      sinon.stub(User, 'findOne').resolves(user);
      
      await authController.login(req, res);
      
      const data = JSON.parse(res._getData());
      
      expect(res._getStatusCode()).to.equal(401);
      expect(data).to.have.property('success', false);
      expect(data.error).to.include('无效的凭据');
    });
    
    it('应该处理用户不存在的情况', async function() {
      const req = httpMocks.createRequest({
        body: {
          email: 'nonexistent@example.com',
          password: 'Password123!'
        }
      });
      
      const res = httpMocks.createResponse();
      
      // 模拟用户不存在
      sinon.stub(User, 'findOne').resolves(null);
      
      await authController.login(req, res);
      
      const data = JSON.parse(res._getData());
      
      expect(res._getStatusCode()).to.equal(401);
      expect(data).to.have.property('success', false);
      expect(data.error).to.include('无效的凭据');
    });
  });
  
  describe('Google登录', function() {
    it('应该处理有效的Google登录', async function() {
      // 准备Google响应数据
      const googlePayload = {
        email: 'user@gmail.com',
        name: 'Google User',
        given_name: 'Google',
        family_name: 'User',
        picture: 'https://example.com/photo.jpg'
      };
      
      // 设置请求
      const req = httpMocks.createRequest({
        body: { idToken: 'valid_google_token' }
      });
      const res = httpMocks.createResponse();
      
      // 直接模拟OAuth2Client.prototype.verifyIdToken方法返回结果
      OAuth2Client.prototype.verifyIdToken.resolves({
        getPayload: () => googlePayload
      });
      
      // 模拟User.findOne不返回用户（用户不存在）
      sinon.stub(User, 'findOne').resolves(null);
      
      // 模拟User.create创建新用户
      const newUser = {
        _id: '60d21b4667d0d8992e610c85',
        email: googlePayload.email,
        firstName: googlePayload.given_name,
        lastName: googlePayload.family_name,
        picture: googlePayload.picture,
        authProvider: 'google',
        role: 'Client'
      };
      sinon.stub(User, 'create').resolves(newUser);
      
      // 模拟jwt.sign生成token
      sinon.stub(jwt, 'sign').returns('mock.jwt.token');
      
      // 执行测试
      await authController.googleLogin(req, res);
      
      // 验证结果
      expect(res.statusCode).to.equal(200);
      const data = res._getJSONData();
      expect(data.success).to.be.true;
      expect(data.token).to.exist;
      expect(data.user).to.include({
        email: googlePayload.email,
        firstName: googlePayload.given_name,
        lastName: googlePayload.family_name
      });
    });

    it('应该拒绝无效的Google令牌', async function() {
      // 设置 verifyIdToken 抛出错误
      OAuth2Client.prototype.verifyIdToken.rejects(new Error('Invalid token'));
      
      // 准备请求和响应
      const req = httpMocks.createRequest({
        body: { idToken: 'invalid_token' }
      });
      const res = httpMocks.createResponse();
      
      // 执行控制器方法
      await authController.googleLogin(req, res);
      
      // 验证响应
      expect(res.statusCode).to.equal(401);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.exist;
    });

    it('应该处理缺少idToken的情况', async function() {
      // 准备没有idToken的请求
      const req = httpMocks.createRequest({ body: {} });
      const res = httpMocks.createResponse();
      
      // 执行控制器方法
      await authController.googleLogin(req, res);
      
      // 验证响应
      expect(res.statusCode).to.equal(400);
      const data = res._getJSONData();
      expect(data.success).to.be.false;
      expect(data.error).to.exist;
    });
  });
}); 