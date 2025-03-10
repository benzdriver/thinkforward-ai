/**
 * i18n 模拟工具
 * 提供一个简单的翻译函数，用于在测试中模拟 i18next 功能
 */

const mocki18n = {
  /**
   * 模拟的翻译函数
   * @param {string} key - 翻译键
   * @param {string} defaultValue - 默认值
   * @param {object} params - 替换参数
   * @returns {string} 翻译后的文本
   */
  t: function(key, defaultValue, params) {
    // 如果没有提供默认值，使用键作为默认值
    if (!defaultValue && typeof key === 'string') {
      defaultValue = key.split(':').pop();
    }
    
    // 处理插值参数
    if (params) {
      let result = defaultValue;
      Object.keys(params).forEach(param => {
        result = result.replace(`{{${param}}}`, params[param]);
      });
      return result;
    }
    return defaultValue;
  }
};

module.exports = mocki18n; 