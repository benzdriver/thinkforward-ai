const express = require('express');
const router = express.Router();

// 导入路由文件
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const clientRoutes = require('./clientRoutes');
const formRoutes = require('./formRoutes');
const applicationRoutes = require('./applicationRoutes');
const aiRoutes = require('./aiRoutes');

// 注册路由
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/forms', formRoutes);
router.use('/applications', applicationRoutes);
router.use('/ai', aiRoutes);

// API根路径
router.get('/', (req, res) => {
  res.json({
    message: req.t('welcome', 'Welcome to ThinkForward AI API'),
    version: '1.0.0'
  });
});

// 在路由文件中添加健康检查端点
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router; 