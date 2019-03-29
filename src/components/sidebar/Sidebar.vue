<template lang="html">
  <div :class="triggerSidebarToggle">
    <div class="sidebar-nav">
      <app-nav></app-nav>
    </div>
  </div>
</template>

<script>
import Nav from './Nav'

export default {
  components: {
    'app-nav': Nav
  },

  data: () => ({
  }),

  computed: {
    triggerSidebarToggle () {
      return {
        sidebar: true,
        open: this.$store.state.sidebarOpen
      }
    }
  }

}
</script>

<style lang="css" scope>
.navigation-drawer__border {
  display: none;
}

</style>
