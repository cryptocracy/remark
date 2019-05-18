<template>
  <div>
    <v-dialog v-model="showBTCAddress" width="40em">
      <v-card class="br20">
        <v-card-title class="headline">BTC Address/QR Code</v-card-title>
        <v-card-text v-if="address" class="text-xs-center">
          <p class="subheading">{{address}}</p>
          <img :src="qrSrc" :height="imageSize" class="mt-3 mb-3">
        </v-card-text>
        <v-card-text v-else class="text-xs-center">No associated BTC proof found with this Blockstack Identity.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-tooltip top v-if="address">
            <v-btn
              slot="activator"
              color="blue accent-4"
              flat
              dark
              round
              v-clipboard:copy="address"
              v-clipboard:success="onCopy"
            >
              <v-icon class="mr-2" small>file_copy</v-icon>
              Copy
            </v-btn>
            <span v-if="showTooltip">Copied!</span>
            <span v-else>Copy BTC Address</span>
          </v-tooltip>
          <v-btn color="blue accent-4" @click="showBTCAddress=!showBTCAddress" flat round dark><v-icon class="mr-2" small>clear</v-icon>Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="payWithAltcoins" width="35em">
      <v-card class="text-xs-center br20">
        <v-card-title class="headline">
          Coming Soon..
        </v-card-title>
        <v-card-text>
          <div><v-icon large>fa-smile-o</v-icon></div>
          <p>Thanks for showing interest.</p>
          <p>Our team is working hard for making this feature available to users as soon as possible.</p>
          <p>Stay tuned...</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn round flat color="blue accent-4" @click="payWithAltcoins=!payWithAltcoins"> <v-icon class="mr-3">clear</v-icon> close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addToChannels" width="40em">
      <v-card class="text-xs-center br20">
        <v-card-title class="headline">
          Add to Channels
        </v-card-title>
        <v-card-text>
          <v-select
            :items=channelPriorities
            label="Select channel priority"
            v-model="channelPriority"
            return-object
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn round color="blue accent-4 white--text" @click="updateChannelFile">Subscribe</v-btn>
          <v-btn round flat @click="addToChannels=!addToChannels"> cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { eventBus } from '@/main'
import channelService from '@/services/channels'
export default {
  name: 'profileModals',
  mixins: [channelService],
  data: () => ({
    qrSrc: '',
    address: '',
    showBTCAddress: false,
    showTooltip: false,
    payWithAltcoins: false,
    addToChannels: false,
    channelPriority: null,
    channelPriorities: [
      { text: 'Gold', value: 'gold', priority: 1 },
      { text: 'Silver', value: 'silver', priority: 2 },
      { text: 'Bronze', value: 'bronze', priority: 3 }
    ]

  }),
  computed: {
    imageSize () {
      // breakpoints to dynamically resizing profile image
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '80px'
        case 'sm': return '200px'
        default: return '246px'
      }
    }
  },
  mounted () {
    eventBus.$on('showBTCAddress', data => {
      this.qrSrc = data.qrSrc
      this.address = data.address
      this.showBTCAddress = true
    })
    eventBus.$on('payWithAltcoins', data => {
      this.payWithAltcoins = true
    })
    eventBus.$on('addToChannels', data => {
      console.log('YOOOOOOOOO', data)
      this.userData = {...data.data}
      this.addToChannels = true
    })
  },
  methods: {
    onCopy () {
      this.showTooltip = true
      setTimeout(() => {
        this.showTooltip = false
      }, 4000)
    },
    updateChannelFile () {
      this.$set(this.userData, 'channelLeague', this.channelPriority.value)
      this.$set(this.userData, 'channelPriority', this.channelPriority.priority)
      console.log(this.userData)
      this.updateChannels(this.userData, 'addition')
      this.addToChannels = false
      this.userData = null
    }
  },
  destroyed () {
    eventBus.$off('showBTCAddress')
    eventBus.$off('payWithAltcoins')
    eventBus.$off('addToChannels')
  }
}
</script>

<style lang="scss">
.br20 {
  border-radius: 20px
}
</style>
