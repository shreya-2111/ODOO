import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const Header = ({ isSidebarCollapsed, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { assets, bookings, notifications, markNotificationRead, clearAllNotifications } = useApp();
  const navigate = useNavigate();
  
  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = (id) => {
    markNotificationRead(id);
    setShowNotifDropdown(false);
    navigate('/notifications');
  };

  // Search filter logic for active autocomplete dropdown
  const filteredSearchAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.code && a.code.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 4);

  const filteredSearchBookings = bookings.filter(b => 
    (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (b.teamName && b.teamName.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 4);

  return (
    <header className="erp-header px-4">
      {/* Left section: Sidebar toggle handle & Autocomplete Search */}
      <div className="d-flex align-items-center gap-3">
        {/* Toggle button visible on desktop when collapsed, and always visible on mobile/tablet */}
        <button 
          className={`btn btn-sm btn-light border border-secondary-subtle d-flex align-items-center justify-content-center ${isSidebarCollapsed ? '' : 'd-lg-none'}`}
          onClick={toggleSidebar}
          title="Toggle Navigation"
          aria-label="Toggle Navigation"
          style={{ width: '32px', height: '32px' }}
        >
          <i className="bi bi-list fs-5"></i>
        </button>
        
        {/* Active search bar with drop autocomplete panel */}
        <div className="d-none d-md-flex align-items-center bg-light rounded-pill px-3 py-1 border border-secondary-subtle position-relative">
          <i className="bi bi-search text-muted me-2" style={{ fontSize: '0.85rem' }}></i>
          <input 
            type="text" 
            placeholder="Search assets, allocations..." 
            className="border-0 bg-transparent" 
            style={{ outline: 'none', fontSize: '0.85rem', width: '240px' }}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
          />

          {/* Autocomplete Search Dropdown */}
          {showSearchResults && searchQuery.trim() !== '' && (
            <div 
              className="dropdown-menu show shadow border border-secondary-subtle p-0 position-absolute"
              style={{
                top: '38px',
                left: 0,
                width: '320px',
                zIndex: 1060,
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              <div className="bg-light p-2 border-bottom fw-semibold text-secondary" style={{ fontSize: '0.75rem' }}>
                Search Results for "{searchQuery}"
              </div>
              
              <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {filteredSearchAssets.length === 0 && filteredSearchBookings.length === 0 ? (
                  <div className="p-3 text-center text-muted" style={{ fontSize: '0.8rem' }}>
                    No matching assets or bookings
                  </div>
                ) : (
                  <>
                    {filteredSearchAssets.length > 0 && (
                      <div className="p-2">
                        <div className="fw-bold text-muted px-2 py-1 uppercase" style={{ fontSize: '0.65rem' }}>Assets</div>
                        {filteredSearchAssets.map((asset) => (
                          <div 
                            key={asset.code}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              navigate(`/directory?search=${asset.code}`);
                              setSearchQuery('');
                              setShowSearchResults(false);
                            }}
                            className="dropdown-item px-2 py-1 rounded small"
                            style={{ cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            <i className="bi bi-tag-fill text-primary me-2"></i>
                            <span className="fw-semibold">{asset.code}</span> - {asset.name}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {filteredSearchBookings.length > 0 && (
                      <div className="p-2 border-top">
                        <div className="fw-bold text-muted px-2 py-1 uppercase" style={{ fontSize: '0.65rem' }}>Bookings</div>
                        {filteredSearchBookings.map((b, idx) => (
                          <div 
                            key={idx}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              navigate(`/booking`);
                              setSearchQuery('');
                              setShowSearchResults(false);
                            }}
                            className="dropdown-item px-2 py-1 rounded small"
                            style={{ cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            <i className="bi bi-calendar-check-fill text-success me-2"></i>
                            {b.teamName || 'Confirmed'} - {b.startTime}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right section: System Utilities & Profiles */}
      <div className="d-flex align-items-center gap-3">
        
        {/* Alerts & Notifications Dropdown */}
        <div className="dropdown position-relative">
          <button 
            className="btn btn-light rounded-circle p-2 border position-relative d-flex align-items-center justify-content-center"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            onBlur={() => setTimeout(() => setShowNotifDropdown(false), 200)}
            title="System Alerts"
            aria-label="System Alerts"
            style={{ width: '38px', height: '38px' }}
          >
            <i className="bi bi-bell fs-5 text-secondary"></i>
            {unreadNotifications.length > 0 && (
              <span 
                className="position-absolute badge rounded-pill bg-danger" 
                style={{ 
                  fontSize: '0.625rem', 
                  padding: '0.2rem 0.35rem',
                  top: '2px',
                  right: '2px',
                  transform: 'translate(10%, -10%)'
                }}
              >
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div 
              className="dropdown-menu dropdown-menu-end show shadow-sm border border-secondary-subtle p-0" 
              style={{ 
                width: '320px', 
                position: 'absolute', 
                right: 0, 
                top: '45px', 
                zIndex: 1050,
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
                <span className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>Notifications</span>
                {unreadNotifications.length > 0 && (
                  <button 
                    onMouseDown={(e) => { e.preventDefault(); clearAllNotifications(); }}
                    className="btn btn-link btn-xs text-decoration-none p-0"
                    style={{ fontSize: '0.75rem', color: 'var(--erp-primary)' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              
              <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {unreadNotifications.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-check-circle fs-4 mb-2 d-block text-success"></i>
                    <span style={{ fontSize: '0.8rem' }}>No unread notifications</span>
                  </div>
                ) : (
                  unreadNotifications.map((ntf) => (
                    <div 
                      key={ntf.id} 
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleNotificationClick(ntf.id);
                      }}
                      className="dropdown-item p-3 border-bottom d-flex gap-2 align-items-start text-wrap" 
                      style={{ cursor: 'pointer', whiteSpace: 'normal', fontSize: '0.8rem' }}
                    >
                      <span className={`badge bg-${ntf.type === 'danger' ? 'danger' : ntf.type === 'warning' ? 'warning' : 'info'} p-1 rounded-circle mt-1`} style={{ width: '6px', height: '6px' }}> </span>
                      <div className="flex-grow-1">
                        <p className="mb-0 text-dark" style={{ lineHeight: '1.3' }}>{ntf.message}</p>
                        <small className="text-muted">{ntf.timestamp}</small>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Resolved blur conflict on "See all activity" navigation by using onMouseDown */}
              <div 
                onMouseDown={(e) => {
                  e.preventDefault();
                  navigate('/notifications');
                  setShowNotifDropdown(false);
                }}
                className="dropdown-item text-center py-2 bg-light border-top fw-semibold text-decoration-none"
                style={{ fontSize: '0.8rem', color: 'var(--erp-primary)', cursor: 'pointer' }}
              >
                See all activity
              </div>
            </div>
          )}
        </div>

        {/* User Card Profiles */}
        <div className="d-flex align-items-center gap-2 border-start ps-3">
          <div className="d-none d-lg-block text-end">
            <span className="d-block fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>
              {user ? user.fullName : 'Guest Administrator'}
            </span>
            <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>
              {user ? user.role : 'Guest'}
            </small>
          </div>
          
          <div className="dropdown">
            <button 
              className="btn btn-light border-0 p-0 rounded-circle"
              type="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
              aria-label="User profile dropdown"
            >
              <div 
                className="text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" 
                style={{ 
                  width: '38px', 
                  height: '38px', 
                  backgroundColor: 'var(--erp-primary)',
                  fontSize: '0.9rem' 
                }}
              >
                {user ? user.fullName.split(' ').map(n => n[0]).join('') : 'U'}
              </div>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm border mt-2">
              <li className="px-3 py-2 border-bottom">
                <span className="d-block fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>{user ? user.fullName : 'Guest'}</span>
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>{user ? user.email : 'guest@company.com'}</small>
              </li>
              {/* Removed settings list option directly */}
              <li>
                <button onClick={handleLogout} className="dropdown-item py-2 text-danger" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
