<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-6 offset-sm-3">
        <b-card :title="title" :sub-title="subTitle">
          <b-card-text v-html="text"></b-card-text>
        </b-card>
        <div v-for="comment in comments" :key="comment['@id']">
          <comment :comment="comment" :is-new="comment.comment_id == newCommentId"></comment>
          <b-btn class="float-right mt-1 mb-3" squared size="sm"
            v-b-modal="`modal-reply-${comment.comment_id}`">
            Antworten</b-btn>
          <br style="clear:both"/>
          <b-modal
            :id="`modal-reply-${comment.comment_id}`"
            title="Antworten">
            <comment-form
              v-if="url.length > 0"
              :ref="`form-${comment.comment_id}`"
              :conversation-url="url"
              :reply-to-id="comment.comment_id"
              v-on:comment-created="loadComments"></comment-form>
           <template v-slot:modal-footer>
             <b-btn squared variant="primary"
                    style="flex: auto"
                    @click="submitCommentForm(comment.comment_id)">Abschicken</b-btn>
             <b-btn squared variant="danger">Abbrechen</b-btn>
           </template>
          </b-modal>
        </div>

        <br/>
        <h4>Neuen Kommentar hinzufügen</h4>
        <comment-form
          v-if="url.length > 0"
          :conversation-url="url"
          v-on:comment-created="loadComments"></comment-form>
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
      newCommentId: '',
    }
  },
  methods: {
    submitCommentForm (commentId) {
      let form = this.$refs['form-' + commentId][0]
      form.submit()
    },
    loadComments (newCommentId) {
      this.comments = []
      if (newCommentId != false) this.newCommentId = newCommentId
      else this.newCommentId = ''
      readContent(this.url + '/@comments').then((res) => {
        this.comments = res.items
        if (newCommentId != false) {
          setTimeout(() => {
            this.$scrollTo(`#comment-${newCommentId}`)
          }, 0)
        }
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

    this.loadComments(false)
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
