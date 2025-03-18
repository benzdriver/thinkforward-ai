const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middleware/roleCheck');
const { subscriptionCheck } = require('../../middleware/subscriptionCheck');
const consultantDashboardController = require('../../controllers/dashboard/consultantDashboardController');

// 确保只有顾问可以访问这些端点
router.use(requireRole('CONSULTANT'));

// 顾问仪表盘概览
router.get('/overview', consultantDashboardController.getOverview);

// 客户统计
router.get('/client-stats', consultantDashboardController.getClientStats);

// 效率指标
router.get('/efficiency-metrics', consultantDashboardController.getEfficiencyMetrics);

// 最近活动
router.get('/recent-activities', consultantDashboardController.getRecentActivities);

// 待处理任务
router.get('/pending-tasks', consultantDashboardController.getPendingTasks);

// 申请状态统计
router.get('/application-stats', consultantDashboardController.getApplicationStats);

// AI使用情况统计
router.get('/ai-usage', consultantDashboardController.getAiUsageStats);

// 高级分析 - 仅高级订阅
router.get('/advanced-analytics', 
  subscriptionCheck(['growth', 'professional']), 
  consultantDashboardController.getAdvancedAnalytics);

// 收入预测 - 仅专业订阅
router.get('/revenue-forecast', 
  subscriptionCheck(['professional']), 
  consultantDashboardController.getRevenueForecast);

module.exports = router; 