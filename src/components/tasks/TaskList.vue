<template>
  <div class="container">
    <v-layout row v-show="tasksArray.length">

      <v-flex xs12 sm10 offset-sm1>
        <v-card class="br20">
          <div class="entity-preferences">
            <div class="entity-filter">
              <div class="entity-check-group">
                <v-checkbox
                  v-model="filterAll"
                  :disabled="filterAll"
                />
                <span class="checkbox-label">All</span>
              </div>
              <div class="entity-check-group">
                <v-checkbox v-model="filterArchived"/>
                <span class="checkbox-label">Archived</span>
              </div>
              <div class="entity-check-group">
                <v-checkbox v-model="filterActive"/>
                <span class="checkbox-label">Active</span>
              </div>
              <div class="entity-check-group">
                <v-checkbox v-model="filterUpcoming"/>
                <span class="checkbox-label">Upcoming</span>
              </div>
            </div>
            <div class="entity-sorting">
              <v-radio-group v-model="sortBy" row>
                <div class="entity-radio-group">
                  <v-radio value="name"></v-radio>
                  <span class="radio-label">By Name</span>
                </div>
                <div class="entity-radio-group">
                  <v-radio value="date"></v-radio>
                  <span class="radio-label">By Date</span>
                </div>
                <div class="entity-radio-group">
                  <v-radio value="startDate"></v-radio>
                  <span class="radio-label">By Start Date</span>
                </div>
              </v-radio-group>
            </div>
          </div>
          <v-divider/>
          <v-list two-line subheader>
            <v-list-tile
              v-for="task in filteredTasksArray"
              :key="task.createdtime"
              :to="{name: 'TaskInfo', params: {
                taskName: 'task_'+task.createdtime,
                taskObject: task,
                hubUrl: hubUrl
              }}"
            >
              <v-list-tile-avatar>
                <v-icon color="green lighten-4">list</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title v-text="task.title"/>
                <v-list-tile-sub-title v-text="task.detail"/>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn v-if="owned" icon :to="{ name: 'EditTask', params: { taskProp: task } }">
                  <v-icon color="grey lighten-1">edit</v-icon>
                </v-btn>
                <v-btn v-if="!hubUrl" icon @click.stop.prevent="removeFavorite($task, task)">
                  <v-icon color="grey lighten-1">favorite_border</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import storageService from '@/services/blockstack-storage'

export default {
  name: 'TaskList',
  data: () => ({
    blockstack: window.blockstack,
    filterArchived: false,
    filterActive: false,
    filterUpcoming: true,
    sortBy: 'name',
    tasks: []
  }),
  props: {
    tasksArray: {
      type: Array,
      required: true,
      default: () => []
    },
    owned: {
      type: Boolean
    },
    hubUrl: {
      type: String
    }
  },
  computed: {
    filterAll: {
      get () {
        return this.filterArchived && this.filterActive
      },
      set () {
        this.filterArchived = true
        this.filterActive = true
        this.filterUpcoming = true
      }
    },
    filteredTasksArray () {
      let sortFunc = (prev, next) => {
        if (this.sortBy === 'name') return prev.title.localeCompare(next.title)
        else if (this.sortBy === 'date') return prev.createdtime - next.createdtime
        else return +new Date(prev.start) - new Date(next.start)
      }
      return this.tasks.filter(task => (this.filterArchived && task.archived) || (this.filterActive && !task.archived) || (this.filterUpcoming && (+new Date() < +new Date(task.due)))).slice(0).sort(sortFunc)
    }
  },
  methods: {
    getFavTaskName (task) {
      return `task_${task.createdtime}_${JSON.parse(localStorage['blockstack-gaia-hub-config']).address}`
    },
    removeFavorite (e, task) {
      storageService.reduceFavoriteTaskIndex(this.getFavTaskName(task), task.title)
      this.tasks = this.tasks.filter(item => item.createdtime !== task.createdtime)
    }
  },
  mounted () {
    this.tasks = this.tasksArray
  }
}
</script>
