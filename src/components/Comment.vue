<template>
  <b-row>
    <b-col :offset="offset">
      <b-card :id="`comment-${id}`" :class="cssClasses.join(' ')">
        <template v-slot:header>
          <span class="author">
            <font-awesome-icon icon="user" class="mr-1"/>
            {{author}} {{$t('says')}}:
          </span>
          <span class="date">{{date}}</span>
          <span v-if="deletable || editable" class="tools">
            <a class="delete" v-if="deletable"
               v-b-modal="`modal-delete-${id}`">
              <font-awesome-icon icon="trash"/>
              {{$t('delete')}}
            </a>
            <a class="edit" v-if="editable"
               v-b-modal="`modal-edit-${id}`">
              <font-awesome-icon icon="edit"/>
              {{$t('edit')}}
            </a>
          </span>
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
           {{$t('submit')}}
        </b-btn>
        <b-btn squared variant="danger"
               @click="cancel()">Abbrechen</b-btn>
      </template>
    </b-modal>
    <b-modal
      :id="`modal-delete-${id}`"
      :ref="`modal-delete-${id}`"
      :title="$t('really-delete-comment')">
      {{$t('cannot-be-undone')}}
      <template v-slot:modal-footer="{ cancel }">
        <b-btn squared variant="danger"
               style="flex: auto"
               @click="deleteComment()"
               :disabled="isSubmitting">
           <b-spinner small v-if="isSubmitting"></b-spinner>
           <font-awesome-icon icon="trash" v-if="!isSubmitting"/>
           {{$t('delete')}}
        </b-btn>
        <b-btn squared variant="secondary"
               style="flex: auto"
               @click="cancel()">
          {{$t('cancel')}}
        </b-btn>
      </template>
    </b-modal>
  </b-row>
</template>

<script>
import CommentForm from '@/components/CommentForm'
import moment from 'moment'
import { deleteContent } from '../../utils/plone-api'
import { mail2userid, nl2br } from '../../utils/tools'

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
      deletable: false,
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
    deleteComment () {
      this.isSubmitting = true
      deleteContent(this.url).then((res) => {
        if (res.status == 204) {
          this.$emit('comment-deleted', this.id)
          this.cssClasses.push('deleted')
          let modal = this.$refs['modal-delete-' + this.id]
          modal.hide()
        }
        this.isSubmitting = false
      })
    }
  },
  mounted () {
    this.url = this.comment['@id']
    this.id = this.comment.comment_id
    this.author = mail2userid(this.comment.author_username)
    this.date = moment
      .utc(this.comment.modification_date)
      .local()
      .format('DD.MM.YYYY - HH:mm') + ' ' + this.$t('o-clock')
    this.text = this.comment.text.data
    this.editable = this.comment.is_editable
    this.deletable = this.comment.is_deletable
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

.comment .tools {
  float: right;
}

@media (max-width: 500px) {
  .comment .tools {
    display: block;
    margin-top: 10px;
    text-align: right;
    width: 100%;
  }
}

.comment .delete,
.comment .edit {
  cursor: pointer;
  margin-left: 10px;
}

.comment .delete:hover,
.comment .edit:hover {
  color: black !important;
}

.comment .date {
  float: right;
  font-style: italic;
  margin-left: 10px;
}

.comment.new {
  animation-name: highlight-new;
  animation-duration: 4s;
}

.comment.deleted {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 2s, opacity 2s linear;
}

@keyframes highlight-new {
  from {
    background-color: var(--primary);
    color: white;
  }
  to {
    background-color: initial;
    color: initial;
  }
}
</style>
