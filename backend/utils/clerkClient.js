const { Clerk } = require('@clerk/clerk-sdk-node');
const config = require('../config');

// 创建Clerk客户端实例
const clerkClient = new Clerk({ 
  secretKey: config.clerk.secretKey 
});

module.exports = clerkClient; 