<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title v-text="test.name"></v-list-item-title>
      <v-list-item-subtitle v-text="test.comment"></v-list-item-subtitle>
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
        {{testData.redmineData.status}}
        {{testData.redmineData.assignedTo}}
        {{testData.redmineData.subject}}
        {{testData.redmineData.project}}
      </v-list-item-title>
    </v-list-item-content>

    <v-list-item-action>
      <v-btn icon>
        <v-icon color="primary" @click="emitEdit">
          mdi-pencil
        </v-icon>
      </v-btn>
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
      loading: true
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
    }
  },
  mounted: function() {
    this.getTestData();
  }
}
</script>