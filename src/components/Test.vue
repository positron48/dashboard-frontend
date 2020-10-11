<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title>
        {{test.name}}
        <v-btn icon @click="emitEdit">
          <v-icon x-small color="grey">
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn icon @click="emitCopy">
          <v-icon x-small color="grey">
            mdi-content-copy
          </v-icon>
        </v-btn>
      </v-list-item-title>
      <v-list-item-subtitle>
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
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-content>
      <v-list-item-title v-if="testData && testData.branch" v-text="testData.branch"></v-list-item-title>
      <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
      ></v-progress-circular>
    </v-list-item-content>

    <v-list-item-content>
      <v-list-item-title v-if="testData && testData.redmineData">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
        <span
            v-bind="attrs"
            v-on="on"
        >{{testData.redmineData.status}}</span>
          </template>
          <span>{{testData.redmineData.project}}: {{testData.redmineData.subject}}</span>
        </v-tooltip>
      </v-list-item-title>
      <v-list-item-subtitle v-if="testData && testData.redmineData && testData.redmineData.assignedTo">
        <v-icon
            dense
            small
            style="margin-top: -5px"
        >
          mdi-face
        </v-icon>
        {{testData.redmineData.assignedTo}}
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-content v-if="testData && testData.additional && testData.additional.length">
      <template v-for="prop in testData.additional">
        <v-tooltip bottom v-if="prop.type === 'hint'" :key="prop.title + '_' + test.id">
          <template v-slot:activator="{ on, attrs }">
            <v-chip
                outlined
                v-bind="attrs"
                v-on="on"
            >
              {{prop.text}}
            </v-chip>
          </template>
          <span>{{prop.hint}}</span>
        </v-tooltip>
      </template>
    </v-list-item-content>

    <v-list-item-action>
      <v-btn icon>
        <v-icon color="primary" @click="getTestData">
          mdi-refresh
        </v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import API from "@/libs/api";

export default {
  name: 'Test',
  data () {
    return {
      testData: null,
      loading: true,
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