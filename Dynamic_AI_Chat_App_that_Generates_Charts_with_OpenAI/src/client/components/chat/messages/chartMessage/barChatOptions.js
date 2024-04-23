const barChartOptions = (data) => ({
    scales: {
      y: {
        type: 'logarithmic',
        position: 'left',
        min: Math.min(...data.datasets[0].data) * 0.95
      }
    },
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    animation: { duration: 2000 },
    elements: { bar: { borderWidth: 2, borderSkipped: 'bottom' } }
  });

export default barChartOptions;