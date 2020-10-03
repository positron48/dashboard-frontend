<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
              v-model.trim="login"
              label="Логин redmine"
              @keydown.native="onKeyDown"
              required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
              v-model.trim="password"
              type="password"
              label="Пароль redmine"
              @keydown.native="onKeyDown"
              required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            @click="auth()"
          >
            Войти
          </v-btn>
        </v-col>
      </v-row>

      <v-alert
          dense
          v-if="showAlert"
          border="left"
          type="error"
      >
        <v-icon @click="showAlert = false" class="pb-1">
          mdi-close
        </v-icon>
        {{ alertMessage}}
      </v-alert>
    </v-container>
  </div>
</template>

<script>
import API from '@/libs/api.js'
import {isLogin} from '@/libs/auth.js'
export default {
  data () {
    return {
      login: '',
      password: '',
      isLogin: false,
      showAlert: false,
      alertMessage: ''
    }
  },
  methods: {
    auth () {
      this.showAlert = false
      API.auth(this.login, this.password)
        .then(response => {
          if ('success' in response.data && response.data.success) {
            this.isLogin = isLogin()
            this.$emit('login', response.data.user)
          } else if ('message' in response.data && response.data.message) {
            this.alert(response.data.message)
          } else {
            this.alert('Попробуйте позже')
          }
        })
        .catch(error => {
          console.error(['auth error', error])
          this.alert(error)
        })
    },
    onKeyDown (e) {
      if (e.keyCode === 13) { // enter
        this.auth()
      }
    },
    alert (message) {
      this.alertMessage = message
      this.showAlert = true
    }
  },
  mounted: function () {
    this.isLogin = isLogin()
  }
}
</script>