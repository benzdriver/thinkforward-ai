const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const { ALL_ROLES, ROLES } = require('../constants/roles');

const UserSchema = new Schema({
  // 外部认证信息
  authProvider: {
    type: String,
    enum: ['clerk', 'local', 'dual'],
    default: 'clerk'
  },
  
  // Clerk专用字段
  clerkId: {
    type: String,
    sparse: true,
    index: true
  },
  
  // 本地认证将使用的字段
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  
  password: {
    type: String,
    required: function() {
      return this.authProvider === 'local' || this.authProvider === 'dual';
    },
    validate: {
      validator: function(password) {
        // 如果是系统设置的密码哈希或空密码跳过验证
        if (!password || password.startsWith('$2a$')) return true;
        
        // 密码策略验证
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return password.length >= minLength && 
               hasUpperCase && hasLowerCase && 
               hasNumber && hasSpecial;
      },
      message: '密码必须至少8个字符，包含大小写字母、数字和特殊字符'
    },
    select: false // 默认不返回密码字段
  },
  
  // 密码重置和账户恢复字段
  passwordResetToken: String,
  passwordResetExpires: Date,
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // 用户详细信息
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  displayName: String,
  avatar: String,
  
  // 业务相关信息
  role: {
    type: String,
    enum: ALL_ROLES,
    default: ROLES.CLIENT
  },
  preferredLanguage: {
    type: String,
    enum: ['en', 'zh'],
    default: 'en'
  },
  
  // 迁移和审计信息
  migratedFromClerk: {
    type: Boolean,
    default: false
  },
  migrationDate: Date,
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // 增加社交登录相关字段
  socialLogins: [{
    provider: {
      type: String,
      enum: ['google', 'apple', 'microsoft', 'github', 'facebook', 'wechat'] // 包括微信
    },
    providerId: String,  // 社交平台的用户ID
    data: Object,        // 存储额外数据
    lastUsed: Date,
    createdAt: Date
  }],

  // 在用户模型中添加这些字段
  syncStatus: {
    lastSynced: Date,
    syncErrors: [{ 
      date: Date, 
      message: String 
    }]
  },

  migrationStatus: {
    passwordSetupEmailSent: Date,
    reminderEmailsSent: [Date],
    migrationCompleted: Boolean
  },
}, {
  timestamps: true
});

// 密码哈希中间件
UserSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// 密码验证方法
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // 只有当authProvider是local或dual时才验证密码
    if (this.authProvider === 'clerk') return false;
    
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// 账户锁定方法
UserSchema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

UserSchema.methods.lock = async function() {
  this.lockUntil = Date.now() + 3600000; // 锁定1小时
  return this.save();
};

UserSchema.methods.unlock = async function() {
  this.lockUntil = undefined;
  this.failedLoginAttempts = 0;
  return this.save();
};

UserSchema.methods.incrementLoginAttempts = async function() {
  // 增加失败次数
  this.failedLoginAttempts += 1;
  
  // 如果超过5次失败，锁定账户
  if (this.failedLoginAttempts >= 5) {
    await this.lock();
  }
  
  return this.save();
};

// 准备本地认证方法
UserSchema.methods.prepareForLocalAuth = async function(password) {
  if (!password) throw new Error('Password is required');
  
  this.password = password;
  this.authProvider = this.authProvider === 'clerk' ? 'dual' : 'local';
  this.migratedFromClerk = this.authProvider === 'dual';
  if (this.authProvider === 'dual') {
    this.migrationDate = new Date();
  }
  
  return this.save();
};

// 完成迁移方法
UserSchema.methods.completeLocalMigration = async function() {
  if (this.authProvider !== 'dual') {
    throw new Error('User is not in dual auth mode');
  }
  
  this.authProvider = 'local';
  this.clerkId = undefined;
  
  return this.save();
};

// 检查用户是否设置了本地密码
UserSchema.methods.hasLocalPassword = function() {
  return Boolean(this.password);
};

// 设置本地密码并更新认证方式
UserSchema.methods.setLocalPassword = async function(password) {
  if (!password) throw new Error('Password is required');
  
  this.password = password;
  
  // 更新认证提供商
  if (this.authProvider === 'clerk') {
    this.authProvider = 'dual';
    this.migratedFromClerk = true;
    this.migrationDate = new Date();
  }
  
  return this.save();
};

module.exports = mongoose.model('User', UserSchema); 