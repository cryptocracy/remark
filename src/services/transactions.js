import Axios from 'axios'
const transactionService = {
  getTransactionsData: async () => {
    this.address = localStorage['blockstack-gaia-hub-config'] ? JSON.parse(localStorage['blockstack-gaia-hub-config']).address : ''
    // this.address = '1LhbrBMnicrPYAouVyNTcSFBQjDrZBQ18G'
    let res = await Axios.get(`https://blockchain.info/address/${this.address}?format=json&cors=true`)
    return transactionService.generateChartData(res.data)
  },

  sum: (arr, type) => {
    return arr.reduce((acc, item) => {
      acc += type === 'input' ? item.prev_out.value : item.value
      return acc
    }, 0)
  },

  filter: (acc, tx) => {
    let input = tx.inputs.filter(input => input.prev_out.addr === this.address)
    let output = tx.out.filter(output => output.addr === this.address)
    let sentAmount = input.length > 0 ? transactionService.sum(input, 'input') : 0
    let receivedAmount = output.length > 0 ? transactionService.sum(output, 'output') : 0

    if (input.length > 0) {
      acc.sentAmounts.unshift((sentAmount - receivedAmount) / 100000000)
      acc.sentDates.unshift(tx.time * 1000)
      return acc
    } else {
      acc.receivedAmounts.unshift(receivedAmount / 100000000)
      acc.receivedDates.unshift(tx.time * 1000)
      return acc
    }
  },
  generateChartData: (rawData) => {
    return rawData.txs.reduce(transactionService.filter, {
      sentAmounts: [],
      receivedAmounts: [],
      sentDates: [],
      receivedDates: []
    })
  }
}

export default transactionService
