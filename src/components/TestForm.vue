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
                    v-model="testData.name"
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
                    v-model="testData.script"
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
                    v-model="testData.comment"
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
              color="primary darken-1"
              text
              @click="saveTest"
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
        testData: {
          id: this.test ? this.test.id : "",
          name: this.test ? this.test.name : "",
          script: this.test ? this.test.script : "",
          comment: this.test ? this.test.comment : ""
        }
      }
    },
    props: {
      project: {
        type: Number
      },
      test: {
        type: Object
      }
    },
    methods: {
      saveTest() {
        if(!this.testData.id){
          this.createTest()
        } else {
          this.editTest()
        }
      },
      createTest () {
        API.createTest(this.testData, this.project)
            .then(response => {
              if ('success' in response.data && response.data.success) {
                this.testData.id = response.data.id
                this.$emit('close')
                this.$emit('save', this.testData)
              } else {
                alert(response.data.message) //todo alert
                console.error(['createTest error'])
              }
            })
            .catch(error => {
              alert(error)
              console.error(['createTest error', error])
            })
      },
      editTest () {
        API.editTest(this.testData)
            .then(response => {
              if ('success' in response.data && response.data.success) {
                this.$emit('close')
                this.$emit('save', this.testData)
              } else {
                alert(response.data.message) //todo alert
                console.error(['editTest error'])
              }
            })
            .catch(error => {
              alert(error)
              console.error(['editTest error', error])
            })
      },
      close () {
        this.$emit('close')
      }
    }
  }
</script>