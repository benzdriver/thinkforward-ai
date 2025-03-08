const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');
const { clerkClient } = require('@clerk/clerk-sdk-node');
const logger = require('../utils/logger');
const { OAuth2Client } = require('google-auth-library');

class AuthService {
  constructor() {
    this.config = config;
    this.client = new OAuth2Client(this.config.google.clientId);
  }
  
  // 生成JWT令牌
  generateToken(userId, expiresIn = '1d') {
    return jwt.sign(
      { id: userId },
      this.config.jwtSecret,
      { expiresIn }
    );
  }
  
  // 验证JWT令牌
  verifyToken(token) {
    try {
      return jwt.verify(token, this.config.jwtSecret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  
  // 从Clerk验证并同步用户
  async authenticateWithClerk(clerkToken) {
    try {
      // 使用Clerk SDK验证令牌
      const { sub: clerkId } = await clerkClient.verifyToken(clerkToken);
      
      // 获取Clerk用户详情
      const clerkUser = await clerkClient.users.getUser(clerkId);
      
      // 查找或创建用户
      const primaryEmail = clerkUser.emailAddresses.find(
        email => email.id === clerkUser.primaryEmailAddressId
      ).emailAddress;
      
      let user = await User.findOne({ clerkId });
      
      if (!user) {
        // 尝试通过邮箱查找
        user = await User.findOne({ email: primaryEmail });
        
        if (user) {
          // 已有用户，关联Clerk
          user.clerkId = clerkId;
          user.authProvider = user.authProvider === 'local' ? 'dual' : 'clerk';
        } else {
          // 创建新用户
          user = new User({
            clerkId,
            authProvider: 'clerk',
            email: primaryEmail,
            firstName: clerkUser.firstName || 'User',
            lastName: clerkUser.lastName || '',
            displayName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || primaryEmail,
            role: 'Client',
            preferredLanguage: 'en'
          });
        }
        
        await user.save();
      }
      
      // 更新登录时间
      user.lastLogin = new Date();
      await user.save();
      
      // 返回用户和令牌
      return {
        user,
        token: this.generateToken(user._id)
      };
    } catch (error) {
      logger.error('Clerk authentication error:', error);
      throw error;
    }
  }
  
  // 本地登录方法(现在不激活，为迁移准备)
  async authenticateLocally(email, password) {
    try {
      const user = await User.findOne({ email }).select('+password');
      
      if (!user || user.authProvider === 'clerk') {
        throw new Error('Invalid credentials');
      }
      
      if (user.isLocked()) {
        throw new Error('Account is locked');
      }
      
      const isMatch = await user.comparePassword(password);
      
      if (!isMatch) {
        await user.incrementLoginAttempts();
        throw new Error('Invalid credentials');
      }
      
      // 重置失败尝试
      if (user.failedLoginAttempts > 0) {
        user.failedLoginAttempts = 0;
        await user.save();
      }
      
      // 更新登录时间
      user.lastLogin = new Date();
      await user.save();
      
      // 返回用户和令牌
      return {
        user,
        token: this.generateToken(user._id)
      };
    } catch (error) {
      logger.error('Local authentication error:', error);
      throw error;
    }
  }
  
  // 为用户准备密码重置令牌
  async createPasswordResetToken(email) {
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    user.passwordResetExpires = Date.now() + 3600000; // 1小时内有效
    await user.save();
    
    return resetToken;
  }
  
  // 使用令牌重置密码
  async resetPassword(token, newPassword) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      throw new Error('Invalid or expired token');
    }
    
    // 设置新密码
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    // 如果用户来自Clerk，标记为双重认证
    if (user.authProvider === 'clerk') {
      user.authProvider = 'dual';
      user.migratedFromClerk = true;
      user.migrationDate = new Date();
    }
    
    await user.save();
    return user;
  }
  
  // 迁移辅助方法 - 为Clerk用户准备本地密码
  async prepareUserForMigration(userId, password) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user.prepareForLocalAuth(password);
  }
  
  // 完成单个用户迁移
  async completeUserMigration(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user.completeLocalMigration();
  }
  
  // 批量迁移操作(管理员工具)
  async bulkMigrationStatus() {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$authProvider',
          count: { $sum: 1 }
        }
      }
    ]);
    
    return stats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});
  }
  
  // Google登录方法
  async authenticateWithGoogle(idToken) {
    try {
      // 验证Google令牌
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.config.google.clientId
      });
      
      const payload = ticket.getPayload();
      const googleId = payload.sub;
      
      // 查找或创建用户
      let user = await User.findOne({
        'socialLogins.provider': 'google',
        'socialLogins.providerId': googleId
      });
      
      if (!user) {
        // 尝试通过邮箱查找
        user = await User.findOne({ email: payload.email });
        
        if (user) {
          // 已有用户，添加社交登录
          user.socialLogins.push({
            provider: 'google',
            providerId: googleId,
            data: {
              email: payload.email,
              name: payload.name,
              picture: payload.picture
            },
            lastUsed: new Date(),
            createdAt: new Date()
          });
        } else {
          // 创建新用户
          user = new User({
            email: payload.email,
            firstName: payload.given_name || payload.name.split(' ')[0],
            lastName: payload.family_name || payload.name.split(' ').slice(1).join(' '),
            authProvider: 'local', // 这里是local因为我们自己管理认证
            socialLogins: [{
              provider: 'google',
              providerId: googleId,
              data: {
                email: payload.email,
                name: payload.name,
                picture: payload.picture
              },
              lastUsed: new Date(),
              createdAt: new Date()
            }]
          });
        }
        
        await user.save();
      } else {
        // 更新最后使用时间
        const loginIndex = user.socialLogins.findIndex(
          login => login.provider === 'google' && login.providerId === googleId
        );
        
        if (loginIndex !== -1) {
          user.socialLogins[loginIndex].lastUsed = new Date();
          await user.save();
        }
      }
      
      // 更新登录时间
      user.lastLogin = new Date();
      await user.save();
      
      // 返回用户和令牌
      return {
        user,
        token: this.generateToken(user._id)
      };
    } catch (error) {
      logger.error('Google authentication error:', error);
      throw error;
    }
  }
  
  // 可以为其他提供商添加类似方法
  async authenticateWithApple(idToken) { /* ... */ }
  async authenticateWithMicrosoft(code) { /* ... */ }
  async authenticateWithWeChat(code) { /* ... */ }
}

module.exports = new AuthService(); 