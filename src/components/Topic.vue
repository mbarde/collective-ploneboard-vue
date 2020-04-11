<template>
  <b-container>
    <b-row>
      <b-col>
        <h1>{{title}}</h1>
        <p v-if="description.length > 0">{{description}}</p>
        <template v-if="initialized">
          <b-list-group>
            <b-list-group-item
              class="conversation"
              v-for="conversation in conversations"
              :key="conversation['@id']"
              :href="getConversationUrl(conversation)">
              <b-row>
                <b-col cols="12" md="8">
                  {{conversation.title}}
                  <br/>
                  <i class="author">von {{conversation.author}} </i>
                  <i class="date">({{conversation.modified_string}})</i>
                </b-col>
                <b-col cols="12" md="4">
                  <span class="d-none d-md-inline">
                    <i class="comments">
                      {{conversation.comment_count}}
                        {{conversation.comment_count > 1 ? 'Kommentare' : 'Kommentar'}}
                    </i>
                    <i class="newest-comment"
                       v-if="conversation.comments_modified_string">
                       letzter: {{conversation.comments_modified_string}}
                    </i>
                  </span>
                  <span class="d-xs-inline d-sm-inline d-md-none comments-mobile">
                    <font-awesome-icon icon="comment"/>
                    {{conversation.comment_count}}
                    <span v-if="conversation.comments_modified_string"
                          class="ml-2">
                      <font-awesome-icon icon="clock"/>
                      {{conversation.comments_modified_string}}
                    </span>
                  </span>
                </b-col>
              </b-row>
            </b-list-group-item>
          </b-list-group>

          <hr/>
          <conversation-form
            v-if="url.length > 0"
            :topic-url="url"
            v-on:conversation-created="onConversationCreated"
          ></conversation-form>
        </template>

        <b-col v-else cols="12" class="text-center">
          <br/><br/>
          <b-spinner label="Loading..." type="grow"></b-spinner>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { readContent } from '../../utils/plone-api'
import { mail2userid, url2id } from '../../utils/tools'
import ConversationForm from '@/components/ConversationForm'
import moment from 'moment'

export default {
  name: 'Topic',
  components: {
    ConversationForm,
  },
  data () {
    return {
      initialized: false,
      boardId: '',
      topicId: '',
      url: '',
      title: '',
      description: '',
      conversations: [],
    }
  },
  methods: {
    getConversationUrl (conversation) {
      const conversationId = url2id(conversation['@id'])
      return `#/${this.boardId}/${this.topicId}/${conversationId}`
    },
    onConversationCreated (newConversationId) {
      /* jump to newly created conversation */
      this.$router.push(`${this.url}/${newConversationId}`)
    },
    findMostCurrentComment (comments) {
      let mostCurrentComment = comments[0]
      let mostCurrentModified = moment(comments[0].modification_date)
      comments.slice(1).forEach((comment) => {
        let compareDate = moment(comment.modification_date)
        if (compareDate > mostCurrentModified) {
          mostCurrentComment = comment
          mostCurrentModified = compareDate
        }
      })
      return mostCurrentComment
    }
  },
  mounted () {
    this.initialized = false
    this.boardId = this.$route.params.boardId
    this.topicId = this.$route.params.topicId
    this.url = `/${this.boardId}/${this.topicId}`

    readContent(this.url).then((res) => {
      this.title = res.title
      this.description = res.description
      this.conversations = res.items

      let promises = []
      this.conversations.forEach((conversation) => {
        promises.push(new Promise((resolve) => {
          readContent(conversation['@id']).then((res) => {
            conversation.author = mail2userid(res.creators.pop())
            conversation.modified = moment(res.modified)
            conversation.modified_string = conversation.modified
              .format('DD.MM.YYYY - HH:mm') + ' Uhr'
            resolve()
          })
        }))

        /* get comment count of each conversation */
        promises.push(new Promise((resolve) => {
          readContent(conversation['@id'] + '/@comments?b_size=999999').then((res) => {
            conversation.comment_count = res.items_total

            if (res.items_total == 0) {
              conversation.comments_modified = conversation.modified
              conversation.comments_modified_string = ''
            } else {
              let mcc = this.findMostCurrentComment(res.items)
              conversation.comments_modified = moment
                .utc(mcc.modification_date)
                .local()
              conversation.comments_modified_string = conversation.comments_modified
                .format('DD.MM.YYYY - HH:mm') + ' Uhr'
            }
            resolve()
          })
        }))
      })
      Promise.all(promises).then(() => {
        this.initialized = true
        this.conversations.sort((a, b) => {
          return a.comments_modified < b.comments_modified
        })
      })
    }).catch(() => {
      this.$emit('content-not-found')
    })
  },
}
</script>

<style scoped>
.list-group-item.conversation i.author,
.list-group-item.conversation i.date {
  font-size: 90%;
  font-style: italic;
}
.list-group-item.conversation i.comments,
.list-group-item.conversation i.newest-comment {
  color: black;
  display: block;
  font-size: 80%;
  font-style: italic;
  line-height: 24px;
  text-align: right;
}

.list-group-item.conversation span.comments-mobile {
  color: black;
  font-size: 80%;
  font-style: italic;
}


</style>
