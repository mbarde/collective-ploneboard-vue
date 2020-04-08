<template>
  <b-container>
    <b-row>
      <b-col>
        <h3>{{title}}</h3>
        <p v-html="html"></p>
        <b-btn v-if="isLoggedIn"
               href="#/forum"
               variant="primary">
          <font-awesome-icon icon="comments"/> Zum Forum
        </b-btn>
        <b-btn v-else
               href="#/login"
               variant="primary">
          <font-awesome-icon icon="sign-in-alt"/> Anmelden
        </b-btn>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { isLoggedIn } from '../../utils/auth.js'
import { readStaticPage } from '../../utils/plone-api.js'

export default {
  name: 'Welcome',
  data () {
    return {
      title: '',
      html: '',
      isLoggedIn: false,
    }
  },
  methods: {
  },
  mounted () {
    readStaticPage('welcome').then((res) => {
      this.title = res.title
      this.html = res.text.data
    })

    this.isLoggedIn = isLoggedIn()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
