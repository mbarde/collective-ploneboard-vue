const PAGE_TITLE = 'Ersti Forum'
const PRODUCTION_URL = 'https://www.uni-koblenz-landau.de/ErstiForum/'
const LANGUAGE_CODE = 'de'

// vue.config.js
module.exports = {
  chainWebpack: config => {
    config
    .plugin('html')
    .tap(args => {
      args[0].title = PAGE_TITLE
      return args
    })
  },

  css: {
    sourceMap: true
  },

  publicPath: process.env.NODE_ENV === 'production'
                ? PRODUCTION_URL
                : '/',

  pluginOptions: {
    i18n: {
      locale: LANGUAGE_CODE,
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
