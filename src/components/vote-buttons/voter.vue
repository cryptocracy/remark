<template>
  <v-layout row>
    <v-flex class="disFlex" xs12 justify-space-around>
      <div class="flex xs6 disFlex justify-space-around align-center pr-0">
        <span class="count green--text">{{totalUpVotes}}</span>
        <v-btn fab dark class="hoverAnimation m-0" :class="{'unClickable': upvote}" :color="upvote?'green':'grey'" @click="voteUp()">
          <v-icon dark>thumb_up_alt</v-icon>
        </v-btn>
      </div>
      <div class="flex xs6 disFlex justify-space-around align-center pr-0">
        <v-btn fab dark class="hoverAnimation m-0" :class="{'unClickable': downvote}" :color="downvote?'red':'grey'" @click="voteDown()">
          <v-icon dark>thumb_down_alt</v-icon>
        </v-btn>
        <span class="count red--text">{{totalDownVotes}}</span>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import storageService from '@/services/blockstack-storage'
import cryptocracyServices from '@/services/cryptocracy'
import { mapGetters } from 'vuex'

export default {
  name: 'voter',
  data: () => ({
    upvote: false,
    downvote: false,
    isVoted: false,
    myVoteData: [],
    totalVotesData: [],
    totalUpVotes: 0,
    totalDownVotes: 0,
    currentVoteStatus: {}
  }),
  computed: {
    ...mapGetters({
      profileData: 'getProfileData'
    })
  },
  props: {
    itemsObject: {
      type: Object
    },
    hubUrl: {
      type: String
    },
    type: String
  },
  watch: {
    deep: true,
    totalVotesData (newValue, oldValue) {
      if (newValue && newValue.length > 0) {
        this.getTotalUpVotes(newValue)
        this.getTotalDownVotes(newValue)
      }
    },
    currentVoteStatus (newValue, oldValue) {
      if (newValue) {
        if (newValue['vote']) {
          this.isVoted = true
        }
        if (newValue['votedOn'] && newValue['vote'] === 1) {
          this.upvote = true
          this.downvote = false
        } else {
          this.downvote = true
          this.upvote = false
        }
      }
    }
  },
  mounted () {
    storageService.getFile({
      fileName: 'my_votes.json',
      options: {decrypt: false}
    }).then(res => {
      this.myVoteData = res.length ? res : []
      this.currentVoteStatus = this.myVoteData[this.getIndex()]
    })
    this.getTotalVotes()
  },
  methods: {
    async getTotalVotes () {
      this.totalVotesData = await cryptocracyServices.countVotes({gaia: this.getContentUrl(this.itemsObject)})
    },
    getTotalUpVotes (votes = []) {
      if (votes.length > 0) {
        this.totalUpVotes = votes.reduce((acc, curr) => {
          if (curr === 1 || curr === '1') {
            acc = acc + 1
            return acc
          } else {
            return acc
          }
        }, 0)
        return this.totalUpVotes
      }
      return 0
    },
    getTotalDownVotes (votes = []) {
      if (votes.length > 0) {
        this.totalDownVotes = votes.reduce((acc, curr) => {
          if (curr === -1 || curr === '-1') {
            acc = acc + 1
            return acc
          } else {
            return acc
          }
        }, 0)
        return this.totalDownVotes
      }
      return 0
    },
    getIndex () {
      return this.myVoteData.findIndex((item, index) => {
        return item.title === this.itemsObject.title && item.createdtime === this.itemsObject.createdtime
      })
    },
    getContentUrl (item) {
      let urlItems = {}
      if (localStorage['blockstack-gaia-hub-config']) {
        urlItems = JSON.parse(localStorage['blockstack-gaia-hub-config'])
      }
      // creating hub url(where our files are stored)
      const contentUrl = `${urlItems.url_prefix}${item.owner}/${this.type}_${item.createdtime}.json`
      return contentUrl
    },
    voteUp () {
      if (this.downvote || !(this.isVoted)) {
        this.upvote = true
        this.totalUpVotes++
        this.totalDownVotes = this.totalDownVotes > 0 ? --this.totalDownVotes : 0
        this.downvote = false
        this.isVoted = true
        if (this.currentVoteStatus && this.currentVoteStatus['vote']) {
          this.currentVoteStatus['vote'] = 1
        } else {
          this.itemsObject['vote'] = 1
        }
        this.updateMyVote()
      }
    },
    voteDown () {
      if (this.upvote || !(this.isVoted)) {
        this.downvote = true
        this.totalDownVotes++
        this.totalUpVotes = this.totalUpVotes > 0 ? --this.totalUpVotes : 0
        this.upvote = false
        this.isVoted = true
        if (this.currentVoteStatus && this.currentVoteStatus['vote']) {
          this.currentVoteStatus['vote'] = -1
        } else {
          this.itemsObject['vote'] = -1
        }
        this.updateMyVote()
      }
    },
    updateVoteStatus (item) {
      if (!item['contentUrl']) {
        item['contentUrl'] = this.getContentUrl(item)
      }

      let currentDate = new Date().getTime()
      if (item['votedOn']) {
        item['voteUpdatedOn'] = currentDate
      } else {
        item['votedOn'] = currentDate
        item['voteUpdatedOn'] = currentDate
      }
    },
    updateMyVote () {
      if (this.currentVoteStatus && this.currentVoteStatus['vote']) {
        this.updateVoteStatus(this.currentVoteStatus)
      } else {
        this.updateVoteStatus(this.itemsObject)
      }

      let index = this.getIndex() ? this.getIndex() : 0
      if (index >= 0) {
        this.myVoteData[index] = this.currentVoteStatus
      } else {
        this.myVoteData.push(this.itemsObject)
        this.currentVoteStatus = this.itemsObject
      }
      storageService.putFile({
        fileName: 'my_votes.json',
        data: this.myVoteData,
        options: { encrypt: false }
      }).then(res => {
        if (res) this.$store.dispatch('ACTION_NOTIFY_SERVER', this.profileData.username)
      })
    }
    // To empty the my_votes.json file at once use this function
    // changeFileStatus () {
    //   storageService.putFile({
    //     fileName: 'my_votes.json',
    //     data: '',
    //     options: { encrypt: false }
    //   })
    // }
  }
}
</script>

<style scoped lang="scss">
  .disFlex {
    display: flex;
  }
  .count {
    font-size: 20px;
  }
  .unClickable {
    pointer-events: none !important;
  }
  .hoverAnimation:hover {
    animation: swing 2s -1.2s ease-out;
  }
  @keyframes swing {
    0%   {transform: rotate(10deg) scale(1)}
    10%  {transform: rotate(-20deg) scale(1.1)}
    20%  {transform: rotate(20deg) scale(1)}
    30%  {transform: rotate(-20deg) scale(1.1)}
    40%  {transform: rotate(20deg) scale(1)}
    50%  {transform: rotate(-20deg) scale(1.1)}
    60%  {transform: rotate(20deg) scale(1)}
    70%  {transform: rotate(-20deg) scale(1.1)}
    80%  {transform: rotate(20deg) scale(1)}
    90%  {transform: rotate(-20deg) scale(1.1)}
    100% {transform: rotate(10deg) scale(1)}
  }
</style>
