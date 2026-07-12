import React from 'react';

const StatsCard = ({ title, value, icon, color = 'primary', trend }) => {
  const getColorClass = () => {
    switch (color) {
      case 'primary': return { bg: 'rgba(113, 75, 103, 0.1)', text: '#714B67' };
      case 'secondary': return { bg: 'rgba(1, 126, 132, 0.1)', text: '#017e84' };
      case 'success': return { bg: 'rgba(40, 167, 69, 0.1)', text: '#28a745' };
      case 'danger': return { bg: 'rgba(220, 53, 69, 0.1)', text: '#dc3545' };
      case 'warning': return { bg: 'rgba(255, 193, 7, 0.1)', text: '#ffc107' };
      default: return { bg: 'rgba(108, 117, 125, 0.1)', text: '#6c757d' };
    }
  };

  const styleColors = getColorClass();

  return (
    <div className="stats-card">
      <div>
        <span className="d-block text-muted mb-1" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
          {title}
        </span>
        <h3 className="mb-0 fw-bold text-dark">{value}</h3>
        {trend && (
          <div className="mt-2" style={{ fontSize: '0.75rem' }}>
            <span className={`text-${trend.type === 'up' ? 'success' : 'danger'} fw-semibold me-1`}>
              <i className={`bi bi-arrow-${trend.type === 'up' ? 'up' : 'down'}-short`}></i>
              {trend.value}
            </span>
            <span className="text-muted">{trend.label}</span>
          </div>
        )}
      </div>
      <div 
        className="stats-icon-wrapper" 
        style={{ backgroundColor: styleColors.bg, color: styleColors.text }}
      >
        <i className={`bi ${icon}`}></i>
      </div>
    </div>
  );
};

export default StatsCard;
