<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-6 offset-sm-3">
        <h1>{{title}}</h1>
        <b-list-group>
          <b-list-group-item
            v-for="topic in topics"
            v-bind:key="topic['@id']">
            <a :href="getTopicUrl(topic)">
              {{topic.title}}
            </a>
          </b-list-group-item>
        </b-list-group>
      </div>
    </div>
  </div>
</template>

<script>
import { getContent } from '../../utils/plone-api.js'
import { url2id } from '../../utils/tools.js'

export default {
  name: 'MessageBoard',
  data () {
    return {
      id: '',
      title: '',
      topics: [],
    }
  },
  methods: {
    getTopicUrl (topic) {
      const topicId = url2id(topic['@id'])
      return `#/board/${this.id}/${topicId}`
    }
  },
  mounted () {
    const url = `/${this.$route.params.boardId}`
    getContent(url).then((res) => {
      this.id = res.id
      this.title = res.title
      this.topics = res.items
    })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
