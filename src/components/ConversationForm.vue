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
           class="mt-2" variant="primary"
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
  name: 'ConversationForm',
  props: ['topicUrl'],
  data () {
    return {
      containerUrl: '',
      title: '',
      text: '',
      errorMessage: '',
      isSubmitting: false,
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
      this.isSubmitting = true
      if (this.validate() === false) return

      let data = {
        '@type': 'Conversation',
        'title': this.title,
        'text': this.text
      }
      createContent(this.containerUrl, data).then((res) => {
        if (res.status === 201) {
          this.title = ''
          this.text = ''
          let newConversationUrl = res.headers.location
          let newConversationId = url2id(newConversationUrl)
          this.$emit('conversation-created', newConversationId)
        }
        this.isSubmitting = false
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
