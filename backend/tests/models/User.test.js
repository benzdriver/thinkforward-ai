const User = require('../../models/User');
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const sinon = require('sinon');

describe('用户模型测试', () => {
  before(async () => {
    // 连接到测试数据库
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/thinkforward_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });
  
  afterEach(async () => {
    await User.deleteMany({});
  });
  
  after(async () => {
    await mongoose.connection.close();
  });
  
  it('应该成功创建并保存用户', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'Password123!',
      role: 'Client',
      preferredLanguage: 'zh'
    };
    
    const user = new User(userData);
    const savedUser = await user.save();
    
    expect(savedUser._id).to.exist;
    expect(savedUser.firstName).to.equal(userData.firstName);
    expect(savedUser.lastName).to.equal(userData.lastName);
    expect(savedUser.email).to.equal(userData.email);
    expect(savedUser.role).to.equal(userData.role);
    expect(savedUser.preferredLanguage).to.equal(userData.preferredLanguage);
    expect(savedUser.password).to.not.equal(userData.password); // 密码应该被哈希
  });
  
  it('应该在保存前哈希密码', async () => {
    // 创建用于测试的中间件
    const user = new User({
      firstName: 'Hash',
      lastName: 'Test',
      email: 'hash@test.com',
      password: 'plaintext'
    });
    
    // 监听bcrypt.hash方法
    const hashSpy = sinon.spy(bcrypt, 'hash');
    
    await user.save();
    
    expect(hashSpy.called).to.be.true;
    expect(user.password).to.not.equal('plaintext');
    
    hashSpy.restore();
  });
  
  it('comparePassword方法应正确验证密码', async () => {
    const user = new User({
      firstName: 'Compare',
      lastName: 'Password',
      email: 'compare@test.com',
      password: 'correctPassword'
    });
    
    await user.save();
    
    const correctResult = await user.comparePassword('correctPassword');
    const incorrectResult = await user.comparePassword('wrongPassword');
    
    expect(correctResult).to.be.true;
    expect(incorrectResult).to.be.false;
  });
  
  it('应该锁定和解锁账户', async () => {
    const user = new User({
      firstName: 'Lock',
      lastName: 'Test',
      email: 'lock@test.com',
      password: 'password'
    });
    
    await user.save();
    
    // 锁定账户
    await user.lock();
    expect(user.isLocked()).to.be.true;
    expect(user.lockUntil).to.be.greaterThan(Date.now());
    
    // 解锁账户
    await user.unlock();
    expect(user.isLocked()).to.be.false;
    expect(user.failedLoginAttempts).to.equal(0);
  });
  
  it('应该增加失败登录尝试次数', async () => {
    const user = new User({
      firstName: 'Attempts',
      lastName: 'Test',
      email: 'attempts@test.com',
      password: 'password'
    });
    
    await user.save();
    
    // 增加失败次数
    await user.incrementLoginAttempts();
    expect(user.failedLoginAttempts).to.equal(1);
    
    // 多次尝试直到锁定
    await user.incrementLoginAttempts();
    await user.incrementLoginAttempts();
    await user.incrementLoginAttempts();
    await user.incrementLoginAttempts(); // 第5次尝试应该锁定账户
    
    expect(user.isLocked()).to.be.true;
  });
}); 