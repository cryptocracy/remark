import transactionService from '@/services/transactions'
const transactionsHandler = {
  state: {
    sentAmounts: [],
    receivedAmounts: [],
    sentDates: [],
    receivedDates: [],
    showPayoutGraph: false,
    showDonationGraph: false
  },
  mutations: {
    MUTATION_SET_TRANSACTIONS_DATA (state, payload) {
      for (let key in payload) {
        state[key] = payload[key]
      }
    },
    MUTATION_CHANGE_PAYOUT_GRAPH_STATE (state, payload) {
      state.showPayoutGraph = payload
    },
    MUTATION_CHANGE_DONATION_GRAPH_STATE (state, payload) {
      state.showDonationGraph = payload
    }
  },
  actions: {
    async ACTION_GET_TRANSACTIONS_DATA (context, payload) {
      let transactionsData = await transactionService.getTransactionsData()
      context.commit('MUTATION_SET_TRANSACTIONS_DATA', transactionsData)
      if (transactionsData.sentDates.length > 0) {
        context.commit('MUTATION_CHANGE_PAYOUT_GRAPH_STATE', true)
      }
      if (transactionsData.receivedDates.length > 0) {
        context.commit('MUTATION_CHANGE_DONATION_GRAPH_STATE', true)
      }
      return transactionsData
    }
  },
  getters: {
    getSentAmounts: state => state.sentAmounts,
    getReceivedAmounts: state => state.receivedAmounts,
    getSentDates: state => state.sentDates,
    getReceivedDates: state => state.receivedDates,
    showPayoutGraph: state => state.showPayoutGraph,
    showDonationGraph: state => state.showDonationGraph
  }
}
export default transactionsHandler
