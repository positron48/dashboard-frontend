<template>
  <div id="app">
    <v-app id="inspire">
      <v-navigation-drawer
          v-model="drawer"
          v-if="isLogin"
          app
      >
        <v-sheet
            color="grey lighten-4"
            class="pa-4"
        >
          <v-avatar
              class="mb-4"
              color="grey darken-1"
              size="64"
          >
            <v-img
                max-height="100"
                max-width="100"
                :src="photo"
            ></v-img>
          </v-avatar>

          <div>{{ username }}</div>
        </v-sheet>

        <v-divider></v-divider>

        <p class="pl-5 pt-5 text-h6">Проекты</p>

        <v-list>
          <v-list-item
              v-for="text in projects"
              :key="text"
              link
          >
            <v-list-item-icon>
              <v-icon>mdi-server</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app>
        <v-app-bar-nav-icon
            v-if="isLogin"
            @click="drawer = !drawer"
        >

        </v-app-bar-nav-icon>

        <a @click="go('/')">
          <v-btn
            text
          >
            Dashboard
          </v-btn>
        </a>

        <v-spacer></v-spacer>

        <a v-if="isLogin" @click="logout()" class="mr-2">
          <v-icon>mdi-door</v-icon>
        </a>
        <a @click="go('/help')">
          <v-icon>mdi-help</v-icon>
        </a>
      </v-app-bar>

      <v-main>
        <router-view/>
      </v-main>
    </v-app>
  </div>
</template>

<script>
  import {isLogin, logout} from './libs/auth.js'
  export default {
    data: () => ({
      drawer: null,

      isLogin: false,
      loginText: '',

      /* test data */
      username: "filatov@intaro.ru",
      photo: "https://www.gravatar.com/avatar/3a1d1cc4974b08ebd74113167b65443a?rating=PG&size=100&default=retro",
      projects: [
          "Multisite",
          "Re-new",
      ]
    }),
    methods: {
      go (screen) {
        if (screen !== '/help' && !this.isLogin) {
          this.$router.push('/auth')
        } else {
          this.$router.push(screen)
        }
      },
      logout () {
        logout()
        this.$router.push('/auth')
      },
      updateLogin () {
        this.isLogin = isLogin()
        this.loginText = this.isLogin ? 'Выйти' : 'Войти'
        let page = location.pathname.substr(1)
        if (this.isLogin) {
          if (page === 'auth' || page === '') {
            this.go('/')
          }
        } else {
          if (page !== 'auth' && page !== 'help') {
            this.go('/auth')
          }
        }
      },
    },
    mounted: function () {
      this.updateLogin()
    }
  }
</script>