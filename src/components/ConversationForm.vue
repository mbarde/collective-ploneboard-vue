<template>
  <b-form>
    <h4 v-if="!embedded">
      <font-awesome-icon icon="comments"/>
      {{formTitle}}
    </h4>
    <b-alert v-if="errorMessage.length > 0" variant="danger" show>
      {{errorMessage}}
    </b-alert>
    <div class="form-group">
      <input v-model.lazy="title" name="title"
        :placeholder="$t('title')"
        class="form-control" type="text"/>
    </div>
    <b-form-textarea
      id="textarea"
      v-model="text"
      :placeholder="$t('your-text')"
      rows="3"
      max-rows="6"></b-form-textarea>
    <b-btn v-if="!embedded"
           @click="submit()" squared
           class="mt-2" variant="primary"
           :disabled="isSubmitting">
      <b-spinner small v-if="isSubmitting"></b-spinner>
      {{$t('submit')}}
    </b-btn>
  </b-form>
</template>

<script>
import { createContent, readContent, updateContent } from '../../utils/plone-api'
import { url2id } from '../../utils/tools'

export default {
  name: 'ConversationForm',
  props: ['topicUrl', 'conversationUrl', 'isEmbedded'],
  data () {
    return {
      containerUrl: '',
      url: false,
      formTitle: '',
      title: '',
      text: '',
      errorMessage: '',
      isSubmitting: false,
      embedded: false,
    }
  },
  methods: {
    validate () {
      if (
        this.title.trim().length < 0 ||
        this.text.trim().length == 0)
      {
        this.errorMessage = this.$t('fill-all-fields')
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

      let data = {
        'title': this.title,
        'text': this.text
      }

      if (this.url != false) {
        updateContent(this.url, data).then((res) => {
          if (res.status === 204) {
            this.title = ''
            this.text = ''
            let newConversationId = url2id(this.url)
            this.$emit('conversation-updated', newConversationId)
          }
          this.isSubmitting = false
        })
      } else {
        data['@type'] = 'Conversation'
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
    }
  },
  mounted () {
    if (this.isEmbedded != null) this.embedded = this.isEmbedded

    /* edit an existing conversation */
    if (this.conversationUrl != null) {
      this.formTitle = this.$t('edit-conversation')
      this.url = this.conversationUrl
      readContent(this.conversationUrl).then((res) => {
        this.title = res.title
        this.text = res.text.data
      })
    } else {
      /* create a new conversation */
      this.formTitle = this.$t('add-conversation')
      this.url = false
    }
    this.containerUrl = this.topicUrl
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
