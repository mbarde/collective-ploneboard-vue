<template>
  <b-container>
    <b-row>
      <b-col>
          <h3>{{title}}</h3>
          <p v-if="html.length > 0" v-html="html"></p>
          <b-alert v-if="errMsg.length > 0" v-html="errMsg"
                   show variant="danger"></b-alert>
          <div class="form-group">
            <input v-model.lazy="usermail" name="email"
                   placeholder="E-Mail Adresse (Universität)"
                   @keyup.enter="login()"
                   class="form-control" type="email"/>
          </div>
          <div class="form-group">
            <input v-model.lazy="password" name="password"
                   type="password" placeholder="Passwort"
                   @keyup.enter="login()"
                   class="form-control"/>
          </div>
          <button class="btn btn-primary btn-block"
                  @click="login()"
                  :disabled="tryingLogin">
            <b-spinner small v-if="tryingLogin"></b-spinner>
            <font-awesome-icon v-else icon="sign-in-alt"/> Login
          </button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { login, readContent, readStaticPage } from '../../utils/plone-api'
import { isLoggedIn, setUsername, setUserId } from '../../utils/auth'

export default {
  name: 'Login',
  data () {
    return {
      usermail: '',
      password: '',
      errMsg: '',
      tryingLogin: false,
      title: '',
      html: '',
    }
  },
  methods: {
    login () {
      this.tryingLogin = true
      login(this.usermail, this.password).then((response) => {
        if (response === 401) {
          this.tryingLogin = false
          this.errMsg = 'E-Mail Adresse oder Passwort falsch!'
        }
        if (isLoggedIn()) {
          readContent('/@users/' + this.usermail).then((res) => {
            var fullname = `${res.prename} ${res.fullname}`.trim()
            setUserId(res.id)
            setUsername(fullname)
            this.$emit('logged-state-changed')
          })
        }
      })
    },
  },
  mounted () {
    if (isLoggedIn()) {
      this.$router.push('/')
    }
    readStaticPage('signin').then((res) => {
      this.title = res.title
      this.html = res.text.data
    })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
