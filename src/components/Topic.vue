<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-6 offset-sm-3">
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
      </div>
    </div>
  </div>
</template>

<script>
import { getContent } from '../../utils/plone-api.js'
import { url2id } from '../../utils/tools.js'

export default {
  name: 'Topic',
  data () {
    return {
      boardId: '',
      topicId: '',
      title: '',
      description: '',
      conversations: [],
    }
  },
  methods: {
    getConversationUrl (conversation) {
      const conversationId = url2id(conversation['@id'])
      return `#/board/${this.boardId}/${this.topicId}/${conversationId}`
    }
  },
  mounted () {
    this.boardId = this.$route.params.boardId
    this.topicId = this.$route.params.topicId
    const url = `/${this.boardId}/${this.topicId}`
    getContent(url).then((res) => {
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
