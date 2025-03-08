const { config } = require('../../config');
const logger = require('../../utils/logger');
const fs = require('fs');
const path = require('path');
const { t } = require('../../utils/i18nHelper');

/**
 * 加载提示模板
 * @param {string} language - 语言代码('en'或'zh')
 * @param {string} promptName - 提示模板名称
 * @returns {string} 提示模板内容
 */
const loadPrompt = (language, promptName) => {
  try {
    const promptPath = path.join(config.ai.promptsDir, language, `${promptName}.txt`);
    return fs.readFileSync(promptPath, 'utf8');
  } catch (error) {
    logger.error(`Error loading prompt ${language}/${promptName}:`, error);
    // 如果找不到指定语言的提示，则回退到英语
    if (language !== 'en') {
      return loadPrompt('en', promptName);
    }
    return '';
  }
};

/**
 * 处理用户消息并生成AI回复
 * @param {Array} messages - 对话历史消息
 * @param {Object} userProfile - 用户资料信息(可选)
 * @param {Object} openai - OpenAI实例
 * @param {string} language - 对话语言('en'或'zh')
 * @returns {string} AI回复
 */
const generateChatResponse = async (messages, userProfile, openai, language = 'en') => {
  try {
    // 加载适合的系统提示
    const systemPrompt = t('prompts:chat.systemPrompt', {}, language);
    
    // 准备消息历史 (最多取最近10条)
    const recentMessages = messages.slice(-10);
    
    // 如果有用户资料，添加到上下文
    let finalSystemPrompt = systemPrompt;
    
    if (userProfile) {
      // 使用i18next获取资料上下文模板
      const profileContext = t('prompts:chat.profileContext', {
        citizenship: userProfile.citizenship || t('common:notSpecified', 'Not specified', { lng: language }),
        location: userProfile.currentCountry || t('common:notSpecified', 'Not specified', { lng: language }),
        age: userProfile.age || t('common:notSpecified', 'Not specified', { lng: language }),
        education: userProfile.highestEducation || t('common:notSpecified', 'Not specified', { lng: language }),
        goal: userProfile.immigrationGoal || t('common:notSpecified', 'Not specified', { lng: language })
      }, language);
      
      finalSystemPrompt = `${systemPrompt}\n\n${profileContext}`;
    }
    
    // 构建消息数组
    const chatMessages = [
      { role: 'system', content: finalSystemPrompt },
      ...recentMessages
    ];
    
    // 调用OpenAI API生成响应
    const response = await openai.chat.completions.create({
      model: config.openai.models.chat,
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 1000
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    logger.error('Chat response generation error:', error);
    throw error;
  }
};

/**
 * 分析用户查询意图
 * @param {string} query - 用户查询
 * @param {Object} openai - OpenAI实例
 * @param {string} language - 语言('en'或'zh')
 * @returns {Object} 分析结果包含意图和实体
 */
const analyzeIntent = async (query, openai, language = 'en') => {
  try {
    // 使用i18next获取意图分析提示
    const intentPrompt = t('prompts:chat.intentAnalysis', {
      query
    }, language);
    
    // 调用OpenAI API分析意图
    const response = await openai.chat.completions.create({
      model: config.openai.models.chat,
      messages: [
        { 
          role: 'system', 
          content: 'You analyze immigration queries to determine user intent and extract key entities. Respond only with JSON.' 
        },
        { role: 'user', content: intentPrompt }
      ],
      temperature: 0.2,
      max_tokens: 600,
      response_format: { type: "json_object" }
    });
    
    try {
      // 解析JSON响应
      return JSON.parse(response.choices[0].message.content);
    } catch (e) {
      logger.error('Error parsing intent analysis JSON:', e);
      // 返回基本结构如果解析失败
      return {
        primaryIntent: "unknown",
        pathwayOfInterest: null,
        keyEntities: [],
        stage: "unknown",
        questions: []
      };
    }
  } catch (error) {
    logger.error('Intent analysis error:', error);
    throw error;
  }
};

module.exports = {
  generateChatResponse,
  analyzeIntent,
  loadPrompt
}; 