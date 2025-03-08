const AiAssessment = require('../models/AiAssessment');
const Client = require('../models/Client');
const User = require('../models/User');
const AIService = require('../services/aiService');
const PDFGenerator = require('../utils/pdfGenerator');
const logger = require('../utils/logger');
const { t } = require('../utils/i18nHelper');

// 创建新的评估
exports.createAssessment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { clientId } = req.body;
    const language = req.language || 'en';
    
    // 检查客户资料是否存在并归属当前用户
    const client = await Client.findById(clientId).populate('user');
    
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client profile not found')
      });
    }
    
    if (client.user._id.toString() !== userId.toString() && 
        req.user.role !== 'Admin' && 
        (!client.consultant || client.consultant.toString() !== userId.toString())) {
      return res.status(403).json({
        message: req.t('errors.notAuthorized', 'Not authorized to access this client profile')
      });
    }
    
    // 执行评估
    const result = await AIService.performInitialAssessment(client, userId, language);
    
    // 返回结果
    res.status(201).json({
      message: req.t('assessment.created', 'Assessment created successfully'),
      assessment: result
    });
  } catch (error) {
    logger.error('Assessment creation error:', error);
    res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 获取评估列表
exports.getAssessments = async (req, res) => {
  try {
    const userId = req.user._id;
    const { clientId } = req.query;
    
    let query = { user: userId };
    
    // 如果指定了客户ID，筛选该客户的评估
    if (clientId) {
      // 检查客户归属权
      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(404).json({
          message: req.t('errors.clientNotFound', 'Client profile not found')
        });
      }
      
      if (client.user.toString() !== userId.toString() && 
          req.user.role !== 'Admin' && 
          (!client.consultant || client.consultant.toString() !== userId.toString())) {
        return res.status(403).json({
          message: req.t('errors.notAuthorized', 'Not authorized to access this client')
        });
      }
      
      query.profile = clientId;
    }
    
    // 获取评估列表，按创建时间降序排列
    const assessments = await AiAssessment.find(query)
      .populate('profile', 'firstName lastName email citizenship')
      .sort({ createdAt: -1 });
    
    res.json({
      assessments
    });
  } catch (error) {
    logger.error('Get assessments error:', error);
    res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 获取单个评估详情
exports.getAssessment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    
    // 查找评估
    const assessment = await AiAssessment.findById(id)
      .populate('profile', 'firstName lastName email citizenship currentCountry age highestEducation workExperience languageProficiency')
      .populate('user', 'firstName lastName email');
      
    if (!assessment) {
      return res.status(404).json({
        message: req.t('errors.assessmentNotFound', 'Assessment not found')
      });
    }
    
    // 检查权限
    if (assessment.user._id.toString() !== userId.toString() && 
        req.user.role !== 'Admin' && 
        (!assessment.profile.consultant || assessment.profile.consultant.toString() !== userId.toString())) {
      return res.status(403).json({
        message: req.t('errors.notAuthorized', 'Not authorized to access this assessment')
      });
    }
    
    // 获取相关聊天记录
    const chat = await AiChat.findById(assessment.chat).select('messages title');
    
    res.json({
      assessment,
      chat
    });
  } catch (error) {
    logger.error('Get assessment error:', error);
    res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 更新评估
exports.updateAssessment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { notes, status } = req.body;
    
    // 查找评估
    const assessment = await AiAssessment.findById(id);
      
    if (!assessment) {
      return res.status(404).json({
        message: req.t('errors.assessmentNotFound', 'Assessment not found')
      });
    }
    
    // 检查权限
    if (assessment.user.toString() !== userId.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({
        message: req.t('errors.notAuthorized', 'Not authorized to update this assessment')
      });
    }
    
    // 更新字段
    if (notes !== undefined) assessment.consultantNotes = notes;
    if (status !== undefined) assessment.status = status;
    
    assessment.updatedAt = Date.now();
    await assessment.save();
    
    res.json({
      message: req.t('assessment.updated', 'Assessment updated successfully'),
      assessment
    });
  } catch (error) {
    logger.error('Update assessment error:', error);
    res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 删除评估
exports.deleteAssessment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    
    // 查找评估
    const assessment = await AiAssessment.findById(id);
      
    if (!assessment) {
      return res.status(404).json({
        message: req.t('errors.assessmentNotFound', 'Assessment not found')
      });
    }
    
    // 检查权限
    if (assessment.user.toString() !== userId.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({
        message: req.t('errors.notAuthorized', 'Not authorized to delete this assessment')
      });
    }
    
    // 删除评估
    await AiAssessment.deleteOne({ _id: id });
    
    res.json({
      message: req.t('assessment.deleted', 'Assessment deleted successfully')
    });
  } catch (error) {
    logger.error('Delete assessment error:', error);
    res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 生成评估PDF
exports.generatePDF = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const language = req.language || 'en';
    
    // 查找评估
    const assessment = await AiAssessment.findById(id)
      .populate('profile', 'firstName lastName email citizenship currentCountry age highestEducation workExperience languageProficiency')
      .populate('user', 'firstName lastName email company');
      
    if (!assessment) {
      return res.status(404).json({
        message: req.t('errors.assessmentNotFound', 'Assessment not found')
      });
    }
    
    // 检查权限
    if (assessment.user._id.toString() !== userId.toString() && 
        req.user.role !== 'Admin' && 
        (!assessment.profile.consultant || assessment.profile.consultant.toString() !== userId.toString())) {
      return res.status(403).json({
        message: req.t('errors.notAuthorized', 'Not authorized to access this assessment')
      });
    }
    
    // 生成PDF (假设PDFGenerator是一个工具类)
    const pdfBuffer = await PDFGenerator.generateAssessmentPDF(assessment, language);
    
    // 设置响应头
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=assessment-${assessment._id}.pdf`);
    
    // 发送PDF
    res.send(pdfBuffer);
    
  } catch (error) {
    logger.error('Generate PDF error:', error);
    res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 重新生成评估
exports.regenerateAssessment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const language = req.language || assessment.language || 'en';
    
    // 查找评估
    const assessment = await AiAssessment.findById(id);
      
    if (!assessment) {
      return res.status(404).json({
        message: req.t('errors.assessmentNotFound', 'Assessment not found')
      });
    }
    
    // 检查权限
    if (assessment.user.toString() !== userId.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({
        message: req.t('errors.notAuthorized', 'Not authorized to regenerate this assessment')
      });
    }
    
    // 查找客户资料
    const client = await Client.findById(assessment.profile);
    if (!client) {
      return res.status(404).json({
        message: req.t('errors.clientNotFound', 'Client profile not found')
      });
    }
    
    // 重新执行评估
    const result = await AIService.performInitialAssessment(client, userId, language);
    
    res.json({
      message: req.t('assessment.regenerated', 'Assessment regenerated successfully'),
      assessment: result
    });
  } catch (error) {
    logger.error('Regenerate assessment error:', error);
    res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
}; 