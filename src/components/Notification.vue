<template>
  <v-snackbar
    v-model="snackbar"
    :timeout="2000"
    :top="true"
    color="red"
  >
    {{ notification }}
    <v-btn
      color="pink"
      flat
      @click="snackbar = false"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      notification: 'notification'
    }),
    snackbar: {
      get () {
        return this.$store.state.showNotification
      },
      set (value) {
        this.$store.commit('MUTATION_SET_NOTIFICATION', { show: false, notification: '' })
      }
    }
  }
}
</script>

<style>

</style>
