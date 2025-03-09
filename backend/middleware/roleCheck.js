const { hasPermission } = require('../utils/permissions');
const logger = require('../utils/logger');

/**
 * 角色检查中间件，确保有健壮的t函数处理
 */

// 确保有默认的t函数
const defaultT = (key, defaultValue) => defaultValue || key;

/**
 * 检查特定权限的中间件
 * @param {string} permission - 需要检查的权限
 * @returns {Function} - Express中间件
 */
const requirePermission = (roles) => {
  // 转换为数组以统一处理
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  
  return (req, res, next) => {
    // 使用默认t函数作为后备
    const t = req.t || defaultT;
    
    // 验证用户是否存在
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: t('auth.unauthorized', '未授权：用户未登录')
      });
    }
    
    // 检查用户是否有所需角色之一
    const hasPermission = requiredRoles.some(role => req.user.role === role);
    
    if (!hasPermission) {
      // 记录权限被拒绝
      console.warn(`权限被拒绝: 用户 ${req.user._id} 尝试访问需要 ${requiredRoles.join(',')} 的资源`);
      
      return res.status(403).json({
        success: false,
        error: t('auth.forbidden', '禁止访问：权限不足')
      });
    }
    
    next();
  };
};

/**
 * 检查特定角色的中间件
 * @param {...string} roles - 需要检查的角色列表
 * @returns {Function} - Express中间件
 */
const requireRole = requirePermission;

module.exports = {
  requirePermission,
  requireRole
}; 