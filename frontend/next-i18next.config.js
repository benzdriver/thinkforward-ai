/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'en', 'zh-TW', 'fr', 'ja', 'ko', 'ar'],
    localeDetection: false,
  },
  rtlLocales: ['ar'],
  localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  ns: ['common', 'index', 'layout'],
  defaultNS: 'common',
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  },
  returnObjects: true
};
