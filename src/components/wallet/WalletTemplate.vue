<template>
  <v-layout row>
    <v-flex xs12 sm8 offset-sm2>
      <v-card class="br20">
        <v-layout class="wallet-card">
          <v-list-tile avatar>
            <v-avatar
              size=60
            >
              <v-icon class="coin-icon">fa-{{ icon }}</v-icon>
            </v-avatar>
            <div class="wallet-block">
              <v-list-tile-sub-title class="coin-sub-title">coin:</v-list-tile-sub-title>
              <v-list-tile-sub-title class="coin-sub-title">address:</v-list-tile-sub-title>
              <slot name="balance-title"></slot>
            </div>
            <div class="wallet-block">
              <v-list-tile-title v-html="title"/>
              <v-list-tile-title v-html="address" @click="copyAddress" id="coinAddress"></v-list-tile-title>
              <!--<v-list-tile-title v-html="amount"></v-list-tile-title>-->
              <slot name="balance"></slot>
            </div>
          </v-list-tile>
          <slot name="qr"></slot>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Summary',
  data: () => ({
    title: '',
    address: '',
    amount: '',
    icon: ''
  }),
  methods: {
    copyAddress () {
      const tempInput = document.createElement('input')
      document.body.appendChild(tempInput)
      tempInput.setAttribute('value', this.address)
      tempInput.select()
      document.execCommand('copy')
      document.body.removeChild(tempInput)
    }
  },
  mounted () {
    this.$store.commit('toggleLoading')
    const coinAddress = localStorage['blockstack-gaia-hub-config'] ? JSON.parse(localStorage['blockstack-gaia-hub-config']).address : ''
    this.address = coinAddress
    const username = localStorage['blockstack'] ? JSON.parse(localStorage['blockstack']).username : ''
    axios.get('https://blockchain.info/q/addressbalance/' + coinAddress)
      .then(res => {
        this.amount = res.data + ''
        this.$store.commit('toggleLoading')
      })
    axios.get('https://core.blockstack.org/v1/names/' + username)
      .then(res => {
        this.icon = res.data.blockchain
        this.title = res.data.blockchain
      })
  }
}
</script>

<style lang="scss" scoped>
  .wallet-block {
    margin-left: 5px;
  }
  .wallet-card {
    padding: 15px 0;
    flex-wrap: wrap;
    flex-direction: column;

    .coin-sub-title, .v-list__tile__sub-title, .v-list__tile__title {
      height: 24px;
    }
  }
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
  #coinAddress {
    cursor: pointer;
  }
</style>
