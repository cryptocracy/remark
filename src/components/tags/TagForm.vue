<template>
  <v-card class="container">
    <v-form ref="form" v-model="valid">
      <v-text-field
        v-model="tag.title"
        :rules="titleRules"
        :counter="21"
        :disabled="isLoading"
        label="Title"
        required
      ></v-text-field>
      <v-select
        :items="symbols"
        label="Symbol"
        v-model="tag.symbol"
        :disabled="isLoading"
      ></v-select>
      <v-text-field
        v-model="tag.address"
        :rules="addressRules"
        :counter="42"
        label="Crypto Address"
        :disabled="isLoading"
      ></v-text-field>
      <!--<div class="switch-wrapper">-->
      <!--<div class="input-group&#45;&#45;text-field primary&#45;&#45;text">Privacy</div>-->
      <!--<div class="switch-block">-->
      <!--<span class="switch-text">Public</span>-->
      <!--<v-switch v-model="tag.private"></v-switch>-->
      <!--<span class="switch-text">Personal</span>-->
      <!--</div>-->
      <!--</div>-->
      <div class="switch-wrapper" v-if="tagProp">
        <div class="input-group--text-field primary--text">Archived</div>
        <div class="switch-block">
          <span class="switch-text">No</span>
          <v-switch v-model="tag.archived"></v-switch>
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
const cryptoName = localStorage['blockstack'] ? JSON.parse(localStorage['blockstack']).username : ''

export default {
  data: () => ({
    blockstack: window.blockstack,
    isLoading: false,
    valid: false,
    tag: {
      title: '',
      address: '',
      symbol: null,
      private: false,
      archived: false,
      v: '0.0.1',
      id: ''
    },
    symbols: ['BTC', 'STX'],
    titleRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 21) || 'Name must be less than 21 characters',
      v => /^\w+$/.test(v) || 'Letters, numbers and "_" are only allowed'
    ],
    addressRules: [
      v => v ? /^((?!_)[A-z0-9])+$/.test(v) || 'Letters and numbers are only allowed' : true,
      v => v ? v.length <= 42 || 'Please enter proper address' : true
    ]
  }),
  props: {
    tagProp: {
      type: [Object, null],
      default: null
    }
  },
  watch: {
    tagProp () {
      this.updateFromTagProp()
    }
  },
  methods: {
    submit () {
      const timestamp = +new Date()
      if (this.$refs.form.validate()) {
        this.isLoading = true
        this.tag.createdtime = this.tagProp ? this.tagProp.createdtime : timestamp
        this.tag.owner = JSON.parse(localStorage['blockstack-gaia-hub-config']).address
        this.tag.ownername = cryptoName
        this.saveTag(timestamp)
      }
    },
    getTagFilename (timestamp) {
      return this.tagProp ? `tag_${this.tagProp.createdtime}.json` : `tag_${timestamp}.json`
    },
    saveTag (timestamp) {
      this.blockstack.putFile(this.getTagFilename(timestamp), JSON.stringify(this.tag), { encrypt: false })
        .then((jsonUrl) => {
          storageService.updateTagIndex(jsonUrl.split('/').pop().split('.')[0], this.tag.title)
            .then(() => {
              this.isLoading = false
              this.tagProp ? this.$router.push({
                name: 'TagInfo',
                params: {
                  tagName: 'tag_' + this.tag.createdtime,
                  tagObject: this.tag
                } }) : this.clear()
            })
        })
    },
    clear () {
      this.$refs.form.reset()
    },
    updateFromTagProp () {
      if (this.tagProp) {
        for (let property in this.tagProp) {
          this.tag[property] = this.tagProp[property] instanceof Object ? { ...this.tagProp[property] } : this.tagProp[property]
        }
      } else {
        this.clear()
      }
    }
  },
  mounted () {
    this.updateFromTagProp()
  }
}
</script>
