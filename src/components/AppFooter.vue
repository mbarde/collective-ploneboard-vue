<template>
  <footer class="main-footer">
    <b-container>
      <p v-html="html"></p>
    </b-container>
  </footer>
</template>

<script>
import { readStaticPage } from '../../utils/plone-api'

export default {
  name: 'AppFooter',
  data () {
    return {
      html: '',
    }
  },
  methods: {
  },
  mounted () {
    readStaticPage('footer').then((res) => {
      this.html = res.text.data
    })
  },
}
</script>

<style lang="scss">
footer.main-footer {
  background-color: var(--primary);
  color: white;
  margin-top: 20px;
  min-height: 200px;
  padding-top: 20px;
  padding-bottom: 20px;
}

footer.main-footer a {
  color: white !important;
}
</style>
