const User = require('../models/User');
const authService = require('../services/authService');
const emailService = require('../services/emailService');
const { clerkClient } = require('@clerk/clerk-sdk-node');
const config = require('../config');
const logger = require('../utils/logger');
const { syncSocialLogins } = require('../utils/syncSocialLogins');

// 当前使用Clerk登录，重定向到Clerk
const login = async (req, res) => {
  try {
    const authMode = config.authMode || 'clerk';
    
    // 如果还在使用Clerk，告知前端
    if (authMode === 'clerk') {
      return res.status(200).json({
        success: true,
        message: req.t('auth.useClerk', 'Please use Clerk for authentication'),
        data: { authMode, useClerk: true }
      });
    }
    
    // 如果已迁移到本地或处于双轨期
    if (['local', 'dual', 'migrating'].includes(authMode)) {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: req.t('auth.missingCredentials', 'Email and password are required'),
          error: 'Missing credentials'
        });
      }
      
      // 使用本地认证
      const { user, token } = await authService.authenticateLocally(email, password);
      
      return res.status(200).json({
        success: true,
        message: req.t('auth.loginSuccess', 'Login successful'),
        data: { user, token, authMode }
      });
    }
    
    // 未知认证模式
    return res.status(500).json({
      success: false,
      message: req.t('auth.invalidMode', 'Invalid authentication mode'),
      error: 'Configuration error'
    });
  } catch (error) {
    logger.error('Login error:', error);
    return res.status(401).json({
      success: false,
      message: req.t('auth.loginFailed', 'Login failed'),
      error: error.message
    });
  }
};

// 同步Clerk用户到本地数据库
const syncClerkUser = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: req.t('auth.noToken', 'Token is required'),
        error: 'Missing token'
      });
    }
    
    // 从token获取用户ID并查询Clerk
    const authData = await authService.authenticateWithClerk(token);
    const clerkUser = authData.user;
    
    // 查找或创建用户
    let user = await User.findOne({ clerkId: clerkUser.id });
    
    if (!user) {
      user = new User({
        clerkId: clerkUser.id,
        authProvider: 'clerk',
        email: clerkUser.email,
        firstName: clerkUser.firstName || 'User',
        lastName: clerkUser.lastName || '',
        lastLogin: new Date()
      });
    }
    
    // 同步社交登录
    if (clerkUser.externalAccounts && clerkUser.externalAccounts.length > 0) {
      syncSocialLogins(user, clerkUser.externalAccounts);
    }
    
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: req.t('auth.syncSuccess', 'User synchronized successfully'),
      data: authData
    });
  } catch (error) {
    logger.error('Sync error:', error);
    return res.status(400).json({
      success: false,
      message: req.t('auth.syncFailed', 'User synchronization failed'),
      error: error.message
    });
  }
};

// 获取当前用户信息
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: req.t('auth.userNotFound', 'User not found'),
        error: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: req.t('errors.serverError', 'Server error'),
      error: error.message
    });
  }
};

// 更新用户信息
const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, preferredLanguage } = req.body;
    const updates = {};
    
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (preferredLanguage) updates.preferredLanguage = preferredLanguage;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: req.t('user.noUpdates', 'No updates provided'),
        error: 'No updates provided'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    );
    
    return res.status(200).json({
      success: true,
      message: req.t('user.updateSuccess', 'User updated successfully'),
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: req.t('errors.serverError', 'Server error'),
      error: error.message
    });
  }
};

// 准备用户密码 - 为迁移做准备
const prepareLocalPassword = async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        message: req.t('auth.noPassword', 'Password is required'),
        error: 'Missing password'
      });
    }
    
    // 检查密码强度
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: req.t('auth.weakPassword', 'Password must be at least 8 characters'),
        error: 'Weak password'
      });
    }
    
    const user = await authService.prepareUserForMigration(req.user._id, password);
    
    return res.status(200).json({
      success: true,
      message: req.t('auth.passwordSet', 'Local password set successfully'),
      data: { authProvider: user.authProvider }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: req.t('errors.serverError', 'Server error'),
      error: error.message
    });
  }
};

// 请求密码重置
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: req.t('auth.noEmail', 'Email is required'),
        error: 'Missing email'
      });
    }
    
    // 获取重置令牌
    const resetToken = await authService.createPasswordResetToken(email);
    
    // 在生产环境中发送重置邮件
    if (process.env.NODE_ENV === 'production') {
      const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;
      await emailService.sendPasswordResetEmail(email, resetUrl);
      
      return res.status(200).json({
        success: true,
        message: req.t('auth.resetEmailSent', 'Password reset email sent')
      });
    } else {
      // 在开发环境中返回令牌（方便测试）
      return res.status(200).json({
        success: true,
        message: req.t('auth.resetTokenCreated', 'Password reset token created'),
        data: { resetToken }
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: req.t('errors.serverError', 'Server error'),
      error: error.message
    });
  }
};

// 重置密码
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: req.t('auth.missingResetInfo', 'Token and password are required'),
        error: 'Missing token or password'
      });
    }
    
    // 检查密码强度
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: req.t('auth.weakPassword', 'Password must be at least 8 characters'),
        error: 'Weak password'
      });
    }
    
    const user = await authService.resetPassword(token, password);
    
    return res.status(200).json({
      success: true,
      message: req.t('auth.passwordReset', 'Password reset successfully'),
      data: { authProvider: user.authProvider }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: req.t('auth.resetFailed', 'Password reset failed'),
      error: error.message
    });
  }
};

// 检查迁移状态 - 仅管理员
const checkMigrationStatus = async (req, res) => {
  try {
    // 检查用户是否为管理员
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: req.t('auth.notAuthorized', 'Not authorized'),
        error: 'Not authorized'
      });
    }
    
    const stats = await authService.bulkMigrationStatus();
    
    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: req.t('errors.serverError', 'Server error'),
      error: error.message
    });
  }
};

module.exports = {
  login,
  syncClerkUser,
  getCurrentUser,
  updateUser,
  prepareLocalPassword,
  requestPasswordReset,
  resetPassword,
  checkMigrationStatus
}; 