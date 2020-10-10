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
          <v-icon class="d-inline mb-2 ml-2" @click="showProjectForm = true">mdi-plus</v-icon>
        </div>

        <v-list>
          <v-list-item
              v-for="project in projects"
              :key="project.id"
              @click="selectProject(project.id)"
              link
          >
            <v-list-item-icon>
              <v-icon>mdi-server</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title
                  :style="project.id === currentProject ? 'font-weight: bold' : ''"
              >
                {{ project.name }}
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-icon v-if="project.editable">
              <v-icon @click="editProjectForm(project)">mdi-pencil</v-icon>
            </v-list-item-icon>
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
          <v-icon color="primary">mdi-help</v-icon>
        </a>
      </v-app-bar>

      <v-main>
        <router-view
            @login="updateLogin"
        />
      </v-main>
    </v-app>

    <ProjectForm
        v-if="showProjectForm"
        @close="showProjectForm = false"
        @save="refreshUser"
        :projects="userProjects"
        :project="projectData"
    ></ProjectForm>
  </div>
</template>

<script>
  import {isLogin, logout} from './libs/auth.js'
  import API from "@/libs/api";
  import ProjectForm from "@/components/ProjectForm";
  export default {
    components: {ProjectForm},
    data: () => ({
      showPanel: null,

      isLogin: false,
      showProjectForm: false,

      currentProject: null,
      projectData: null,

      /* user data */
      username: "",
      photo: "",
      projects: [], // проекты, присутствующие в мониторинге
      userProjects: [] // все проекты пользователя в редмайне
    }),
    methods: {
      go (screen) {
        if(screen.indexOf('/project/') === 0){
          this.currentProject = parseInt(screen.replace('/project/', ''))
        } else {
          this.currentProject = null
        }
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
      },
      selectProject(id) {
        this.go('/project/' + id)
      },
      editProjectForm(project) {
        console.log(['editProjectForm', project])
        this.projectData = project
        this.showProjectForm = true
      }
    },
    mounted: function () {
      this.updateLogin(null)
      this.updateProjectList()
    },
    created() {
      let self = this
      // выделение текущего проекта при загрузке страницы
      setTimeout(function (){
        if(self.$route.name === 'Project'){
          self.currentProject = parseInt(self.$route.params.id)
        }
      }, 1000)
    }
  }
</script>