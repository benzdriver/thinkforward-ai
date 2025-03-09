/**
 * 请求模拟工具 - 自动添加t函数到所有请求
 */
const httpMocks = require('node-mocks-http');

// 包装原始httpMocks.createRequest函数
const originalCreateRequest = httpMocks.createRequest;

// 重写createRequest以自动添加t函数
httpMocks.createRequest = function(options = {}) {
  // 确保options对象存在
  options = options || {};
  
  // 只有当未提供t函数时才添加默认t函数
  if (!options.t) {
    options.t = (key, defaultValue) => defaultValue || key;
  }
  
  // 调用原始函数
  return originalCreateRequest(options);
};

module.exports = httpMocks; 