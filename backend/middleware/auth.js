const { Clerk } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');
const config = require('../config');
const AuthService = require('../services/authService');
const logger = require('../utils/logger');

const authService = new AuthService();

const clerk = new Clerk({ secretKey: config.clerk.secretKey });

/**
 * 认证中间件
 * 使用Clerk验证会话并查找或创建用户
 */
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: req.t ? req.t('auth:noToken', 'Authorization token is required') : 'Authorization token is required' 
      });
    }
    
    try {
      // 使用实例的方法
      const decoded = await authService.verifyToken(token);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: req.t ? req.t('auth:invalidToken', 'Authentication failed - invalid token') : 'Authentication failed - invalid token' 
        });
      }
      
      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      logger.warn(
        req.t ? 
        req.t('auth:errors.general', '认证错误: {{message}}', { message: error.message }) : 
        `认证错误: ${error.message}`, 
        { error }
      );
      
      return res.status(401).json({ 
        success: false, 
        error: req.t ? req.t('auth:failed', 'Authentication failed') : 'Authentication failed' 
      });
    }
  } catch (error) {
    logger.warn(
      req.t ? 
      req.t('auth:errors.general', '认证错误: {{message}}', { message: error.message }) : 
      `认证错误: ${error.message}`, 
      { error }
    );
    
    return res.status(401).json({ 
      success: false, 
      error: req.t ? req.t('auth:failed', 'Authentication failed') : 'Authentication failed'
    });
  }
};

module.exports = { auth }; 