<template>
  <div class="container">
    <div class="text-h4 mt-6 ml-4">
      <p class="d-inline text-h6">
        {{ projectName }}
      </p>
      <v-icon class="d-inline" @click="addTestForm">mdi-plus</v-icon>
    </div>

    <v-list three-line>
      <template v-for="test in tests">

        <Test :key="test.id" :test="test" @edit="editTestForm"/>

        <v-divider
            :key="'divider-' + test.id"
        ></v-divider>
      </template>
    </v-list>

    <TestForm
        v-if="showTestForm"
        @close="showTestForm = false"
        @save="saveTest"
        :project="id"
        :test="editedTest"
    ></TestForm>
  </div>
</template>

<script>
//import API from '@/libs/api.js'
import TestForm from "@/components/TestForm";
import API from "@/libs/api";
import Test from "@/components/Test";

export default {
  components: {Test, TestForm},
  data () {
    return {
      id: parseInt(this.$route.params.id),
      showTestForm: false,
      projectName: "",

      editedTest: null,
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
            console.error(['project get error', error])
            alert(error) // todo нормальное уведомление
          })
    },
    updateProjectData(project) {
      this.projectName = project.name
      this.tests = project.tests
    },
    saveTest(test) {
      // ищем тест по ид в списке, если не находим - добавляем
      for (let i = 0; i < this.tests.length; i++) {
        if (this.tests[i].id === test.id) {
          this.tests[i] = test
          return
        }
      }
      this.tests.push(test)
    },
    addTestForm() {
      this.editedTest = null
      this.showTestForm = true
    },
    editTestForm(test) {
      this.editedTest = test
      this.showTestForm = true
    }
  },
  mounted: function () {
    this.getProject()
  }
}
</script>