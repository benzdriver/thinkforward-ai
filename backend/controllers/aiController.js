const AIService = require('../services/aiService');
const AiChat = require('../models/Chat');
const AiAssessment = require('../models/AiAssessment');
const Client = require('../models/Client');
const Form = require('../models/Form');
const { t } = require('../utils/i18nHelper');
const logger = require('../utils/logger');

// 创建新对话
exports.createChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { language = 'en' } = req.body;
    
    const chat = await AIService.createChat(userId, language);
    
    return res.status(201).json({
      message: req.t('ai.chatCreated', 'Chat created successfully'),
      chat
    });
  } catch (error) {
    logger.error('Create chat error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 发送消息给AI
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, message, language = req.language || 'en' } = req.body;
    const userId = req.user._id;
    
    if (!message) {
      return res.status(400).json({
        message: req.t('errors.invalidRequest', 'Message is required')
      });
    }
    
    // 检查聊天是否存在并归属于当前用户
    const chat = await AiChat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({
        message: req.t('errors.chatNotFound', 'Chat not found')
      });
    }
    
    if (chat.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: req.t('errors.notAuthorized', 'Not authorized to access this chat')
      });
    }
    
    // 检查消息限制
    const userMessageCount = await AiChat.aggregate([
      { $match: { user: userId } },
      { $unwind: '$messages' },
      { $match: { 'messages.role': 'user' } },
      { $count: 'total' }
    ]);
    
    const totalMessages = userMessageCount.length > 0 ? userMessageCount[0].total : 0;
    const messageLimit = 100; // 从用户订阅获取限制
    
    if (messageLimit > 0 && totalMessages >= messageLimit) {
      return res.status(403).json({
        message: req.t('ai.limitReached', 'You have reached your message limit. Please upgrade your subscription for unlimited access.')
      });
    }
    
    // 发送消息
    const response = await AIService.sendMessage(chatId, message, language);
    
    return res.status(200).json({
      message: req.t('ai.messageSent', 'Message sent successfully'),
      response: response.message,
      chatId: response.chatId
    });
  } catch (error) {
    logger.error('Send message error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 获取聊天历史
exports.getChatHistory = async (req, res) => {
  try {
    const history = await AIService.getChatHistory(req.user._id);
    
    return res.json({
      history
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 获取单个聊天
exports.getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;
    
    const chat = await AiChat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({
        message: req.t('errors.chatNotFound', 'Chat not found')
      });
    }
    
    if (chat.user.toString() !== userId.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({
        message: req.t('errors.notAuthorized', 'Not authorized to access this chat')
      });
    }
    
    return res.status(200).json({
      chat
    });
  } catch (error) {
    logger.error('Get chat by ID error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 执行初始评估
exports.performInitialAssessment = async (req, res) => {
  try {
    const { profile } = req.body;
    const language = req.language || 'en';
    
    if (!profile) {
      return res.status(400).json({
        message: req.t('errors.invalidRequest', 'Profile data is required')
      });
    }
    
    const assessment = await AIService.performInitialAssessment(
      profile,
      req.user._id,
      language
    );
    
    return res.json({
      assessment
    });
  } catch (error) {
    console.error('Perform assessment error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 获取表单帮助
exports.getFormHelp = async (req, res) => {
  try {
    const { formId, fieldId, currentValues } = req.body;
    const language = req.language || 'en';
    
    if (!formId || !fieldId) {
      return res.status(400).json({
        message: req.t('errors.invalidRequest', 'Form ID and field ID are required')
      });
    }
    
    const help = await AIService.getFormCompletionHelp(
      formId,
      fieldId,
      currentValues || {},
      req.user._id,
      language
    );
    
    return res.json({
      suggestion: help.suggestion,
      chatId: help.chatId
    });
  } catch (error) {
    console.error('Get form help error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 审核文档
exports.reviewDocument = async (req, res) => {
  try {
    const userId = req.user._id;
    const { documentContent, documentType } = req.body;
    const language = req.language || 'en';
    
    if (!documentContent || !documentType) {
      return res.status(400).json({
        message: req.t('errors.invalidRequest', 'Document content and type are required')
      });
    }
    
    const review = await AIService.reviewDocument(documentContent, documentType, userId, language);
    
    return res.status(200).json({
      message: req.t('ai.documentReviewed', 'Document reviewed successfully'),
      review
    });
  } catch (error) {
    logger.error('Document review error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 获取表单字段帮助
exports.getFormFieldHelp = async (req, res) => {
  try {
    const userId = req.user._id;
    const { formId, fieldName } = req.body;
    const language = req.language || 'en';
    
    if (!formId || !fieldName) {
      return res.status(400).json({
        message: req.t('errors.invalidRequest', 'Form ID and field name are required')
      });
    }
    
    const form = await Form.findById(formId);
    
    if (!form) {
      return res.status(404).json({
        message: req.t('errors.formNotFound', 'Form not found')
      });
    }
    
    const field = form.fields.find(f => f.name === fieldName);
    
    if (!field) {
      return res.status(404).json({
        message: req.t('errors.fieldNotFound', 'Field not found in form')
      });
    }
    
    const guidance = await AIService.provideFormHelp(formId, fieldName, userId, language);
    
    return res.status(200).json({
      message: req.t('ai.helpProvided', 'Field help provided'),
      guidance
    });
  } catch (error) {
    logger.error('Form field help error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 分析文件
exports.analyzeFile = async (req, res) => {
  try {
    const userId = req.user._id;
    const file = req.file;
    const { fileType } = req.body;
    const language = req.language || 'en';
    
    if (!file) {
      return res.status(400).json({
        message: req.t('errors.noFile', 'No file uploaded')
      });
    }
    
    if (!fileType) {
      return res.status(400).json({
        message: req.t('errors.invalidRequest', 'File type is required')
      });
    }
    
    // 文件处理和分析逻辑
    // ...
    
    return res.status(200).json({
      message: req.t('ai.fileAnalyzed', 'File analyzed successfully'),
      analysis: {
        summary: 'File analysis summary',
        recommendations: []
      }
    });
  } catch (error) {
    logger.error('File analysis error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 处理旧版API请求 (兼容现有前端)
exports.handleLegacyChat = async (req, res) => {
  try {
    const { message, userRole, isSubscribed } = req.body;
    const userId = req.user ? req.user._id : null;
    const language = req.language || 'en';
    
    if (!message) {
      return res.status(400).json({
        message: req.t('errors.invalidRequest', 'Message is required')
      });
    }
    
    // 如果用户已登录，使用用户的聊天记录
    if (userId) {
      // 查找用户最近的通用聊天，如果没有则创建新的
      let chat = await AiChat.findOne({
        user: userId,
        chatType: 'General'
      }).sort({ updatedAt: -1 });
      
      if (!chat) {
        chat = await AIService.createChat(userId, language);
      }
      
      const response = await AIService.sendMessage(chat._id, message, language);
      
      return res.json({
        response: response.message,
        chatId: response.chatId
      });
    } 
    // 未登录用户不保存聊天记录，直接调用OpenAI
    else {
      // 这里应该使用一个简化版的AI服务方法，不保存到数据库
      // 简化版实现:
      const { OpenAI } = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      // 使用i18next获取系统提示
      const systemPromptContent = t('prompts:chat.guestSystemPrompt', {}, language);
      
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: systemPromptContent
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
      });
      
      return res.json({
        response: completion.choices[0].message.content
      });
    }
  } catch (error) {
    console.error('Legacy chat error:', error);
    return res.status(500).json({
      response: req.t('errors.serverError', 'Sorry, an error occurred. Please try again later.')
    });
  }
};

// 获取用户的所有聊天
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const chats = await AiChat.find({ user: userId })
      .sort({ updatedAt: -1 })
      .select('title updatedAt language messages');
    
    return res.status(200).json({
      chats
    });
  } catch (error) {
    logger.error('Get user chats error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 删除聊天
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;
    
    const chat = await AiChat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({
        message: req.t('errors.chatNotFound', 'Chat not found')
      });
    }
    
    if (chat.user.toString() !== userId.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({
        message: req.t('errors.notAuthorized', 'Not authorized to delete this chat')
      });
    }
    
    await chat.remove();
    
    return res.status(200).json({
      message: req.t('ai.chatDeleted', 'Chat deleted successfully')
    });
  } catch (error) {
    logger.error('Delete chat error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 创建评估
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
    
    if (client.user._id.toString() !== userId.toString() && req.user.role !== 'Admin' && 
        (!client.consultant || client.consultant.toString() !== userId.toString())) {
      return res.status(403).json({
        message: req.t('errors.notAuthorized', 'Not authorized to access this client profile')
      });
    }
    
    // 执行评估
    const result = await AIService.performInitialAssessment(client, userId, language);
    
    return res.status(201).json({
      message: req.t('ai.assessmentCreated', 'Assessment created successfully'),
      assessment: result.assessment,
      chatId: result.chat._id
    });
  } catch (error) {
    logger.error('Create assessment error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 获取用户评估
exports.getUserAssessments = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const assessments = await AiAssessment.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('client', 'firstName lastName')
      .select('title createdAt eligibilityScore programs strengths weaknesses');
    
    return res.status(200).json({
      assessments
    });
  } catch (error) {
    logger.error('Get user assessments error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
};

// 获取特定评估
exports.getAssessmentById = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const userId = req.user._id;
    
    const assessment = await AiAssessment.findById(assessmentId)
      .populate('client', 'firstName lastName citizenship age education workExperience languageTests');
    
    if (!assessment) {
      return res.status(404).json({
        message: req.t('errors.assessmentNotFound', 'Assessment not found')
      });
    }
    
    if (assessment.user.toString() !== userId.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({
        message: req.t('errors.notAuthorized', 'Not authorized to access this assessment')
      });
    }
    
    return res.status(200).json({
      assessment
    });
  } catch (error) {
    logger.error('Get assessment by ID error:', error);
    return res.status(500).json({
      message: req.t('errors.serverError', 'Server error')
    });
  }
}; 