<template lang="html">
  <div class="iconbox-wrapper alter">
    <div class="row">
      <div class="col-md-3 col-sm-6">
        <app-icon-box-alter
          iconColor="green darken-3"
          icon="monetization_on"
          title="9, 693"
          subtitle="Earns"
        >
        </app-icon-box-alter>
      </div>

      <div class="col-md-3 col-sm-6">
        <app-icon-box-alter
          iconColor="pink accent-3"
          icon="add_shopping_cart"
          title="1, 250"
          subtitle="Sales"
        >
        </app-icon-box-alter>
      </div>

      <div class="col-md-3 col-sm-6">
        <app-icon-box-alter
          iconColor="blue darken-3"
          icon="supervisor_account"
          title="2, 324"
          subtitle="Users"
        >
        </app-icon-box-alter>
      </div>
      <div class="col-md-3 col-sm-6">
        <app-icon-box-alter
          iconColor="orange darken-3"
          icon="remove_red_eye"
          title="2, 324"
          subtitle="Views"
        >
        </app-icon-box-alter>
      </div>
    </div>
  </div>

</template>

<script>
import BoxAlterSingle from './BoxAlterSingle'

export default {
  components: {
    'app-icon-box-alter': BoxAlterSingle
  }
}
</script>

<style lang="css">
</style>
