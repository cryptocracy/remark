<template>
  <v-layout row>
    <v-flex xs12 sm10 offset-sm1>
      <v-card class="br20">
        <v-list three-line>
          <template v-for="(item, index) in transactions">

            <v-divider
              v-if="index !== 0"
              :inset="item.inset"
              :key="index"
            ></v-divider>

            <v-list-tile
              :key="item.title"
              avatar
            >
              <v-list-tile-avatar>
                <v-icon :class="{ 'tx-rotate': item.balance_diff < 0} ">arrow_right_alt</v-icon>
                <!--<v-icon v-else>arrow_left_alt</v-icon>-->
                <!--<v-icon>arrow_right_alt</v-icon>-->
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title v-html="new Date(+item.created_at * 1000).toLocaleString()"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.hash"></v-list-tile-sub-title>
                <template v-for="(outItem, outIndex) in item.out">
                  <v-list-tile-sub-title :key="outIndex" v-html="outItem.addr"></v-list-tile-sub-title>
                </template>
              </v-list-tile-content>
              <v-list-tile-action>
                <div>{{ item.balance_diff }}</div>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Summary',
  data: () => ({
    transactions: []
  }),
  mounted () {
    this.$store.commit('toggleLoading')
    const btcAddress = localStorage['blockstack-gaia-hub-config'] ? JSON.parse(localStorage['blockstack-gaia-hub-config']).address : ''
    axios.get('https://chain.api.btc.com/v3/address/' + btcAddress + '/tx')
      .then(res => {
        if (res.data) {
          this.transactions = res.data.data.list.sort((a, b) => a.created_at < b.created_at)
        }
        this.$store.commit('toggleLoading')
      })
  }
}
</script>

<style scoped>
  .qr-image {
      height: 100px;
      width: 100px;
      min-width: 100px;
  }
  .tx-rotate {
    transform: rotate(180deg);
  }
</style>
