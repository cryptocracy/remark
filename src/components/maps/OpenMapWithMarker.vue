<template>
  <l-map id="mapid" :zoom="zoom" :center="actualCoordinates" @click="setMarker">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-marker :lat-lng="actualCoordinates" :icon="icon"></l-marker>
    <v-btn fab class="map-location" @click.stop="getMyLocation">
      <v-icon dark>location_on</v-icon>
    </v-btn>
  </l-map>

</template>

<script>
import L from 'leaflet'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

export default {
  name: 'OpenMapWithMarker',
  data: () => ({
    zoom: 13,
    centerMap: L.latLng(47.413220, -1.219482),
    url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    marker: L.latLng(47.413220, -1.219482),
    riseOnHover: true,
    icon: L.icon({
      iconRetinaUrl: iconRetinaUrl,
      iconUrl: iconUrl,
      shadowUrl: shadowUrl,
      iconSize: [38, 58],
      iconAnchor: [22, 57],
      popupAnchor: [-3, -76]
    })
  }),
  components: { LMap, LTileLayer, LMarker },
  props: {
    center: {
      type: Object,
      default: () => ({
        lat: 47.413220,
        lng: -1.219482
      })
    },
    draggable: {
      type: Boolean,
      custom: true,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    actualCoordinates () {
      return this.center ? this.center : {
        lat: 47.413220,
        lng: -1.219482
      }
    }
  },
  methods: {
    setMarker (e) {
      if (!this.readonly) {
        this.marker = e.latlng
        this.$emit('input', e.latlng.wrap())
      }
    },
    getMyLocation () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.centerMap = L.latLng(position.coords.latitude, position.coords.longitude)
        this.$emit('getCurrentLocation', this.centerMap)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.vue2leaflet-map {
    height: 300px;
    z-index: 0;
    position: relative;

    .map-location {
        position: absolute;
        left: 5px;
        bottom: 5px;
        z-index: 410;
        height: 30px;
        width: 30px;
    }

    .leaflet-control-container {
      border: 2px red solid;

    .leaflet-bar {
      border-top-left-radius: 15px;
      overflow: hidden;
    }
    }
}
</style>
