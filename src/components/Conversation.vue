<template>
  <b-container>
    <b-row>
      <b-col>
        <b-card :title="title" :sub-title="subTitle" class="main">
          <b-card-text v-html="nl2brLocal(text)" class="mt-4"></b-card-text>
        </b-card>
        <div v-for="comment in comments" :key="comment['@id']">
          <comment :comment="comment" :is-new="comment.comment_id == newCommentId"></comment>
          <template v-if="allowReplies">
            <b-btn
              variant="primary"
              class="float-right mt-1 mb-3" squared size="sm"
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
              <template v-slot:modal-footer="{ cancel }">
                <b-btn squared variant="primary"
                       style="flex: auto"
                       @click="submitCommentForm(comment.comment_id)">Abschicken</b-btn>
                <b-btn squared variant="danger"
                       @click="cancel()">Abbrechen</b-btn>
              </template>
            </b-modal>
          </template><!-- if allowReplies -->
        </div>

        <hr/>
        <h4>Neuen Kommentar hinzufügen</h4>
        <comment-form
          v-if="url.length > 0"
          :conversation-url="url"
          v-on:comment-created="loadComments"></comment-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Comment from '@/components/Comment'
import CommentForm from '@/components/CommentForm'
import moment from 'moment'
import { readContent } from '../../utils/plone-api.js'
import { mail2userid, nl2br } from '../../utils/tools.js'

export default {
  name: 'Conversation',
  components: {
    Comment,
    CommentForm,
  },
  data () {
    return {
      allowReplies: false,
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
      readContent(this.url + '/@comments?b_size=999999').then((res) => {
        this.comments = res.items
        if (newCommentId != false) {
          setTimeout(() => {
            this.$scrollTo(`#comment-${newCommentId}`)
          }, 0)
        }
      })
    },
    nl2brLocal (str) {
      return nl2br(str)
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
      this.author = mail2userid(res.creators.pop())

      let modifiedStr = moment(this.modified).format('DD.MM.YYYY - HH:mm')
      this.subTitle = `von ${this.author} (${modifiedStr} Uhr)`
    })

    this.loadComments(false)
  },
}
</script>

<style scoped>
.card.main .card-subtitle {
  font-size: 80%;
  font-style: italic;
}
</style>
