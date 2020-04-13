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
import { faComment, faComments, faClock, faEdit, faHome,
         faSignInAlt, faSignOutAlt, faTrash, faUser
       } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faComment)
library.add(faComments)
library.add(faClock)
library.add(faEdit)
library.add(faHome)
library.add(faSignInAlt)
library.add(faSignOutAlt)
library.add(faTrash)
library.add(faUser)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

/* set withCredentials parameter globally to
   ensure cookies are send to backend
   (needed for sticky session load balancing) */
import axios from 'axios'
axios.defaults.withCredentials = true

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
