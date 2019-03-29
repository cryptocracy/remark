<template>
  <div class="ab">
    <div class="login">
      <div class="text-center">
				<img class="img-icon" src="https://raw.githubusercontent.com/cryptocracy/images/master/podcast.png" alt="Remark" height="296" width="350">
        <h1>Remark</h1>
        <h4>Resonate Your Audio</h4>
        <v-btn class="btn-login pl-4 pr-4" style="color : #409bf7;" @click="signIn">Sign In With Blockstack</v-btn>
        <p></p>
        <img class="img-icon" src="https://raw.githubusercontent.com/cryptocracy/images/master/mic.png" alt="Remark" height="128" width="128">
      </div>
    </div>
    <v-footer class="pa-3" >
      <v-spacer></v-spacer>
      <div>powered by <a href="https://blockstack.org">Blockstack</a> - source code on <a href="https://github.com/cryptocracy/remark">Github</a></div>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: 'login',
  data: () => ({
    blockstack: window.blockstack
  }),
  methods: {
    signIn () {
      const origin = window.location.origin
      this.blockstack.redirectToSignIn(origin, `${origin}/manifest.json`, ['store_write', 'publish_data'])
      // this.blockstack.redirectToSignIn()
    }
  }
}
</script>

<style lang="scss" scoped>

  .login {
    display: flex;
    align-items: center;
    background: linear-gradient(to right, #409bf7, #91c3f7);
    justify-content: center;
    // height: 94.4vh;
    height: 100vh;
  }
  .img-icon {
    // margin-left: 14%;
    margin-bottom: 4%;
  }
  .application .theme--light.footer, .theme--light .v-footer {
    background: linear-gradient(to right, #409bf7, #91c3f7);
  }
  .application a {
    color : #a135f0
  }
  .btn-login {
    border-radius: 20px;
    color : #409bf7;
  }
  .theme--light.application {
    background: linear-gradient(to right, #409bf7, #91c3f7);
  }
</style>
