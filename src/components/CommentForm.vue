<template>
  <b-form>
    <b-alert v-if="errorMessage.length > 0" variant="danger" show>
      {{errorMessage}}
    </b-alert>
    <b-card no-body class="new-comment">
      <template v-slot:header>
        <span class="author">
          <font-awesome-icon icon="user" class="mr-1"/>
          {{username}} sagt:
        </span>
      </template>
    </b-card>
    <b-form-textarea
      id="textarea"
      v-model="text"
      placeholder="Ihr Text ..."
      rows="3"
      max-rows="6"></b-form-textarea>
    <b-btn v-if="commentId == false && isReply == false"
           @click="submit()"
           squared class="mt-2" variant="primary"
           :disabled="isSubmitting">
       <b-spinner small v-if="isSubmitting"></b-spinner>
       Abschicken
    </b-btn>
  </b-form>
</template>

<script>
import { getUsername } from '../../utils/auth.js'
import { createContent, readContent, updateContent } from '../../utils/plone-api.js'
import { mail2userid, url2id } from '../../utils/tools.js'

export default {
  name: 'CommentForm',
  props: ['conversationUrl', 'replyToId', 'commentUrl'],
  data () {
    return {
      username: '',
      postUrl: '',
      text: '',
      errorMessage: '',
      commentId: false,
      isReply: false,
      isSubmitting: false,
    }
  },
  methods: {
    validate () {
      if (this.text.trim().length == 0) {
        this.errorMessage = 'Bitte füllen Sie alle Eingabefelder aus!'
        return false
      }
      this.errorMessage = ''
      return true
    },
    submit () {
      this.isSubmitting = true
      if (this.validate() === false) {
        this.isSubmitting = false
        return
      }

      let data = {'text': this.text}
      if (this.commentId != false) {
        updateContent(this.postUrl, data).then((res) => {
          if (res.status === 204) {
            this.text = ''
            this.$emit('comment-updated', this.commentId)
          }
          this.isSubmitting = false
        })
      } else {
        createContent(this.postUrl, data).then((res) => {
          if (res.status === 204) {
            this.text = ''
            let newCommentUrl = res.headers.location
            let newCommentId = url2id(newCommentUrl)
            this.$emit('comment-created', newCommentId)
          }
          this.isSubmitting = false
        })
      }
    }
  },
  mounted () {
    /* are we editing an existing comment? */
    if (this.commentUrl != null) {
      this.postUrl = this.commentUrl
      readContent(this.commentUrl).then((res) => {
        this.commentId = res.comment_id
        this.text = res.text.data
        this.username = mail2userid(res.author_username)
      })
    } else {
    /* otherwise we are creating a new comment
       (which could also be a reply) */
      this.username = getUsername()
      this.commentId = false
      this.postUrl = this.conversationUrl + '/@comments'
      if (this.replyToId != null) {
        this.replyToIdData = this.replyToId
        this.postUrl += `/${this.replyToIdData}`
        this.isReply = true
      } else {
        this.isReply = false
      }
    }
  },
}
</script>

<style scoped>
.new-comment .card-header {
  font-size: 80%;
  line-height: 80%;
}
</style>
