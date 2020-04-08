<template>
  <b-row>
    <b-col :offset="offset">
      <b-card :id="`comment-${id}`" :class="cssClasses.join(' ')">
        <template v-slot:header>
          <span class="author">{{author}} sagt:</span>
          <span class="date">{{date}}</span>
          <a class="edit" v-if="editable"
             v-b-modal="`modal-edit-${id}`">
            <font-awesome-icon icon="edit"/> Bearbeiten
          </a>
        </template>
        <b-card-text v-html="nl2brLocal(text)"></b-card-text>
      </b-card>
    </b-col>
    <b-modal
      :id="`modal-edit-${id}`"
      title="Bearbeiten">
      <comment-form
        :ref="`form-edit-${id}`"
        :comment-url="url"
        v-on:comment-updated="onUpdated()">
      </comment-form>
      <template v-slot:modal-footer="{ cancel }">
        <b-btn squared variant="primary"
               style="flex: auto"
               @click="submitEditForm()"
               :disabled="isSubmitting">
           <b-spinner small v-if="isSubmitting"></b-spinner>
           Abschicken
        </b-btn>
        <b-btn squared variant="danger"
               @click="cancel()">Abbrechen</b-btn>
      </template>
    </b-modal>
  </b-row>
</template>

<script>
import CommentForm from '@/components/CommentForm'
import moment from 'moment'
import { mail2userid, nl2br } from '../../utils/tools.js'

export default {
  name: 'Comment',
  props: ['comment', 'isNew'],
  components: {
    CommentForm,
  },
  data () {
    return {
      cssClasses: ['comment', 'mt-3'],
      url: '',
      id: '',
      author: '',
      date: '',
      text: '',
      offset: 0,
      editable: false,
      isSubmitting: false,
    }
  },
  methods: {
    nl2brLocal (str) {
      return nl2br(str)
    },
    submitEditForm () {
      this.isSubmitting = true
      let form = this.$refs['form-edit-' + this.id]
      form.submit()
    },
    onUpdated () {
      this.isSubmitting = false
      this.$emit('comment-updated', this.id)
    },
  },
  mounted () {
    this.url = this.comment['@id']
    this.id = this.comment.comment_id
    this.author = mail2userid(this.comment.author_username)
    this.date = moment(this.comment.modification_date).format('DD.MM.YYYY - HH:mm') + ' Uhr'
    this.text = this.comment.text.data
    this.editable = this.comment.is_editable
    if (this.comment.in_reply_to != null) this.offset = 1
    if (this.isNew == true) {
      this.cssClasses.push('new')
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.comment .card-header {
  font-size: 80%;
  line-height: 80%;
}

.comment .edit {
  cursor: pointer;
  float: right;
  margin-right: 10px;
}

.comment .edit:hover {
  color: black !important;
}

.comment .date {
  float: right;
  font-style: italic;
}

.comment.new {
  animation-name: highlight-new;
  animation-duration: 4s;
}

@keyframes highlight-new {
  from {
    background-color: #073F8B;
    color: white;
  }
  to {
    background-color: initial;
    color: initial;
  }
}
</style>
