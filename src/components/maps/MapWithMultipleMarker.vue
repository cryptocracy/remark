<template>
  <div>
    <GmapMap
      :center="center"
      :zoom="10"
      style="width: 100%; height: 300px"
    >
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="center=m.position"
      />
    </GmapMap>
  </div>
</template>

<script>
export default {
  data: () => ({
    center: {
      lat: 40.730610,
      lng: -73.9352420
    },
    markers: [{
      position: {
        lat: 40.730610,
        lng: -73.9352420
      }
    }, {
      position: {
        lat: 40.6782,
        lng: -73.9442
      }
    }]
  })
}
</script>

<style scoped>

</style>
