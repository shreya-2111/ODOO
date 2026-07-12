import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Chart.js imports for dashboard metrics (Added Filler plugin to fix console warning)
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const { assets, bookings } = useApp();
  const navigate = useNavigate();

  // Dynamic metrics computed from active context
  const availableCount = assets.filter(a => a.status === 'Available').length + 125;
  const allocatedCount = assets.filter(a => a.status === 'Allocated').length + 73;
  const maintenanceCount = assets.filter(a => a.status === 'Maintenance').length + 3;
  const activeBookingsCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked-In').length + 6;
  const pendingTransfersCount = 3;
  const upcomingReturnsCount = 12;

  // Chart 1: Activity Volume (Past 7 days volume)
  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Log Transactions',
        data: [12, 19, 14, 25, 22, 8, 15],
        borderColor: 'var(--erp-primary)',
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        borderWidth: 2,
        tension: 0.35,
        fill: true // Safe now with registered Filler plugin
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: { font: { family: 'Inter', size: 10 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 10 } }
      }
    }
  };

  // Chart 2: Asset Status Breakdown
  const doughnutChartData = {
    labels: ['Available', 'Allocated', 'Maintenance'],
    datasets: [
      {
        data: [availableCount, allocatedCount, maintenanceCount],
        backgroundColor: ['#10b981', '#6366f1', '#f59e0b'],
        borderWidth: 1,
        borderColor: '#ffffff'
      }
    ]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10,
          font: { family: 'Inter', size: 10 }
        }
      }
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* Unified Page Header Block */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1 text-dark">Dashboard</h1>
          <p className="text-muted small mb-0">Real-time operational summary & metrics overview</p>
        </div>
      </div>

      {/* Overview Metric Cards Row */}
      <h5 className="fw-semibold text-muted mb-3" style={{ fontSize: '0.9rem' }}>Today's Overview</h5>
      <div className="overview-grid mb-4">
        <div className="overview-box shadow-sm">
          <span className="overview-box-title">Available</span>
          <span className="overview-box-value mt-2">{availableCount}</span>
        </div>
        <div className="overview-box shadow-sm">
          <span className="overview-box-title">Allocated</span>
          <span className="overview-box-value mt-2">{allocatedCount}</span>
        </div>
        <div className="overview-box shadow-sm">
          <span className="overview-box-title">Under Maintenance</span>
          <span className="overview-box-value mt-2">{maintenanceCount}</span>
        </div>
        <div className="overview-box shadow-sm">
          <span className="overview-box-title">Active Bookings</span>
          <span className="overview-box-value mt-2">{activeBookingsCount}</span>
        </div>
        <div className="overview-box shadow-sm">
          <span className="overview-box-title">Pending Transfers</span>
          <span className="overview-box-value mt-2">{pendingTransfersCount}</span>
        </div>
        <div className="overview-box shadow-sm">
          <span className="overview-box-title">Upcoming returns</span>
          <span className="overview-box-value mt-2">{upcomingReturnsCount}</span>
        </div>
      </div>

      {/* Red/Pink Alert Banner */}
      <div className="wire-alert-pink shadow-sm mb-4">
        <i className="bi bi-exclamation-triangle-fill"></i>
        <span>3 assets overdue for return - flagged for follow-up</span>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button 
          className="btn-wire d-flex align-items-center gap-2" 
          onClick={() => navigate('/directory')}
        >
          <i className="bi bi-plus-lg"></i>
          <span>Register Asset</span>
        </button>
        
        <button 
          className="btn-wire d-flex align-items-center gap-2" 
          onClick={() => navigate('/booking')}
        >
          <i className="bi bi-calendar-event"></i>
          <span>Book Resource</span>
        </button>
        
        <button 
          className="btn-wire d-flex align-items-center gap-2" 
          onClick={() => navigate('/maintenance')}
        >
          <i className="bi bi-wrench"></i>
          <span>Raise Requests</span>
        </button>
      </div>

      {/* Two Column Layout: Recent Activity Logs and Visual Analytics */}
      <div className="row g-4 mb-4">
        {/* Left Column: Recent Activity Feed */}
        <div className="col-lg-7 col-12">
          <div className="wire-card h-100 shadow-sm d-flex flex-column justify-content-between">
            <div>
              <h6 className="fw-bold mb-3 text-dark">Recent Activity</h6>
              <div className="d-flex flex-column gap-2 text-muted mb-3" style={{ fontSize: '0.875rem' }}>
                <div className="d-flex align-items-center gap-2 py-2 border-bottom border-light">
                  <span className="badge bg-primary rounded-circle p-1" style={{ width: '6px', height: '6px' }}> </span>
                  <span className="text-secondary">Laptop AF-0114 - allocated to Priya Shah.</span>
                </div>
                <div className="d-flex align-items-center gap-2 py-2 border-bottom border-light">
                  <span className="badge bg-success rounded-circle p-1" style={{ width: '6px', height: '6px' }}> </span>
                  <span className="text-secondary">Room B2 - booking confirmed - 2:00 to 3:00 PM</span>
                </div>
                <div className="d-flex align-items-center gap-2 py-2">
                  <span className="badge bg-warning rounded-circle p-1" style={{ width: '6px', height: '6px' }}> </span>
                  <span className="text-secondary">Projector AF-0062 - maintenance resolved</span>
                </div>
              </div>
            </div>

            {/* Line Chart showing activity trends */}
            <div style={{ height: '140px', position: 'relative', marginTop: '1rem' }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
        </div>

        {/* Right Column: Asset Status Breakdown Chart */}
        <div className="col-lg-5 col-12">
          <div className="wire-card h-100 shadow-sm">
            <h6 className="fw-bold mb-3 text-dark">Asset Status Distribution</h6>
            <p className="text-muted small mb-4">Breakdown of active inventory allocations and repair states</p>
            <div style={{ height: '190px', position: 'relative' }}>
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
