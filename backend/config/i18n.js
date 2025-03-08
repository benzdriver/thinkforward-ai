const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const path = require('path');

const i18nConfig = {
  backend: {
    loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json')
  },
  fallbackLng: 'en',
  preload: ['en', 'zh'],
  supportedLngs: ['en', 'zh'],
  ns: ['common', 'errors', 'ai'],
  defaultNS: 'common'
};

module.exports = i18nConfig; 