<template lang="html">
  <v-list>
    <v-list-group
      v-for="item in items"
      :value="item.active"
      v-bind:key="item.title"
      v-model="item.active"
      :class="!item.items ? 'no-child' : ''"
    >

      <v-list-tile :class="item.class" slot="activator" :to="item.linkTo" @click=hideSearchResults>
        <v-list-tile-action>
          <v-icon :color="item.color">{{ item.action }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <!-- Rendering child list item -->
      <v-list-tile @click=hideSearchResults v-if="item.items" v-for="subItem in item.items" v-bind:key="subItem.title" :to="subItem.linkTo">
        <v-list-tile-action>
          <v-icon color="grey lighten-1">{{ item.action }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list-group>
  </v-list>
</template>

<script>
import items from './navData'

export default {
  data () {
    return {
      items
    }
  },
  methods: {
    hideSearchResults () {
      this.$store.commit('MUTATION_SET_SEARCH_STATE', false)
      this.$store.commit('MUTATION_SET_SEARCH_RESULT', [])
    },
    stopLoading () {
      this.$store.commit('toggleLoading', false)
    }
  }
}
</script>

<style lang="css">
 /* do not delete for now */
/* .list__tile {
  height: 50px;
}
.primary--text.list__tile--active.list__tile.list__tile--link {
  color: rgba(0,0,0,.87) !important;
}

.list--group .list__tile {
  height: 40px;
  padding-left: 20px !important;
}
.list--group .list__tile:hover {

  background: #f3f3f3;
}
.list--group .list__tile .list__tile__title:hover,
.list--group .router-link-exact-active .list__tile__title {
}

.application .theme--light.list--group .list__tile--active .list__tile__title, .theme--light .list--group .list__tile--active .list__tile__title {
  color: rgba(0,0,0,.87) !important;
}

.list__tile--highlighted, .list__tile--link:hover {
  background: linear-gradient(to right, rgba(30,190,165, .3) , rgba(30,190,165, .2), rgba(30,190,165, 0)) !important;
}
.list--group__header--active {

  background: linear-gradient(to right, rgba(30,190,165, .3) , rgba(30,190,165, .2), rgba(30,190,165, 0)) !important;
}
.list--group__header--active .list__tile,
.list--group__header>li:first-child:hover {
  background: transparent !important;
} */
a:focus {
  color: #1ebea5 !important
}
a:hover {
  /* color: #2a3134 !important */
  color: inherit !important
}
.v-list >>> .v-list__tile {
    height: 50px;
  }
.no-child .v-list__group__header__append-icon {
  display: none;
}
.v-list__group__header__append-icon .v-icon{
  font-size: 16px;
  margin-right: 5px;
}
.v-list >>> .primary--text.list__tile--active.list__tile.list__tile--link {
  color: rgba(0,0,0,.87) !important;
}

.v-list >>> .v-list__group__items .v-list__tile {
  height: 40px;
  padding-left: 20px !important;
}
.v-list >>> .v-list__group .v-list__tile:hover {
  background: #f3f3f3;
}
/* .v-list >>> .v-list__group .v-list__tile .v-list__tile__title:hover,
.v-list >>> .v-list__group .router-link-exact-active .v-list__tile__title {
} */
.v-list >>> .v-list__group .v-list__tile--active .v-list__tile__title,
.v-list >>> .v-list__group .v-list__tile--active .v-list__tile__title {
  color: rgba(0,0,0,.87) !important;
}

/* .v-list >>> .v-list__tile--active, .v-list >>> .v-list__tile--link:hover,
.v-list >>> .v-list__group__header:hover {
  background: linear-gradient(to right, rgba(30,190,165, .3) , rgba(30,190,165, .2), rgba(30,190,165, 0)) !important;
}
.v-list >>> .v-list__group__header--active {
  background: linear-gradient(to right, rgba(30,190,165, .3) , rgba(30,190,165, .2), rgba(30,190,165, 0)) !important;
} */
.theme--light.v-list .v-list__tile--link:hover {
  background: linear-gradient(to right, rgba(30,190,165, .3) , rgba(30,190,165, .2), rgba(30,190,165, 0)) !important;
}
/* .theme--light.v-list .v-list__group.no-child:hover {
  background: white !important;
} */
.theme--light.v-list .v-list__group__header:hover {
  background: linear-gradient(to right, rgba(30,190,165, .3) , rgba(30,190,165, .2), rgba(30,190,165, 0)) !important;
}

.v-list >>> .v-list__group__header--active .v-list__tile,
.v-list >>> .v-list__group__header .v-list__tile {
  background: transparent !important;
}
.v-list >>> .v-list__group__header--active .v-list__tile,
.v-list >>> .v-list__group__header>li:first-child:hover {
  background: transparent !important;
}
</style>
