<template>
  <div id="app" class="container">
    <div class="content">
      <!-- <app-nav></app-nav> -->
      <router-view/>
    </div>
    <br/>
    <!-- <app-footer></app-footer> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: black;
  margin-top: 60px;
}
</style>
