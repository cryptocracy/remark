<template>
  <v-card class="container">
    <v-form ref="form" v-model="valid">
      <v-text-field
        v-model="event.title"
        :rules="titleRules"
        :counter="32"
        :disabled="isLoading"
        label="Title"
        required
      ></v-text-field>
      <v-text-field
        v-model="event.description"
        label="Description"
        :disabled="isLoading"
      ></v-text-field>
      <v-select
        :items="symbols"
        label="Symbol"
        v-model="event.symbol"
        :disabled="isLoading"
      ></v-select>
      <v-text-field
        v-model="event.address"
        :rules="addressRules"
        :counter="42"
        label="Crypto Address"
        :disabled="isLoading"
      ></v-text-field>
      <div class="date-time-picker">
        <datetime
          v-model="event.start"
          type='datetime'
          input-id="startDate"
          :max-datetime="event.end"
          :min-datetime="new Date().toISOString()"
        >
          <label class="v-btn theme--light" for="startDate" slot="before">Start date & time</label>
        </datetime>
        <datetime
          v-model="event.end"
          type='datetime'
          input-id="endDate"
          :min-datetime="event.start"
        >
          <label class="v-btn theme--light" for="endDate" slot="before">End date & time</label>
        </datetime>
      </div>
      <v-select
        :items="markers"
        label="Marker"
        item-text="title"
        v-model="event.marker"
        :disabled="isLoading"
        return-object
      ></v-select>
      <v-select
        :items="images"
        label="Image(s)"
        item-text="title"
        v-model="event.images"
        :disabled="isLoading"
        return-object
        multiple
        chips
      ></v-select>
      <v-combobox
        v-model="tags"
        chips
        :rules="tagsRules"
        multiple
        label="Tags"
        hint="Add multiple tags by pressing Enter or Tab button after writing tag name. You can add a maximum of 5 tags."
        :persistent-hint="true"
      ></v-combobox>
      <!--<div class="switch-wrapper">-->
      <!--<div class="input-group&#45;&#45;text-field primary&#45;&#45;text">Privacy</div>-->
      <!--<div class="switch-block">-->
      <!--<span class="switch-text">Public</span>-->
      <!--<v-switch v-model="event.limit"></v-switch>-->
      <!--<span class="switch-text">Personal</span>-->
      <!--</div>-->
      <!--</div>-->
      <div class="switch-wrapper" v-if="eventProp">
        <div class="input-group--text-field primary--text">Archived</div>
        <div class="switch-block">
          <span class="switch-text">No</span>
          <v-switch v-model="event.archived"></v-switch>
          <span class="switch-text">Yes</span>
        </div>
      </div>
      <v-btn
        :disabled="!valid || isLoading"
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
import { Datetime } from 'vue-datetime'
import { Settings } from 'luxon'
import objectHelpers from '@/helpers/objectHelpers.js'
import validationService from '@/helpers/validate'
import 'vue-datetime/dist/vue-datetime.css'

const cryptoAddress = localStorage['blockstack-gaia-hub-config'] ? JSON.parse(localStorage['blockstack-gaia-hub-config']).address : ''
const cryptoName = localStorage['blockstack'] ? JSON.parse(localStorage['blockstack']).username : ''

Settings.defaultLocale = 'en'

export default {

  data: () => ({
    blockstack: window.blockstack,
    isLoading: false,
    valid: false,
    markers: [],
    tags: [],
    images: [],
    event: {
      title: '',
      description: '',
      address: '',
      start: null,
      end: null,
      tags: [],
      images: null,
      marker: null,
      symbol: null,
      event: null,
      limit: false,
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
  components: {
    Datetime
  },
  props: {
    eventProp: {
      type: [Object, null],
      default: null
    }
  },
  watch: {
    eventProp () {
      this.updateFromEventProp()
    },
    tags () {
      if (this.tags.length > 5) {
        this.tags.pop()
      }
    }
  },
  methods: {
    submit () {
      const timestamp = +new Date()
      if (this.$refs.form.validate()) {
        this.isLoading = true
        this.event.createdtime = this.eventProp ? this.eventProp.createdtime : timestamp
        this.event.owner = JSON.parse(localStorage['blockstack-gaia-hub-config']).address
        this.event.ownername = cryptoName
        this.event.tags = []
        this.tags.forEach(element => {
          this.event.tags.push({title: element})
        })
        this.saveEvent(timestamp)
      }
    },
    getEventFilename (timestamp) {
      return this.eventProp ? `event_${this.eventProp.createdtime}.json` : `event_${timestamp}.json`
    },
    saveEvent (timestamp) {
      this.blockstack.putFile(this.getEventFilename(timestamp), JSON.stringify(this.event), { encrypt: false })
        .then((jsonUrl) => {
          storageService.updateEventIndex(jsonUrl.split('/').pop().split('.')[0], this.event.title)
            .then(() => {
              this.isLoading = false
              this.eventProp ? this.$router.push({
                name: 'EventInfo',
                params: {
                  eventName: 'event_' + this.event.createdtime,
                  eventObject: this.event
                }
              }) : this.clear()
            })
        })
    },
    clear () {
      this.$refs.form.reset()
      this.event.start = undefined
      this.event.end = undefined
    },
    updateFromEventProp () {
      if (this.eventProp) {
        for (let property in this.eventProp) {
          this.event[property] = this.eventProp[property] instanceof Object ? {...this.eventProp[property]} : this.eventProp[property]
        }
        this.event.images = objectHelpers.toArray(this.event.images)
        // this.event.tags = objectHelpers.toArray(this.event.tags)
        this.eventProp.tags.forEach(item => {
          this.tags.push(item.title)
        })
      } else {
        this.clear()
      }
    },
    fetchMarkers () {
      // fetching markers list
      this.blockstack.getFile('my_markers.json', { decrypt: false })
        .then((markersJSON) => {
          let markersObj = JSON.parse(markersJSON)
          if (markersObj) {
            this.markers = Object.keys(markersObj).map((key) => {
              return {
                address: 'https://gaia.blockstack.org/hub/' + cryptoAddress + '/' + key + '.json',
                title: markersObj[key]
              }
            })
          }
          this.blockstack.getFile('my_fav_markers.json', { decrypt: false })
            .then((favMarkersJSON) => {
              let favMarkersObj = JSON.parse(favMarkersJSON)
              if (favMarkersObj) {
                Object.keys(favMarkersObj).forEach((key) => {
                  if (key.split('_')[2] !== cryptoAddress) {
                    this.markers.push({
                      address: 'https://gaia.blockstack.org/hub/' + key.split('_')[2] + '/' + key.substr(0, key.lastIndexOf('_')) + '.json',
                      title: favMarkersObj[key]
                    })
                  }
                })
              }
            })
        })
    },
    // fetchTags () {
    //   // fetching tags list
    //   this.blockstack.getFile('my_tags.json', { decrypt: false })
    //     .then((tagsJSON) => {
    //       let tagsObj = JSON.parse(tagsJSON)
    //       if (tagsObj) {
    //         this.tags = Object.keys(tagsObj).map((key) => {
    //           return {
    //             address: 'https://gaia.blockstack.org/hub/' + cryptoAddress + '/' + key + '.json',
    //             title: tagsObj[key]
    //           }
    //         })
    //       }
    //       this.blockstack.getFile('my_fav_tags.json', { decrypt: false })
    //         .then((favTagsJSON) => {
    //           let favTagsObj = JSON.parse(favTagsJSON)
    //           if (favTagsJSON) {
    //             Object.keys(favTagsObj).forEach((key) => {
    //               if (key.split('_')[2] !== cryptoAddress) {
    //                 this.tags.push({
    //                   address: 'https://gaia.blockstack.org/hub/' + key.split('_')[2] + '/' + key.substr(0, key.lastIndexOf('_')) + '.json',
    //                   title: favTagsObj[key]
    //                 })
    //               }
    //             })
    //           }
    //         })
    //     })
    // },
    fetchImages () {
      // fetching images list
      this.blockstack.getFile('my_images.json', { decrypt: false })
        .then((imagesJSON) => {
          let imagesObj = JSON.parse(imagesJSON)
          if (imagesObj) {
            this.images = Object.keys(imagesObj).map((key) => {
              return {
                address: 'https://gaia.blockstack.org/hub/' + cryptoAddress + '/' + key + '.json',
                title: imagesObj[key]
              }
            })
          }
          // this.blockstack.getFile('my_fav_images.json', { decrypt: false })
          //   .then((favTagsJSON) => {
          //     let favTagsObj = JSON.parse(favTagsJSON)
          //     if (favTagsJSON) {
          //       Object.keys(favTagsObj).forEach((key) => {
          //         if (key.split('_')[2] !== cryptoAddress) {
          //           this.images.push({
          //             address: 'https://gaia.blockstack.org/hub/' + key.split('_')[2] + '/' + key.substr(0, key.lastIndexOf('_')) + '.json',
          //             title: favTagsObj[key]
          //           })
          //         }
          //       })
          //     }
          //   })
        })
    }
  },
  mounted () {
    this.updateFromEventProp()
    this.fetchMarkers()
    // this.fetchTags()
    this.fetchImages()
  }
}
</script>
