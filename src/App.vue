<template>
  <div id="app">
    <v-app id="inspire">
      <v-navigation-drawer
          v-model="showPanel"
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
            @click="showPanel = !showPanel"
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
        <router-view @login="updateLogin"/>
      </v-main>
    </v-app>
  </div>
</template>

<script>
  import {isLogin, logout} from './libs/auth.js'
  import API from "@/libs/api";
  export default {
    data: () => ({
      showPanel: null,

      isLogin: false,

      /* user data */
      username: "",
      photo: "",
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
        this.isLogin = false
        this.$router.push('/auth')
      },
      updateLogin (user) {
        this.isLogin = isLogin()
        if (user !== null && user !== undefined) {
          this.updateUserData(user)
        } else if(API.hasToken()) {
          API.getUser(this.login, this.password)
            .then(response => {
              if ('success' in response.data && response.data.success) {
                this.updateUserData(response.data.user)
              } else {
                alert('Не удалось получить данные пользователя') // todo нормальное уведомление
                this.logout()
              }
            })
            .catch(error => {
              console.error(['user get error', error])
              alert('Не удалось получить данные пользователя') // todo нормальное уведомление
              this.logout()
            })
        }

        this.redirectIfNeed()
      },
      updateUserData(user) {
        this.username = user['name']
        this.photo = user['image']
      },
      redirectIfNeed() {
        let page = this.$router.currentRoute.path
        if (this.isLogin) {
          if (page === '/auth' || page === '/') {
            this.go('/')
          }
        } else {
          if (page !== '/auth' && page !== '/help') {
            this.go('/auth')
          }
        }
      }
    },
    mounted: function () {
      this.updateLogin(null)
    }
  }
</script>