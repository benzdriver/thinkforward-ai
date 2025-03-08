const { t } = require('../../utils/i18nHelper');
const chai = require('chai');
const expect = chai.expect;

describe('国际化工具测试', () => {
  it('应该返回英语文本', () => {
    const result = t('assessment.report.title', 'Default Title', {}, 'en');
    expect(result).to.equal('Immigration Assessment Report');
  });

  it('应该返回中文文本', () => {
    const result = t('assessment.report.title', 'Default Title', {}, 'zh');
    expect(result).to.equal('移民评估报告');
  });

  it('应该处理带变量的模板', () => {
    const result = t('prompts.documentReview.userPrompt', 'Please review my {{type}}', { type: 'Resume' }, 'zh');
    expect(result).to.include('请审核我的Resume');
  });

  it('当缺少键时应返回默认值', () => {
    const result = t('nonexistent.key', 'Default Value', {}, 'en');
    expect(result).to.equal('Default Value');
  });

  it('应该处理多级嵌套键', () => {
    const result = t('assessment.eligibility.high', 'High', {}, 'zh');
    expect(result).to.equal('高');
  });
}); 