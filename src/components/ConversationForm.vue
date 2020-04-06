<template>
  <b-form>
    <h4>Neue Unterhaltung aufmachen</h4>
    <b-alert v-if="errorMessage.length > 0" variant="danger" show>
      {{errorMessage}}
    </b-alert>
    <div class="form-group">
      <input v-model.lazy="title" name="title"
        placeholder="Titel"
        class="form-control" type="text"/>
    </div>
    <b-form-textarea
      id="textarea"
      v-model="text"
      placeholder="Ihr Text ..."
      rows="3"
      max-rows="6"></b-form-textarea>
    <b-btn @click="submit()" squared
           class="mt-2" variant="primary">Abschicken</b-btn>
  </b-form>
</template>

<script>
import { createContent } from '../../utils/plone-api.js'
import { url2id } from '../../utils/tools.js'

export default {
  name: 'ConversationForm',
  props: ['topicUrl'],
  data () {
    return {
      containerUrl: '',
      title: '',
      text: '',
      errorMessage: '',
    }
  },
  methods: {
    validate () {
      if (
        this.title.trim().length < 0 ||
        this.text.trim().length == 0)
      {
        this.errorMessage = 'Bitte füllen Sie alle Eingabefelder aus!'
        return false
      }
      this.errorMessage = ''
      return true
    },
    submit () {
      if (this.validate() === false) return

      let data = {
        '@type': 'Conversation',
        'title': this.title,
        'text': this.text
      }
      createContent(this.containerUrl, data).then((res) => {
        if (res.status === 204) {
          this.title = ''
          this.text = ''
          let newCommentUrl = res.headers.location
          let newCommentId = url2id(newCommentUrl)
          this.$emit('comment-created', newCommentId)
        }
      })
    }
  },
  mounted () {
    this.containerUrl = this.topicUrl
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
