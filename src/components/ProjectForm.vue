<template>
  <v-row justify="center">
    <v-dialog
        v-model="show"
        persistent
        max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Создание проекта</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                    :items="projects"
                    label="Проект"
                    v-model="projectData.externalId"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="12" md="12">
                <v-text-field
                    label="regexp для получения номера задачи из названия ветки"
                    v-model="projectData.regexp"
                    required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="12" md="12">
                <v-checkbox
                    v-model="projectData.useDefaultRedmine"
                    label="Использовать редмайн по умолчанию для получения информации о задачах"
                ></v-checkbox>
              </v-col>

              <v-col
                  cols="12" sm="12" md="12"
                  v-if="!projectData.useDefaultRedmine"
              >
                <v-text-field
                    label="Url редмайна для получения информации о задачах"
                    v-model="projectData.redmineUrl"
                ></v-text-field>
              </v-col>

              <v-col
                  cols="6" sm="12" md="12"
                  v-if="!projectData.useDefaultRedmine"
              >
                <v-text-field
                    label="Логин"
                    v-model="projectData.redmineUser"
                ></v-text-field>
              </v-col>

              <v-col
                  cols="6" sm="12" md="12"
                  v-if="!projectData.useDefaultRedmine"
              >
                <v-text-field
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword"
                    label="Пароль"
                    v-model="projectData.redminePassword"
                ></v-text-field>
              </v-col>

            </v-row>
          </v-container>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="grey darken-1"
              text
              @click="close"
          >
            Закрыть
          </v-btn>
          <v-btn
              color="red darken-1"
              text
              @click="deleteProject"
          >
            Удалить
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              @click="saveProject"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import API from "@/libs/api";

  export default {
    data () {
      return {
        show: true,
        showPassword: false,
        projectData: {
          id: this.project ? this.project.id : null,
          regexp: this.project ? this.project.regexp : '^\\D*(\\d+)',
          externalId: this.project ? this.project.externalId : null,
          useDefaultRedmine: this.project ? this.project.useDefaultRedmine : true,

          redmineUrl: this.project ? this.project.redmineUrl : '',
          redmineUser: '',
          redminePassword: '',
        }
      }
    },
    props: {
      projects: {
        type: Array
      },
      project: {
        type: Object
      }
    },
    methods: {
      saveProject() {
        if(this.projectData.externalId === null){
          alert('Укажите проект')
        } else {
          if (!this.projectData.id) {
            this.createProject()
          } else {
            this.editProject()
          }
        }
      },
      createProject () {
        API.createProject(this.projectData)
            .then(response => {
              if ('success' in response.data && response.data.success) {
                this.$emit('close')
                this.$emit('save')
              } else {
                alert(response.data.message) //todo alert
                console.error(['createProject error'])
              }
            })
            .catch(error => {
              alert(error)
              console.error(['createProject error', error])
            })
      },
      editProject () {
        API.editProject(this.projectData)
            .then(response => {
              if ('success' in response.data && response.data.success) {
                this.$emit('close')
                this.$emit('save')
              } else {
                alert(response.data.message) //todo alert
                console.error(['editProject error'])
              }
            })
            .catch(error => {
              alert(error)
              console.error(['editProject error', error])
            })
      },
      deleteProject () {
        if(confirm('Вы действительно хотите удалить проект?')) {
          let projectId = this.projectData.id
          API.deleteProject(projectId)
              .then(response => {
                if ('success' in response.data && response.data.success) {
                  this.$emit('close')
                  this.$emit('delete', projectId)
                } else {
                  alert(response.data.message) //todo alert
                  console.error(['deleteProject error'])
                }
              })
              .catch(error => {
                alert(error)
                console.error(['deleteProject error', error])
              })
        }
      },
      close () {
        this.$emit('close')
      }
    }
  }
</script>