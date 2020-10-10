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
              <v-col
                  cols="12"
                  sm="12"
              >
                <v-autocomplete
                    :items="projects"
                    label="Проект"
                    v-model="projectData.externalId"
                ></v-autocomplete>
              </v-col>

              <v-col
                  cols="12"
                  sm="12"
                  md="12"
              >
                <v-text-field
                    label="regexp для получения номера задачи из названия ветки"
                    v-model="projectData.regexp"
                    required
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
        projectData: {
          id: this.project ? this.project.id : null,
          regexp: this.project ? this.project.regexp : '^\\D*(\\d+)',
          externalId: this.project ? this.project.externalId : null
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
                alert('createProject error') //todo alert
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
                alert('editProject error') //todo alert
                console.error(['editProject error'])
              }
            })
            .catch(error => {
              alert(error)
              console.error(['editProject error', error])
            })
      },
      close () {
        this.$emit('close')
      }
    },
    mounted() {
      console.log([this.project, this.projectData])
    }
  }
</script>