<template>
  <b-row>
    <b-col :offset="offset">
      <b-card class="comment mt-3">
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
  props: ['comment'],
  data () {
    return {
      author: '',
      date: '',
      text: '',
      offset: 0,
    }
  },
  methods: {
  },
  mounted () {
    this.author = this.comment.author_name
    this.date = moment(this.comment.modification_date).format('DD.MM.YYYY - HH:mm') + ' Uhr'
    this.text = this.comment.text.data
    if (this.comment.in_reply_to != null) this.offset = 1
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.comment .card-header {
  font-size: 80%;
}

.comment .date {
  float: right;
  font-style: italic;
}
</style>
