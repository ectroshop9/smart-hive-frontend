import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function HiveChart({ data, title, color }) {
  const chartData = {
    labels: data.labels || ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [{
      label: title,
      data: data.values || [65, 59, 80, 81, 56, 55],
      borderColor: color || '#ffc107',
      backgroundColor: `${color || '#ffc107'}20`,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: color || '#ffc107',
      pointBorderColor: '#fff',
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1a1a1a', titleColor: '#ffc107', bodyColor: '#fff' }
    },
    scales: {
      y: { grid: { color: '#333' }, ticks: { color: '#fff' } },
      x: { grid: { display: false }, ticks: { color: '#fff' } }
    }
  };

  return (
    <div className="chart-container">
      <h4 className="chart-title">{title}</h4>
      <div className="chart-wrapper"><Line data={chartData} options={options} /></div>
    </div>
  );
}

export default HiveChart;
EOFnpm install chart.js react-chartjs-2

cat > src/components/HiveChart.js << 'EOF'
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function HiveChart({ data, title, color }) {
  const chartData = {
    labels: data.labels || ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [{
      label: title,
      data: data.values || [65, 59, 80, 81, 56, 55],
      borderColor: color || '#ffc107',
      backgroundColor: `${color || '#ffc107'}20`,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: color || '#ffc107',
      pointBorderColor: '#fff',
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1a1a1a', titleColor: '#ffc107', bodyColor: '#fff' }
    },
    scales: {
      y: { grid: { color: '#333' }, ticks: { color: '#fff' } },
      x: { grid: { display: false }, ticks: { color: '#fff' } }
    }
  };

  return (
    <div className="chart-container">
      <h4 className="chart-title">{title}</h4>
      <div className="chart-wrapper"><Line data={chartData} options={options} /></div>
    </div>
  );
}

export default HiveChart;
