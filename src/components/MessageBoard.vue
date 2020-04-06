<template>
  <b-container>
    <b-row>
      <b-col cols-md="6" offset-md="3">
        <h1>{{title}}</h1>
        <p v-if="description.length > 0">
          {{description}}
        </p>
        <b-list-group>
          <b-list-group-item
            v-for="topic in topics"
            :key="topic['@id']"
            :href="getTopicUrl(topic)">
              <h4>{{topic.title}}</h4>
              {{topic.description}}
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { readContent } from '../../utils/plone-api.js'
import { url2id } from '../../utils/tools.js'

export default {
  name: 'MessageBoard',
  data () {
    return {
      id: '',
      title: '',
      description: '',
      topics: [],
    }
  },
  methods: {
    getTopicUrl (topic) {
      const topicId = url2id(topic['@id'])
      return `#/${this.id}/${topicId}`
    }
  },
  mounted () {
    const url = `/${this.$route.params.boardId}`
    readContent(url).then((res) => {
      this.id = res.id
      this.title = res.title
      this.description = res.description
      this.topics = res.items
    })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
