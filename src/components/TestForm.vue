<template>
  <v-row justify="center">
    <v-dialog
        v-model="show"
        persistent
        max-width="800px"
    >
      <v-card v-if="testData">
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

            <v-row>
              <v-col>
                <h4>Ссылки на площадки</h4>
              </v-col>
            </v-row>

            <template v-for="(item, index) in testData.links">
              <v-row :key="index">
                <v-col cols="12" md="4">
                  <v-text-field
                      label="название"
                      v-model="item.title"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="7">
                  <v-text-field
                      label="ссылка"
                      v-model="item.link"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="1">
                  <v-btn icon @click="deleteLink(index)">
                    <v-icon color="red">
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </template>

            <v-btn outlined @click="addSiteLink">
              Добавить ссылку
            </v-btn>
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
              @click="deleteTest"
          >
            Удалить
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
  export default {
    data () {
      console.log(this.test)
      return {
        show: true,
        testData: {
          id: this.test ? this.test.id : "",
          name: this.test ? this.test.name : "",
          script: this.test ? this.test.script : "",
          comment: this.test ? this.test.comment : "",
          links: (this.test && this.test.links && this.test.links.length) ? this.test.links : [
            {
              title: '',
              link: ''
            }
          ]
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
      addSiteLink() {
        this.testData.links.push({id: null, title: '', link: ''})
      },
      saveTest() {
        this.$emit('save', this.testData)
      },
      deleteTest() {
        this.$emit('delete', this.testData)
      },
      deleteLink(index){
        this.testData.links.splice(index, 1)
      },
      close () {
        this.$emit('close')
      }
    }
  }
</script>