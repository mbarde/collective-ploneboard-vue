<template>
  <b-container>
    <b-row>
      <b-col>
        <h1>{{title}}</h1>
        <p v-if="description.length > 0">
          {{description}}
        </p>
        <b-list-group v-if="initialized">
          <b-list-group-item class="topic"
            v-for="topic in topics"
            :key="topic['@id']"
            :href="getTopicUrl(topic)">
              <h4>{{topic.title}}</h4>
              {{topic.description}}
              <i>{{topic.conversation_count}} Unterhaltungen</i>
          </b-list-group-item>
        </b-list-group>
        <b-col v-else cols="12" class="text-center">
          <br/><br/>
          <b-spinner label="Loading..." type="grow"></b-spinner>
        </b-col>
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
      initialized: false,
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

      /* get conversation count of each topic */
      let promises = []
      this.topics.forEach((topic) => {
        promises.push(new Promise((resolve) => {
          readContent(topic['@id']).then((res) => {
            topic.conversation_count = res.items_total
            resolve()
          })
        }))
      })
      Promise.all(promises).then(() => {
        this.initialized = true
      })
    }).catch(() => {
      this.$emit('content-not-found')
    })
  },
}
</script>

<style scoped>
.list-group-item.topic i {
  float: right;
  font-size: 80%;
  font-style: italic;
}
</style>
