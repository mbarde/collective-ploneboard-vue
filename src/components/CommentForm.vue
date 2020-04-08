<template>
  <b-form>
    <b-alert v-if="errorMessage.length > 0" variant="danger" show>
      {{errorMessage}}
    </b-alert>
    <b-form-textarea
      id="textarea"
      v-model="text"
      placeholder="Ihr Text ..."
      rows="3"
      max-rows="6"></b-form-textarea>
    <b-btn v-if="isReply == false" @click="submit()"
            squared class="mt-2" variant="primary"
            :disabled="isSubmitting">
       <b-spinner small v-if="isSubmitting"></b-spinner>
       Abschicken
    </b-btn>
  </b-form>
</template>

<script>
import { createContent } from '../../utils/plone-api.js'
import { url2id } from '../../utils/tools.js'

export default {
  name: 'CommentForm',
  props: ['conversationUrl', 'replyToId'],
  data () {
    return {
      postUrl: '',
      isReply: false,
      text: '',
      errorMessage: '',
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
      if (this.validate() === false) return

      let data = {'text': this.text}
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
  },
  mounted () {
    this.postUrl = this.conversationUrl + '/@comments'
    if (this.replyToId != null) {
      this.replyToIdData = this.replyToId
      this.postUrl += `/${this.replyToIdData}`
      this.isReply = true
    } else {
      this.isReply = false
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
