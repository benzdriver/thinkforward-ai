const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../../models/User');

// 确保在User.test.js开始时加载i18n模拟

describe('用户模型测试', function() {
  before(async function() {
    // 连接到测试数据库
    this.timeout(10000);
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });
  
  afterEach(async function() {
    await User.deleteMany({});
    sinon.restore();
  });
  
  after(async function() {
    await mongoose.connection.close();
  });

  describe('字段验证', function() {
    it('应该要求email是有效的格式', async function() {
      const userWithInvalidEmail = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'invalid-email',
        password: 'Password123!',
        role: 'CLIENT'
      });
      
      let error;
      try {
        await userWithInvalidEmail.validate();
      } catch (e) {
        error = e;
      }
      
      expect(error).to.exist;
      expect(error.errors.email).to.exist;
    });
    
    it('应该要求密码至少有8个字符', async function() {
      const userWithShortPassword = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Pass1!',
        role: 'CLIENT'
      });
      
      let error;
      try {
        await userWithShortPassword.validate();
      } catch (e) {
        error = e;
      }
      
      expect(error).to.exist;
      expect(error.errors.password).to.exist;
    });
    
    it('应该验证角色字段的有效值', async function() {
      const userWithInvalidRole = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'InvalidRole'
      });
      
      let error;
      try {
        await userWithInvalidRole.validate();
      } catch (e) {
        error = e;
      }
      
      expect(error).to.exist;
      expect(error.errors.role).to.exist;
    });
  });

  describe('保存前钩子', function() {
    it('应该在保存前对密码进行哈希处理', async function() {
      const plainPassword = 'Password123!';
      const hashSpy = sinon.spy(bcrypt, 'hash');
      
      const user = new User({
        firstName: 'Hash',
        lastName: 'Test',
        email: 'hash@test.com',
        password: plainPassword,
        role: 'CLIENT'
      });
      
      await user.save();
      
      expect(hashSpy.called).to.be.true;
      expect(user.password).to.not.equal(plainPassword);
      
      // 验证哈希密码是否可以匹配原始密码
      const isMatch = await bcrypt.compare(plainPassword, user.password);
      expect(isMatch).to.be.true;
    });
    
    it('不应该重新哈希已经哈希过的密码', async function() {
      // 首先创建用户
      const user = new User({
        firstName: 'Hash',
        lastName: 'Once',
        email: 'hashonce@test.com',
        password: 'Password123!',
        role: 'CLIENT'
      });
      
      await user.save();
      const firstHash = user.password;
      
      // 修改非密码字段并再次保存
      user.firstName = 'Updated';
      const hashSpy = sinon.spy(bcrypt, 'hash');
      await user.save();
      
      expect(hashSpy.called).to.be.false;
      expect(user.password).to.equal(firstHash);
    });
  });

  describe('实例方法', function() {
    it('matchPassword方法应正确比较密码', async function() {
      // 确保使用完整的模型实例，而不是普通对象
      const user = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123', // 会被自动哈希
        role: 'CLIENT'
      });
      
      // 保存用户以触发哈希钩子
      await user.save();
      
      // 确认 matchPassword 存在
      expect(user.matchPassword).to.be.a('function');
      
      // 测试密码匹配
      const isMatch = await user.matchPassword('password123');
      expect(isMatch).to.be.true;
    });
  });
}); 