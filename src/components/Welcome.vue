<template>
  <b-container>
    <b-row>
      <b-col>
        <h3>{{title}}</h3>
        <p v-html="html"></p>
        <b-btn href="#/forum" variant="primary">Zum Forum</b-btn>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { readStaticPage } from '../../utils/plone-api.js'

export default {
  name: 'Welcome',
  components: {
  },
  data () {
    return {
      title: '',
      html: '',
    }
  },
  methods: {
  },
  mounted () {
    readStaticPage('welcome').then((res) => {
      this.title = res.title
      this.html = res.text.data
    })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
