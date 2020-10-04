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

        <div class="ml-5 mt-5 ">
          <p class="d-inline text-h6">Проекты</p>
          <v-icon class="d-inline pb-2 pl-2" @click="addProject = true">mdi-plus</v-icon>
        </div>

        <v-list>
          <v-list-item
              v-for="project in projects"
              :key="project.id"
              link
          >
            <v-list-item-icon>
              <v-icon>mdi-server</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ project.name }}</v-list-item-title>
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

    <NewProject
        v-if="addProject"
        @close="addProject = false"
        @create="refreshUser"
        :projects="userProjects"
    ></NewProject>
  </div>
</template>

<script>
  import {isLogin, logout} from './libs/auth.js'
  import API from "@/libs/api";
  import NewProject from "@/components/NewProject";
  export default {
    components: {NewProject},
    data: () => ({
      showPanel: null,

      isLogin: false,
      addProject: false,

      /* user data */
      username: "",
      photo: "",
      projects: [], // проекты, присутствующие в мониторинге
      userProjects: [] // все проекты пользователя в редмайне
    }),
    methods: {
      go (screen) {
        if(this.$router.currentRoute.path === screen){
          return
        }
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
          this.refreshUser()
        }
        this.redirectIfNeed()
      },
      updateUserData(user) {
        this.username = user['name']
        this.photo = user['image']
        this.projects = user['projects']
      },
      refreshUser() {
        API.getUser(this.login, this.password)
            .then(response => {
              if ('success' in response.data && response.data.success) {
                this.updateUserData(response.data.user)
                this.updateProjectList()
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
      },
      updateProjectList() {
        API.getProjects()
          .then(response => {
            if ('success' in response.data && response.data.success) {
              this.userProjects = response.data.projects
            } else {
              console.error(['getProjects error'])
            }
          })
          .catch(error => {
            console.error(['getProjects error', error])
          })
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
      this.updateProjectList()
    }
  }
</script>