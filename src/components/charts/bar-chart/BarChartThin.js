import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,

  data () {
    return {
      gradient: null
    }
  },

  mounted () {
    const options = {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        yAxes: [{
          display: false,
          ticks: {
            beginAtZero: true,
            max: 150,
            stepSize: 25
          }
        }],
        xAxes: [{
          display: false,
          barPercentage: 0.2
        }]
      },
      legend: {
        display: false
      }
    }

    this.gradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)

    this.gradient.addColorStop(0, 'rgba(37, 141, 242, .8)')
    this.gradient.addColorStop(0.5, 'rgba(37, 141, 242, 0.9)')
    this.gradient.addColorStop(1, 'rgba(24, 102, 178, 1)')

    const dataSet = {
      labels: ['1', '2', '3', '4', '5', '6', '7', '9',
        '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
        '21', '22', '23', '24', ' 25'
      ],
      datasets: [
        {
          label: 'Product One',
          borderColor: 'rgba(37, 141, 242, 1)',
          hoverBackgroundColor: 'rgba(37, 141, 242, 1)',
          borderWidth: 1,
          backgroundColor: this.gradient,
          data: [90, 75, 115, 130, 115, 70, 80, 90, 75, 115,
            130, 115, 70, 80, 90, 75, 115, 130, 115, 70,
            80, 90, 75, 115, 130]
        }
      ]
    }

    this.renderChart(dataSet, options)
  }
}
