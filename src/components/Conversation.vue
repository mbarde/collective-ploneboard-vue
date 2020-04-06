<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-6 offset-sm-3">
        <b-card :title="title" :sub-title="subTitle">
          <b-card-text v-html="text"></b-card-text>
        </b-card>
        <div v-for="comment in comments" :key="comment['@id']">
          <comment :comment="comment"></comment>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Comment from '@/components/Comment'
import moment from 'moment'
import { getContent } from '../../utils/plone-api.js'

export default {
  name: 'Conversation',
  components: {
    Comment,
  },
  data () {
    return {
      boardId: '',
      topicId: '',
      conversationId: '',
      id: '',
      author: '',
      modified: '',
      title: '',
      subTitle: '',
      text: '',
      comments: [],
    }
  },
  methods: {
  },
  mounted () {
    this.boardId = this.$route.params.boardId
    this.topicId = this.$route.params.topicId
    this.conversationId = this.$route.params.conversationId
    const url = `/${this.boardId}/${this.topicId}/${this.conversationId}`
    getContent(url).then((res) => {
      this.modified = res.modified
      this.title = res.title
      this.text = res.text.data
      getContent(url + '/@history').then((res) => {
        this.author = res.pop().actor.fullname
        let modifiedStr = moment(this.modified).format('DD.MM.YYYY - HH:mm')
        this.subTitle = `von ${this.author} (${modifiedStr} Uhr)`
      })
    })
    getContent(url + '/@comments').then((res) => {
      this.comments = res.items
    })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
