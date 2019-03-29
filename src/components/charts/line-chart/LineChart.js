import { Line } from 'vue-chartjs'
// import transactionService from '@/services/transactions'
import { mapGetters } from 'vuex'
export default {
  extends: Line,
  computed: {
    ...mapGetters({
      receivedAmounts: 'getReceivedAmounts',
      receivedDates: 'getReceivedDates',
      showGraph: 'showGraph'
    })
  },

  data () {
    return {
      gradient: null,
      gradient2: null,
      address: ''
    }
  },

  mounted () {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            beginAtZero: true
          }
        }],
        xAxes: [{
          gridLines: {
            display: false
          },
          type: 'time',
          time: {
            unit: 'month'
            // displayFormats: {
            //   'hour': 'HH:mm'
            // },
            // unitStepSize: 3
            // max: moment.unix(1499817599),
            // parser : function (utcMoment) {
            //   return utcMoment.utcOffset('+0000');
            // }
          }
        }]
      },
      tooltips: {
        enabled: true,
        mode: 'x-axis'
      },
      legend: {
        display: true,
        position: 'top',
        fullWidth: true,
        labels: {
          boxWidth: 14,
          fontSize: 14
        }
      }
    }

    this.gradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)
    this.gradient2 = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)

    this.gradient.addColorStop(0, 'rgba(64, 199,65, 0.9)')
    this.gradient.addColorStop(0.5, 'rgba(64, 199, 65, 0.2)')
    this.gradient.addColorStop(1, 'rgba(64, 199, 65, 0)')

    this.gradient2.addColorStop(0, 'rgba(0, 231, 255, 0.9)')
    this.gradient2.addColorStop(0.5, 'rgba(0, 231, 255, 0.2)')
    this.gradient2.addColorStop(1, 'rgba(0, 231, 255, 0)')
    const dataSet = {
      labels: [...this.receivedDates],
      datasets: [
        {
          label: 'BTC Received',
          borderColor: 'rgba(64, 199,65, 1)',
          pointBackgroundColor: 'rgba(64, 199,65, 1)',
          borderWidth: 1,
          pointBorderColor: 'rgba(64, 199,65, 1)',
          backgroundColor: this.gradient,
          data: [...this.receivedAmounts]
        }
      ]
    }
    this.renderChart(dataSet, options)
  }
}
