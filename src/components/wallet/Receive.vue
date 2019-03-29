<template>
  <wallet-template>
    <template slot="qr">
      <img :src="qrSrc" class="qr-image">
    </template>
  </wallet-template>
</template>

<script>
import qr from 'qr-encode'
import WalletTemplate from './WalletTemplate'

export default {
  name: 'Summary',
  data: () => ({
    qrSrc: ''
  }),
  components: {
    WalletTemplate
  },
  mounted () {
    if (localStorage['blockstack-gaia-hub-config']) {
      this.qrSrc = qr(JSON.parse(localStorage['blockstack-gaia-hub-config']).address, { type: 6, size: 6, level: 'Q' })
    }
  }
}
</script>

<style scoped lang="scss">
  .qr-image {
    align-self: center;
    height: 200px;
    width: 200px;
    margin: 5px 0;
  }
</style>
