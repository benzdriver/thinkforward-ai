const { config } = require('../../config');
const logger = require('../../utils/logger');
const { t } = require('../../utils/i18nHelper');

/**
 * 审核文档内容并提供改进建议
 * @param {string} documentContent - 文档内容
 * @param {string} documentType - 文档类型 (如 "个人陈述", "推荐信", "简历")
 * @param {object} openai - OpenAI实例
 * @param {string} language - 语言 ('en' 或 'zh')
 * @returns {object} 包含审核结果和建议的对象
 */
const reviewDocument = async (documentContent, documentType, openai, language = 'en') => {
  try {
    // 确定要使用的提示词语
    const typeTerms = {
      en: {
        'cover-letter': 'cover letter',
        'personal-statement': 'personal statement',
        'resume': 'resume / CV',
        'reference-letter': 'reference letter',
        'loe': 'letter of explanation'
      },
      zh: {
        'cover-letter': '求职信',
        'personal-statement': '个人陈述',
        'resume': '简历',
        'reference-letter': '推荐信',
        'loe': '解释信'
      }
    };
    
    const docTypeTerm = typeTerms[language][documentType] || documentType;
    
    // 使用i18next获取提示内容
    const systemPrompt = t('prompts:documentReview.systemPrompt', {}, language);
    const userPrompt = t('prompts:documentReview.userPrompt', {
      docType: docTypeTerm,
      content: documentContent
    }, language);
    
    // 调用OpenAI API进行文档审核
    const response = await openai.chat.completions.create({
      model: config.openai.models.chat,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.4,
      max_tokens: 2500
    });
    
    // 提取评论内容
    const reviewContent = response.choices[0].message.content;
    
    // 简单分析评论，提取主要建议（实际实现可能使用更复杂的方法）
    const strengths = [];
    const improvements = [];
    const missing = [];
    
    let currentSection = '';
    
    // 简单解析响应以提取各个部分
    const lines = reviewContent.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // 识别各个部分
      if (trimmedLine.includes('STRENGTHS') || trimmedLine.includes('优势')) {
        currentSection = 'strengths';
        continue;
      } else if (trimmedLine.includes('IMPROVEMENT') || trimmedLine.includes('改进')) {
        currentSection = 'improvements';
        continue;
      } else if (trimmedLine.includes('MISSING') || trimmedLine.includes('缺失')) {
        currentSection = 'missing';
        continue;
      }
      
      // 如果是列表项，添加到相应数组
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
        const point = trimmedLine.substring(1).trim();
        
        if (currentSection === 'strengths' && point) {
          strengths.push(point);
        } else if (currentSection === 'improvements' && point) {
          improvements.push(point);
        } else if (currentSection === 'missing' && point) {
          missing.push(point);
        }
      }
    }
    
    // 返回审核结果
    return {
      documentType,
      review: reviewContent,
      strengths,
      improvements,
      missingElements: missing,
      // 基于改进建议数量的简单评分系统
      overallScore: Math.max(5, 10 - improvements.length - missing.length),
      language
    };
  } catch (error) {
    logger.error('Document review chain error:', error);
    throw error;
  }
};

module.exports = {
  reviewDocument
}; 