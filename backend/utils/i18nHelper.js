const i18next = require('i18next');
const backend = require('i18next-fs-backend');
const path = require('path');
const config = require('../config');

// 初始化独立的i18next实例
i18next
  .use(backend)
  .init({
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
    },
    fallbackLng: 'en',
    preload: ['en', 'zh'],
    ns: ['common', 'errors', 'ai', 'prompts'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    initImmediate: false
  });

/**
 * 获取本地化文本
 * @param {string} key - 本地化键
 * @param {object} options - 插值变量和选项
 * @param {string} language - 语言代码，默认en
 * @returns {string} 本地化文本
 */
const t = (key, options = {}, language = 'en') => {
  return i18next.t(key, { ...options, lng: language });
};

module.exports = { t }; 