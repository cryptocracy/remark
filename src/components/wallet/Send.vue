<template>
  <v-layout row v-if="!stateIsLoading">
    <v-flex xs12 sm8 offset-sm2>
      <v-card class="wallet-card wallet-card--balance br20 text-xs-center">
        Current balance: {{ this.addressData.final_balance }} (Satoshi)
      </v-card>
      <v-card class="wallet-card br20">
        <div class="wallet-title">Send to:</div>
        <v-form ref="form" lazy-validation>
          <v-combobox
            v-model="selectedChannel"
            :items="filteredChannelList"
            item-text="fullyQualifiedName"
            item-value="btcAddress"
            :disabled="isLoading"
            chips
            label="Select from Subscribed Channels"
            hint="Showing Subscribed Channels that have a BTC address associated with them."
            :persistent-hint="true"
          >
            <template v-if="selectedChannel && typeof selectedChannel === 'object' && Object.keys(selectedChannel).length > 0" slot="selection" slot-scope="data">
              <v-chip
                color="#a135f0"
                text-color="white"
                :selected="data.selected"
                :disabled="data.disabled"
                :key="JSON.stringify(data.item)"
                :close="true"
                @input="selectedChannel = {}"
              >
                <!-- Image will be shown in the chip, if there is not an image then the first character avatar of the user will be shown. -->
                <v-avatar v-if="data.item.hasOwnProperty('profile') && data.item.profile.hasOwnProperty('image')">
                  <img :src="data.item.profile.image[0].contentUrl" alt="avatar">
                </v-avatar>
                <v-avatar v-else class="primary white--text">
                  {{ typeof data.item === 'object' ? data.item.fullyQualifiedName.slice(0, 1).toUpperCase() : ''}}
                </v-avatar>
                {{ data.item.fullyQualifiedName }}
              </v-chip>
            </template>
          </v-combobox>

          <p class="mt-3">Or directly enter a address</p>

          <v-text-field
            v-model="addressee"
            :rules="addressRules"
            :disabled="isLoading"
            label="BTC Address"
            hint="This field will be read-only if you select a Channel from above dropdown"
            :persistent-hint="true"
            :readonly="selectedChannel && typeof selectedChannel === 'object' && Object.keys(selectedChannel).length > 0"
            requiredpo
          ></v-text-field>
          <v-text-field
            v-model="amountPay"
            label="Amount to Send"
            :disabled="isLoading"
            :rules="amountRule"
            suffix="BTC (in Satoshi)"
          ></v-text-field>
          <v-text-field
            v-model="amountFee"
            label="Transaction Fee"
            :disabled="isLoading"
            :rules="amountRule"
            suffix="Satoshi/byte"
          ></v-text-field>
          <div class="fee-title" v-if="fastestFee || halfHourFee || hourFee">Recommended fees (in Satoshis per byte)</div>
          <div class="fee-hints">
            <div class="fee-hint" v-if="fastestFee">Fastest fee:&nbsp;
              <span class="fee-amount" @click="setFee(fastestFee)">{{ fastestFee }}</span>
            </div>
            <div class="fee-hint" v-if="halfHourFee">Medium fee:&nbsp;
              <span class="fee-amount" @click="setFee(halfHourFee)">{{ halfHourFee }}</span>
            </div>
            <div class="fee-hint" v-if="hourFee">Slowest fee:&nbsp;
              <span class="fee-amount" @click="setFee(hourFee)">{{ hourFee }}</span>
            </div>
          </div>
          <div class="form-buttons">
            <v-btn
              :disabled="!valid || isLoading"
              @click="submit"
            >
              send
            </v-btn>
            <v-btn
              @click="clear"
              :disabled="isLoading"
            >
              clear
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import channelService from '@/services/channels'
const bitcoin = require('bitcoinjs-lib')
const CoinKey = require('coinkey')
const axios = require('axios')
const apiUrl = `https://blockchain.info/rawaddr/`
// const apiUrl = 'https://cors-anywhere.herokuapp.com/https://blockchain.info/rawaddr/'

export default {
  name: 'Send',
  data: () => ({
    filteredChannelList: [],
    selectedChannel: {},
    addressPublic: '',
    addressee: null,
    amountPay: null,
    amountFee: null,
    isLoading: false,
    fastestFee: null,
    halfHourFee: null,
    hourFee: null,
    addressData: {},
    addressRules: [
      v => v ? /^((?!_)[A-z0-9])+$/.test(v) || 'Letters and numbers are only allowed' : true,
      v => v ? v.length <= 34 || 'Please enter proper address' : true,
      v => v ? v.length >= 25 || 'Please enter proper address' : true
    ],
    amountRule: [
      v => v ? /^((?!_)[0-9.])+$/.test(v) || 'Numbers are only allowed' : true
    ]
  }),
  mixins: [channelService],
  computed: {
    ...mapGetters({
      stateIsLoading: 'isLoading',
      channelList: 'getChannels'
    }),
    valid () {
      return this.addressee && this.amountPay && this.amountFee
    }
  },
  watch: {
    deep: true,
    channelList () {
      if (this.channelList.length > 0) {
        this.getFilteredChannelList(this.channelList)
      }
    },
    selectedChannel () {
      if (this.selectedChannel && typeof this.selectedChannel === 'object' && Object.keys(this.selectedChannel).length > 0) {
        this.getUserDetails()
      } else {
        this.addressee = null
      }
    }
  },
  methods: {
    // method to filter channel on the basis of if there is any btc address found in their account.
    getFilteredChannelList (channelList) {
      this.filteredChannelList = []
      channelList.forEach(channel => {
        this.filterByService({ channel, createList: true })
      })
    },
    // filtering channels if they have bitcoin service associated
    filterByService (args) {
      let { channel, createList } = args
      if (channel.hasOwnProperty('profile') && Array.isArray(channel.profile.account)) {
        channel.profile.account.find(account => {
          if (account.service.toLowerCase() === 'bitcoin') {
            // filling channel list array if createList is true
            createList && this.fillChannelList(channel, account)
            !createList && (this.addressee = account.identifier)
          }
        })
      }
    },
    fillChannelList (channel, account) {
      let modifiedChannelObject = Object.assign({}, channel)
      this.$set(modifiedChannelObject, 'addressee', account.identifier)
      this.filteredChannelList.push(modifiedChannelObject)
    },
    async getUserDetails () {
      this.$store.commit('toggleLoading')
      let query = this.selectedChannel.fullyQualifiedName || this.selectedChannel.username
      let user = await this.$store.dispatch('ACTION_GET_USER', {
        query,
        endpoint: `https://core.blockstack.org/v1/users/${query}`
      })
      this.$store.commit('toggleLoading')
      this.filterByService({ channel: user, createList: false })
    },
    setFee (amount) {
      this.amountFee = amount
    },
    clear () {
      this.selectedChannel = {}
      this.addressee = null
      this.amountPay = null
      this.amountFee = null
    },
    submit () {
      this.isLoading = true
      let tx = new bitcoin.TransactionBuilder()
      for (let txData of this.addressData.txs) {
        for (let out of txData.out) {
          if (!out.spent && out.addr === this.addressPublic) {
            tx.addInput(txData.hash, +out.n)
          }
        }
      }
      tx.addOutput(this.addressee, +this.amountPay)
      tx.addOutput(this.addressPublic, this.addressData.final_balance - this.amountPay - this.amountFee * (tx.__tx.ins.length * 148 + (tx.__tx.outs.length + 1) * 34 + 10 - tx.__tx.ins.length))
      const buffer = Buffer.from(JSON.parse(localStorage['blockstack']).appPrivateKey, 'hex')
      const ck = new CoinKey(buffer) // eslint-disable-next-line
      let keyPair = new bitcoin.ECPair.fromWIF(ck.privateWif, bitcoin.networks.bitcoin)
      for (let inputIndex in tx.__inputs) {
        tx.sign(+inputIndex, keyPair)
      }
      let txHex = tx.build().toHex()
      let bodyFormData = new FormData()
      bodyFormData.append('tx', txHex)
      const config = {
        headers: {
          'Content-Type': ' multipart/form-data'
        }
      }
      axios.post('https://blockchain.info/pushtx?cors=true', bodyFormData, config)
        .then((res) => {
          this.isLoading = false
          this.clear()
        })
    }
  },
  mounted () {
    if (Object.keys(this.$store.state.pay_to).length > 0) {
      this.selectedChannel = this.$store.state.pay_to
    }
    if (this.$store.state.BTCAddress) {
      this.addressee = this.$store.state.BTCAddress
    }
    this.getFilteredChannelList(this.channelList)
    this.$store.commit('toggleLoading')
    this.addressPublic = JSON.parse(localStorage['blockstack-gaia-hub-config']).address
    //  get info about wallet address
    axios.get(apiUrl + this.addressPublic + '?format=json&cors=true')
      .then((res) => {
        this.addressData = res.data
        this.$store.commit('toggleLoading')
      })
    //  get info about tx fees
    axios.get('https://bitcoinfees.earn.com/api/v1/fees/recommended')
      .then((res) => {
        this.fastestFee = res.data.fastestFee
        this.halfHourFee = res.data.halfHourFee
        this.hourFee = res.data.hourFee
      })
  },
  created () {
    // method from channelService mixin
    this.getChannels()
  },
  destroyed () {
    this.$store.state.BTCAddress = null
    this.$store.state.pay_to = {}
  }
}
</script>

<style lang="scss" scoped>
    .wallet-card {
        padding: 15px 20px;

        .form-buttons {
            margin-left: -7px;
        }

        &.wallet-card--balance {
          margin-bottom: 20px;
          text-align: right;
          font-size: 16px;
        }
    }
    .wallet-title {
        font-size: 24px;
    }
    .fee-hints {
        display: flex;
    }
    .fee-hint {
        margin-right: 20px;
    }
    .fee-amount {
        cursor: pointer;
        color: #b734d6;
    }
</style>
