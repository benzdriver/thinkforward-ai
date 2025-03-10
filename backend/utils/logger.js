const winston = require('winston');
const config = require('../config');

// 根据环境配置适当的日志级别
const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// 测试环境可以进一步降低日志级别或使用noop记录器
const testMode = process.env.NODE_ENV === 'test';

const logger = winston.createLogger({
  level: testMode ? 'error' : level, // 测试时只记录错误
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // 控制台输出
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // 生产环境文件日志
    ...(process.env.NODE_ENV === 'production' ? [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' })
    ] : [])
  ],
  // 测试环境可以完全禁用日志
  silent: process.env.NODE_ENV === 'test' && process.env.LOG_TESTS !== 'true'
});

module.exports = logger; 