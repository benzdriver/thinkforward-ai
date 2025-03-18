const Consultant = require('../../models/User');
const Application = require('../../models/Application');
const { ROLES } = require('../../constants/roles');
const logger = require('../../utils/logger');

/**
 * 获取访客仪表盘概览
 */
exports.getOverview = async (req, res) => {
  try {
    // 获取公开统计数据
    const publicStats = await getPublicStatistics();
    const caseStudies = await getPublicCaseStudies(req, 3); // 传递req对象用于国际化
    
    res.status(200).json({
      success: true,
      data: {
        publicStats,
        caseStudies
      }
    });
  } catch (error) {
    logger.error(`获取访客仪表盘概览失败: ${error.message}`);
    res.status(500).json({
      success: false,
      message: req.t('errors.serverError', '服务器错误'),
      error: error.message
    });
  }
};

/**
 * 获取系统公开统计数据
 */
exports.getPublicStats = async (req, res) => {
  try {
    const stats = await getPublicStatistics();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error(`获取公开统计数据失败: ${error.message}`);
    res.status(500).json({
      success: false,
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

/**
 * 获取公开顾问列表
 */
exports.getPublicConsultantList = async (req, res) => {
  try {
    // 获取推荐顾问列表（公开信息）
    const consultants = await User.find({ role: ROLES.CONSULTANT, isPublicProfile: true })
      .select('name avatar specializations rating languages education experience')
      .limit(10);
    
    res.status(200).json({
      success: true,
      data: consultants
    });
  } catch (error) {
    logger.error(`获取公开顾问列表失败: ${error.message}`);
    res.status(500).json({
      success: false,
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

/**
 * 获取案例研究
 */
exports.getCaseStudies = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const caseStudies = await getPublicCaseStudies(req, limit); // 传递req对象
    
    res.status(200).json({
      success: true,
      data: caseStudies
    });
  } catch (error) {
    logger.error(`获取案例研究失败: ${error.message}`);
    res.status(500).json({
      success: false,
      message: req.t('errors.serverError', '服务器错误')
    });
  }
};

// 辅助函数

async function getPublicStatistics() {
  // 获取系统公开统计数据
  const consultantCount = await User.countDocuments({ role: ROLES.CONSULTANT });
  const successfulApplications = await Application.countDocuments({ status: 'APPROVED' });
  
  return {
    consultantCount,
    successfulApplications,
    countriesServed: 20, // 静态数据或从配置中获取
    satisfactionRate: 96 // 静态数据或从评分系统中计算
  };
}

// 修改函数接收req参数用于国际化
async function getPublicCaseStudies(req, limit = 5) {
  // 这里可以从专门的案例研究集合获取数据
  // 使用国际化函数翻译内容
  return [
    {
      id: '1',
      title: req.t('case_studies.tech_immigration.title', '成功的技术移民案例'),
      program: req.t('case_studies.tech_immigration.program', '联邦技术移民'),
      timeFrame: req.t('case_studies.tech_immigration.timeFrame', '8个月'),
      challenge: req.t('case_studies.tech_immigration.challenge', '申请人IELTS成绩略低，但有强大的技术背景'),
      solution: req.t('case_studies.tech_immigration.solution', '利用AI分析系统找到最佳申请策略，突出技术经验'),
      result: req.t('case_studies.tech_immigration.result', '申请成功获批，节省了2个月处理时间')
    },
    {
      id: '2',
      title: req.t('case_studies.family_reunification.title', '家庭团聚快速处理'),
      program: req.t('case_studies.family_reunification.program', '父母团聚计划'),
      timeFrame: req.t('case_studies.family_reunification.timeFrame', '14个月'),
      challenge: req.t('case_studies.family_reunification.challenge', '复杂的家庭关系证明和健康问题'),
      solution: req.t('case_studies.family_reunification.solution', '前瞻性文档准备和AI辅助健康问题解释'),
      result: req.t('case_studies.family_reunification.result', '成功获批，比平均处理时间快3个月')
    },
    {
      id: '3',
      title: req.t('case_studies.student_pr.title', '留学生转永久居民'),
      program: req.t('case_studies.student_pr.program', '经验类别'),
      timeFrame: req.t('case_studies.student_pr.timeFrame', '6个月'),
      challenge: req.t('case_studies.student_pr.challenge', '工作经验分类和评估问题'),
      solution: req.t('case_studies.student_pr.solution', '详细的工作经验分析和精准的NOC匹配'),
      result: req.t('case_studies.student_pr.result', '一次通过，无需补充材料')
    }
  ].slice(0, limit);
} 