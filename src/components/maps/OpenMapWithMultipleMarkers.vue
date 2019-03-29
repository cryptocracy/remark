<template>
  <div class="map" id="map">
    <!-- <l-map id="mapid" :zoom="zoom" :center="center" @click="setMarker">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <v-btn fab class="map-location" @click.stop="getMyLocation">
        <v-icon dark>location_on</v-icon>
      </v-btn>
    </l-map> -->
  </div>

</template>

<script>
import L from 'leaflet'
import 'leaflet.markercluster'
// import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
// import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
// import iconUrl from 'leaflet/dist/images/marker-icon.png'
// import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
// import { eventBus } from '@/main'

export default {
  name: 'OpenMapWithMarker',
  data: () => ({
    map: null,
    tileLayer: null,
    zoom: 6,
    Icon: null,
    redIcon: null,
    // centerMap: L.latLng(47.413220, -1.219482),
    url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    markerLayer: []
    // marker: L.latLng(47.413220, -1.219482),
    // riseOnHover: true,
    // icon: L.icon({
    //   iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    //   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    //   shadowUrl: shadowUrl,
    //   iconSize: [38, 58],
    //   iconAnchor: [22, 57],
    //   popupAnchor: [-3, -76]
    // })
  }),
  // components: { 'l-map': LMap, 'l-tile-layer': LTileLayer, 'l-marker': LMarker, 'l-popup': LPopup, 'l-marker-cluster': Vue2LeafletMarkerCluster },
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
    },
    markers: {
      type: Array
    }
  },
  watch: {
    deep: true,
    markers () {
      if (this.markers.length >= 0) {
        this.initLayers(true)
      }
    },
    center () {
      this.map.setView([this.center.lat, this.center.lng], this.zoom)
    }
  },
  mounted () {
    this.renderMap()
  },
  methods: {
    renderMap () {
      this.initMap()
      this.initIcon()
      this.initLayers()
    },
    initMap () {
      // console.log(Object.keys(L.map('map')))
      this.map = L.map('map').setView([this.center.lat, this.center.lng], this.zoom)
      this.tileLayer = L.tileLayer(
        'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }
      )
      this.tileLayer.addTo(this.map)
      this.cluster = L.markerClusterGroup()
      this.map.on('click', () => {
        this.$emit('updateMap', this.map.getCenter())
      })
    },
    initIcon () {
      this.Icon = L.Icon.extend({
        shadowUrl: shadowUrl,
        iconSize: [98, 98],
        iconAnchor: [55, 57],
        popupAnchor: [-3, -76]
      })
      this.redIcon = new this.Icon({
        iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'
      })
    },
    initLayers (watch) {
      // this.cir = L.circle([this.center.lat, this.center.lng], 1609*300)
      this.cluster.removeLayers(this.markerLayer)
      this.markerLayer = []
      this.markers.forEach(element => {
        let marker = L.marker(element.coordinates, {icon: this.redIcon})
          .bindPopup(`<div>Content Type: ${this.getDetails(element.fileUrl).type}</div>
            <div>Owner: ${this.getDetails(element.fileUrl).owner}</div>
            <div>Created On: ${this.getDetails(element.fileUrl).createdOn}</div>
            <button type="button" class="redirectButton v-btn v-btn--round v-btn--small theme--dark teal accent-4" color="primary">view details</button>`)

        marker.on('mouseover', (e) => {
          marker.openPopup()
          let el = document.getElementsByClassName('leaflet-popup-content')
          el[el.length - 1].childNodes[6].addEventListener('click', () => {
            this.redirectUser(element)
          })
        })
        let a = this.cluster.addLayer(marker)
        this.markerLayer.push(a)
      })
      this.map.addLayer(this.cluster)
    },
    setMarker (e) {
      if (!this.readonly) {
        this.marker = e.latlng
        this.$emit('input', e.latlng)
      }
    },
    getMyLocation () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.centerMap = L.latLng(position.coords.latitude, position.coords.longitude)
      })
    },
    getDetails (url) {
      let a = url.split('/')
      return {
        'owner': a[4],
        'type': a[5].split('_')[0].toUpperCase(),
        'createdOn': new Date(Number(a[5].split('_')[1].split('.')[0])).toLocaleString()
      }
    },
    async redirectUser (content) {
      await this.$store.dispatch('ACTION_GET_CONTENT', content.fileUrl)
      if (content.fileUrl.includes('marker')) this.$router.push({name: 'OwnedMarkers'})
      else if (content.fileUrl.includes('tag')) this.$router.push({name: 'Owned'})
      else if (content.fileUrl.includes('image')) this.$router.push({name: 'OwnedImages'})
      else if (content.fileUrl.includes('event')) this.$router.push({name: 'OwnedEvents'})
    }
  }
}
</script>

<style lang="scss" >
@import "leaflet.markercluster/dist/MarkerCluster.css";
@import "leaflet.markercluster/dist/MarkerCluster.Default.css";
.break-all {
  word-break: break-all
}
.map {
  position: relative;
  height: 350px;
  z-index: 0;
}
// .vue2leaflet-map {
//     height: 300px;
//     z-index: 0;
//     position: relative;

//     // .map-location {
//     //     position: absolute;
//     //     left: 5px;
//     //     bottom: 5px;
//     //     z-index: 410;
//     //     height: 30px;
//     //     width: 30px;
//     // }

//     .leaflet-control-container {
//       border: 2px red solid;

//     .leaflet-bar {
//       border-top-left-radius: 15px;
//       overflow: hidden;
//     }
//     }
// }
</style>
