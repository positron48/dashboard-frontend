<template>
  <v-row justify="center">
    <v-dialog
        v-model="show"
        persistent
        max-width="800px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Создание тестовой площадки</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                  cols="12"
                  sm="12"
                  md="12"
              >
                <v-text-field
                    label="название"
                    v-model="test.name"
                    required
                ></v-text-field>
              </v-col>

              <v-col
                  cols="12"
                  sm="12"
                  md="12"
              >
                <v-text-field
                    label="url скрипта для получения статуса"
                    v-model="test.script"
                    required
                ></v-text-field>
              </v-col>

              <v-col
                  cols="12"
                  sm="12"
                  md="12"
              >
                <v-text-field
                    label="комментарий"
                    v-model="test.comment"
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
              @click="createTest"
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
      test: {
        id: null,
        name: null,
        script: null,
        comment: null,
      }
    }),
    props: {
      project: {
        type: Number
      }
    },
    methods: {
      createTest () {
        API.createTest(this.test, this.project)
            .then(response => {
              if ('success' in response.data && response.data.success) {
                this.test.id = response.data.id
                this.$emit('close')
                this.$emit('create', this.test)
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
      close () {
        this.$emit('close')
      }
    }
  }
</script>