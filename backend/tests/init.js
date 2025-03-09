/**
 * 测试初始化脚本
 * 在mocha命令中使用: --require ./tests/init.js
 */

/**
 * Mocha ROOT_HOOK_PLUGIN
 * 
 * 这种特殊格式允许在不直接使用before/after的情况下注册全局钩子
 */

// 导出 ROOT_HOOK_PLUGIN 对象
exports.mochaHooks = {
  beforeAll() {
    console.log('全局测试设置开始...');
    
    // 创建全局t函数
    global.t = (key, defaultValue) => defaultValue || key;
    
    // 修改所有请求对象，添加t函数
    const httpMocks = require('node-mocks-http');
    const originalCreateRequest = httpMocks.createRequest;
    httpMocks.createRequest = function(options = {}) {
      options = options || {};
      options.t = options.t || global.t;
      return originalCreateRequest(options);
    };
    
    console.log('全局测试设置完成！');
  },
  
  afterAll() {
    console.log('全局测试清理完成！');
  }
}; 