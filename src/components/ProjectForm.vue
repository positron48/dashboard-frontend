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
                    v-model="project"
                ></v-autocomplete>
              </v-col>

              <v-col
                  cols="12"
                  sm="12"
                  md="12"
              >
                <v-text-field
                    label="regexp для получения номера задачи из названия ветки"
                    v-model="regexp"
                    required
                ></v-text-field>
              </v-col>

            </v-row>
          </v-container>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="close"
          >
            Закрыть
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              @click="createProject"
          >
            Добавить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import API from "@/libs/api";

  export default {
    data: () => ({
      show: true,
      regexp: '^\\D*(\\d+)',
      project: null
    }),
    props: {
      projects: {
        type: Array
      }
    },
    methods: {
      createProject () {
        if(this.project === null){
          alert('Укажите проект')
        } else {
          API.createProject(this.project, this.regexp)
              .then(response => {
                if ('success' in response.data && response.data.success) {
                  this.$emit('close')
                  this.$emit('create')
                } else {
                  alert('createProject error') //todo alert
                  console.error(['createProject error'])
                }
              })
              .catch(error => {
                alert(error)
                console.error(['createProject error', error])
              })
        }
      },
      close () {
        this.$emit('close')
      }
    }
  }
</script>