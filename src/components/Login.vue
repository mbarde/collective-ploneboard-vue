<template>
  <b-container>
    <b-row>
      <b-col v-if="title.length > 0">
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
            <font-awesome-icon v-if="!tryingLogin" icon="sign-in-alt"/> Login
          </button>
      </b-col>
      <b-col v-else class="text-center">
        <br/><br/>
        <b-spinner label="Loading..." type="grow"></b-spinner>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { isLoggedIn, setUsername, setUserId } from '../../utils/auth'
import { MESSAGE_BOARD_ID, SESS_GOTO_AFTER_LOGIN } from '../../utils/constants'
import { login, readContent, readStaticPage } from '../../utils/plone-api'
import { mail2userid } from '../../utils/tools'

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
            let fullname = mail2userid(res.username)
            setUserId(res.id)
            setUsername(fullname)
            this.$emit('logged-state-changed')
            this.afterLogin()
          })
        }
      })
    },
    afterLogin () {
      let nextLocation = sessionStorage.getItem(SESS_GOTO_AFTER_LOGIN) || ''
      if (nextLocation === undefined || nextLocation.length === 0) {
        nextLocation = '/' + MESSAGE_BOARD_ID
      }
      this.$router.push(nextLocation)
      sessionStorage.setItem(SESS_GOTO_AFTER_LOGIN, '')
    }
  },
  mounted () {
    if (isLoggedIn()) this.afterLogin()
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
