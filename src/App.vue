<template>
  <div id="app">
    <b-container>
      <a href="/#/">
        <img class="logo"
             src="./assets/logo.png"
             alt="Logo Universität Koblenz - Landau"/>
      </a>
    </b-container>
    <nav-bar ref="navbar"></nav-bar>
    <div class="content">
      <router-view/>
    </div>
    <br/>
    <app-footer></app-footer>
  </div>
</template>

<script>
import AppFooter from '@/components/AppFooter'
import NavBar from '@/components/NavBar'

export default {
  name: 'App',
  components: {
    AppFooter,
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

@font-face {
  font-family: 'Raleway';
  src: url('./assets/Raleway-Regular.ttf') format('truetype');
}

html {
  height: 100%;
}

body > div {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* Avoid the IE 10-11 `min-height` bug. */
}

.content {
  flex: 1 0 auto;
  /* Prevent Chrome, Opera, and Safari from letting these items shrink to smaller than their content's default minimum size. */
}

.footer {
  flex-shrink: 0;
  /* Prevent Chrome, Opera, and Safari from letting these items shrink to smaller than their content's default minimum size. */
}

#app {
  font-family: Raleway, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: black;
  padding-top: 20px;
}

#app a {
  color: #073F8B;
}

#app .logo {
  width: 200px;
}
</style>
