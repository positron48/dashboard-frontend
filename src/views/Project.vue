<template>
  <div class="container">
    <div class="text-h4 mt-6 ml-4">
      <p class="d-inline text-h6">
        {{ projectName }}
      </p>
      <v-icon class="d-inline" @click="addTest = true">mdi-plus</v-icon>
    </div>

    <v-list three-line>
      <template v-for="test in tests">

        <v-list-item
            :key="test.id"
        >
          <v-list-item-content>
            <v-list-item-title v-text="test.name"></v-list-item-title>
            <v-list-item-subtitle v-text="test.comment"></v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon>
              <v-icon color="grey lighten-1">mdi-information</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>

        <v-divider
            :key="test.id"
        ></v-divider>
      </template>
    </v-list>


    <NewTest
        v-if="addTest"
        @close="addTest = false"
        @create="createTest"
        :project="id"
    ></NewTest>
  </div>
</template>

<script>
//import API from '@/libs/api.js'
import NewTest from "@/components/NewTest";
import API from "@/libs/api";

export default {
  components: {NewTest},
  data () {
    return {
      id: parseInt(this.$route.params.id),
      addTest: false,
      projectName: "",

      tests: []
    }
  },
  methods: {
    getProject() {
      API.getProject(this.id)
          .then(response => {
            if ('success' in response.data && response.data.success) {
              this.updateProjectData(response.data.project)
            } else {
              alert('Не удалось получить данные проекта') // todo нормальное уведомление
            }
          })
          .catch(error => {
            console.error(['user get error', error])
            alert(error) // todo нормальное уведомление
          })
    },
    updateProjectData(project) {
      this.projectName = project.name
      this.tests = project.tests
    },
    createTest(test) {
      this.tests.push(test)
    }
  },
  mounted: function () {
    this.getProject()
  }
}
</script>