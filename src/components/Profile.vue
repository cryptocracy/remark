<template>
  <div>
    <div v-if="userData.hasOwnProperty('profile')" class="container profile-info">
      <v-container fluid="true" grid-list-md text-xs-center>
        <v-layout class="br20" row wrap align-center>
          <v-flex xs12>
            <v-card dark color="blue" class="" width="100%" height="288px">
              <v-img class="white--text" height="288px" :src="base64Image || 'https://cdn.vuetifyjs.com/images/cards/docks.jpg'">
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn v-if="$route.params.id === 'my-profile'" color="blue accent-4" @click="pickFile" outline icon><v-icon>edit</v-icon></v-btn>
                  <input @change="filePicked" ref="headerFile" accept="image/*" style="display: none;" type="file">
                </v-card-actions>
              </v-img>
              <v-avatar id="myavatar" class="justify-center">
                <v-img
                  position="center center"
                  v-if="userData.profile.hasOwnProperty('image')"
                  :src="userData.profile.image[0].contentUrl"
                  height="150px"
                  width="150px"
                >
                </v-img>
                <v-img
                  position="center center"
                  v-else
                  height="150px"
                  width="150px"
                  src="https://www.freeiconspng.com/uploads/no-image-icon-6.png"
                  gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)">
                </v-img>
              </v-avatar>
            </v-card>
          </v-flex>
          <!-- row of channel buttons starts here -->
          <v-flex xs1 class="br20">
            <v-icon color="teal accent-4" @click="redirectToResources('OwnedSounds')">fa-rss</v-icon> {{resources.sounds}}
          </v-flex>
          <v-flex xs2 class="br20">
            <v-tooltip bottom>
              <span v-if="$route.params.id !== 'my-profile'"> {{ userData.fullyQualifiedName }} </span>
              <span v-else> {{ userData.username }} </span>
            </v-tooltip>
            <v-list-tile-content>
              <v-list-tile-title v-if="$route.params.id !== 'my-profile'">{{userData.fullyQualifiedName || 'None'}}</v-list-tile-title>
              <v-list-tile-title v-else>{{userData.username || 'None'}}</v-list-tile-title>
              <v-list-tile-sub-title>Channel Name</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-flex>
          <v-flex xs1></v-flex>
          <v-flex xs1></v-flex>
          <!-- subscribe to channel button starts here -->
          <v-flex xs2 class="br20">
            <div v-if="$route.params.id !== 'my-profile'" class="justify-center">
              <v-tooltip bottom v-if="!isAdded">
                <v-btn slot="activator" @click.stop="updateChannels(userData, 'addition')" outline fab small color="blue accent-4"><v-icon color="blue accent-4">add_alert</v-icon></v-btn>
                <span>Subscribe to {{ userData.fullyQualifiedName }} 's Channel</span>
              </v-tooltip>
              <v-tooltip bottom v-else>
                <v-btn slot="activator" @click.stop="updateChannels(userData, 'deletion')" outline fab small color="red accent-4"><v-icon color="red accent-4">close</v-icon></v-btn>
                <span>Unsubscribe from {{ userData.fullyQualifiedName }} 's Channel</span>
              </v-tooltip>
            </div>
          </v-flex>
          <v-flex xs2></v-flex>
          <!-- reveal the qr code button starts here -->
          <v-flex xs1 class="br20">
            <v-icon v-if="$route.params.id !== 'my-profile'" dark block color="purple accent-4" @click="eventBus.$emit('showBTCAddress', {qrSrc, address})" class="br20">fa-qrcode</v-icon>
          </v-flex>
          <v-flex xs1 class="br20">
            <v-icon v-if="$route.params.id !== 'my-profile'" color="orange accent-4" :disabled="$route.params.id === 'my-profile' || !hasBTCProof" block :dark="hasBTCProof && $route.params.id !== 'my-profile'" class="br20" @click="redirectUser">fa-bitcoin</v-icon>
          </v-flex>
          <v-flex xs1 class="br20">
            <v-icon v-if="$route.params.id !== 'my-profile'" color="blue accent-4" dark block class="br20" @click="eventBus.$emit('payWithAltcoins')">fa-rocket</v-icon>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-if="showEdit"
              autofocus
              v-model="channelTitle"
              @blur="showEdit=false; updateSettings()"
            ></v-text-field>
            <v-icon @click="showEdit=true" v-if="!showEdit && $route.params.id === 'my-profile'"  small color="blue accent-4">edit</v-icon>
            <h5 v-if="channelTitle">{{channelTitle}}</h5>
            <h6 v-if="$route.params.id === 'my-profile' && !channelTitle">Editable title of your channel.</h6>

          </v-flex>
          <v-layout v-if="sounds && Object.keys(sounds).length" row wrap>
            <v-flex v-for="(item, index) in Object.keys(sounds)" :key="index" xs6>
              <v-card class="mt-2 br20" >
                <v-card-text>
                  <v-list>
                    <v-list-tile>
                      <v-list-tile-content>
                        <v-list-tile-title>{{sounds[item]}}</v-list-tile-title>
                        <v-list-tile-sub-title>{{new Date(parseInt(item.split('_')[1])).toUTCString()}}</v-list-tile-sub-title>
                      </v-list-tile-content>
                      <!-- <v-list-tile-sub-title>{{sounds[item]}}</v-list-tile-sub-title> -->
                      <v-list-tile-action>
                        <!-- <v-spacer></v-spacer> -->
                        <v-tooltip bottom>
                          <v-btn v-if="!isAddedObj[index]" @click="$store.commit('MUTATION_ADD_TO_PLAYLIST', { sound: hubUrl+item+'.mp3', title: sounds[item] }); $set(isAddedObj, index, true)" color="primary" slot="activator" round icon ><v-icon>playlist_add</v-icon></v-btn>
                          <v-btn v-else  color="primary" slot="activator" round icon ><v-icon>done</v-icon></v-btn>
                          <span v-if="!isAddedObj[index]">Add to current playlist</span>
                          <span v-else>Added to current playlist</span>
                        </v-tooltip>
                      </v-list-tile-action>
                      <v-list-tile-action>
                        <v-tooltip bottom>
                          <v-btn slot="activator" icon color="primary" @click="$store.commit('MUTATION_SET_SOUND', { sound: hubUrl+item+'.mp3', title: sounds[item] })" round ><v-icon>play_arrow</v-icon></v-btn>
                          <span>Play</span>
                        </v-tooltip>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
          <!-- grid of channel players starts here -->
          <!--          <v-flex xs12 class="br20">
            <v-list>
              <v-card width="100%">
                <audio class="soundplayer" src="http://www.hochmuth.com/mp3/Beethoven_12_Variation.mp3" controls></audio>
                <v-card-title class="text-xs-left">
                  <div>
                    <span class="grey--text">Created Date</span><br>
                    <span>Audio Title</span><br>
                    <span>Audio Description</span>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-list-tile-action><v-icon color="red">fa-heart-o</v-icon></v-list-tile-action>
                  <v-list-tile-action><v-icon color="green">fa-share-alt</v-icon></v-list-tile-action>
                  <v-list-tile-action><v-icon color="blue">fa-comment</v-icon></v-list-tile-action>
                </v-card-actions>
              </v-card>
            </v-list>
          </v-flex>
          <v-flex xs6 class="br20">
            <v-list>
              <v-card width="100%">
                <audio class="soundplayer" src="http://www.hochmuth.com/mp3/Bloch_Prayer.mp3" controls></audio>
                <v-card-title class="text-xs-left">
                  <div>
                    <span class="grey--text">Created Date</span><br>
                    <span>Audio Title</span><br>
                    <span>Audio Description</span>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-list-tile-action><v-icon color="red">fa-heart-o</v-icon></v-list-tile-action>
                  <v-list-tile-action><v-icon color="green">fa-share-alt</v-icon></v-list-tile-action>
                  <v-list-tile-action><v-icon color="blue">fa-comment</v-icon></v-list-tile-action>
                </v-card-actions>
              </v-card>
            </v-list>
          </v-flex>
          <v-flex xs6 class="br20">
            <v-list>
              <v-card width="100%">
                <audio class="soundplayer" src="http://www.hochmuth.com/mp3/Bloch_Prayer.mp3" controls></audio>
                <v-card-title class="text-xs-left">
                  <div>
                    <span class="grey--text">Created Date</span><br>
                    <span>Audio Title</span><br>
                    <span>Audio Description</span>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-list-tile-action><v-icon color="red">fa-heart-o</v-icon></v-list-tile-action>
                  <v-list-tile-action><v-icon color="green">fa-share-alt</v-icon></v-list-tile-action>
                  <v-list-tile-action><v-icon color="blue">fa-comment</v-icon></v-list-tile-action>
                </v-card-actions>
              </v-card>
            </v-list>
          </v-flex>-->
        </v-layout>
      </v-container>
    </div>
    <div class="mt-5 text-xs-center" v-else-if="!isResolved">
      <v-progress-circular
        :size="70"
        :width="5"
        color="blue accent-4"
        indeterminate
      ></v-progress-circular>
    </div>
    <div v-else class="mt-5 text-xs-center">
      <h1>No Channels found</h1>
    </div>
    <modals></modals>
  </div>
</template>

<script>
import { eventBus } from '@/main'
import { mapGetters } from 'vuex'
import qrEncode from 'qr-encode'
import modals from '@/components/modals/profile-modals'
import channelService from '@/services/channels'
import axios from 'axios'
import storageService from '../services/blockstack-storage'
// import { marker } from 'leaflet';

export default {
  name: 'Profile',
  data: () => ({
    // qrSrc: '',
    // address: '',
    dataurl: '',
    sounds: {},
    isAddedObj: {},
    showEdit: false,
    channelTitle: '',
    base64Image: '',
    channelDescription: '',
    resources: {
      tags: 0,
      sounds: 0,
      images: 0
    },
    eventBus: eventBus
  }),
  components: {
    modals
  },
  computed: {
    ...mapGetters({
      profileData: 'getProfileData',
      channels: 'getChannels',
      searchedUserProfileData: 'getUserProfileData',
      isResolved: 'isResolved',
      isRedirected: 'isRedirected'
    }),
    // computed property for showing searched user profile data or user's own profile data
    userData () {
      if (this.searchedUserProfileData && Object.keys(this.searchedUserProfileData).length > 0) {
        return this.searchedUserProfileData
      }
      return this.profileData
    },
    // computed property for showing addition/deletion button
    isAdded () {
      if (this.channels.length > 0) {
        return this.channels.find((item) => {
          return item.fullyQualifiedName === this.searchedUserProfileData.fullyQualifiedName
        })
      } else return false
    },
    hasBTCProof () {
      if (this.searchedUserProfileData && this.searchedUserProfileData.hasOwnProperty('profile') && Array.isArray(this.searchedUserProfileData.profile.account)) {
        return this.searchedUserProfileData.profile.account.find(account => account.service.toLowerCase() === 'bitcoin')
      } else {
        return false
      }
    },
    hubUrl () {
      if (this.searchedUserProfileData && this.searchedUserProfileData.hasOwnProperty('profile') && typeof this.searchedUserProfileData.profile.apps === 'object') {
        let url = this.searchedUserProfileData.profile.apps[window.location.origin] || this.searchedUserProfileData.profile.apps['https://remark_cryptocracy_io']
        this.getResourceCount(url)
        return url
      } else if (this.$route.params.id !== 'my-profile') {
        this.getResourceCount(null)
        return null
      } else if (this.profileData && this.profileData.profile) {
        let url = this.profileData.profile.apps[window.location.origin] || this.profileData.profile.apps['https://remark_cryptocracy_io']
        this.getResourceCount(url)
        return url
      }
      return ''
    },
    address () {
      if (this.hasBTCProof) {
        return this.hasBTCProof.identifier
      } else {
        return null
      }
    },
    qrSrc () {
      if (this.address) {
        return qrEncode(this.address, {type: 6, size: 6, level: 'Q'})
      } else {
        return null
      }
    }
  },
  watch: {
    deep: true,
    // this is necessary, do not remove it
    hubUrl () {
    }
  },
  mixins: [channelService],
  created () {
    // method from channelService mixin
    this.getChannels()
    // searching for user profile via params in current route when its not user own profile
    // isRedirected added to stop searching for profiles when user is being redirected from another page by clicking on the user link
    if (this.$route.params.id !== 'my-profile' && !this.isRedirected) {
      let searchObj = {
        endpoint: 'search',
        query: this.$route.params.id,
        isAbsolute: this.$route.params.id.split('.').length > 1,
        type: 'channels'
      }
      this.$store.commit('MUTATION_SET_SEARCH_RESULT', [])
      this.$store.commit('MUTATION_SET_USER', {})
      this.$store.dispatch('ACTION_GET_SEARCH_RESULT', searchObj)
    }
    // if (localStorage['blockstack-gaia-hub-config']) {
    //   this.address = JSON.parse(localStorage['blockstack-session']).userData.gaiaHubConfig.address
    //   this.qrSrc = qrEncode(this.address, {type: 6, size: 6, level: 'Q'})
    // }
  },
  methods: {
    filePicked (event) {
      const files = event.target.files

      if (files && files[0]) {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(files[0])
        fileReader.addEventListener('load', () => {
          // console.log('The soundUrl is ' + fileReader.result)
          this.base64Image = fileReader.result
          this.updateSettings()
        })
      }
    },
    updateSettings () {
      storageService.putFile({
        fileName: 'public_settings.json',
        data: {
          image: this.base64Image,
          channelDescription: this.channelDescription,
          channelTitle: this.channelTitle
        },
        options: { encrypt: false }
      }).then(res => {})
    },
    getSettings (url) {
      if (url) {
        axios.get(url + 'public_settings.json').then(res => {
          this.base64Image = res.data.image
          this.channelTitle = res.data.channelTitle
          this.channelDescription = res.data.channelDescription
        })
      } else {
        storageService.getFile({
          fileName: 'public_settings.json',
          options: { decrypt: false }
        }).then(res => {
          this.base64Image = res.image
          this.channelTitle = res.channelTitle
          this.channelDescription = res.channelDescription
          // console.log('ressssss', res)
        })
      }
    },
    pickFile () {
      this.$refs['headerFile'].click()
    },
    redirectUser () {
      this.$store.state.pay_to = this.searchedUserProfileData
      this.$router.push({name: 'Send'})
    },
    redirectToResources (resource) {
      this.$store.state.hubUrl = this.hubUrl
      this.$router.push({name: resource})
    },
    async getResourceCount (url) {
      this.getSettings(url)
      if (url) {
        axios.get(url + 'my_sounds.json').then(res => {
          this.sounds = {...res.data}
          Object.keys.forEach((element, index) => {
            this.$set(this.isAddedObj, index, false)
          })
          this.resources.sounds = Object.keys(this.sounds).length
        }).catch(e => {
          this.resources.sounds = 0
        })
      }
    }
  },
  destroyed () {
    this.$store.commit('MUTATION_SET_REDIRECTION_STATE', false)
  }
}
</script>
<style lang="scss" scoped>
.profile-info {
  .headline {
  color: #5a5d5f
  }
  h3{
    color: grey
  }
}
.br20 {
  border-radius: 20px
}
.qr-code {
  margin: 1% 0% 3% 0%
}
.ml25 {
  margin-left: 1em
}
#myavatar {
  margin-top: -144px
}
.soundplayer {
  width: 100%
}
.si {
  .v-icon {
  font-size: 15px !important
  }
}

</style>
