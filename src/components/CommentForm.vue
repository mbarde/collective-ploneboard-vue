<template>
  <b-form class="mt-5">
    <h4>Neuen Kommentar hinzufügen</h4>
    <b-form-textarea
      id="textarea"
      v-model="text"
      placeholder="Enter something..."
      rows="3"
      max-rows="6"></b-form-textarea>
    <b-btn @click="submit()">Abschicken</b-btn>
  </b-form>
</template>

<script>
import { createContent } from '../../utils/plone-api.js'

export default {
  name: 'CommentForm',
  props: ['conversationUrl', 'replyToId'],
  data () {
    return {
      postUrl: '',
      replyToIdData: false,
      text: '',
    }
  },
  methods: {
    submit () {
      let data = {'text': this.text}
      createContent(this.postUrl, data).then((res) => {
        if (res.status === 204) {
          console.log('emitting')
          this.$emit('comment-created')
        }
      })
    }
  },
  mounted () {
    this.postUrl = this.conversationUrl + '/@comments'
    if (this.replyToId != null) this.replyToIdData = this.replyToId
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
