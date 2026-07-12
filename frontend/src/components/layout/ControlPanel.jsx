import React from 'react';

const ControlPanel = ({ 
  title, 
  subtitle, 
  actionButtons = [], 
  viewMode, 
  setViewMode, 
  searchQuery, 
  setSearchQuery,
  filterOptions = [],
  activeFilter,
  setActiveFilter
}) => {
  return (
    <div className="erp-control-panel shadow-sm">
      {/* Breadcrumbs / Page Title */}
      <div className="d-flex flex-column">
        <div className="control-breadcrumbs">
          <span className="text-secondary-erp fw-medium">{title}</span>
          {subtitle && (
            <>
              <span className="separator">/</span>
              <span className="text-muted fw-normal" style={{ fontSize: '0.95rem' }}>{subtitle}</span>
            </>
          )}
        </div>
      </div>

      {/* Center Search & Filters */}
      <div className="d-flex align-items-center gap-2 flex-grow-1 flex-md-grow-0 justify-content-end">
        {setSearchQuery && (
          <div className="input-group input-group-sm" style={{ maxWidth: '200px' }}>
            <span className="input-group-text bg-white border-end-0"><i className="bi bi-filter"></i></span>
            <input 
              type="text" 
              className="form-control border-start-0" 
              placeholder="Filter result..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {filterOptions.length > 0 && setActiveFilter && (
          <select 
            className="form-select form-select-sm border-color" 
            style={{ width: 'auto' }}
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Right Side: Action Buttons & Views */}
      <div className="d-flex align-items-center gap-2">
        {/* Render Page-specific Buttons */}
        {actionButtons.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.onClick}
            className={`btn btn-sm ${btn.className || 'btn-primary-erp'} d-flex align-items-center gap-1`}
          >
            {btn.icon && <i className={`bi ${btn.icon}`}></i>}
            <span>{btn.label}</span>
          </button>
        ))}

        {/* View Switchers (List vs Kanban) */}
        {viewMode && setViewMode && (
          <div className="btn-group btn-group-sm border rounded ms-2" role="group" aria-label="Layout view mode">
            <button 
              type="button" 
              className={`btn btn-light border-0 ${viewMode === 'list' ? 'active bg-secondary-erp text-white' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <i className="bi bi-list-task"></i>
            </button>
            <button 
              type="button" 
              className={`btn btn-light border-0 ${viewMode === 'kanban' ? 'active bg-secondary-erp text-white' : ''}`}
              onClick={() => setViewMode('kanban')}
              title="Kanban View"
            >
              <i className="bi bi-grid-3x3-gap-fill"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
