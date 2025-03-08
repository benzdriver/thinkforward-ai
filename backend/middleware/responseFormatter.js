const logger = require('../utils/logger');

/**
 * 响应格式化中间件
 * 统一API响应格式
 */
const responseFormatter = (req, res, next) => {
  // 保存原始的res.json函数
  const originalJson = res.json;
  
  // 覆盖res.json方法
  res.json = function(data) {
    // 如果已经是标准格式则不再包装
    if (data && (data.success !== undefined && data.message !== undefined)) {
      return originalJson.call(this, data);
    }
    
    // 获取状态码
    const statusCode = res.statusCode;
    
    // 获取本地化的状态消息
    let statusMessage = '';
    if (statusCode >= 200 && statusCode < 300) {
      statusMessage = req.t('api.success', 'Operation successful');
    } else if (statusCode >= 400 && statusCode < 500) {
      statusMessage = data.message || req.t('api.clientError', 'Request error');
    } else if (statusCode >= 500) {
      statusMessage = data.message || req.t('api.serverError', 'Server error');
    }
    
    // 构建标准响应对象
    const response = {
      success: statusCode >= 200 && statusCode < 300,
      message: statusMessage,
      data: statusCode >= 400 ? null : data,
      error: statusCode >= 400 ? (data.error || data.message || statusMessage) : null
    };
    
    // 使用原始的json方法发送响应
    return originalJson.call(this, response);
  };
  
  next();
};

module.exports = responseFormatter; 