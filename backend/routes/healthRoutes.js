const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const logger = require('../utils/logger');

// 健康检查端点
router.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'API Server' });
});

// 数据库连接检查端点
router.get('/db', async (req, res) => {
  try {
    // 检查MongoDB连接状态
    const dbState = mongoose.connection.readyState;
    const states = {
      0: '已断开',
      1: '已连接',
      2: '正在连接',
      3: '正在断开连接'
    };

    const dbStatus = states[dbState];
    
    // 尝试简单的数据库查询
    const dbPing = await mongoose.connection.db.admin().ping();
    
    logger.info(`数据库健康检查: 状态=${dbStatus}, ping=${JSON.stringify(dbPing)}`);
    
    return res.status(dbState === 1 ? 200 : 503).json({
      status: dbState === 1 ? 'OK' : 'Error',
      database: 'MongoDB',
      state: dbStatus,
      ping: dbPing.ok === 1 ? '成功' : '失败'
    });
  } catch (error) {
    logger.error(`数据库健康检查失败: ${error.message}`);
    return res.status(503).json({
      status: 'Error',
      database: 'MongoDB',
      error: error.message
    });
  }
});

module.exports = router; 