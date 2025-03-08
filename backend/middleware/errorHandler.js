const logger = require('../utils/logger');

// 全局错误处理中间件
const errorHandler = (err, req, res, next) => {
  // 记录错误
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user ? req.user._id : 'unauthenticated'
  });
  
  // MongoDB错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: req.t('errors.validationError', 'Validation Error'),
      errors: Object.values(err.errors).map(val => val.message)
    });
  }
  
  // JWT错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: req.t('errors.unauthorized', 'Invalid token')
    });
  }
  
  // Clerk错误
  if (err.name === 'ClerkError') {
    return res.status(401).json({
      message: req.t('errors.unauthorized', 'Authentication error')
    });
  }
  
  // OpenAI错误
  if (err.name === 'OpenAIError') {
    return res.status(500).json({
      message: req.t('errors.aiError', 'AI service error')
    });
  }
  
  // 默认服务器错误
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    message: req.t('errors.serverError', 'Server error'),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err.message 
    })
  });
};

module.exports = errorHandler; 