<template>
  <v-card class="container">
    <v-form ref="form" v-model="valid">
      <v-text-field
        v-model="marker.title"
        :rules="titleRules"
        :counter="32"
        :disabled="isLoading"
        label="Title"
        required
      ></v-text-field>
      <v-text-field
        v-model="marker.detail"
        label="Detail"
      ></v-text-field>
      <v-select
        :items="symbols"
        label="Symbol"
        v-model="marker.symbol"
        :disabled="isLoading"
      ></v-select>
      <v-text-field
        v-model="marker.address"
        :rules="addressRules"
        :counter="42"
        label="Crypto Address"
        :disabled="isLoading"
      ></v-text-field>

      <v-combobox
        v-model="tags"
        chips
        :rules="tagsRules"
        multiple
        label="Tags"
        hint="Add multiple tags by pressing Enter or Tab button after writing tag name. You can add a maximum of 5 tags."
        :persistent-hint="true"
      ></v-combobox>

      <open-map-with-marker
        class="mt-3"
        @input="changeCoordinates"
        :center="coordinates"
      />
      <div class="geo-button-wrapper" v-if="geoUpdated && oldGeo">
        <v-btn
          fab
          dark
          small
          color="green pa-2"
          @click="rollbackCoordinates"
        >
          <v-icon>settings_backup_restore</v-icon>
        </v-btn>
        <span class="geo-button-text">Rollback to original geo location</span>
      </div>
      <!--<div class="switch-wrapper">-->
      <!--<div class="input-group&#45;&#45;text-field primary&#45;&#45;text">Privacy</div>-->
      <!--<div class="switch-block">-->
      <!--<span class="switch-text">Public</span>-->
      <!--<v-switch v-model="marker.private"></v-switch>-->
      <!--<span class="switch-text">Personal</span>-->
      <!--</div>-->
      <!--</div>-->
      <div class="switch-wrapper" v-if="markerProp">
        <div class="input-group--text-field primary--text">Archived</div>
        <div class="switch-block">
          <span class="switch-text">No</span>
          <v-switch v-model="marker.archived"></v-switch>
          <span class="switch-text">Yes</span>
        </div>
      </div>
      <v-btn
        :disabled="!valid || isLoading "
        @click="submit"
      >
        submit
      </v-btn>
      <v-btn
        @click="clear"
        :disabled="isLoading"
      >
        clear
      </v-btn>
    </v-form>
  </v-card>
</template>

<script>
import storageService from '@/services/blockstack-storage'
import OpenMapWithMarker from '@/components/maps/OpenMapWithMarker'
import validationService from '@/helpers/validate'

const cryptoName = localStorage['blockstack'] ? JSON.parse(localStorage['blockstack']).username : ''

export default {
  data: () => ({
    blockstack: window.blockstack,
    isLoading: false,
    valid: false,
    oldGeo: false,
    tags: [],
    marker: {
      coordinates: null,
      title: '',
      tags: [],
      address: '',
      detail: '',
      symbol: null,
      private: false,
      archived: false,
      v: '0.0.1',
      id: ''
    },
    symbols: ['BTC', 'STX'],
    titleRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 32) || 'Name must be less than 32 characters',
      v => /^[\w ]+$/.test(v) || 'Letters, numbers, spaces and "_" are only allowed'
    ],
    addressRules: [
      v => v ? /^((?!_)[A-z0-9])+$/.test(v) || 'Letters and numbers are only allowed' : true,
      v => v ? v.length <= 42 || 'Please enter proper address' : true
    ],
    tagsRules: [
      v => validationService.validateTags(v)
    ]
  }),
  props: {
    markerProp: {
      type: [Object, null],
      default: null
    }
  },
  components: {
    OpenMapWithMarker
  },
  watch: {
    deep: true,
    markerProp () {
      this.updateFromMarkerProp()
    },
    tags () {
      if (this.tags.length > 5) {
        this.tags.pop()
      }
    }
  },
  computed: {
    geoUpdated () {
      return JSON.stringify(this.oldGeo) !== JSON.stringify(this.marker.coordinates)
    },
    coordinates () {
      return this.marker.coordinates ? {
        lat: this.marker.coordinates.lat,
        lng: this.marker.coordinates.lng
      } : null
    }
  },
  methods: {
    submit () {
      const timestamp = +new Date()
      if (this.$refs.form.validate()) {
        this.isLoading = true
        this.marker.createdtime = this.markerProp ? this.markerProp.createdtime : timestamp
        this.marker.owner = JSON.parse(localStorage['blockstack-gaia-hub-config']).address
        this.marker.ownername = cryptoName
        this.marker.tags = []
        this.tags.forEach(element => {
          this.marker.tags.push({title: element})
        })
        this.saveMarker(timestamp)
      }
    },
    getMarkerFilename (timestamp) {
      return this.markerProp ? `marker_${this.markerProp.createdtime}.json` : `marker_${timestamp}.json`
    },
    saveMarker (timestamp) {
      this.blockstack.putFile(this.getMarkerFilename(timestamp), JSON.stringify(this.marker), { encrypt: false })
        .then((jsonUrl) => {
          storageService.updateMarkerIndex(jsonUrl.split('/').pop().split('.')[0], this.marker.title)
            .then(() => {
              this.isLoading = false
              this.markerProp ? this.$router.push({
                name: 'MarkerInfo',
                params: {
                  markerName: 'marker_' + this.marker.createdtime,
                  markerObject: this.marker
                } }) : this.clear()
            })
        })
    },
    clear () {
      this.$refs.form.reset()
    },
    updateFromMarkerProp () {
      if (this.markerProp) {
        for (let property in this.markerProp) {
          this.marker[property] = this.markerProp[property] instanceof Object ? { ...this.markerProp[property] } : this.markerProp[property]
        }
        if (this.marker.coordinates) {
          this.oldGeo = {...this.marker.coordinates}
        }
        this.markerProp.tags.forEach(item => {
          this.tags.push(item.title)
        })
      } else {
        this.clear()
      }
    },
    changeCoordinates (newCoords) {
      this.marker.coordinates = newCoords
    },
    rollbackCoordinates () {
      this.marker.coordinates = {...this.oldGeo}
    }
  },
  mounted () {
    this.updateFromMarkerProp()
  }
}
</script>
