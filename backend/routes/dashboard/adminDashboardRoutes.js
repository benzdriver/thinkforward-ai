const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middleware/roleCheck');
const adminDashboardController = require('../../controllers/dashboard/adminDashboardController');

// 确保只有管理员可以访问这些端点
router.use(requireRole('ADMIN'));

// 管理员仪表盘概览
router.get('/overview', adminDashboardController.getOverview);

// 用户统计
router.get('/user-stats', adminDashboardController.getUserStats);

// 顾问绩效
router.get('/consultant-performance', adminDashboardController.getConsultantPerformance);

// 申请分析
router.get('/application-analytics', adminDashboardController.getApplicationAnalytics);

// 收入统计
router.get('/revenue-stats', adminDashboardController.getRevenueStats);

// 系统健康状况
router.get('/system-health', adminDashboardController.getSystemHealth);

// 订阅管理数据
router.get('/subscriptions', adminDashboardController.getSubscriptionsData);

module.exports = router; 