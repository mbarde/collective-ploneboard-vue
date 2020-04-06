<template>
  <b-form>
    <b-form-textarea
      id="textarea"
      v-model="text"
      placeholder="Enter something..."
      rows="3"
      max-rows="6"></b-form-textarea>
    <b-btn v-if="isReply == false" @click="submit()"
            squared class="mt-2" variant="primary">Abschicken</b-btn>
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
      title: '',
    }
  },
  methods: {
    submit () {
      let data = {'text': this.text}
      createContent(this.postUrl, data).then((res) => {
        if (res.status === 204) {
          let newCommentUrl = res.headers.location
          let newCommentId = url2id(newCommentUrl)
          this.$emit('comment-created', newCommentId)
        }
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
