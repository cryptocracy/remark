<template lang="html">
  <div class="readmin-panel br20">
    <div class="panel-heading">
      <h5>{{title}}</h5>
    </div>
    <div v-if="showGraph" class="panel-body" :is="children" :style="{height: height}">
    </div>
    <div v-else class="panel-body text-xs-center no-data"  :style="{height: height}">
      <v-icon>fas fa-exchange-alt</v-icon>
      <h4 class="mt-5 no-data">
        {{error_message_title}}
      </h4>
      <p>{{error_message}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'children', 'height', 'error_message_title', 'error_message', 'showGraph']
}
</script>

<style lang="css">
  .no-data {
    color: rgba(0,0,0,.54)
  }
</style>
