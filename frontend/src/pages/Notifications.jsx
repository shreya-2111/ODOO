import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Notifications = () => {
  const { notifications } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('All');

  // Dynamic categorisation helper to map context notifications to tab filters
  const getNotificationCategory = (ntf) => {
    const msg = ntf.message.toLowerCase();
    
    // Alerts Category
    if (
      ntf.type === 'danger' || 
      ntf.type === 'warning' || 
      msg.includes('overdue') || 
      msg.includes('discrepancy') ||
      msg.includes('warning')
    ) {
      return 'Alerts';
    }
    
    // Bookings Category
    if (
      msg.includes('booking') || 
      msg.includes('room') || 
      msg.includes('schedule') || 
      msg.includes('reserved')
    ) {
      return 'Bookings';
    }
    
    // Approvals & Allocations Category
    if (
      msg.includes('assign') || 
      msg.includes('transfer') || 
      msg.includes('approve') || 
      msg.includes('allocate')
    ) {
      return 'Approvals';
    }
    
    // Fallback default
    return 'Approvals';
  };

  // Filter real-time notifications based on active tab
  const filteredNotifications = notifications.filter((ntf) => {
    if (activeSubTab === 'All') return true;
    return getNotificationCategory(ntf) === activeSubTab;
  });

  const getIconClass = (type) => {
    switch (type) {
      case 'danger': return 'bi-x-circle-fill text-danger';
      case 'warning': return 'bi-exclamation-triangle-fill text-warning';
      case 'success': return 'bi-check-circle-fill text-success';
      case 'info': return 'bi-info-circle-fill text-primary';
      default: return 'bi-bell-fill text-secondary';
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* Unified Page Header Block */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1 text-dark">Notifications</h1>
          <p className="text-muted small mb-0">Review system activity streams, allocations, and compliance alerts</p>
        </div>
      </div>

      {/* Filter sub-tabs */}
      <div className="sub-tabs-bar">
        <div 
          className={`sub-tab-item ${activeSubTab === 'All' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('All')}
        >
          All
        </div>
        <div 
          className={`sub-tab-item ${activeSubTab === 'Alerts' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('Alerts')}
        >
          Alerts
        </div>
        <div 
          className={`sub-tab-item ${activeSubTab === 'Approvals' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('Approvals')}
        >
          Approvals
        </div>
        <div 
          className={`sub-tab-item ${activeSubTab === 'Bookings' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('Bookings')}
        >
          Bookings
        </div>
      </div>

      {/* Activity feed list */}
      <div className="wire-card">
        <div className="list-group list-group-flush">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-bell-slash fs-3 mb-2 d-block text-secondary-subtle"></i>
              <span style={{ fontSize: '0.85rem' }}>No activity logs matching selected category scope.</span>
            </div>
          ) : (
            filteredNotifications.map((ntf, idx) => (
              <div key={ntf.id || idx} className="list-group-item px-0 py-3 border-bottom d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <i className={`bi ${getIconClass(ntf.type)} fs-5`}></i>
                  <span className="fw-semibold text-secondary" style={{ fontSize: '0.9rem' }}>
                    {ntf.message}
                  </span>
                </div>
                <span className="small text-muted">{ntf.timestamp || 'Just now'}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
