const { Document } = require('langchain/document');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { config } = require('../../config/ai');
const path = require('path');
const fs = require('fs');
const logger = require('../../utils/logger');
const { t } = require('../../utils/i18nHelper');

// 加载知识库
const loadRegulatoryDocs = () => {
  try {
    const docsPath = path.join(__dirname, '../../ai/knowledge');
    const files = fs.readdirSync(docsPath);
    let documents = [];
    
    for (const file of files) {
      if (file.endsWith('.txt')) {
        const content = fs.readFileSync(path.join(docsPath, file), 'utf8');
        documents.push({
          content,
          metadata: { source: file }
        });
      }
    }
    
    return documents;
  } catch (error) {
    logger.error('Error loading regulatory docs:', error);
    return [];
  }
};

// 对资料进行客户化分析
const analyzeProfile = async (profile, openai, embeddings, language = 'en') => {
  try {
    // 构建资料摘要
    let profileSummary = '';
    
    // 基本信息
    profileSummary += `Personal Information:\n`;
    profileSummary += `Name: ${profile.firstName} ${profile.lastName}\n`;
    profileSummary += `Age: ${profile.age || 'Not provided'}\n`;
    profileSummary += `Country of Citizenship: ${profile.citizenship || 'Not provided'}\n`;
    profileSummary += `Current Country: ${profile.currentCountry || 'Not provided'}\n`;
    profileSummary += `Marital Status: ${profile.maritalStatus || 'Not provided'}\n\n`;
    
    // 教育背景
    const education = profile.education || [];
    if (education.length > 0) {
      profileSummary += `Education:\n`;
      education.forEach(edu => {
        profileSummary += `- ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution} (${edu.country}), ${edu.startDate} to ${edu.endDate}\n`;
      });
      profileSummary += '\n';
    }
    
    // 工作经验
    const workExperience = profile.workExperience || [];
    if (workExperience.length > 0) {
      profileSummary += `Work Experience:\n`;
      workExperience.forEach(work => {
        profileSummary += `- ${work.jobTitle} at ${work.employer} (${work.country}), ${work.startDate} to ${work.endDate}, ${work.hoursPerWeek} hours/week\n`;
      });
      profileSummary += '\n';
    }
    
    // 语言测试
    const languageTests = profile.languageTests || [];
    if (languageTests.length > 0) {
      profileSummary += `Language Tests:\n`;
      languageTests.forEach(test => {
        profileSummary += `- ${test.language} (${test.testType}): Reading ${test.reading}, Writing ${test.writing}, Listening ${test.listening}, Speaking ${test.speaking}\n`;
      });
      profileSummary += '\n';
    }
    
    // 加载相关知识库文档
    const regulatoryDocs = loadRegulatoryDocs();
    
    // 对文档进行分割，以便进行相似性搜索
    const relevantDocs = regulatoryDocs; // 简化版本，应该使用相似性搜索
    
    // 使用i18next获取提示内容
    const systemPrompt = t('prompts:assessment.systemPrompt', {}, language);
    const analysisPrompt = t('prompts:assessment.analysisPrompt', { profile: profileSummary }, language);
    
    // 获取基于分析提示的AI回复
    const response = await openai.chat.completions.create({
      model: config.openai.models.chat,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: analysisPrompt }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });
    
    return {
      profileSummary,
      assessment: response.choices[0].message.content
    };
  } catch (error) {
    logger.error('Assessment analysis error:', error);
    throw new Error('Failed to analyze profile: ' + error.message);
  }
};

module.exports = {
  analyzeProfile
}; 