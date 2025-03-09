const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'zh',
    locales: ['en', 'fr', 'zh'],
    localeDetection: true
  },
  localePath: path.resolve(__dirname, './public/locales')
}
