<template>
  <b-container>
    <b-row>
      <b-col v-if="initialized">
        <h3>{{title}}</h3>
        <p v-html="html"></p>
        <b-btn v-if="isLoggedIn"
               :href="`#/${MESSAGE_BOARD_ID}`"
               variant="primary">
          <font-awesome-icon icon="comments"/> {{$t('to-forum')}}
        </b-btn>
        <b-btn v-else
               href="#/login"
               variant="primary">
          <font-awesome-icon icon="sign-in-alt"/> {{$t('login')}}
        </b-btn>
      </b-col>
      <b-col v-else cols="12" class="text-center">
        <br/><br/>
        <b-spinner :label="$t('loading')" type="grow"></b-spinner>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { isLoggedIn } from '../../utils/auth'
import { MESSAGE_BOARD_ID } from '../../utils/constants'
import { readStaticPage } from '../../utils/plone-api'

export default {
  name: 'Welcome',
  data () {
    return {
      title: '',
      html: '',
      isLoggedIn: false,
      initialized: false,
      MESSAGE_BOARD_ID: MESSAGE_BOARD_ID,
    }
  },
  methods: {
  },
  mounted () {
    this.initialized = false
    readStaticPage('welcome').then((res) => {
      this.title = res.title
      this.html = res.text.data
      this.initialized = true
    })

    this.isLoggedIn = isLoggedIn()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
