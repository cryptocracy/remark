<template>
  <wallet-template>
    <template slot="balance-title">
      <v-list-tile-sub-title class="coin-sub-title">balance:&nbsp;&nbsp;</v-list-tile-sub-title>
    </template>
    <template slot="balance">
      <v-list-tile-title v-html="balance"/>
    </template>
  </wallet-template>
</template>

<script>
import WalletTemplate from './WalletTemplate'
import axios from 'axios'

export default {
  name: 'Summary',
  components: {
    WalletTemplate
  },
  data: () => ({
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
