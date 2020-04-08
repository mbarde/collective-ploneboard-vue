import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)

var VueScrollTo = require('vue-scrollto');
Vue.use(VueScrollTo, {
  container: 'body',
  x: false,
  y: true,
})

import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faSignInAlt, faTrash
       } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faEdit)
library.add(faSignInAlt)
library.add(faTrash)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
