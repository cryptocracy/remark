<template>
  <v-speed-dial
    class="floating-button floatShepherd"
    v-model="fab"
    :top="top"
    :bottom="bottom"
    :right="right"
    :left="left"
    :direction="direction"
    :open-on-hover="hover"
  >
    <v-btn
      slot="activator"
      v-model="fab"
      color="red accent-4"
      :to="{ name: 'AddImage', params: { imageProp: null } }"
      dark
      fab
    >
      <v-icon>mic</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
export default {
  name: 'FloatingButton',

  data: () => ({
    direction: 'left',
    fab: false,
    fling: false,
    hover: false,
    tabs: null,
    top: false,
    right: true,
    bottom: true,
    left: false
  })
}
</script>

<style scoped>
    .floating-button {
      position: fixed;
      color: white;
    }
</style>
