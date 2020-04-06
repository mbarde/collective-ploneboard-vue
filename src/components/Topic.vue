<template>
  <b-container>
    <b-row>
      <b-col>
        <h1>{{title}}</h1>
        <p v-if="description.length > 0">{{description}}</p>
        <b-list-group v-if="initialized">
          <b-list-group-item
            class="conversation"
            v-for="conversation in conversations"
            :key="conversation['@id']"
            :href="getConversationUrl(conversation)">
              {{conversation.title}}
              <i>{{conversation.comment_count}} Kommentare</i>
          </b-list-group-item>
        </b-list-group>

        <hr/>
        <conversation-form v-if="url.length > 0" :topic-url="url"></conversation-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { readContent } from '../../utils/plone-api.js'
import { url2id } from '../../utils/tools.js'
import ConversationForm from '@/components/ConversationForm'

export default {
  name: 'Topic',
  components: {
    ConversationForm,
  },
  data () {
    return {
      initialized: false,
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
    },
  },
  mounted () {
    this.boardId = this.$route.params.boardId
    this.topicId = this.$route.params.topicId
    this.url = `/${this.boardId}/${this.topicId}`
    readContent(this.url).then((res) => {
      this.title = res.title
      this.description = res.description
      this.conversations = res.items

      /* get comment count of each conversation */
      let promises = []
      this.conversations.forEach((conversation) => {
        promises.push(new Promise((resolve) => {
          readContent(conversation['@id'] + '/@comments').then((res) => {
            conversation.comment_count = res.items_total
            resolve()
          })
        }))
      })
      Promise.all(promises).then(() => {
        this.initialized = true
      })
    })
  },
}
</script>

<style scoped>
.list-group-item.conversation i {
  float: right;
  font-size: 80%;
  font-style: italic;
}
</style>
