<template>
  <b-container>
    <b-row>
      <b-col>
        <h4>
          <font-awesome-icon icon="comments"/>
          {{$t('my-conversations')}} ({{conversations.length}})
        </h4>
        <b-list-group
          v-if="initializedConversations"
          class="mb-3">
          <b-list-group-item
            v-for="conversation in conversations"
            :key="conversation['@id']"
            :href="getConversationPath(conversation)">
            {{conversation.title}}
            <small class="float-right">
              {{conversation.modifiedStr}}
            </small>
          </b-list-group-item>
          <p v-if="initializedConversations && conversations.length === 0">
            {{$t('no-conversations-yet')}}
          </p>
        </b-list-group>
        <b-col v-else cols="12" class="text-center">
          <br/><br/>
          <b-spinner :label="$t('loading')" type="grow"></b-spinner>
        </b-col>

        <h4>
          <font-awesome-icon icon="comment"/>
          {{$t('my-comments')}} ({{comments.length}})
        </h4>
        <b-list-group
          v-if="initializedComments"
          class="mb-3">
          <b-list-group-item
            v-for="comment in comments"
            :key="comment['@id']"
            :href="getCommentPath(comment)">
            {{getCommentTitle(comment)}}
            <small class="float-right">
              {{comment.modifiedStr}}
            </small>
          </b-list-group-item>
          <p v-if="initializedComments && comments.length === 0">
            {{$t('no-comments-yet')}}
          </p>
        </b-list-group>
        <b-col v-else cols="12" class="text-center">
          <br/><br/>
          <b-spinner :label="$t('loading')" type="grow"></b-spinner>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import moment from 'moment'
import { getUserId } from '../../utils/auth'
import { BASE_URL } from '../../utils/constants'
import { readContent } from '../../utils/plone-api'
import { dict2querystr } from '../../utils/tools'

export default {
  name: 'UserContent',
  data () {
    return {
      comments: [],
      conversations: [],
      initializedComments: false,
      initializedConversations: false,
    }
  },
  methods: {
    readContents(userId, portalType) {
      let urlParams = {
        'Creator': userId,
        'portal_type': portalType,
        'b_size': '999999',
        'metadata_fields': 'modified',
      }
      let url = '/@search?' + dict2querystr(urlParams)
      return new Promise((resolve) => {
        readContent(url).then((res) => {
          res.items.forEach((item) => {
            item.modified = moment(item.modified)
            item.modifiedStr = item.modified
             .format('DD.MM.YYYY - HH:mm') + ' ' + this.$t('o-clock')
          })
          res.items.sort((a, b) => a.modified < b.modified)
          resolve(res.items)
        })
      })
    },
    getCommentTitle (comment) {
      let parts = comment.title.split(' on ')
      return 'In ' + parts.slice(1).join('')
    },
    getCommentPath (comment) {
      return '#' + comment['@id']
        .replace(BASE_URL, '')
        .replace('/++conversation++default/', '?c=')
    },
    getConversationPath (conversation) {
      return '#' + conversation['@id'].replace(BASE_URL, '')
    },
  },
  mounted () {
    let userId = getUserId()

    this.initializedComments = false
    this.readContents(userId, 'Discussion Item')
      .then((items) => {
        this.comments = items
        this.initializedComments = true
      }
    )

    this.initializedConversations
    this.readContents(userId, 'Conversation')
      .then((items) => {
        this.conversations = items
        this.initializedConversations = true
      }
    )
  },
}
</script>

<style scoped>
</style>
