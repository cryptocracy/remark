<template lang="html">
  <div class="">
    <h6>Latest Activities (Coming Soon)</h6>
    <!-- <div v-for="(notification, index) in notificationData" :key="index">

      <div class="notification-single">
        <div class="avatar" v-if="notification.avatar !== ''" :style="{background: 'url(' + notification.avatar + ')'}"></div>
        <div v-if="notification.avatar === null" class="avatar avatar-icon"><i class="fa fa-user"></i></div>

        <div v-if="notification.icon" :class="notificationIconClass(notification)">
          <i :class="notification.icon"></i>
        </div>

        <p class="details">
          <a href="#" v-if="notification.name">{{notification.name}}</a>
          <span>{{notification.detail}}</span>
        </p>
        <p class="time">{{notification.time}}</p>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  methods: {
    /**
    * Notification icon, background change based on notification data.
    *
    * @type {function}
    * @param {boolean} iconType based on notification `success/warning/danger` data
    * @return {string} success-icon if icon type success is true
    */
    notificationIconClass (iconType) {
      return {
        'success-icon': iconType.success,
        avatar: true,
        'avatar-icon': true,
        'warning-icon': iconType.warning,
        'danger-icon': iconType.danger
      }
    }
  },
  computed: {
    /**
    * Get notification data from vuex store
    * as a props to the componenet
    */
    notificationData () {
      return this.$store.state.notifications.data
    }
  }
}
</script>

<style lang="css">
</style>
