/**
 * 国际化兼容中间件
 * 确保req.t在所有环境中都可用
 */
module.exports = function(req, res, next) {
  // 如果req.t不存在，添加默认实现
  if (!req.t) {
    req.t = (key, defaultValue) => defaultValue || key;
  }
  next();
}; 