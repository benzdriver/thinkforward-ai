const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * 简化的同步中间件 - 仅更新登录时间
 */
const authSyncMiddleware = async (req, res, next) => {
  // 只处理已认证的请求
  if (!req.user) {
    return next();
  }
  
  try {
    // 只对已存在的用户更新登录时间
    if (req.user._id) {
      await User.findByIdAndUpdate(
        req.user._id,
        { $set: { lastLogin: new Date() } }
      );
    }
    
    next();
  } catch (error) {
    logger.error('认证同步中间件错误:', error);
    next(); // 继续处理请求
  }
};

module.exports = authSyncMiddleware; 