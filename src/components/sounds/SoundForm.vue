<template>
  <v-card class="container">
    <v-form ref="form" v-model="valid">
      <sound-uploader
        accept="audio/mp3"
        ref="soundInput"
        :disabled="isLoading"
        limit=20000000
        :value="soundFile"
        @input="getUploadedSound"
      />
      <!--      <input type="file" :name="uploadSound" :value="soundFile" :disabled="isLoading" limit=20000000 accept="audio/mp3" class="input-file" @input="getUploadedSound" required>-->
      <v-text-field
        v-model="sound.title"
        :rules="titleRules"
        :counter="32"
        :disabled="isLoading"
        label="Title"
        required
      ></v-text-field>
      <v-text-field
        v-model="sound.description"
        label="Description"
        :disabled="isLoading"
      ></v-text-field>
      <v-select
        :items="symbols"
        label="Symbol"
        v-model="sound.symbol"
        :disabled="isLoading"
      ></v-select>
      <v-text-field
        v-model="sound.address"
        :rules="addressRules"
        :counter="32"
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

      <div class="switch-wrapper" v-if="soundProp">
        <div class="input-group--text-field primary--text">Archived</div>
        <div class="switch-block">
          <span class="switch-text">No</span>
          <v-switch v-model="sound.archived"></v-switch>
          <span class="switch-text">Yes</span>
        </div>
      </div>
      <v-btn
        :disabled="!valid || isLoading || !soundFile"
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
import SoundUploader from '@/components/sound-uploader/SoundUploader'
import storageService from '@/services/blockstack-storage'
import { Settings } from 'luxon'
import objectHelpers from '@/helpers/objectHelpers.js'
import validationService from '@/helpers/validate'

/* const cryptoAddress = localStorage['blockstack-gaia-hub-config'] ? JSON.parse(localStorage['blockstack-gaia-hub-config']).address : '' */
const cryptoName = localStorage['blockstack'] ? JSON.parse(localStorage['blockstack']).username : ''

Settings.defaultLocale = 'en'

export default {

  data: () => ({
    blockstack: window.blockstack,
    isLoading: false,
    valid: false,
    soundFile: null,
    tags: [],
    sound: {
      title: '',
      description: '',
      address: '',
      tags: [],
      symbol: null,
      sound: null,
      limit: false,
      archived: false,
      v: '0.0.1',
      id: ''
    },
    symbols: ['BTC', 'STX'],
    titleRules: [
      v => !!v || 'A Title is required',
      v => (v && v.length <= 32) || 'The Title must be less than 32 characters',
      v => /^[\w ]+$/.test(v) || 'Letters, numbers, spaces and "_" are only allowed'
    ],
    addressRules: [
      v => v ? /^((?!_)[A-z0-9])+$/.test(v) || 'Letters and numbers are only allowed' : true,
      v => v ? v.length <= 42 || 'Please enter proper donation BTC or STX address' : true
    ],
    tagsRules: [
      v => validationService.validateTags(v)
    ]
  }),
  components: {
    SoundUploader
  },
  props: {
    soundProp: {
      type: [Object, null],
      default: null
    }
  },
  watch: {
    soundProp () {
      this.updateFromSoundProp()
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
        this.sound.createdtime = this.soundProp ? this.soundProp.createdtime : timestamp
        this.sound.owner = JSON.parse(localStorage['blockstack-gaia-hub-config']).address
        this.sound.tags = []
        this.tags.forEach(element => {
          this.sound.tags.push({title: element})
        })
        this.sound.ownername = cryptoName
        if (this.soundFile.name) {
          this.blockstack.putFile(`sound_${timestamp}.${this.soundFile.name.split('.').pop()}`, this.soundFile, { encrypt: false })
            .then((soundUrl) => {
              this.sound.sound = soundUrl
              this.saveSound(timestamp)
            })
        } else {
          this.saveSound(timestamp)
        }
      }
    },
    getSoundFilename (timestamp) {
      return this.soundProp ? `sound_${this.soundProp.createdtime}.json` : `sound_${timestamp}.json`
    },
    saveSound (timestamp) {
      this.blockstack.putFile(this.getSoundFilename(timestamp), JSON.stringify(this.sound), { encrypt: false })
        .then((jsonUrl) => {
          storageService.updateSoundIndex(jsonUrl.split('/').pop().split('.')[0], this.sound.title)
            .then(() => {
              this.isLoading = false
              this.soundProp ? this.$router.push({
                name: 'SoundInfo',
                params: {
                  soundName: 'sound_' + this.sound.createdtime,
                  soundObject: this.sound
                }
              }) : this.clear()
            })
        })
    },
    clear () {
      this.$refs.form.reset()
    },
    updateFromSoundProp () {
      if (this.soundProp) {
        for (let property in this.soundProp) {
          this.sound[property] = this.soundProp[property] instanceof Object ? {...this.soundProp[property]} : this.soundProp[property]
        }
        this.sound.sounds = objectHelpers.toArray(this.sound.sounds)
        this.soundProp.tags.forEach(item => {
          this.tags.push(item.title)
        })
      } else {
        this.clear()
      }
    }
  },
  mounted () {
    this.updateFromSoundProp()
  }
}
</script>
