const User = require('../models/User');
const Client = require('../models/Client');
const Application = require('../models/Application');
const Chat = require('../models/Chat');
const Assessment = require('../models/Assessment');
const Payment = require('../models/Payment');  // 假设存在这个模型
const logger = require('../utils/logger');

//===== 顾问仪表盘控制器 =====//

/**
 * 获取顾问仪表盘概览
 */
exports.getConsultantOverview = async (req, res) => {
  try {
    const consultantId = req.user.id;
    
    // 获取基本统计数据
    const clientStats = await getConsultantClientStatistics(consultantId);
    const efficiencyMetrics = await getConsultantEfficiencyMetrics(consultantId);
    const applicationStats = await getConsultantApplicationStatistics(consultantId);
    
    res.status(200).json({
      success: true,
      data: {
        clientStats,
        efficiencyMetrics,
        applicationStats
      }
    });
  } catch (error) {
    logger.error(`获取顾问仪表盘概览失败: ${error.message}`);
    res.status(500).json({
      success: false,
      message: '获取仪表盘数据失败',
      error: error.message
    });
  }
};

// [其他顾问相关控制器方法，与之前的实现类似，但函数名更具体]
exports.getConsultantClientStats = async (req, res) => { /* ... */ };
exports.getConsultantEfficiencyMetrics = async (req, res) => { /* ... */ };
exports.getConsultantRecentActivities = async (req, res) => { /* ... */ };
exports.getConsultantPendingTasks = async (req, res) => { /* ... */ };
exports.getConsultantApplicationStats = async (req, res) => { /* ... */ };
exports.getConsultantAiUsageStats = async (req, res) => { /* ... */ };

//===== 客户仪表盘控制器 =====//

/**
 * 获取客户仪表盘概览
 */
exports.getClientOverview = async (req, res) => {
  try {
    const clientId = req.user.id;
    
    // 获取申请状态概览
    const applications = await Application.find({ client: clientId })
      .select('name status progress updatedAt');
    
    // 获取即将到期的截止日期
    const upcomingDeadlines = await getClientUpcomingDeadlines(clientId);
    
    // 获取最近的活动
    const recentActivities = await getClientRecentActivities(clientId, 5);
    
    res.status(200).json({
      success: true,
      data: {
        applications,
        upcomingDeadlines,
        recentActivities
      }
    });
  } catch (error) {
    logger.error(`获取客户仪表盘概览失败: ${error.message}`);
    res.status(500).json({
      success: false,
      message: '获取仪表盘数据失败',
      error: error.message
    });
  }
};

/**
 * 获取客户申请状态
 */
exports.getClientApplicationStatus = async (req, res) => {
  try {
    const clientId = req.user.id;
    
    const applications = await Application.find({ client: clientId })
      .select('name status progress updatedAt consultant')
      .populate('consultant', 'name email');
    
    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    logger.error(`获取客户申请状态失败: ${error.message}`);
    res.status(500).json({
      success: false,
      message: '获取申请状态失败',
      error: error.message
    });
  }
};

// [其他客户相关控制器方法]
exports.getClientDocuments = async (req, res) => { /* ... */ };
exports.getClientRecentActivities = async (req, res) => { /* ... */ };
exports.getClientUpcomingDeadlines = async (req, res) => { /* ... */ };

//===== 管理员仪表盘控制器 =====//

/**
 * 获取管理员仪表盘概览
 */
exports.getAdminOverview = async (req, res) => {
  try {
    // 用户统计
    const userStats = await getAdminUserStatistics();
    
    // 申请统计
    const applicationStats = await getAdminApplicationStatistics();
    
    // 收入统计
    const revenueStats = await getAdminRevenueStatistics();
    
    // 系统健康状况
    const systemHealth = await getAdminSystemHealth();
    
    res.status(200).json({
      success: true,
      data: {
        userStats,
        applicationStats,
        revenueStats,
        systemHealth
      }
    });
  } catch (error) {
    logger.error(`获取管理员仪表盘概览失败: ${error.message}`);
    res.status(500).json({
      success: false,
      message: '获取仪表盘数据失败',
      error: error.message
    });
  }
};

// [其他管理员相关控制器方法]
exports.getAdminUserStats = async (req, res) => { /* ... */ };
exports.getAdminConsultantPerformance = async (req, res) => { /* ... */ };
exports.getAdminApplicationAnalytics = async (req, res) => { /* ... */ };
exports.getAdminRevenueStats = async (req, res) => { /* ... */ };
exports.getAdminSystemHealth = async (req, res) => { /* ... */ };

//===== 辅助函数 =====//

// [顾问相关辅助函数，与之前的实现类似]
async function getConsultantClientStatistics(consultantId) { /* ... */ }
async function getConsultantEfficiencyMetrics(consultantId) { /* ... */ }
async function getConsultantApplicationStatistics(consultantId) { /* ... */ }

// [客户相关辅助函数]
async function getClientUpcomingDeadlinesHelper(clientId) {
  return await Application.aggregate([
    { $match: { client: clientId } },
    { $unwind: '$reminders' },
    { $match: { 'reminders.dueDate': { $gte: new Date(), $lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) } } },
    { $project: {
      applicationId: '$_id',
      applicationName: '$name',
      reminderTitle: '$reminders.title',
      dueDate: '$reminders.dueDate',
      priority: '$reminders.priority'
    }}
  ]);
}

async function getClientRecentActivitiesHelper(clientId, limit) {
  // 获取申请更新活动
  const applicationActivities = await Application.find({ client: clientId })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .select('name status updatedAt');
  
  // 获取文档上传活动
  const documentActivities = await Document.find({ client: clientId })
    .sort({ uploadedAt: -1 })
    .limit(limit)
    .select('name uploadedAt');
  
  // 合并并排序活动
  const allActivities = [
    ...applicationActivities.map(app => ({
      type: 'application_update',
      name: app.name,
      status: app.status,
      timestamp: app.updatedAt
    })),
    ...documentActivities.map(doc => ({
      type: 'document_upload',
      name: doc.name,
      timestamp: doc.uploadedAt
    }))
  ];
  
  return allActivities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

// [管理员相关辅助函数]
async function getAdminUserStatistics() {
  const userCounts = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);
  
  // 转换为更易用的格式
  const userStats = {
    total: 0,
    consultants: 0,
    clients: 0,
    admins: 0
  };
  
  userCounts.forEach(role => {
    userStats[role._id.toLowerCase() + 's'] = role.count;
    userStats.total += role.count;
  });
  
  return userStats;
}

async function getAdminApplicationStatistics() {
  // 按状态统计申请数量
  const statusCounts = await Application.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  // 转换为更易用的格式
  const statusStats = {};
  statusCounts.forEach(status => {
    statusStats[status._id] = status.count;
  });
  
  return statusStats;
}

async function getAdminRevenueStatistics() {
  // 获取总收入
  const totalRevenue = await Payment.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  
  // 获取月度收入趋势
  const monthlyRevenue = await Payment.aggregate([
    { $group: {
      _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
      amount: { $sum: '$amount' }
    }},
    { $sort: { _id: 1 } }
  ]);
  
  return {
    totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    monthlyRevenue
  };
}

async function getAdminSystemHealth() {
  // 这里会根据实际系统情况进行实现
  // 例如API响应时间、数据库连接状态等
  return {
    status: 'healthy',
    apiResponseTime: 120, // 毫秒
    databaseConnections: 25,
    memoryUsage: 75, // 百分比
    lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000)
  };
} 