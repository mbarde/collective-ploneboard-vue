<template>
  <b-container>
    <b-row>
      <b-col v-if="title.length > 0">
          <h3>{{title}}</h3>
          <p v-if="html.length > 0" v-html="html"></p>
          <b-btn href="#/"
                 variant="primary">
            <font-awesome-icon icon="home"/> Zur Startseite
          </b-btn>
      </b-col>
      <b-col v-else class="text-center">
        <br/><br/>
        <b-spinner :label="$t('loading')" type="grow"></b-spinner>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { readStaticPage } from '../../utils/plone-api'

export default {
  name: 'NotFound',
  data () {
    return {
      title: '',
      html: '',
    }
  },
  methods: {
  },
  mounted () {
  readStaticPage('404').then((res) => {
    this.title = res.title
    this.html = res.text.data
  })
  },
}
</script>

<style scoped>
</style>
