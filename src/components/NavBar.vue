<template>
  <div class="nav-container mb-3 mt-3" fluid>
    <b-container>
      <b-nav>
        <b-nav-item href="#/" class="d-none d-sm-flex">
          <font-awesome-icon icon="home"/>
        </b-nav-item>
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
import { BASE_URL } from '../../utils/constants'
import { readContent } from '../../utils/plone-api'

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
      this.navItems = []

      if (this.$route.path == '/login') {
        this.navItems.push({
          title: this.$t('login'),
          path: '/login'
        })
        return
      }

      if (this.$route.path == '/profile') {
        this.navItems.push({
          title: this.$t('my-content'),
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

@media (max-width: 575px) {
  .nav .nav-item {
    width: 100%;
  }
}

.nav .nav-item::before {
  content: '>';
  margin-left: -5px;
  margin-right: -5px;
  margin-top: 8px;
}

.nav .nav-item:first-child a {
  padding-left: 0;
}

.nav .nav-item:first-child::before {
  content: '';
}
</style>
