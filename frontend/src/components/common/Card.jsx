import React from 'react';

const Card = ({ title, headerActions, children, className = '' }) => {
  return (
    <div className={`card border-color shadow-sm mb-4 ${className}`} style={{ borderRadius: '8px', overflow: 'hidden' }}>
      {(title || headerActions) && (
        <div className="card-header bg-white border-bottom py-3 d-flex align-items-center justify-content-between">
          {title && <h5 className="mb-0 fw-bold text-dark" style={{ fontSize: '1rem' }}>{title}</h5>}
          {headerActions && <div className="card-actions">{headerActions}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;
