const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../../models/User');
const { ROLES } = require('../../../constants/roles');

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
    it('应该要求email是有效的格式', function(done) {
      this.timeout(5000); // 设置更短的超时，以便更快发现问题
      
      const user = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'invalid-email', // 无效的邮箱
        password: 'Password123!',
        role: ROLES.CLIENT
      });
      
      console.log('开始验证邮箱...');
      
      try {
        // 改用更可靠的验证方式 - Promise API
        user.validate()
          .then(() => {
            // 如果验证通过，测试应该失败
            console.log('邮箱验证意外通过');
            done(new Error('Email validation should have failed'));
          })
          .catch(err => {
            try {
              console.log('邮箱验证失败，错误:', err.message);
              expect(err).to.exist;
              expect(err.errors).to.exist;
              expect(err.errors.email).to.exist;
              done();
            } catch (error) {
              done(error);
            }
          });
      } catch (error) {
        console.log('验证过程中发生错误:', error);
        done(error);
      }
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
      // 使用符合复杂度要求的密码
      const password = 'StrongPassword123!';
      
      // 创建有效的本地用户 (不使用预先哈希的密码)
      const user = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'test-local@example.com',
        password: password, // 让模型的pre-save钩子自动哈希密码
        role: ROLES.CLIENT,
        authProvider: 'local' // 设置为local
      });
      
      // 保存用户并检查结果
      const savedUser = await user.save();
      
      // 从数据库重新获取用户，包括密码字段
      const retrievedUser = await User.findById(savedUser._id).select('+password');
      
      // 确认密码比较方法
      const passwordCompareFn = retrievedUser.matchPassword || retrievedUser.comparePassword;
      
      // 使用直接比较验证密码哈希是否有效
      const directBcryptCompare = await bcrypt.compare(password, retrievedUser.password);
      
      // 测试模型的matchPassword/comparePassword方法
      const isMatch = await retrievedUser.matchPassword(password);
      
      expect(isMatch).to.be.true;
      
      const isNotMatch = await retrievedUser.matchPassword('WrongPassword123!');
      expect(isNotMatch).to.be.false;
    });

    it('clerk用户的matchPassword方法应返回false', async function() {
      // 使用符合复杂度要求的密码
      const password = 'StrongPassword123!';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // 创建clerk用户
      const user = new User({
        firstName: 'Clerk',
        lastName: 'User',
        email: 'clerk@example.com',
        password: hashedPassword,
        role: ROLES.CLIENT,
        authProvider: 'clerk', // 特意设置为clerk
        clerkId: 'clerk_12345'
      });
      
      await user.save({ validateBeforeSave: false });
      
      // 关键修复：显式包含password字段
      const savedUser = await User.findById(user._id).select('+password');
      
      // 测试matchPassword方法
      const result = await savedUser.matchPassword(password);
      // 对于clerk用户，期望返回false
      expect(result).to.be.false;
    });
  });
}); 