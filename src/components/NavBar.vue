<template>
  <div class="nav-container mb-3 mt-3" fluid>
    <b-container>
      <b-nav>
        <b-nav-item
          v-for="(item, index) in navItems"
          :key="index"
          :href="`#${item.path}`"
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
      this.navItems = [{
        title: 'Start',
        path: '/'
      }]

      if (this.$route.path == '/login') {
        this.navItems.push({
          title: 'Login',
          path: '/login'
        })
        return
      }

      if (this.$route.path == '/profile') {
        this.navItems.push({
          title: 'Meine Beiträge',
          path: '/profile'
        })
        return
      }

      /* otherwise automatically create breadcrumbs */
      const url = this.$route.path + '/@breadcrumbs'
      readContent(url).then((res) => {
        if (res.items != undefined) {
          res.items.forEach((item) => {
            this.navItems.push({
              title: item.title,
              path: this.absoluteToRelativePath(item['@id'])
            })
          })
        }
      })
    }
  },
  mounted () {
    this.update()
  },
}
</script>

<style scoped>
.nav-container {
  border-bottom: 4px solid var(--primary);
  border-top: 4px solid var(--primary);
}
.nav .nav-item {
  color: var(--primary);
  display: flex;
}

.nav .nav-item::after {
  content: '>';
  margin-top: 8px;
}

.nav .nav-item:first-child a {
  padding-left: 0;
}

.nav .nav-item:last-child::after {
  content: '';
}
</style>
