<template>
  <b-row>
    <b-col :offset="offset">
      <b-card :id="`comment-${id}`" :class="cssClasses.join(' ')">
        <template v-slot:header>
          <span class="author">{{author}} sagt:</span>
          <span class="date">{{date}}</span>
        </template>
        <b-card-text>{{text}}</b-card-text>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Comment',
  props: ['comment', 'isNew'],
  data () {
    return {
      cssClasses: ['comment', 'mt-3'],
      id: '',
      author: '',
      date: '',
      text: '',
      offset: 0,
    }
  },
  methods: {
  },
  mounted () {
    this.id = this.comment.comment_id
    this.author = this.comment.author_name
    this.date = moment(this.comment.modification_date).format('DD.MM.YYYY - HH:mm') + ' Uhr'
    this.text = this.comment.text.data
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
