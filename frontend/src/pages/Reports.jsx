import React from 'react';
import { useApp } from '../context/AppContext';

// Chart.js imports
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Reports = () => {
  const { addNotification } = useApp();

  // 1. Chart configurations to match wireframe labels
  const barData = {
    labels: ['Engineering', 'Facilities', 'Field Ops', 'Marketing', 'Sales'],
    datasets: [
      {
        label: 'Utilization Rate (%)',
        data: [88, 42, 76, 50, 62],
        backgroundColor: '#017e84',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#212529'
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        max: 100,
        grid: { color: '#e9ecef' },
        ticks: { font: { family: 'Inter', size: 11 } }
      },
      x: { 
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 11 } }
      }
    }
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Service Tickets Logged',
        data: [3, 8, 5, 12, 6, 14],
        backgroundColor: '#714B67',
        borderColor: '#212529',
        borderWidth: 3,
        tension: 0.35,
        fill: false
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: '#e9ecef' },
        ticks: { font: { family: 'Inter', size: 11 } }
      },
      x: { 
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 11 } }
      }
    }
  };

  // Triggers browser print-to-PDF utility
  const handleExport = () => {
    addNotification('info', 'Preparing print-friendly report PDF layout...');
    window.print();
  };

  return (
    <div className="container-fluid p-0">
      {/* Unified Page Header Block */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1 text-dark">Reports & Analytics</h1>
          <p className="text-muted small mb-0">Analyze organizational asset utilization, cost allocations, and service metrics</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6 col-12">
          <div className="wire-card">
            <h6 className="fw-bold mb-3 text-dark">Utilisation by department</h6>
            <div style={{ height: '220px', position: 'relative' }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-12">
          <div className="wire-card">
            <h6 className="fw-bold mb-3 text-dark">Maintenance Frequency</h6>
            <div style={{ height: '220px', position: 'relative' }}>
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Summary lists matching wireframe exactly */}
      <div className="row g-4 mb-4">
        {/* Most used assets */}
        <div className="col-md-4 col-12">
          <div className="wire-card h-100 mb-0">
            <h6 className="fw-bold mb-3 text-dark">Most used assets</h6>
            <div className="d-flex flex-column gap-2 small text-muted">
              <div className="py-2">
                <span className="fw-bold text-dark d-block">Laptop AF-0114</span>
                <span>182 hrs booking this month</span>
              </div>
              <div className="py-2 border-top border-light">
                <span className="fw-bold text-dark d-block">Car AF-0012</span>
                <span>2,120 miles this month</span>
              </div>
              <div className="py-2 border-top border-light">
                <span className="fw-bold text-dark d-block">Projector AF-0062</span>
                <span>18 visits logged</span>
              </div>
            </div>
          </div>
        </div>

        {/* Idle assets */}
        <div className="col-md-4 col-12">
          <div className="wire-card h-100 mb-0">
            <h6 className="fw-bold mb-3 text-dark">Idle assets</h6>
            <div className="d-flex flex-column gap-2 small text-muted">
              <div className="py-2">
                <span className="fw-bold text-dark d-block">Camera AF-0120</span>
                <span>unused past 120 days</span>
              </div>
              <div className="py-2 border-top border-light">
                <span className="fw-bold text-dark d-block">Chair AF-0410</span>
                <span>unused 95 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nearing retirement */}
        <div className="col-md-4 col-12">
          <div className="wire-card h-100 mb-0">
            <h6 className="fw-bold mb-3 text-dark">Assets due for maintenance / nearing retirement</h6>
            <div className="d-flex flex-column gap-2 small text-muted">
              <div className="py-2">
                <span className="fw-bold text-dark d-block">Vehicle AF-0037</span>
                <span>service due in 3 days</span>
              </div>
              <div className="py-2 border-top border-light">
                <span className="fw-bold text-dark d-block">Laptop AF-0010</span>
                <span>4 years old - retiring next month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Button Action */}
      <div className="d-flex justify-content-end mt-4 print-hide">
        <button className="btn-wire py-2 px-4" onClick={handleExport}>
          <i className="bi bi-file-earmark-arrow-down me-1"></i> Export report
        </button>
      </div>
    </div>
  );
};

export default Reports;
