const User = require('../models/User');
const AuthService = require('../services/authService');
const { syncSocialLogins } = require('../utils/userSync');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { ROLES } = require('../constants/roles');

const authService = new AuthService();

// 用户注册
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: '该邮箱已注册' 
      });
    }

    // 创建新用户
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'Client'
    });

    // 生成JWT令牌
    const token = authService.generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: '服务器错误' 
    });
  }
};

// 用户登录
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 通过邮箱查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: '无效的凭据' 
      });
    }

    // 验证密码
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        error: '无效的凭据' 
      });
    }

    // 生成JWT令牌
    const token = authService.generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: '服务器错误' 
    });
  }
};

// Google登录
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({
        success: false,
        error: req.t ? req.t('auth.google.tokenRequired', 'Google token is required') : 'Google token is required'
      });
    }
    
    let email, firstName, lastName, picture;
    
    try {
      // 验证Google令牌
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'test-client-id');
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID || 'test-client-id'
      });
      
      // 如果ticket不存在，抛出错误
      if (!ticket) throw new Error('Invalid Google token (no ticket)');
      
      const payload = ticket.getPayload();
      
      // 如果payload不存在，抛出错误
      if (!payload) throw new Error('Invalid Google token (no payload)');
      
      email = payload.email;
      
      // 如果email不存在，抛出错误
      if (!email) throw new Error('Email not provided in Google token');
      
      // 处理名字信息
      firstName = payload.given_name || (payload.name ? payload.name.split(' ')[0] : 'Google');
      lastName = payload.family_name || 
                (payload.name && payload.name.includes(' ') ? 
                 payload.name.split(' ').slice(1).join(' ') : 'User');
      picture = payload.picture || '';
      
    } catch (verifyError) {
      // 只在非测试环境输出日志
      if (process.env.NODE_ENV !== 'test') {
        console.error('Google token verification error:', verifyError);
      }
      return res.status(401).json({
        success: false,
        error: req.t ? req.t('auth.google.invalidToken', 'Invalid Google token') : 'Invalid Google token'
      });
    }
    
    try {
      // 检查用户是否存在
      let user = await User.findOne({ email });
      
      // 如果用户不存在，创建新用户
      if (!user) {
        user = await User.create({
          email,
          firstName,
          lastName,
          picture,
          authProvider: 'google',
          role: ROLES.CLIENT
        });
      }
      
      // 生成JWT
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '30d' }
      );
      
      // 返回成功响应
      return res.status(200).json({
        success: true,
        token,
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          picture: user.picture
        }
      });
    } catch (dbError) {
      console.error('Google login database error:', dbError);
      return res.status(500).json({
        success: false,
        error: req.t ? req.t('auth.error.server', 'Server error') : 'Server error'
      });
    }
  } catch (error) {
    // 只在非测试环境输出日志
    if (process.env.NODE_ENV !== 'test') {
      console.error('Google登录错误:', error);
    }
    return res.status(401).json({
      success: false,
      error: req.t ? req.t('auth.google.invalidToken', 'Invalid Google token') : 'Invalid Google token'
    });
  }
};

// 验证会话
const verifySession = async (req, res) => {
  try {
    // 如果请求到达这里，说明auth中间件已通过验证
    res.status(200).json({
      success: true,
      isAuthenticated: true,
      user: req.user
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      isAuthenticated: false,
      error: '会话无效'
    });
  }
};

// Clerk Webhook 处理
const handleClerkWebhook = async (req, res) => {
  try {
    // 验证 Webhook 请求
    const headerSignature = req.headers['svix-signature'];
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!headerSignature || !webhookSecret) {
      logger.warn('Webhook 签名验证失败: 缺少签名或密钥');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // 验证签名逻辑这里省略，实际应使用 Clerk SDK 或手动验证
    
    // 处理不同的事件类型
    const { type, data } = req.body;
    logger.info(`收到 Clerk webhook: ${type}`);
    
    switch (type) {
      case 'user.created':
        await syncClerkUser(data);
        break;
        
      case 'user.updated':
        await updateUserFromClerk(data);
        break;
        
      case 'user.deleted':
        await handleUserDeletion(data.id);
        break;
        
      // 处理其他事件...
      case 'session.created':
      case 'session.revoked':
        // 可以记录会话信息
        break;
        
      default:
        logger.info(`未处理的 Webhook 事件类型: ${type}`);
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error(`Webhook 处理错误: ${error.message}`, { error });
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取认证状态
const getAuthStatus = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      authenticated: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    logger.error(`获取认证状态错误: ${error.message}`);
    return res.status(500).json({ 
      success: false, 
      error: '服务器错误' 
    });
  }
};

// 验证令牌
const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: '缺少令牌'
      });
    }
    
    const decoded = authService.verifyToken(token);
    
    return res.status(200).json({
      success: true,
      valid: true,
      user: decoded
    });
  } catch (error) {
    logger.error(`令牌验证错误: ${error.message}`);
    return res.status(401).json({
      success: false,
      valid: false,
      error: '无效令牌'
    });
  }
};

// 注销
const logout = async (req, res) => {
  // 可能的服务器端注销逻辑
  // 例如: 将令牌加入黑名单、清除会话等
  
  return res.status(200).json({
    success: true,
    message: '成功注销'
  });
};

// 确保导出所有路由中使用的函数
module.exports = {
  register,
  login,
  googleLogin,
  verifySession,
  handleClerkWebhook,
  getAuthStatus,
  verifyToken,
  logout
}; 