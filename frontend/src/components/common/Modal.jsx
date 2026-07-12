import React, { useEffect } from 'react';

const Modal = ({ show, onClose, title, children, footerActions, size = 'md' }) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  const getWidth = () => {
    switch (size) {
      case 'sm': return '350px';
      case 'lg': return '800px';
      default: return '500px'; // md
    }
  };

  return (
    <div 
      className="modal-backdrop d-flex align-items-center justify-content-center" 
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        zIndex: 1060, 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        className="modal-dialog modal-dialog-centered" 
        style={{ 
          width: '90%', 
          maxWidth: getWidth(), 
          zIndex: 1070 
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '10px', overflow: 'hidden' }}>
          <div className="modal-header border-bottom py-3 px-4 bg-white d-flex align-items-center justify-content-between">
            <h5 className="modal-title fw-bold text-dark mb-0" style={{ fontSize: '1.1rem' }}>{title}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose} 
              aria-label="Close"
              style={{ padding: '0.25rem' }}
            ></button>
          </div>
          <div className="modal-body p-4 bg-white" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            {children}
          </div>
          {footerActions && (
            <div className="modal-footer border-top bg-light py-3 px-4 d-flex justify-content-end gap-2">
              {footerActions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
