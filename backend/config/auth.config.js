/**
 * 认证配置
 * 
 * 这个文件控制认证模式，随着迁移过程会进行更改
 */

module.exports = {
  // 当前认证模式
  // clerk: 仅使用Clerk (初始阶段)
  // migrating: 迁移期间 (用户可以设置密码，但仍主要使用Clerk)
  // dual: 双系统并行 (两种认证方式都能工作)
  // local: 完全迁移到本地认证
  authMode: process.env.AUTH_MODE || 'clerk',
  
  // 公开路由无需认证
  publicRoutes: [
    '/api/user/login',
    '/api/user/register',
    '/api/user/sync',
    '/api/user/reset-password',
    '/api/user/request-reset-password',
    '/api/health'
  ],
  
  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-in-env-file',
    expiresIn: '1d'
  },
  
  // Clerk配置
  clerk: {
    apiKey: process.env.CLERK_SECRET_KEY,
    jwtPublicKey: process.env.CLERK_JWT_PUBLIC_KEY
  },
  
  // 密码策略
  passwordPolicy: {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumber: true,
    requireSpecialChar: true
  },
  
  // 锁定策略
  lockoutPolicy: {
    maxAttempts: 5,
    lockoutDuration: 3600000 // 1小时 (毫秒)
  }
}; 