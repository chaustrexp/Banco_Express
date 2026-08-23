import apiFetch from '../../utils/api';
import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const OperationsChart = () => {
  const chartRef = useRef();
  const [year, setYear] = useState('2026');
  const [chartData, setChartData] = useState({
    depositos: new Array(12).fill(0),
    retiros: new Array(12).fill(0),
    transferencias: new Array(12).fill(0)
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await apiFetch(`http://localhost:5001/api/dashboard/chart?year=${year}`);
        if (res.ok) {
          const rows = await res.json();
          const newChartData = {
            depositos: new Array(12).fill(0),
            retiros: new Array(12).fill(0),
            transferencias: new Array(12).fill(0)
          };
          
          rows.forEach(row => {
            const monthIndex = row.month - 1; // MySQL MONTH is 1-12
            const amount = parseFloat(row.total);
            if (row.type === 'Depósito') newChartData.depositos[monthIndex] += amount;
            if (row.type === 'Retiro') newChartData.retiros[monthIndex] += amount;
            if (row.type === 'Transferencia') newChartData.transferencias[monthIndex] += amount;
          });
          
          setChartData(newChartData);
        }
      } catch (err) {
        console.error('Error fetching chart data:', err);
      }
    };
    fetchChartData();
  }, [year]);

  const data = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Depósitos',
        data: chartData.depositos,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Retiros',
        data: chartData.retiros,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
      {
        label: 'Transferencias',
        data: chartData.transferencias,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
          font: {
            family: 'Inter, system-ui, sans-serif'
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        titleColor: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        bodyColor: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        borderColor: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': $' + context.parsed.y.toLocaleString('es-CO');
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#f3f4f6'
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
          font: {
            family: 'Inter, system-ui, sans-serif'
          }
        }
      },
      y: {
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#f3f4f6'
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
          font: {
            family: 'Inter, system-ui, sans-serif'
          },
          callback: function(value) {
            return '$' + value.toLocaleString('es-CO');
          }
        }
      }
    }
  };

  // Update chart colors when theme changes
  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      const isDark = document.documentElement.classList.contains('dark');
      
      // Update legend colors
      chart.options.plugins.legend.labels.color = isDark ? '#e5e7eb' : '#374151';
      
      // Update tooltip colors
      chart.options.plugins.tooltip.backgroundColor = isDark ? '#1f2937' : '#ffffff';
      chart.options.plugins.tooltip.titleColor = isDark ? '#e5e7eb' : '#374151';
      chart.options.plugins.tooltip.bodyColor = isDark ? '#e5e7eb' : '#374151';
      chart.options.plugins.tooltip.borderColor = isDark ? '#374151' : '#e5e7eb';
      
      // Update scale colors
      chart.options.scales.x.grid.color = isDark ? '#374151' : '#f3f4f6';
      chart.options.scales.x.ticks.color = isDark ? '#9ca3af' : '#6b7280';
      chart.options.scales.y.grid.color = isDark ? '#374151' : '#f3f4f6';
      chart.options.scales.y.ticks.color = isDark ? '#9ca3af' : '#6b7280';
      
      chart.update();
    }
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 xs:p-4 sm:p-6">
      <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-4 xs:mb-6 gap-3 xs:gap-0">
        <h3 className="text-base xs:text-lg font-semibold text-gray-900 dark:text-white">
          Operaciones Mensuales
        </h3>
        <div className="flex items-center space-x-2">
          <select 
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="text-xs xs:text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 xs:px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>
      
      <div className="h-64 xs:h-72 sm:h-80">
        <Bar ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default OperationsChart;