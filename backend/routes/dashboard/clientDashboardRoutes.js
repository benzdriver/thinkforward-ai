const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middleware/roleCheck');
const clientDashboardController = require('../../controllers/dashboard/clientDashboardController');

// 确保只有客户可以访问这些端点
router.use(requireRole('CLIENT'));

// 客户仪表盘概览
router.get('/overview', clientDashboardController.getOverview);

// 申请状态
router.get('/application-status', clientDashboardController.getApplicationStatus);

// 文档列表
router.get('/documents', clientDashboardController.getDocuments);

// 最近活动
router.get('/recent-activities', clientDashboardController.getRecentActivities);

// 即将到期的截止日期
router.get('/upcoming-deadlines', clientDashboardController.getUpcomingDeadlines);

// 顾问信息
router.get('/consultant-info', clientDashboardController.getConsultantInfo);

// 付款历史
router.get('/payment-history', clientDashboardController.getPaymentHistory);

module.exports = router; 