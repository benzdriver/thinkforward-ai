const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');
const dashboardController = require('../controllers/dashboardController');

// 通用仪表盘路由 - 需要认证但不限制角色
router.use(auth);

// 顾问仪表盘路由
router.get('/consultant/overview', requireRole('Consultant'), dashboardController.getConsultantOverview);
router.get('/consultant/client-stats', requireRole('Consultant'), dashboardController.getConsultantClientStats);
router.get('/consultant/efficiency-metrics', requireRole('Consultant'), dashboardController.getConsultantEfficiencyMetrics);
router.get('/consultant/recent-activities', requireRole('Consultant'), dashboardController.getConsultantRecentActivities);
router.get('/consultant/pending-tasks', requireRole('Consultant'), dashboardController.getConsultantPendingTasks);
router.get('/consultant/application-stats', requireRole('Consultant'), dashboardController.getConsultantApplicationStats);
router.get('/consultant/ai-usage', requireRole('Consultant'), dashboardController.getConsultantAiUsageStats);

// 客户仪表盘路由
router.get('/client/overview', requireRole('Client'), dashboardController.getClientOverview);
router.get('/client/application-status', requireRole('Client'), dashboardController.getClientApplicationStatus);
router.get('/client/documents', requireRole('Client'), dashboardController.getClientDocuments);
router.get('/client/recent-activities', requireRole('Client'), dashboardController.getClientRecentActivities);
router.get('/client/upcoming-deadlines', requireRole('Client'), dashboardController.getClientUpcomingDeadlines);

// 管理员仪表盘路由
router.get('/admin/overview', requireRole('Admin'), dashboardController.getAdminOverview);
router.get('/admin/user-stats', requireRole('Admin'), dashboardController.getAdminUserStats);
router.get('/admin/consultant-performance', requireRole('Admin'), dashboardController.getAdminConsultantPerformance);
router.get('/admin/application-analytics', requireRole('Admin'), dashboardController.getAdminApplicationAnalytics);
router.get('/admin/revenue-stats', requireRole('Admin'), dashboardController.getAdminRevenueStats);
router.get('/admin/system-health', requireRole('Admin'), dashboardController.getAdminSystemHealth);

module.exports = router; 