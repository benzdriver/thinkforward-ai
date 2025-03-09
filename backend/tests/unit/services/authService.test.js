const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const AuthService = require('../../../services/authService');
const User = require('../../../models/User');

describe('认证服务测试', function() {
  let authService;
  
  beforeEach(function() {
    authService = new AuthService();
  });
  
  afterEach(function() {
    sinon.restore();
  });
  
  describe('生成令牌', function() {
    it('应该为用户生成有效JWT令牌', function() {
      const user = {
        _id: '507f1f77bcf86cd799439011',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'Client'
      };
      
      const signStub = sinon.stub(jwt, 'sign').returns('fake-token');
      
      const token = authService.generateToken(user);
      
      expect(token).to.equal('fake-token');
      expect(signStub.calledOnce).to.be.true;
      
      const call = signStub.getCall(0);
      expect(call.args[0]).to.have.property('id', user._id);
      expect(call.args[0]).to.have.property('role', user.role);
    });
  });
  
  describe('验证令牌', function() {
    it('应该验证有效的JWT令牌', function() {
      const payload = {
        id: '507f1f77bcf86cd799439011',
        role: 'Client',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
      };
      
      const verifyStub = sinon.stub(jwt, 'verify').returns(payload);
      
      const result = authService.verifyToken('valid-token');
      
      expect(result).to.deep.equal(payload);
      expect(verifyStub.calledOnce).to.be.true;
    });
    
    it('应该在令牌无效时抛出错误', function() {
      sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));
      
      expect(() => authService.verifyToken('invalid-token')).to.throw('Invalid token');
    });
  });
  
  describe('Google认证', function() {
    it('应该验证有效的Google令牌', async function() {
      // 创建模拟Google认证客户端
      const mockTicket = {
        getPayload: () => ({
          email: 'google@example.com',
          name: 'Google User',
          picture: 'https://example.com/photo.jpg'
        })
      };
      
      // 替换authService中的Google验证方法
      authService.googleAuthClient = {
        verifyIdToken: sinon.stub().resolves(mockTicket)
      };
      
      const result = await authService.verifyGoogleToken('valid-google-token');
      
      expect(result.verified).to.be.true;
      expect(result.user).to.have.property('email', 'google@example.com');
      expect(result.user).to.have.property('name', 'Google User');
    });
    
    it('应该处理无效的Google令牌', async function() {
      // 替换authService中的Google验证方法抛出错误
      authService.googleAuthClient = {
        verifyIdToken: sinon.stub().rejects(new Error('Invalid token'))
      };
      
      const result = await authService.verifyGoogleToken('invalid-google-token');
      
      expect(result.verified).to.be.false;
      expect(result.error).to.exist;
    });
  });
  
  // 添加更多认证方法的测试...
}); 