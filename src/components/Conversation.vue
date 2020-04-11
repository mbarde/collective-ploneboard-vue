<template>
  <b-container>
    <b-row>
      <b-col>
        <b-card :title="title" :sub-title="subTitle" class="main">
          <a v-if="editable" class="edit-conversation"
             v-b-modal="'modal-edit-conversation'">
            <font-awesome-icon icon="edit"/> Bearbeiten
          </a>
          <b-card-text v-html="nl2brLocal(text)" class="mt-4"></b-card-text>
        </b-card>
        <b-modal
          id="modal-edit-conversation"
          ref="modal-edit-conversation">
          <template v-slot:modal-header>
            <h4>
              <font-awesome-icon icon="comments"/>
              Unterhaltung bearbeiten
            </h4>
          </template>
          <conversation-form
            v-if="url.length > 0"
            ref="form-edit-conversation"
            :is-embedded="true"
            :conversation-url="url"
            v-on:conversation-updated="onConversationUpdated"
          ></conversation-form>
          <template v-slot:modal-footer="{ cancel }">
            <b-btn squared variant="primary"
                   style="flex: auto"
                   @click="submitConversationForm()"
                   :disabled="isSubmitting">
               <b-spinner small v-if="isSubmitting"></b-spinner>
               Abschicken
            </b-btn>
            <b-btn squared variant="danger"
                   @click="cancel()">Abbrechen</b-btn>
          </template>
        </b-modal>
        <template v-if="initialized">
          <div v-for="comment in comments" :key="comment['@id']">
            <comment
              :comment="comment"
              :is-new="comment.comment_id == newCommentId"
              v-on:comment-updated="loadComments"
              v-on:comment-deleted="onCommentDeleted">
            </comment>
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
                  :ref="`form-replyto-${comment.comment_id}`"
                  :conversation-url="url"
                  :reply-to-id="comment.comment_id"
                  v-on:comment-created="loadComments"></comment-form>
                <template v-slot:modal-footer="{ cancel }">
                  <b-btn squared variant="primary"
                         style="flex: auto"
                         @click="submitCommentForm(comment.comment_id)"
                         :disabled="isSubmitting">
                     <b-spinner small v-if="isSubmitting"></b-spinner>
                     Abschicken
                  </b-btn>
                  <b-btn squared variant="danger"
                         @click="cancel()">Abbrechen</b-btn>
                </template>
              </b-modal>
            </template><!-- if allowReplies -->
          </div>
          <hr/>
          <h4>
            <font-awesome-icon icon="comment"/>
            Neuen Kommentar hinzufügen
          </h4>
          <comment-form
            v-if="url.length > 0"
            :conversation-url="url"
            v-on:comment-created="loadComments"></comment-form>
          </template>
          <b-col v-else cols="12" class="text-center">
            <br/><br/>
            <b-spinner label="Loading..." type="grow"></b-spinner>
          </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Comment from '@/components/Comment'
import CommentForm from '@/components/CommentForm'
import ConversationForm from '@/components/ConversationForm'
import moment from 'moment'
import { getUsername } from '../../utils/auth.js'
import { readContent } from '../../utils/plone-api.js'
import { mail2userid, nl2br } from '../../utils/tools.js'

export default {
  name: 'Conversation',
  components: {
    Comment,
    CommentForm,
    ConversationForm,
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
      isSubmitting: false,
      initialized: false,
      editable: false,
    }
  },
  methods: {
    submitCommentForm (commentId) {
      this.isSubmitting = true
      let form = this.$refs['form-replyto-' + commentId][0]
      form.submit()
    },
    submitConversationForm () {
      this.isSubmitting = true
      let form = this.$refs['form-edit-conversation']
      form.submit()
    },
    loadComments (newCommentId) {
      this.initialized = false
      this.isSubmitting = false
      this.comments = []
      if (newCommentId != false) this.newCommentId = newCommentId
      else this.newCommentId = ''
      readContent(this.url + '/@comments?b_size=999999').then((res) => {
        this.comments = res.items
        this.initialized = true
        if (newCommentId != false) {
          setTimeout(() => {
            this.$scrollTo(`#comment-${newCommentId}`)
          }, 0)
        } else {
          /* c as query parameter indicates to scroll to specified comment;
             usage: ?c=commentid */
          let scrollToCommentId = this.$route.query.c
          if (scrollToCommentId != undefined) {
            setTimeout(() => {
              this.$scrollTo(`#comment-${scrollToCommentId}`)
            }, 0)
          }
        }
      })
    },
    onCommentDeleted (commentId) {
      let found = false
      for (var i = 0; i < this.comments.length; i++) {
        if (this.comments[i].comment_id == commentId) {
          found = i
          break
        }
      }
      if (found != false) this.comments.splice(found, 1)
    },
    onConversationUpdated () {
      this.isSubmitting = false
      let modal = this.$refs['modal-edit-conversation']
      modal.hide()
      this.loadData()
    },
    nl2brLocal (str) {
      return nl2br(str)
    },
    loadData () {
      this.initialized = false
      readContent(this.url).then((res) => {
        this.modified = res.modified
        this.title = res.title
        this.text = res.text.data
        this.author = mail2userid(res.creators.pop())
        this.editable = this.author == getUsername()

        let modifiedStr = moment(this.modified).format('DD.MM.YYYY - HH:mm')
        this.subTitle = `von ${this.author} (${modifiedStr} Uhr)`
      }).catch(() => {
        this.$emit('content-not-found')
      })
      this.loadComments(false)
    }
  },
  mounted () {
    this.boardId = this.$route.params.boardId
    this.topicId = this.$route.params.topicId
    this.conversationId = this.$route.params.conversationId
    this.url = `/${this.boardId}/${this.topicId}/${this.conversationId}`
    this.loadData()
  },
}
</script>

<style scoped>
.card.main .card-subtitle {
  font-size: 80%;
  font-style: italic;
}
a.edit-conversation {
  cursor: pointer;
  font-size: 80%;
  position: absolute;
  right: 15px;
  top: 15px;
}
a.edit-conversation:hover {
  color: black !important;
}
</style>
