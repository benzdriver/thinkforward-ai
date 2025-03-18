const express = require('express');
const router = express.Router();
const guestDashboardController = require('../../controllers/dashboard/guestDashboardController');

// 访客仪表盘路由 - 无需角色验证，展示公开信息

// 访客仪表盘概览
router.get('/overview', guestDashboardController.getOverview);

// 获取系统公开统计数据
router.get('/stats', guestDashboardController.getPublicStats);

// 获取顾问展示列表
router.get('/consultants', guestDashboardController.getPublicConsultantList);

// 案例展示
router.get('/case-studies', guestDashboardController.getCaseStudies);

module.exports = router; 