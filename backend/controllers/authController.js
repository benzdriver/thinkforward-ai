const User = require('../models/User');
const AuthService = require('../services/authService');
const { syncSocialLogins } = require('../utils/userSync');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

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
          role: 'Client'
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

module.exports = {
  register,
  login,
  googleLogin,
  verifySession,
}; 