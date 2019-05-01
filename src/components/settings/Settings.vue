<template>
  <v-layout row wrap>
    <v-flex col>
      <v-card class="br20 mb-2">
        <v-card-title class="headline no-data">Settings</v-card-title>
        <v-card-text col-6>
          <image-uploader
            accept="image/*"
            ref="imageInput"
            limit=2000000
            :value="imageFile"
            @input="getUploadedImage"
          />
          <v-text-field
            v-model="publicSettings.description"
            label="Description"
          ></v-text-field>
          <v-autocomplete
            label="Distance Unit"
            v-model="settings.distanceUnit"
            :items="distanceUnits"
          >
          </v-autocomplete>

          <v-subheader class="pl-0">Search Radius (in {{settings.distanceUnit === 'mi' ? 'Miles' : 'KMs'}})</v-subheader>
          <v-slider
            v-model="settings.searchRadius"
            thumb-label="always"
            :min="min"
            :max="max"
            always-dirty
          ></v-slider>

          <v-subheader class="pl-0">Epicenter</v-subheader>
          <open-map-with-marker
            :center="mapCoordinates"
            @input="(e) => {mapCoordinates = e}"
            @getCurrentLocation="(e) => {mapCoordinates = e}"
          ></open-map-with-marker>

        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" class="m-3" @click="submit" round>Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import OpenMapWithMarker from '@/components/maps/OpenMapWithMarker'
import ImageUploader from '@/components/image-uploader/ImageUploader'
import storageService from '@/services/blockstack-storage'
import { mapGetters } from 'vuex'
export default {
  components: {
    OpenMapWithMarker,
    ImageUploader
  },
  computed: {
    ...mapGetters({
      newSettings: 'getSettings',
      newPublicSettings: 'getPublicSettings'
    }),
    min () {
      return this.settings.distanceUnit === 'mi' ? 1 : 1.6
    },
    max () {
      return this.settings.distanceUnit === 'mi' ? 300 : 483
    }
  },
  watch: {
    deep: true,
    mapCoordinates () {
      this.settings.latitude = this.mapCoordinates.lat
      this.settings.longitude = this.mapCoordinates.lng
    },
    newPublicSettings () {
      this.publicSettings = Object.assign({
        description: '',
        header: null
      }, this.newPublicSettings)
    },
    newSettings () {
      this.settings = Object.assign({}, this.newSettings)
      this.mapCoordinates.lat = this.newSettings.latitude
      this.mapCoordinates.lng = this.newSettings.longitude
    }
  },
  data: () => ({
    imageFile: null,
    mapCoordinates: {
      lat: 45.5122,
      lng: -122.6587
    },
    distanceUnits: [
      {text: 'Kilometre', value: 'km'},
      {text: 'Mile', value: 'mi'}
    ],
    settings: {},
    publicSettings: {
      description: '',
      header: null
    }
  }),
  created () {
    this.settings = this.newSettings
    this.mapCoordinates.lat = this.newSettings.latitude
    this.mapCoordinates.lng = this.newSettings.longitude
    storageService.getFile({
      fileName: 'public_settings.json',
      options: {decrypt: false}
    }).then(res => {
      if (res) {
        this.$store.commit('MUTATION_CHANGE_PUBLIC_SETTINGS', res)
        this.publicSettings = res.data
      }
    })
  },
  methods: {
    submit () {
      if (this.imageFile || this.imageFile.name) {
        console.log(this.imageFile)
        storageService.putFile({
          fileName: `header_img.${this.imageFile.name.split('.').pop()}`,
          data: this.imageFile,
          options: { encrypt: false }
        }).then((imageUrl) => {
          this.publicSettings.header = imageUrl
          this.saveSettings()
        })
      } else {
        this.saveSettings()
      }
    },
    getUploadedImage (e) {
      this.imageFile = e
    },
    saveSettings () {
      this.$store.commit('MUTATION_CHANGE_SETTINGS', this.settings)
      storageService.putFile({
        fileName: 'settings.json',
        data: this.settings,
        options: { encrypt: true }
      })
        .then(() => {
          console.log(this.publicSettings)
          storageService.putFile({
            fileName: 'public_settings.json',
            data: this.publicSettings,
            options: { encrypt: false }
          })
        })
    }
  }
}
</script>

<style scoped>
  .br20 {
    border-radius: 20px
  }
</style>
