<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-6 offset-sm-3">
          <h1>Login</h1>
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
      </div>
    </div>
  </div>
</template>

<script>
import { login, getContent } from '../../utils/plone-api'
import { isLoggedIn, setUsername, setUserId, setUserIsAdmin } from '../../utils/auth'

export default {
  name: 'Login',
  data () {
    return {
      usermail: '',
      password: '',
      errMsg: '',
      tryingLogin: false
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
          getContent('/@users/' + this.usermail).then((res) => {
            var fullname = `${res.prename} ${res.fullname}`.trim()
            setUserId(res.id)
            setUsername(fullname)

            this.checkForAdminStatus()
          })
        }
      })
    },
    checkForAdminStatus () {
      // check if user is an admin
      getContent('/sessions/').then((response) => {
        if (typeof response.items === 'object') {
          setUserIsAdmin(true)
        }
        this.$router.push('/')
      })
    },
  },
  mounted () {
    if (isLoggedIn()) {
      this.$router.push('/')
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
