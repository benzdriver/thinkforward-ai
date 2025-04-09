const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const AiChat = require('../models/AiChat');
const AiAssessment = require('../models/AiAssessment');
const config = require('../config');
const logger = require('../utils/logger');
const { t } = require('../utils/i18nHelper');
const { analyzeProfile } = require('../ai/chains/assessmentChain');
const { reviewDocument } = require('../ai/chains/documentReviewChain');
const { provideFormHelp } = require('../ai/chains/formHelperChain');

class AIService {
  constructor() {
    try {
      this.openai = new OpenAI({
        apiKey: config.openai.apiKey || 'dummy-key-for-development'
      });
    } catch (error) {
      console.warn('Failed to initialize OpenAI client:', error.message);
      this.openai = {
        chat: {
          completions: {
            create: async () => ({
              choices: [{ message: { content: 'This is a fallback response from the mock OpenAI client.' } }]
            })
          }
        }
      };
    }
    
    this.models = {
      chat: config.openai.models.chat,
      embedding: config.openai.models.embedding
    };
    
    // 加载系统提示
    this.prompts = {
      en: {
        general: this._loadPrompt('en', 'general'),
        assessment: this._loadPrompt('en', 'assessment'),
        formHelper: this._loadPrompt('en', 'form-helper'),
        documentReview: this._loadPrompt('en', 'document-review')
      },
      zh: {
        general: this._loadPrompt('zh', 'general'),
        assessment: this._loadPrompt('zh', 'assessment'),
        formHelper: this._loadPrompt('zh', 'form-helper'),
        documentReview: this._loadPrompt('zh', 'document-review')
      }
    };
  }
  
  // 加载提示文件
  _loadPrompt(language, promptName) {
    try {
      const promptPath = path.join(config.ai.promptsDir, language, `${promptName}.txt`);
      logger.info('Loading prompt from:', promptPath); // 添加日志以便调试
      
      if (fs.existsSync(promptPath)) {
        return fs.readFileSync(promptPath, 'utf8');
      } else {
        logger.warn(`Prompt file not found: ${promptPath}`);
        return '';
      }
    } catch (error) {
      logger.error(`Error loading prompt ${language}/${promptName}:`, error);
      return '';
    }
  }
  
  // 检查用户消息限制
  async _checkMessageLimit(userId, subscription) {
    // 获取用户订阅对应的消息限制
    const limit = config.ai.messageLimit[subscription || 'free'];
    
    // 无限制情况
    if (limit < 0) {
      return { withinLimit: true };
    }
    
    // 获取用户本月消息数
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const messageCount = await AiChat.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $project: {
          messageCount: { $size: '$messages' }
        }
      },
      {
        $group: {
          _id: null,
          totalMessages: { $sum: '$messageCount' }
        }
      }
    ]);
    
    const totalMessages = messageCount.length > 0 ? messageCount[0].totalMessages : 0;
    
    return {
      withinLimit: totalMessages < limit,
      totalMessages,
      limit
    };
  }
  
  // 创建新聊天
  async createChat(userId, language = 'en') {
    try {
      const title = t('ai.newChat', 'New Chat', {}, language);
      
      const chat = new AiChat({
        user: userId,
        title: title,
        language: language,
        messages: []
      });
      
      await chat.save();
      return chat;
    } catch (error) {
      logger.error('Create chat error:', error);
      throw new Error(t('errors.chatCreateFailed', 'Failed to create chat', {}, language));
    }
  }
  
  // 发送消息
  async sendMessage(chatId, message, language = 'en') {
    try {
      // 查找聊天
      const chat = await AiChat.findById(chatId);
      
      if (!chat) {
        throw new Error('Chat not found');
      }
      
      // 将用户消息添加到聊天记录
      chat.messages.push({
        role: 'user',
        content: message
      });
      
      // 获取适当的系统提示
      const systemPrompt = this.prompts[language].general;
      
      // 准备消息历史
      const messageHistory = chat.messages.slice(-10); // 最多使用最近的10条消息
      
      // 构建OpenAI API请求
      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...messageHistory
      ];
      
      // 调用OpenAI API
      const completion = await this.openai.chat.completions.create({
        model: this.models.chat,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: config.openai.maxTokens.chat || 1500
      });
      
      // 获取AI回复
      const aiResponse = completion.choices[0].message.content;
      
      // 将AI响应添加到聊天记录
      chat.messages.push({
        role: 'assistant',
        content: aiResponse
      });
      
      // 如果聊天还没有标题，根据内容生成标题
      if (chat.messages.length <= 3 && (!chat.title || chat.title.includes('New Chat'))) {
        const titlePrompt = t('ai:generateTitle', { message }, language);
        
        const titleCompletion = await this.openai.chat.completions.create({
          model: this.models.chat,
          messages: [
            { role: 'system', content: t('ai:titleSystem', {}, language) },
            { role: 'user', content: titlePrompt }
          ],
          temperature: 0.3,
          max_tokens: 60
        });
        
        chat.title = titleCompletion.choices[0].message.content.replace(/^"/, '').replace(/"$/, '');
      }
      
      // 更新最后活动时间
      chat.updatedAt = new Date();
      
      await chat.save();
      
      return {
        message: aiResponse,
        chatId: chat._id
      };
    } catch (error) {
      logger.error('Send message error:', error);
      throw error;
    }
  }
  
  // 执行初始评估
  async performInitialAssessment(profile, userId, language = 'en') {
    try {
      // 创建专用评估聊天
      const chat = await this.createChat(userId, language);
      
      // 使用分析链处理资料
      const analysis = await analyzeProfile(profile, this.openai, null, language);
      
      // 获取系统提示
      const systemPrompt = this.prompts[language].assessment;
      
      // 使用i18next获取用户提示
      const assessmentPrompt = t('prompts:assessment.userPrompt', {
        profileSummary: analysis.profileSummary
      }, language);
      
      // 调用OpenAI API进行评估
      const response = await this.openai.chat.completions.create({
        model: this.models.chat,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: assessmentPrompt }
        ],
        temperature: 0.4,
        max_tokens: 3500
      });
      
      // 保存评估对话
      chat.title = t('prompts:assessment.reportTitle', {}, language);
      chat.messages.push(
        { role: 'user', content: assessmentPrompt },
        { role: 'assistant', content: response.choices[0].message.content }
      );
      
      await chat.save();
      
      // 分析AI回复并创建结构化评估
      // 这里应该有更复杂的逻辑来解析AI回复
      // 简化版:
      const eligibilityFactors = [
        { 
          factor: t('prompts:assessment.factors.age', {}, language), 
          score: 75, 
          assessment: t('prompts:assessment.factorAssessments.ageGood', {}, language)
        },
        { 
          factor: t('prompts:assessment.factors.education', {}, language), 
          score: 80, 
          assessment: t('prompts:assessment.factorAssessments.educationGood', {}, language)
        },
        { 
          factor: t('prompts:assessment.factors.workExperience', {}, language), 
          score: 65, 
          assessment: t('prompts:assessment.factorAssessments.workNeedsImprovement', {}, language)
        },
        { 
          factor: t('prompts:assessment.factors.languageProficiency', {}, language), 
          score: 70, 
          assessment: t('prompts:assessment.factorAssessments.languageBasic', {}, language)
        }
      ];
      
      // 创建并保存评估记录
      const assessment = new AiAssessment({
        user: userId,
        profile: profile._id,
        overallScore: 70, // 简化的计算
        eligibilityFactors,
        recommendedPrograms: [
          { name: 'Express Entry', score: 75, notes: 'Good match based on profile' },
          { name: 'Provincial Nominee Program', score: 68, notes: 'Consider for specific provinces' }
        ],
        keyStrengths: [
          'Education credentials',
          'Age factor'
        ],
        improvementAreas: [
          'Work experience relevance',
          'Language proficiency'
        ],
        rawAssessment: response.choices[0].message.content,
        chat: chat._id,
        language
      });
      
      await assessment.save();
      
      return {
        assessment,
        chat
      };
    } catch (error) {
      logger.error('Assessment error:', error);
      throw error;
    }
  }
  
  // 提供表单帮助
  async provideFormHelp(formId, fieldName, userId, language = 'en') {
    try {
      const fieldHelp = await provideFormHelp(formId, fieldName, this.openai, language);
      
      // 系统提示 
      const systemPrompt = this.prompts[language].formHelper;
      
      // 使用i18next获取用户提示
      const userPrompt = t('prompts:formHelper.userPrompt', {
        formId,
        fieldName
      }, language);
      
      // 获取表单帮助
      const response = await this.openai.chat.completions.create({
        model: this.models.chat,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 1500
      });
      
      return {
        fieldName,
        formId,
        guidance: response.choices[0].message.content
      };
    } catch (error) {
      logger.error('Form help error:', error);
      throw error;
    }
  }
  
  // 审核文档
  async reviewDocument(documentContent, documentType, userId, language = 'en') {
    try {
      // 创建聊天会话
      const chat = await this.createChat(userId, language);
      
      // 使用文档审核链
      const review = await reviewDocument(documentContent, documentType, this.openai, language);
      
      // 保存到聊天记录
      const docTypeNames = {
        'cover-letter': t('document.coverLetter', 'Cover Letter', {}, language),
        'personal-statement': t('document.personalStatement', 'Personal Statement', {}, language),
        'resume': t('document.resume', 'Resume/CV', {}, language),
        'reference-letter': t('document.referenceLetter', 'Reference Letter', {}, language),
        'loe': t('document.letterOfExplanation', 'Letter of Explanation', {}, language)
      };
      
      const docTypeName = docTypeNames[documentType] || documentType;
      
      chat.title = t('ai.documentReview', '{{type}} Review', { type: docTypeName }, language);
      chat.messages.push(
        { role: 'user', content: t('ai.reviewRequest', 'Please review my {{type}}:\n\n{{content}}', { 
          type: docTypeName, 
          content: documentContent 
        }, language) },
        { role: 'assistant', content: review.feedback }
      );
      
      await chat.save();
      
      return {
        review,
        chatId: chat._id
      };
    } catch (error) {
      logger.error('Document review error:', error);
      throw new Error(t('errors.documentReviewFailed', 'Failed to review document', {}, language));
    }
  }
}

module.exports = new AIService();  