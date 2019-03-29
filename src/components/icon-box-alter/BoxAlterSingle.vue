<template lang="html">
  <div class="iconbox-single">
    <div class="box-title">
      <div class="circle-icon-alter" >
        <v-icon :color="iconColor">{{ icon }}</v-icon>
      </div>
      <div>
        <h3>{{ title }}</h3>
        <p>{{ subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['iconColor', 'title', 'subtitle', 'icon']
}
</script>

<style lang="css">
</style>
