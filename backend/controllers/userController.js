const User = require('../models/User');
const authService = require('../services/authService');
const emailService = require('../services/emailService');
const { clerkClient } = require('@clerk/clerk-sdk-node');
const config = require('../config');
const logger = require('../utils/logger');
const { syncSocialLogins } = require('../utils/userSync');
const { getUserPermissions } = require('../utils/permissions');
const { ROLES, ASSIGNABLE_ROLES } = require('../constants/roles');

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
      const updatedUser = syncSocialLogins(user, clerkUser.externalAccounts);
      await updatedUser.save();
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
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.userNotFound', 'User not found')
      });
    }
    
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        lastLogin: user.lastLogin,
        authProvider: user.authProvider,
        migrationStatus: user.migrationStatus || null,
        hasLocalPassword: !!user.password
      }
    });
  } catch (error) {
    logger.error('获取用户信息错误:', error);
    return res.status(500).json({
      success: false,
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 更新用户信息
const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.userNotFound', 'User not found')
      });
    }
    
    // 只允许更新特定字段
    const allowedUpdates = ['firstName', 'lastName', 'profileImage', 'preferences'];
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        user[key] = updates[key];
      }
    });
    
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: req.t('success.userUpdated', 'User updated successfully'),
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    logger.error('更新用户错误:', error);
    return res.status(500).json({
      success: false,
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 准备本地密码（迁移用）
const prepareLocalPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.userNotFound', 'User not found')
      });
    }
    
    // 设置密码并更新迁移状态
    user.password = password;
    if (!user.migrationStatus) user.migrationStatus = {};
    user.migrationStatus.passwordSet = true;
    user.migrationStatus.passwordSetAt = new Date();
    
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: req.t('success.passwordSet', 'Password set successfully')
    });
  } catch (error) {
    logger.error('设置密码错误:', error);
    return res.status(500).json({
      success: false,
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 请求密码重置
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      // 为了安全，即使用户不存在也返回成功
      return res.status(200).json({
        success: true,
        message: req.t('success.resetEmailSent', 'If your email exists in our system, a password reset link has been sent')
      });
    }
    
    // 生成重置令牌
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpire = Date.now() + 3600000; // 1小时
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpire;
    
    await user.save();
    
    // 发送重置邮件
    try {
      await emailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      logger.error('发送密码重置邮件错误:', emailError);
      return res.status(500).json({
        success: false,
        message: req.t('errors.emailSendFailed', 'Failed to send reset email')
      });
    }
    
    return res.status(200).json({
      success: true,
      message: req.t('success.resetEmailSent', 'Password reset email sent')
    });
  } catch (error) {
    logger.error('请求密码重置错误:', error);
    return res.status(500).json({
      success: false,
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 重置密码
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: req.t('errors.invalidToken', 'Invalid or expired token')
      });
    }
    
    // 设置新密码
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    // 如果是迁移用户，更新迁移状态
    if (user.migrationStatus) {
      user.migrationStatus.passwordSet = true;
      user.migrationStatus.passwordSetAt = new Date();
    }
    
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: req.t('success.passwordReset', 'Your password has been reset')
    });
  } catch (error) {
    logger.error('重置密码错误:', error);
    return res.status(500).json({
      success: false,
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 检查迁移状态
const checkMigrationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.userNotFound', 'User not found')
      });
    }
    
    return res.status(200).json({
      success: true,
      migrationStatus: user.migrationStatus || { 
        required: false, 
        completed: false 
      }
    });
  } catch (error) {
    logger.error('检查迁移状态错误:', error);
    return res.status(500).json({
      success: false,
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

/**
 * 获取当前用户角色
 */
const getCurrentUserRole = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: req.t('errors:unauthorized', 'Unauthorized')
      });
    }
    
    res.json({ role: req.user.role || ROLES.GUEST });
  } catch (error) {
    logger.error('获取用户角色错误:', error);
    res.status(500).json({ 
      message: req.t('errors:serverError', 'Server error') 
    });
  }
};

/**
 * 获取当前用户权限
 */
const getCurrentUserPermissions = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: req.t('errors.unauthorized', 'Unauthorized')
      });
    }
    
    const permissions = getUserPermissions(req.user.role);
    return res.status(200).json({
      success: true,
      permissions
    });
  } catch (error) {
    logger.error('获取用户权限错误:', error);
    return res.status(500).json({
      success: false,
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

/**
 * 更新用户个人资料
 */
const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, profileImage } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.userNotFound', 'User not found')
      });
    }
    
    // 更新字段
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (profileImage) user.profileImage = profileImage;
    
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: req.t('success.profileUpdated', 'Profile updated successfully'),
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    logger.error('更新个人资料错误:', error);
    return res.status(500).json({
      success: false,
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

/**
 * 获取所有用户（管理员功能）
 */
const getAllUsers = async (req, res) => {
  try {
    // 检查请求中的用户角色是否为ADMIN
    if (req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: req.t('errors.forbidden', 'You do not have permission')
      });
    }

    // 获取分页参数
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 获取总用户数
    const total = await User.countDocuments();

    // 获取用户列表，排除敏感字段
    const users = await User.find()
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      users
    });
  } catch (error) {
    logger.error('获取所有用户错误:', error);
    res.status(500).json({
      success: false,
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

/**
 * 更新用户角色（管理员功能）
 */
const updateUserRole = async (req, res) => {
  try {
    // 检查权限
    if (req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: req.t('errors.forbidden', 'You do not have permission')
      });
    }
    
    const { userId, role } = req.body;
    
    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        message: req.t('errors.missingFields', 'Missing required fields')
      });
    }
    
    // 检查角色是否有效
    if (!ASSIGNABLE_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: req.t('errors.invalidRole', 'Invalid role specified')
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.userNotFound', 'User not found')
      });
    }
    
    // 更新角色
    user.role = role;
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: req.t('success.roleUpdated', 'User role updated successfully'),
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('更新用户角色错误:', error);
    return res.status(500).json({
      success: false,
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

/**
 * 邀请新用户 (管理员专用)
 */
const inviteUser = async (req, res) => {
  try {
    const { email, role, firstName, lastName } = req.body;
    
    if (!email) {
      return res.status(400).json({
        message: req.t('errors.emailRequired', 'Email is required')
      });
    }
    
    if (!role || !ASSIGNABLE_ROLES.includes(role)) {
      return res.status(400).json({
        message: req.t('errors.invalidRole', 'Invalid role')
      });
    }
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: req.t('errors.userExists', 'User with this email already exists')
      });
    }
    
    // 尝试通过Clerk创建邀请
    try {
      const invitation = await clerkClient.invitations.createInvitation({
        emailAddress: email,
        redirectUrl: process.env.CLERK_REDIRECT_URL || 'http://localhost:3000/onboarding',
        publicMetadata: {
          role,
          invitedBy: req.user._id.toString()
        }
      });
      
      // 创建本地用户记录
      const newUser = new User({
        email,
        firstName: firstName || req.t('defaults.invitedFirstName', 'Invited'),
        lastName: lastName || req.t('defaults.invitedLastName', 'User'),
        role,
        authProvider: 'clerk',
        migrationStatus: {
          passwordSetupEmailSent: new Date(),
          migrationCompleted: false
        }
      });
      
      await newUser.save();
      
      logger.info(`邀请通过Clerk发送: 邮箱 ${email} 被邀请为 ${role}，操作者: ${req.user._id}`);
      
      res.json({
        message: req.t('success.inviteSent', 'Invitation sent successfully'),
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role
        }
      });
    } catch (clerkError) {
      logger.error('Clerk邀请错误:', clerkError);
      
      // 备用解决方案: 仅创建本地用户并发送自定义邀请邮件
      const newUser = new User({
        email,
        firstName: firstName || req.t('defaults.invitedFirstName', 'Invited'),
        lastName: lastName || req.t('defaults.invitedLastName', 'User'),
        role,
        authProvider: 'pending',
        migrationStatus: {
          passwordSetupEmailSent: new Date(),
          migrationCompleted: false
        }
      });
      
      await newUser.save();
      
      // 这里调用自定义邮件服务发送邀请邮件
      // 注意: 需要实现emailService
      // await sendInviteEmail(email, role, generateInviteLink(newUser._id));
      
      logger.info(`本地邀请创建: 邮箱 ${email} 被邀请为 ${role}，操作者: ${req.user._id}`);
      
      res.json({
        message: req.t('success.inviteCreated', 'User created and invitation prepared'),
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role
        }
      });
    }
  } catch (error) {
    logger.error('邀请用户错误:', error);
    res.status(500).json({ 
      message: req.t('errors.serverError', 'Server error') 
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
  checkMigrationStatus,
  getCurrentUserRole,
  getCurrentUserPermissions,
  updateUserProfile,
  getAllUsers,
  updateUserRole,
  inviteUser
}; 