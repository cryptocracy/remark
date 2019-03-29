import { HorizontalBar } from 'vue-chartjs'

export default {
  extends: HorizontalBar,

  mounted () {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          gridLines: {
            display: false
          }
        }],
        xAxes: [{
          gridLines: {
            display: false
          }
        }]
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
    this.renderChart({
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Laptop',
          backgroundColor: '#6c5ce7',
          data: [40, 50, 70, 90, 70, 50, 30]
        },
        {
          label: 'Phone',
          backgroundColor: '#00cec9',
          data: [50, 60, 40, 70, 50, 40, 50]
        }
      ]
    }, options)
  }
}
