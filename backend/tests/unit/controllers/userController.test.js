const { expect } = require('chai');
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const userController = require('../../../controllers/userController');
const User = require('../../../models/User');
const { ROLES } = require('../../../constants/roles');
const mocki18n = require('../../mocks/i18nMock');


describe('用户控制器测试', function() {
  console.log('[TEST SETUP] 开始用户控制器测试');
  
  beforeEach(function() {
    // 正确的写法
    const password = 'testPassword123';
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    this.req = httpMocks.createRequest();
    this.res = httpMocks.createResponse();
    
    // 添加 i18n mock
    this.req.t = mocki18n.t;
  });
  
  afterEach(function() {
    sinon.restore();
  });
  
  describe('获取当前用户信息', function() {
    it('应该返回当前已验证用户的信息', async function() {
      
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: ROLES.CLIENT
      };
      
      const req = httpMocks.createRequest({
        user: mockUser
      });
      
      const res = httpMocks.createResponse();
      await userController.getCurrentUser(req, res);
      const data = JSON.parse(res._getData());
      
      // 使用完全匹配而不是独立属性检查
      const expectedResponse = {
        success: true,
        user: {
          id: mockUser._id,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email,
          role: mockUser.role,
          // 可能还有其他属性...
        }
      };
      
      expect(res._getStatusCode()).to.equal(200);
      
      // 使用包含验证，这样即使控制器返回更多字段也能通过测试
      expect(data.success).to.be.true;
      expect(data.user).to.include({
        id: mockUser._id,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        role: mockUser.role
      });
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
        role: ROLES.CLIENT,
        preferredLanguage: 'en'
      };
      
      // 添加save方法到原始用户对象
      originalUser.save = sinon.stub().resolves({
        _id: '507f1f77bcf86cd799439011',
        firstName: 'After',
        lastName: 'Update',
        email: 'after@example.com',
        role: ROLES.CLIENT,
        preferredLanguage: 'zh'
      });
      
      // 创建请求，确保req.user包含_id
      const req = httpMocks.createRequest({
        user: { _id: originalUser._id },
        body: {
          firstName: 'After',
          lastName: 'Update',
          email: 'after@example.com',
          preferredLanguage: 'zh'
        }
      });
      const res = httpMocks.createResponse();
      
      // 重要：使用sinon.stub()然后.resolves()
      const findByIdStub = sinon.stub(User, 'findById');
      findByIdStub.resolves(originalUser);
      
      // 执行控制器方法
      await userController.updateUser(req, res);
      
      // 验证结果
      const data = JSON.parse(res._getData());
      expect(res._getStatusCode()).to.equal(200);
      expect(data.success).to.be.true;
      expect(data.user).to.exist;
      
      // 验证save被调用一次
      expect(originalUser.save.calledOnce).to.be.true;
    });
    
    it('不应该允许用户更改自己的角色', async function() {
      // 原始用户
      const originalUser = {
        _id: '507f1f77bcf86cd799439011',
        firstName: 'Client',
        lastName: 'User',
        email: 'client@example.com',
        role: ROLES.CLIENT,
        save: sinon.stub().resolves({
          _id: '507f1f77bcf86cd799439011',
          firstName: 'Client',
          lastName: 'Updated',
          email: 'client@example.com',
          role: ROLES.CLIENT
        })
      };
      
      // 创建请求，尝试更改角色
      const req = httpMocks.createRequest({
        user: originalUser,
        body: {
          firstName: 'Client',
          lastName: 'Updated',
          role: 'ADMIN'
        }
      });
      const res = httpMocks.createResponse();
      
      // 模拟用户查找
      sinon.stub(User, 'findById').resolves(originalUser);
      
      await userController.updateUser(req, res);
      
      const data = JSON.parse(res._getData());
      
      expect(res._getStatusCode()).to.equal(200);
      expect(data).to.have.property('success', true);
      expect(data.user).to.have.property('lastName', 'Updated');
      expect(data.user).to.have.property('role', 'CLIENT');
      
      // 验证角色未被更改
      expect(originalUser.role).to.equal('CLIENT');
    });
  });
  
  describe('管理员功能', function() {
    it('管理员应该能获取所有用户列表', async function() {
      
      const req = httpMocks.createRequest({
        user: {
          _id: '507f1f77bcf86cd799439011',
          role: ROLES.ADMIN
        },
        query: {
          page: 1,
          limit: 10
        }
      });
      
      const res = httpMocks.createResponse();
      const countStub = sinon.stub(User, 'countDocuments').resolves(3);
      const sortStub = sinon.stub().returns([
        { _id: '1', email: 'admin@example.com', role: ROLES.ADMIN },
        { _id: '2', email: 'consultant@example.com', role: ROLES.CONSULTANT },
        { _id: '3', email: 'client@example.com', role: ROLES.CLIENT }
      ]);
      
      const limitStub = sinon.stub().returns({ sort: sortStub });
      const skipStub = sinon.stub().returns({ limit: limitStub });
      const selectStub = sinon.stub().returns({ skip: skipStub });
      
      // 检查 find 是否已经被包装
      if (User.find.restore && typeof User.find.restore === 'function') {
        User.find.restore();
      }
      
      const findStub = sinon.stub(User, 'find').returns({ select: selectStub });
      await userController.getAllUsers(req, res);

      const data = JSON.parse(res._getData());
      
      expect(res._getStatusCode()).to.equal(200);
      expect(data).to.have.property('success', true);
      expect(data).to.have.property('users').that.is.an('array');
      expect(data.users).to.have.lengthOf(3);

    });
    
    it('管理员应该能更改用户角色', async function() {
      
      // 目标用户
      const targetUser = {
        _id: '507f1f77bcf86cd799439011',
        firstName: 'Target',
        lastName: 'User',
        email: 'target@example.com',
        role: ROLES.CLIENT,
        save: sinon.stub().resolves({
          _id: '507f1f77bcf86cd799439011',
          firstName: 'Target',
          lastName: 'User',
          email: 'target@example.com',
          role: 'CONSULTANT'
        })
      };
      
      // 创建管理员请求 - 关键修改: 使用userId而不是id参数
      const req = httpMocks.createRequest({
        user: {
          _id: '609f1f77bcf86cd799439022',
          role: 'ADMIN'
        },
        body: {
          userId: '507f1f77bcf86cd799439011',
          role: 'CONSULTANT'
        }
      });
      const res = httpMocks.createResponse();
      
      // 模拟User.findById - 确保使用req.body.userId
      const findByIdStub = sinon.stub(User, 'findById');
      findByIdStub.withArgs(req.body.userId).resolves(targetUser);
      
      findByIdStub.callsFake((...args) => {
        console.log('User.findById()被调用, 参数:', args);
        return Promise.resolve(targetUser);
      });
      
      await userController.updateUserRole(req, res);
      
      // 检查响应
      const responseData = res._getData();

      const data = JSON.parse(responseData);
        
        // 验证角色已更改
      expect(targetUser.role).to.equal('CONSULTANT');
        
        // 验证响应
      expect(res._getStatusCode()).to.equal(200);
      expect(data).to.have.property('success', true);
      expect(data.user).to.have.property('role', 'CONSULTANT');
        
        // 验证方法调用
      expect(findByIdStub.calledOnce).to.be.true;
      expect(targetUser.save.calledOnce).to.be.true;
    });
  });
}); 