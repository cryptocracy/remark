<template>
  <task-list :tasksArray="tasksArray"/>
</template>

<script>
import TaskList from './TaskList'
import axios from 'axios'

const storageFile = 'my_fav_tasks.json'

export default {
  name: 'MyFavoriteTaskList',
  components: {
    TaskList
  },
  data: () => ({
    blockstack: window.blockstack,
    storageFile: storageFile,
    tasksArray: []
  }),
  methods: {
    fetchTaskFile () {
      // fetching project list
      this.blockstack.getFile(this.storageFile, { decrypt: false })
        .then((tasksText) => {
          const tasks = JSON.parse(tasksText || '[]')
          const urlPrefix = JSON.parse(localStorage['blockstack-gaia-hub-config']).url_prefix
          // looping over project list to fetch unique json files for every project
          for (let task in tasks) {
            axios.get(`${urlPrefix}${task.split('_')[2]}/task_${task.split('_')[1]}.json`).then((taskJson) => {
              this.tasksArray.push(taskJson.data)
            })
          }
        })
    }
  },
  mounted () {
    this.fetchTaskFile()
  }
}
</script>

<style scoped>

</style>
