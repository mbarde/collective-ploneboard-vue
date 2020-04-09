// vue.config.js
module.exports = {
  chainWebpack: config => {
    config
    .plugin('html')
    .tap(args => {
      args[0].title = 'ErstiForum'
      return args
    })
  },
  css: {
    sourceMap: true
  },
  publicPath: process.env.NODE_ENV === 'production'
                ? 'https://www.uni-koblenz-landau.de/ErstiForum/'
                : '/',
}
