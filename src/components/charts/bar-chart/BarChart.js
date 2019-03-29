import { Line } from 'vue-chartjs'
import { mapGetters } from 'vuex'
export default {
  extends: Line,

  data () {
    return {
      gradient: null,
      gradient2: null
    }
  },
  computed: {
    ...mapGetters({
      sentAmounts: 'getSentAmounts',
      sentDates: 'getSentDates',
      showGraph: 'showGraph'
    })
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

    this.gradient.addColorStop(0, 'rgba(37, 141, 242, .8)')
    this.gradient.addColorStop(0.5, 'rgba(37, 141, 242, 0.9)')
    this.gradient.addColorStop(1, 'rgba(24, 102, 178, 1)')

    // this.gradient2.addColorStop(0, 'rgba(245, 124, 0, 9)')
    // this.gradient2.addColorStop(0.5, 'rgba(245, 124, 0, 0.8)')
    // this.gradient2.addColorStop(1, 'rgba(245, 124, 0, 1)')
    this.gradient2.addColorStop(0, 'rgba(0, 231, 255, 0.9)')
    this.gradient2.addColorStop(0.5, 'rgba(0, 231, 255, 0.2)')
    this.gradient2.addColorStop(1, 'rgba(0, 231, 255, 0)')

    const dataSet = {
      labels: [...this.sentDates],
      datasets: [
        {
          label: 'BTC Sent',
          borderColor: 'rgba(0, 231, 255, 1)',
          hoverBackgroundColor: 'rgba(0, 231, 255, 1)',
          borderWidth: 1,
          backgroundColor: this.gradient2,
          data: [...this.sentAmounts]
        }
      ]
    }
    this.renderChart(dataSet, options)
  }
}
