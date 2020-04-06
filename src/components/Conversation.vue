<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-6 offset-sm-3">
        <b-card :title="title" :sub-title="subTitle">
          <b-card-text v-html="text"></b-card-text>
        </b-card>
        <div v-for="comment in comments" :key="comment['@id']">
          <comment :comment="comment"></comment>
        </div>
        <comment-form
          v-if="url.length > 0"
          :conversation-url="url"
          v-on:comment-created="loadComments()"></comment-form>
      </div>
    </div>
  </div>
</template>

<script>
import Comment from '@/components/Comment'
import CommentForm from '@/components/CommentForm'
import moment from 'moment'
import { readContent } from '../../utils/plone-api.js'

export default {
  name: 'Conversation',
  components: {
    Comment,
    CommentForm,
  },
  data () {
    return {
      boardId: '',
      topicId: '',
      conversationId: '',
      url: '',
      id: '',
      author: '',
      modified: '',
      title: '',
      subTitle: '',
      text: '',
      comments: [],
    }
  },
  methods: {
    loadComments () {
      console.log('load!')
      this.comments = []
      readContent(this.url + '/@comments').then((res) => {
        this.comments = res.items
      })
    }
  },
  mounted () {
    this.boardId = this.$route.params.boardId
    this.topicId = this.$route.params.topicId
    this.conversationId = this.$route.params.conversationId
    this.url = `/${this.boardId}/${this.topicId}/${this.conversationId}`
    readContent(this.url).then((res) => {
      this.modified = res.modified
      this.title = res.title
      this.text = res.text.data

      /* use @history endpoint to get name of creator */
      readContent(this.url + '/@history').then((res) => {
        this.author = res.pop().actor.fullname
        let modifiedStr = moment(this.modified).format('DD.MM.YYYY - HH:mm')
        this.subTitle = `von ${this.author} (${modifiedStr} Uhr)`
      })
    })

    this.loadComments()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
