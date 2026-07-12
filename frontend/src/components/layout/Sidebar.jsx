import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2' },
    { path: '/organization', label: 'Organization Setup', icon: 'bi-building' },
    { path: '/directory', label: 'Assets', icon: 'bi-folder2-open' },
    { path: '/allocation', label: 'Allocation & Transfer', icon: 'bi-arrow-left-right' },
    { path: '/booking', label: 'Resource Booking', icon: 'bi-calendar-event' },
    { path: '/maintenance', label: 'Maintenance', icon: 'bi-tools' },
    { path: '/audit', label: 'Audit', icon: 'bi-shield-check' },
    { path: '/reports', label: 'Reports', icon: 'bi-bar-chart-line' },
    { path: '/notifications', label: 'Notifications', icon: 'bi-bell' }
  ];

  return (
    <aside className={`erp-sidebar ${isCollapsed ? 'collapsed' : ''}`} aria-label="Sidebar Navigation">
      {/* Brand Header: Entire header behaves as the collapse/expand trigger */}
      <div 
        className="sidebar-brand" 
        onClick={toggleCollapse} 
        style={{ cursor: 'pointer', userSelect: 'none' }}
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        <div className="d-flex align-items-center gap-2">
          <div 
            className="text-white rounded d-flex align-items-center justify-content-center fw-bold" 
            style={{ 
              width: '32px', 
              height: '32px', 
              backgroundColor: 'var(--erp-primary)',
              fontSize: '0.85rem',
              minWidth: '32px'
            }}
          >
            AF
          </div>
          <span className="brand-text fw-bold tracking-tight text-dark">AssetFlow</span>
        </div>
      </div>

      {/* Navigation Items List */}
      <nav className="flex-grow-1 overflow-auto">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="sidebar-item">
              <NavLink
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                title={isCollapsed ? item.label : ''}
                onClick={() => {
                  // Automatically close mobile menu overlay when clicking a route link
                  if (window.innerWidth < 768) {
                    toggleCollapse();
                  }
                }}
              >
                <i className={`bi ${item.icon}`}></i>
                <span className="sidebar-text">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-top mt-auto text-center sidebar-footer bg-white">
        {isCollapsed ? (
          <button 
            className="btn btn-sm btn-light border-0 p-1"
            onClick={toggleCollapse}
            aria-label="Expand Sidebar"
            title="Expand Sidebar"
          >
            <i className="bi bi-chevron-double-right text-dark"></i>
          </button>
        ) : (
          <span className="text-muted small brand-version">AssetFlow ERP v1.0.0</span>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
