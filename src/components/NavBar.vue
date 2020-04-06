<template>
  <div class="nav-container mb-3 mt-3" fluid>
    <b-container>
      <b-nav>
        <b-nav-item
          v-for="(item, index) in navItems"
          :key="index"
          :href="`/#${item.path}`"
          :active="index == navItems.length - 1 ? true : false">
          {{item.title}}
        </b-nav-item>
      </b-nav>
    </b-container>
  </div>
</template>

<script>
import { BASE_URL, readContent } from '../../utils/plone-api.js'

export default {
  name: 'NavBar',
  data () {
    return {
      navItems: [],
    }
  },
  methods: {
    absoluteToRelativePath (absolutePath) {
      return absolutePath.replace(BASE_URL, '')
    },
    update () {
      const url = this.$route.path + '/@breadcrumbs'
      readContent(url).then((res) => {
        this.navItems = []
        res.items.forEach((item) => {
          this.navItems.push({
            title: item.title,
            path: this.absoluteToRelativePath(item['@id'])
          })
        })
      })
    }
  },
  mounted () {
    this.update()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nav-container {
  border-bottom: 4px solid #073F8B;
  border-top: 4px solid #073F8B;
}
.nav .nav-item {
  color: #073F8B;
  display: flex;
}

.nav .nav-item::after {
  content: '>';
  margin-top: 8px;
}

.nav .nav-item:last-child::after {
  content: '';
}
</style>
