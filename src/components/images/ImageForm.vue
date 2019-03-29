<template>
  <v-card class="container">
    <v-form ref="form" v-model="valid">
      <image-uploader
        accept="image/*"
        ref="imageInput"
        :disabled="isLoading"
        limit=2000000
        :value="imageFile"
        @input="getUploadedImage"
      />

      <v-text-field
        v-model="image.title"
        :rules="titleRules"
        :counter="32"
        :disabled="isLoading"
        label="Title"
        required
      ></v-text-field>
      <v-text-field
        v-model="image.detail"
        label="Detail"
        :disabled="isLoading"
      ></v-text-field>
      <v-select
        :items="symbols"
        label="Symbol"
        v-model="image.symbol"
        :disabled="isLoading"
      ></v-select>
      <v-text-field
        v-model="image.address"
        :rules="addressRules"
        :counter="42"
        label="Crypto Address"
        :disabled="isLoading"
      ></v-text-field>
      <v-combobox
        v-model="tags"
        :rules="tagsRules"
        :items="itemList"
        chips
        multiple
        label="Tags"
        hint="Add multiple tags by pressing Enter or Tab button after writing tag name. You can add a maximum of 5 tags."
      ></v-combobox>
      <v-select
        class="mt-1"
        :items="markers"
        label="Marker"
        item-text="title"
        v-model="image.marker"
        :disabled="isLoading"
        return-object
      ></v-select>
      <!--<div class="switch-wrapper">-->
      <!--<div class="input-group&#45;&#45;text-field primary&#45;&#45;text">Privacy</div>-->
      <!--<div class="switch-block">-->
      <!--<span class="switch-text">Public</span>-->
      <!--<v-switch v-model="image.limit"></v-switch>-->
      <!--<span class="switch-text">Personal</span>-->
      <!--</div>-->
      <!--</div>-->
      <div class="switch-wrapper" v-if="imageProp">
        <div class="input-group--text-field primary--text">Archived</div>
        <div class="switch-block">
          <span class="switch-text">No</span>
          <v-switch v-model="image.archived"></v-switch>
          <span class="switch-text">Yes</span>
        </div>
      </div>
      <v-btn
        :disabled="!valid || isLoading || !imageFile"
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
import ImageUploader from '@/components/image-uploader/ImageUploader'
import storageService from '@/services/blockstack-storage'
import objectHelpers from '@/helpers/objectHelpers.js'
import validationService from '@/helpers/validate'

const cryptoAddress = localStorage['blockstack-gaia-hub-config'] ? JSON.parse(localStorage['blockstack-gaia-hub-config']).address : ''
const cryptoName = localStorage['blockstack'] ? JSON.parse(localStorage['blockstack']).username : ''

export default {

  data: () => ({
    blockstack: window.blockstack,
    isLoading: false,
    valid: false,
    imageFile: null,
    markers: [],
    tags: [],
    image: {
      title: '',
      detail: '',
      address: '',
      tags: [],
      marker: null,
      symbol: null,
      image: null,
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
    ],
    itemList: []
  }),
  components: {
    ImageUploader
  },
  props: {
    imageProp: {
      type: [Object, null],
      default: null
    }
  },
  watch: {
    deep: true,
    imageProp () {
      this.updateFromImageProp()
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
        this.image.createdtime = this.imageProp ? this.imageProp.createdtime : timestamp
        this.image.owner = JSON.parse(localStorage['blockstack-gaia-hub-config']).address
        this.image.tags = []
        this.tags.forEach(element => {
          this.image.tags.push({title: element})
        })
        this.image.ownername = cryptoName
        if (this.imageFile.name) {
          this.blockstack.putFile(`image_${timestamp}.${this.imageFile.name.split('.').pop()}`, this.imageFile, { encrypt: false })
            .then((imageUrl) => {
              // if (!this.imageFile) {
              this.image.image = imageUrl
              // }
              this.saveImage(timestamp)
            })
        } else {
          this.saveImage(timestamp)
        }
      }
    },
    getImageFilename (timestamp) {
      return this.imageProp ? `image_${this.imageProp.createdtime}.json` : `image_${timestamp}.json`
    },
    saveImage (timestamp) {
      this.blockstack.putFile(this.getImageFilename(timestamp), JSON.stringify(this.image), { encrypt: false })
        .then((jsonUrl) => {
          storageService.updateImageIndex(jsonUrl.split('/').pop().split('.')[0], this.image.title)
            .then(() => {
              this.isLoading = false
              this.imageProp ? this.$router.push({
                name: 'ImageInfo',
                params: {
                  imageName: 'image_' + this.image.createdtime,
                  imageObject: this.image
                } }) : this.clear()
            })
        })
    },
    clear () {
      this.$refs.form.reset()
      this.$refs.imageInput.removeFile()
    },
    getUploadedImage (e) {
      this.imageFile = e
    },
    updateFromImageProp () {
      if (this.imageProp) {
        for (let property in this.imageProp) {
          this.image[property] = this.imageProp[property] instanceof Object ? { ...this.imageProp[property] } : this.imageProp[property]
        }
        this.image.tags = objectHelpers.toArray(this.image.tags)
        this.imageFile = {}
        this.imageFile.url = this.image.image
        this.imageProp.tags.forEach(item => {
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
    }
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
    // }
  },
  mounted () {
    this.updateFromImageProp()
    this.fetchMarkers()
    // this.fetchTags()
  }
}
</script>
