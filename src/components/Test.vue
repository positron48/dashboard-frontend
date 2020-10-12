<template>
  <v-row>
    <v-col cols="12" xs="2" sm="2" md="2">
      <div>
        {{test.name}}
        <v-btn icon @click="emitEdit">
          <v-icon x-small color="grey">
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click="emitCopy">
              <v-icon v-bind="attrs" v-on="on" x-small color="grey">
                mdi-content-copy
              </v-icon>
            </v-btn>
          </template>
          <span>Создать копию</span>
        </v-tooltip>
      </div>
      <div class="grey--text task-comment">
        <span @click="editCommentClick" v-if="!isEdit">
          {{test.comment ? test.comment : 'комментарий'}}
        </span>
        <v-text-field
            ref="commentInput"
            @blur="saveComment"
            v-if="isEdit"
            label="комментарий"
            v-model="test.comment"
        ></v-text-field>
      </div>
    </v-col>

    <v-col cols="12" xs="2" sm="2" md="2">
      <div v-if="testData && testData.branch">
        {{testData.branch}}
      </div>
      <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
      ></v-progress-circular>
    </v-col>

    <v-col cols="12" xs="5" sm="5" md="6">
      <div class="" v-if="testData && testData.redmineData && testData.redmineData.status">
        <v-chip small label>
          {{testData.redmineData.status}}
        </v-chip>
      </div>
      <div class="task-title" v-if="testData && testData.redmineData && testData.redmineData.subject">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <a target="_blank" :href="testData.redmineData.link">
              <span
                  v-bind="attrs"
                  v-on="on"
              >{{testData.redmineData.subject}}</span>
            </a>
          </template>
          <span>{{testData.redmineData.project}}: {{testData.redmineData.subject}}</span>
        </v-tooltip>
      </div>
      <div class="task-assigned" v-if="testData && testData.redmineData && testData.redmineData.assignedTo">
        <v-icon
            dense
            small
            style="margin-top: -5px"
        >
          mdi-face
        </v-icon>
        {{testData.redmineData.assignedTo}}
      </div>
    </v-col>

    <v-col cols="12" xs="2" sm="2" md="1">
      <div v-if="testData && testData.additional && testData.additional.length">
        <template v-for="prop in testData.additional">
          <v-tooltip bottom v-if="prop.type === 'hint'" :key="prop.title + '_' + test.id">
            <template v-slot:activator="{ on, attrs }">
              <a :href="prop.hint" v-if="prop.hint.indexOf('http') !== -1" class="link--no-decoration">
                <v-chip
                    outlined
                    v-bind="attrs"
                    v-on="on"
                >
                  {{prop.title}}: {{prop.text}}
                </v-chip>
              </a>
              <v-chip
                  outlined
                  v-bind="attrs"
                  v-on="on"
                  v-if="prop.hint.indexOf('http') === -1"
              >
                {{prop.title}}: {{prop.text}}
              </v-chip>
            </template>
            <span>{{prop.hint}}</span>
          </v-tooltip>
        </template>
      </div>
    </v-col>

    <v-col cols="12" xs="1" sm="1" md="1">
      <v-btn icon>
        <v-icon color="primary" @click="getTestData">
          mdi-refresh
        </v-icon>
      </v-btn>
      <br>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon @click="getTestStatus">
            <v-icon color="primary">
              mdi-list-status
            </v-icon>
          </v-btn>
        </template>
        <span>git status</span>
      </v-tooltip>
    </v-col>

    <v-col
        cols="12" xs="12" sm="12" md="12"
        v-if="diffLoading"
    >
      <v-progress-circular
          v-if="diffLoading"
          indeterminate
          color="primary"
      ></v-progress-circular>
    </v-col>

    <v-col
        cols="12" xs="12" sm="12" md="12"
        v-if="diffLoaded"
    >
      <template v-for="item in testData.diff.added">
        <div :key="item" class="green--text">{{item}}</div>
      </template>
      <template v-for="item in testData.diff.modified">
        <div :key="item" class="orange--text">{{item}}</div>
      </template>
      <template v-for="item in testData.diff.deleted">
        <div :key="item" class="red--text">{{item}}</div>
      </template>
      <template v-for="item in testData.diff.untracked">
        <div :key="item" class="grey--text">{{item}}</div>
      </template>
      <div>
        {{diffMessage}}
      </div>
    </v-col>
  </v-row>
</template>

<script>
import API from "@/libs/api";

export default {
  name: 'Test',
  data () {
    return {
      testData: null,
      loading: true,
      diffLoading: false,
      diffLoaded: false,
      diffMessage: "",

      isEdit: false
    }
  },
  props: {
    test: {}
  },
  methods: {
    getTestData() {
      let self = this
      this.loading = true
      this.diffLoaded = false
      this.testData = null
      API.getTestData(this.test.id)
          .then(response => {
            if ('success' in response.data && response.data.success) {
              self.testData = response.data.test
            } else {
              alert(response.data.message) // todo нормальное уведомление
            }
            this.loading = false
          })
          .catch(error => {
            console.error(['test get error', error])
            alert(error) // todo нормальное уведомление
            this.loading = false
          })
    },
    getTestStatus() {
      let self = this

      if(this.diffLoaded) {
        this.diffLoaded = false
        this.testData.diff.added = []
        this.testData.diff.modified = []
        this.testData.diff.deleted = []
        this.testData.diff.untracked = []
      } else {
        this.diffLoading = true
        API.getTestStatus(this.test.id)
            .then(response => {
              if ('success' in response.data && response.data.success) {
                self.testData = response.data.test
              } else {
                alert(response.data.message) // todo нормальное уведомление
              }
              this.diffLoading = false
              this.diffLoaded = true
              this.diffMessage = ''
            })
            .catch(error => {
              console.error(['getTestStatus error', error])
              alert(error) // todo нормальное уведомление
              this.diffLoading = false
              this.diffLoaded = false
              this.diffMessage = 'ошибка получения данных'
            })
      }
    },
    emitEdit() {
      this.$emit('edit', this.test)
    },
    emitCopy() {
      this.$emit('copy', this.test)
    },
    editCommentClick() {
      this.isEdit = true;
      this.focusComment()
    },
    focusComment() {
      this.$nextTick(() => {
        //this one works perfectly
        this.$refs.commentInput.focus()
      })
    },
    saveComment() {
      this.isEdit = false;
      this.$emit('editComment', this.test)
    }
  },
  mounted: function() {
    this.getTestData();
  }
}
</script>
<style>
.link--no-decoration{
  text-decoration: none;
}
.task-title, .task-assigned{
  max-height: 25px;
  overflow: hidden;
}
.task-title .v-chip{
  margin-top: -2px;
  margin-right: 10px;
}
.task-comment{
  font-size: 14px;
}
</style>