<template>
  <wallet-template>
    <template slot="balance-title">
      <v-list-tile-sub-title class="coin-sub-title">balance:&nbsp;&nbsp;</v-list-tile-sub-title>
    </template>
    <template slot="balance">
      <v-list-tile-title v-html="balance"/>
    </template>
    <v-flex md6>
      <app-layout
        height="300px"
        title="Wallet Input (Received)"
        :children="LineChart"
        class='walletInput'
        :showGraph="showDonationGraph"
        error_message_title = "No Donations found."
        error_message="Be patient, it may take time for other users to show interest in your content."
      >
      </app-layout>
    </v-flex>
    <v-flex md6>
      <app-layout
        height="300px"
        title="Wallet Output (Payouts)"
        :children="BarChart"
        class='walletOutput'
        :showGraph="showPayoutGraph"
        error_message_title = "No Payouts found."
        error_message="Looks like you have not initiated any payouts yet."
      >
      </app-layout>
    </v-flex>
  </wallet-template>
</template>

<script>
import WalletTemplate from './WalletTemplate'
import axios from 'axios'
import LineChart from '@/components/charts/line-chart/LineChart'

export default {
  name: 'Summary',
  components: {
    WalletTemplate
  },
  computed: {
    showDonationGraph: 'showDonationGraph',
    showPayoutGraph: 'showPayoutGraph'
  },
  data: () => ({
    LineChart,
    balance: ''
  }),
  mounted () {
    const btcAddress = localStorage['blockstack-gaia-hub-config'] ? JSON.parse(localStorage['blockstack-gaia-hub-config']).address : ''
    axios.get('https://blockchain.info/q/addressbalance/' + btcAddress)
      .then(res => {
        this.balance = res.data + ''
      })
  }
}
</script>

<style scoped>
.coin-sub-title {
    height: 24px;
    display: flex;
    align-items: center;
    padding-bottom: 1px;
}
.coin-icon {
    font-size: 50px;
}
@media only screen and (max-width: 786px) {
    .coin-sub-title {
        display: none;
    }
}
</style>
