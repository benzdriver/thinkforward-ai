module.exports = {
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'zh-TW', 'en', 'fr', 'ja', 'ko', 'ar'],
    localeDetection: false,
  },
  fallbackLng: 'zh',
  ns: ['common', 'landing'],
  defaultNS: 'common',
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
};
