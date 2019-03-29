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
              color="purple accent-4"
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
          <v-btn color="purple accent-4" @click="showBTCAddress=!showBTCAddress" flat round dark><v-icon class="mr-2" small>clear</v-icon>Close</v-btn>
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
          <v-btn round flat color="purple accent-4" @click="payWithAltcoins=!payWithAltcoins"> <v-icon class="mr-3">clear</v-icon> close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import { eventBus } from '@/main'
export default {
  name: 'profileModals',
  data: () => ({
    qrSrc: '',
    address: '',
    showBTCAddress: false,
    showTooltip: false,
    payWithAltcoins: false
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
  },
  methods: {
    onCopy () {
      this.showTooltip = true
      setTimeout(() => {
        this.showTooltip = false
      }, 4000)
    }
  },
  destroyed () {
    eventBus.$off('showBTCAddress')
    eventBus.$off('payWithAltcoins')
  }
}
</script>

<style lang="scss">
.br20 {
  border-radius: 20px
}
</style>
