const { expect } = require('chai');
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
const UserController = require('../../../controllers/userController');
const User = require('../../../models/User');

describe('用户控制器测试', function() {
  beforeEach(function() {
    // 模拟 User.find().select() 链式调用
    const selectStub = sinon.stub().returns([]);
    const findStub = sinon.stub(User, 'find').returns({ select: selectStub });
  });
  
  afterEach(function() {
    sinon.restore();
  });
  
  describe('获取当前用户信息', function() {
    it('应该返回当前已验证用户的信息', async function() {
      // 创建请求对象，带有auth中间件注入的用户
      const user = {
        _id: '507f1f77bcf86cd799439011',
        firstName: 'Current',
        lastName: 'User',
        email: 'current@example.com',
        role: 'Client',
        preferredLanguage: 'zh'
      };
      
      const req = httpMocks.createRequest({
        user: user
      });
      const res = httpMocks.createResponse();
      
      await UserController.getCurrentUser(req, res);
      
      const data = JSON.parse(res._getData());
      
      expect(res._getStatusCode()).to.equal(200);
      expect(data).to.have.property('success', true);
      expect(data.user).to.have.property('email', user.email);
      expect(data.user).to.have.property('role', user.role);
    });
  });
  
  describe('更新用户信息', function() {
    it('应该成功更新用户信息', async function() {
      // 原始用户
      const originalUser = {
        _id: '507f1f77bcf86cd799439011',
        firstName: 'Before',
        lastName: 'Update',
        email: 'before@example.com',
        role: 'Client',
        preferredLanguage: 'en',
        save: sinon.stub().resolves({
          _id: '507f1f77bcf86cd799439011',
          firstName: 'After',
          lastName: 'Update',
          email: 'after@example.com',
          role: 'Client',
          preferredLanguage: 'zh'
        })
      };
      
      // 创建请求，包含当前用户和更新数据
      const req = httpMocks.createRequest({
        user: originalUser,
        body: {
          firstName: 'After',
          lastName: 'Update',
          email: 'after@example.com',
          preferredLanguage: 'zh'
        }
      });
      const res = httpMocks.createResponse();
      
      // 模拟用户查找
      sinon.stub(User, 'findById').resolves(originalUser);
      
      await UserController.updateUser(req, res);
      
      const data = JSON.parse(res._getData());
      
      expect(res._getStatusCode()).to.equal(200);
      expect(data).to.have.property('success', true);
      expect(data.user).to.have.property('firstName', 'After');
      expect(data.user).to.have.property('email', 'after@example.com');
      expect(data.user).to.have.property('preferredLanguage', 'zh');
      
      // 验证字段已更新
      expect(originalUser.firstName).to.equal('After');
      expect(originalUser.email).to.equal('after@example.com');
      expect(originalUser.preferredLanguage).to.equal('zh');
    });
    
    it('不应该允许用户更改自己的角色', async function() {
      // 原始用户
      const originalUser = {
        _id: '507f1f77bcf86cd799439011',
        firstName: 'Client',
        lastName: 'User',
        email: 'client@example.com',
        role: 'Client',
        save: sinon.stub().resolves({
          _id: '507f1f77bcf86cd799439011',
          firstName: 'Client',
          lastName: 'Updated',
          email: 'client@example.com',
          role: 'Client'
        })
      };
      
      // 创建请求，尝试更改角色
      const req = httpMocks.createRequest({
        user: originalUser,
        body: {
          firstName: 'Client',
          lastName: 'Updated',
          role: 'Admin' // 尝试升级为管理员
        }
      });
      const res = httpMocks.createResponse();
      
      // 模拟用户查找
      sinon.stub(User, 'findById').resolves(originalUser);
      
      await UserController.updateUser(req, res);
      
      const data = JSON.parse(res._getData());
      
      expect(res._getStatusCode()).to.equal(200);
      expect(data).to.have.property('success', true);
      expect(data.user).to.have.property('lastName', 'Updated');
      expect(data.user).to.have.property('role', 'Client'); // 角色不应该被更改
      
      // 验证角色未被更改
      expect(originalUser.role).to.equal('Client');
    });
  });
  
  describe('管理员功能', function() {
    it('管理员应该能获取所有用户列表', async function() {
      // 创建管理员用户请求
      const req = httpMocks.createRequest({
        user: {
          _id: '507f1f77bcf86cd799439011',
          role: 'Admin'
        }
      });
      const res = httpMocks.createResponse();
      
      // 模拟用户列表
      const users = [
        { _id: '1', firstName: 'User1', email: 'user1@example.com', role: 'Client' },
        { _id: '2', firstName: 'User2', email: 'user2@example.com', role: 'Coach' },
        { _id: '3', firstName: 'User3', email: 'user3@example.com', role: 'Admin' }
      ];
      sinon.stub(User, 'find').returns({
        sort: sinon.stub().returns({
          select: sinon.stub().resolves(users)
        })
      });
      
      await UserController.getAllUsers(req, res);
      
      const data = JSON.parse(res._getData());
      
      expect(res._getStatusCode()).to.equal(200);
      expect(data).to.have.property('success', true);
      expect(data).to.have.property('count', 3);
      expect(data.users).to.have.lengthOf(3);
    });
    
    it('管理员应该能更改用户角色', async function() {
      // 目标用户
      const targetUser = {
        _id: '507f1f77bcf86cd799439011',
        firstName: 'Target',
        lastName: 'User',
        email: 'target@example.com',
        role: 'Client',
        save: sinon.stub().resolves({
          _id: '507f1f77bcf86cd799439011',
          firstName: 'Target',
          lastName: 'User',
          email: 'target@example.com',
          role: 'Coach' // 更新后的角色
        })
      };
      
      // 创建管理员请求
      const req = httpMocks.createRequest({
        user: {
          _id: '609f1f77bcf86cd799439022',
          role: 'Admin'
        },
        params: {
          id: '507f1f77bcf86cd799439011'
        },
        body: {
          role: 'Coach'
        }
      });
      const res = httpMocks.createResponse();
      
      // 模拟用户查找
      sinon.stub(User, 'findById').resolves(targetUser);
      
      await UserController.updateUserRole(req, res);
      
      const data = JSON.parse(res._getData());
      
      expect(res._getStatusCode()).to.equal(200);
      expect(data).to.have.property('success', true);
      expect(data.user).to.have.property('role', 'Coach');
      
      // 验证角色已更改
      expect(targetUser.role).to.equal('Coach');
    });
  });
}); 