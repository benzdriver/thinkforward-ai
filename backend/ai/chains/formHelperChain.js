const Form = require('../../models/Form');
const config = require('../../config');
const logger = require('../../utils/logger');
const { t } = require('../../utils/i18nHelper');

/**
 * 提供表单字段填写帮助
 * @param {string} formId - 表单ID
 * @param {string} fieldName - 字段名称
 * @param {object} openai - OpenAI实例
 * @param {string} language - 语言 ('en' 或 'zh')
 * @returns {object} 包含字段指导和示例的对象
 */
const provideFormHelp = async (formId, fieldName, openai, language = 'en') => {
  try {
    // 查找表单和字段信息
    const form = await Form.findById(formId);
    
    if (!form) {
      throw new Error('Form not found');
    }
    
    // 查找特定字段
    const field = form.fields.find(f => f.name === fieldName);
    
    if (!field) {
      throw new Error('Field not found in form');
    }
    
    // 使用i18next获取系统提示
    const systemPrompt = t('prompts:formHelper.systemPrompt', {}, language);
    
    // 构建用户提示
    const formPrompt = t('prompts:formHelper.userPrompt', {
      formId: form._id,
      formTitle: form.title,
      formType: form.formType,
      formCategory: form.category || t('common:general', 'General'),
      fieldName: field.name,
      fieldLabel: field.label,
      fieldType: field.type,
      fieldRequired: field.required ? t('common:yes', 'Yes') : t('common:no', 'No'),
      fieldOptions: field.options ? field.options.join(', ') : '',
      fieldHelp: field.helpText || ''
    }, language);
    
    // 调用OpenAI API获取字段填写帮助
    const response = await openai.chat.completions.create({
      model: config.openai.models.chat,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: formPrompt }
      ],
      temperature: 0.5,
      max_tokens: 1000
    });
    
    const helpText = response.choices[0].message.content;
    
    // 简单解析响应以提取各部分
    let purpose = '';
    let instructions = '';
    let examples = [];
    let mistakes = [];
    let implications = '';
    
    let currentSection = '';
    const lines = helpText.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      if (trimmedLine.match(/^1\..*purpose/i) || trimmedLine.match(/^目的/)) {
        currentSection = 'purpose';
        continue;
      } else if (trimmedLine.match(/^2\..*how to/i) || trimmedLine.match(/^如何填写/)) {
        currentSection = 'instructions';
        continue;
      } else if (trimmedLine.match(/^3\..*example/i) || trimmedLine.match(/^示例/)) {
        currentSection = 'examples';
        continue;
      } else if (trimmedLine.match(/^4\..*mistake/i) || trimmedLine.match(/^常见错误/)) {
        currentSection = 'mistakes';
        continue;
      } else if (trimmedLine.match(/^5\..*impact/i) || trimmedLine.match(/^影响/)) {
        currentSection = 'implications';
        continue;
      }
      
      if (currentSection === 'purpose' && trimmedLine && !trimmedLine.startsWith('2.')) {
        purpose += ' ' + trimmedLine;
      } else if (currentSection === 'instructions' && trimmedLine && !trimmedLine.startsWith('3.')) {
        instructions += ' ' + trimmedLine;
      } else if (currentSection === 'examples' && trimmedLine && !trimmedLine.startsWith('4.')) {
        if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
          examples.push(trimmedLine.substring(1).trim());
        } else if (trimmedLine) {
          examples.push(trimmedLine);
        }
      } else if (currentSection === 'mistakes' && trimmedLine && !trimmedLine.startsWith('5.')) {
        if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
          mistakes.push(trimmedLine.substring(1).trim());
        } else if (trimmedLine) {
          mistakes.push(trimmedLine);
        }
      } else if (currentSection === 'implications' && trimmedLine) {
        implications += ' ' + trimmedLine;
      }
    }
    
    // 返回结构化的字段帮助
    return {
      fieldName,
      fieldLabel: field.label,
      formTitle: form.title,
      formType: form.formType,
      helpText,
      structured: {
        purpose: purpose.trim(),
        instructions: instructions.trim(),
        examples: examples.filter(e => e),
        commonMistakes: mistakes.filter(m => m),
        implications: implications.trim()
      },
      language
    };
  } catch (error) {
    logger.error('Form helper chain error:', error);
    throw error;
  }
};

module.exports = {
  provideFormHelp
}; 