<template>
  <b-container>
    <b-row>
      <b-col cols-md="6" offset-md="3">
        <h1>{{title}}</h1>
        <p>{{description}}</p>
        <b-list-group>
          <b-list-group-item
            v-for="conversation in conversations"
            :key="conversation['@id']">
            <a :href="getConversationUrl(conversation)">
              {{conversation.title}}
            </a>
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
  name: 'Topic',
  data () {
    return {
      boardId: '',
      topicId: '',
      url: '',
      title: '',
      description: '',
      conversations: [],
    }
  },
  methods: {
    getConversationUrl (conversation) {
      const conversationId = url2id(conversation['@id'])
      return `#/${this.boardId}/${this.topicId}/${conversationId}`
    }
  },
  mounted () {
    this.boardId = this.$route.params.boardId
    this.topicId = this.$route.params.topicId
    this.url = `/${this.boardId}/${this.topicId}`
    readContent(this.url).then((res) => {
      this.title = res.title
      this.description = res.description
      this.conversations = res.items
    })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
