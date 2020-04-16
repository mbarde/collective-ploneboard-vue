import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { pluginOptions } from '../vue.config.js'

Vue.use(VueI18n)

function loadLocaleMessages () {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

export default new VueI18n({
  locale: pluginOptions.i18n.locale,
  fallbackLocale: pluginOptions.i18n.fallbackLocale,
  messages: loadLocaleMessages()
})
