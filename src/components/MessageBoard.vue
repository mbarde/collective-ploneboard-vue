<template>
  <b-container>
    <b-row>
      <b-col>
        <h3>{{title}}</h3>
        <p v-if="description.length > 0"
           v-html="description"></p>
        <b-list-group v-if="initialized">
          <b-list-group-item class="topic"
            v-for="topic in topics"
            :key="topic['@id']"
            :href="getTopicUrl(topic)">
              <h4>{{topic.title}}</h4>
              {{getTopicDescription(topic)}}
              <i>
                {{topic.conversation_count}}
                {{topic.conversation_count > 1 ? 'Unterhaltungen' : 'Unterhaltung'}}
              </i>
          </b-list-group-item>
        </b-list-group>
        <b-col v-else cols="12" class="text-center">
          <br/><br/>
          <b-spinner label="Loading..." type="grow"></b-spinner>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { AUTO_FORMAT_LINKS, MAX_DESCRIPTION_LENGTH } from '../../utils/constants'
import { readContent } from '../../utils/plone-api'
import { autoInsertHtmlLinks, extractFirstSentence, url2id } from '../../utils/tools'

export default {
  name: 'MessageBoard',
  data () {
    return {
      initialized: false,
      id: '',
      title: '',
      description: '',
      topics: [],
    }
  },
  methods: {
    getTopicUrl (topic) {
      const topicId = url2id(topic['@id'])
      return `#/${this.id}/${topicId}`
    },
    getTopicDescription (topic) {
      let description = topic.description
      description = extractFirstSentence(description)
      if (description.length > MAX_DESCRIPTION_LENGTH) {
        description = description.slice(
          0, MAX_DESCRIPTION_LENGTH
        ) + ' [...]'
      }
      return description
    }
  },
  mounted () {
    const url = `/${this.$route.params.boardId}`
    readContent(url).then((res) => {
      this.id = res.id
      this.title = res.title
      if (AUTO_FORMAT_LINKS === true) {
        this.description = autoInsertHtmlLinks(res.description)
      } else {
        this.description = res.description
      }
      this.topics = res.items

      /* get conversation count of each topic */
      let promises = []
      this.topics.forEach((topic) => {
        promises.push(new Promise((resolve) => {
          readContent(topic['@id']).then((res) => {
            topic.conversation_count = res.items_total
            resolve()
          })
        }))
      })
      Promise.all(promises).then(() => {
        this.initialized = true
      })
    }).catch(() => {
      this.$emit('content-not-found')
    })
  },
}
</script>

<style scoped>
.list-group-item.topic i {
  color: black;
  float: right;
  font-size: 80%;
  font-style: italic;
}
</style>
