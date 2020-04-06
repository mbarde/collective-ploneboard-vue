<template>
  <div id="app" class="container">
    <img class="logo" src="./assets/logo.png" alt="Logo Universität Koblenz - Landau"/>
    <nav-bar ref="navbar"></nav-bar>
    <div class="content">
      <router-view/>
    </div>
    <br/>
    <!-- <app-footer></app-footer> -->
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'

export default {
  name: 'App',
  components: {
    NavBar,
  },
  watch: {
    $route() {
      this.$refs.navbar.update()
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style lang="scss">
// Import custom SASS variable overrides, or alternatively
// define your variable overrides here instead
@import './assets/custom-vars.scss';

// Import Bootstrap and BootstrapVue source SCSS files
@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/src/index.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: black;
  margin-top: 20px;
}

#app a {
  color: #073F8B;
}

#app .card {
  border-radius: 0;
}

#app .logo {
  width: 200px;
}
</style>
