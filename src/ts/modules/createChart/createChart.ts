import { Chart, ChartItem, registerables } from 'chart.js'

/**
 * Chart.jsのインスタンスを返す関数<br/>
 * Chart.js: https://www.chartjs.org/docs/latest/
 *
 * @param args - Chart.jsのマウント先（el）を含めたオブジェクト。任意で拡張可能。
 * @param {ChartItem} args.el - Chart.jsのマウント先
 * @return {Chart} Chart.jsのインスタンス
 */
export const createChart = ({ el }: { el: ChartItem }) => {
  Chart.register(...registerables)

  return new Chart(el, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [
        {
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}
