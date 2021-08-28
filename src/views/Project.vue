<template>
  <div class="container">
    <div class="text-h4 mt-6 ml-4">
      <p class="d-inline text-h6">
        {{ projectName }}
      </p>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
              v-bind="attrs"
              v-on="on"
              class="d-inline"
              @click="addTestForm"
          >mdi-plus</v-icon>
        </template>
        <span>Добавить площадку</span>
      </v-tooltip>
    </div>

    <v-container>
      <template v-for="test in tests">

        <Test
            v-if="test"
            :key="test.id"
            :test="test"
            @edit="editTestForm"
            @copy="copyTestForm"
            @editComment="editTestComment"
        />

        <v-divider
            :key="'divider-' + test.id"
        ></v-divider>
      </template>
    </v-container>

    <TestForm
        v-if="showTestForm"
        @close="showTestForm = false"
        @save="saveTest"
        @delete="deleteTest"
        :project="id"
        :test="testData"
    ></TestForm>
  </div>
</template>

<script>
import TestForm from "@/components/TestForm";
import API from "@/libs/api";
import Test from "@/components/Test";

export default {
  components: {Test, TestForm},
  data () {
    return {
      id: parseInt(this.$route.params.id),
      currentId: null,
      showTestForm: false,
      projectName: "",

      testData: null,
      tests: []
    }
  },
  methods: {
    getProject() {
      this.currentId = parseInt(this.id)
      API.getProject(this.id)
          .then(response => {
            if ('success' in response.data && response.data.success) {
              this.updateProjectData(response.data.project)
            } else {
              alert(response.data.message) // todo нормальное уведомление
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
    addTestForm() {
      this.testData = null
      this.showTestForm = true
    },
    editTestForm(test) {
      this.testData = test
      this.showTestForm = true
    },
    copyTestForm(test) {
      let testCopy = Object.assign({}, test)
      testCopy.id = null
      testCopy.comment = ""
      this.testData = testCopy
      this.showTestForm = true
    },
    editTestComment(test) {
      this.saveTest(test)
    },
    saveTest(test) {
      if(!test.id){
        this.createTest(test)
      } else {
        this.editTest(test)
      }
    },
    createTest (test) {
      API.createTest(test, this.id)
          .then(response => {
            if ('success' in response.data && response.data.success) {
              test.id = response.data.id
              this.showTestForm = false
              this.showTest(test)
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
    editTest (test) {
      API.editTest(test)
          .then(response => {
            if ('success' in response.data && response.data.success) {
              this.showTestForm = false
              this.showTest(test)
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
    deleteTest (test) {
      if(confirm('Вы действительно хотите удалить тест?')) {
        let testId = test.id
        API.deleteTest(testId)
            .then(response => {
              if ('success' in response.data && response.data.success) {
                this.showTestForm = false
                this.deleteTestInList(testId)
              } else {
                alert(response.data.message) //todo alert
                console.error(['deleteTest error'])
              }
            })
            .catch(error => {
              alert(error)
              console.error(['deleteTest error', error])
            })
      }
    },
    showTest(test) {
      // ищем тест по ид в списке, если не находим - добавляем
      for (let i = 0; i < this.tests.length; i++) {
        if (this.tests[i].id === test.id) {
          this.tests[i] = test
          this.sortTests()
          return
        }
      }
      this.tests.push(test)
      this.sortTests()
    },
    sortTests() {
      this.tests = this.tests.sort(function(a, b) {
        var aSort = parseInt(a.sort)
        if(isNaN(aSort)) {
          aSort = 0
        }
        var bSort = parseInt(b.sort)
        if(isNaN(bSort)) {
          bSort = 0
        }
        if (aSort === bSort) {
          return parseInt(a.id) > parseInt(b.id) ? 1 : -1;
        }
        return aSort > bSort ? 1 : -1;
      });
    },
    deleteTestInList(testId) {
      // ищем тест по ид в списке, если не находим - добавляем
      for (let i = 0; i < this.tests.length; i++) {
        if (this.tests[i].id === testId) {
          this.tests.splice(i, 1);
          return
        }
      }
    },
  },
  mounted: function () {
    this.getProject()
  }
}
</script>