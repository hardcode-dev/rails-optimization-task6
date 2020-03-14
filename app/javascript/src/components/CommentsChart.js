import Chart from 'chart.js';

const commentsCanvas = document.getElementById('commentsChart');

export default new Chart(commentsCanvas, {
  type: 'line',
  data: {
    labels: JSON.parse(commentsCanvas.dataset.labels),
    datasets: [
      {
        label: 'Total Comments',
        data: JSON.parse(commentsCanvas.dataset.totalCount),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        lineTension: 0.1,
      },
    ],
  },
  options: {
    title: {
      display: true,
      text: 'Comments over the Last Week',
    },
    scales: {
      yAxes: [
        {
          ticks: {
            suggestedMin: 0,
            precision: 0,
          },
        },
      ],
    },
  },
});
