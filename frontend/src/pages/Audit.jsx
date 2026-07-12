import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Audit = () => {
  const { addNotification } = useApp();

  // Initial checklist rows matching wireframe exactly
  const [checklist, setChecklist] = useState([
    { asset: 'AF-0012 Dell laptop', location: 'Desk B10', verified: true },
    { asset: 'AF-0550 Office chair', location: 'Desk B12', verified: true },
    { asset: 'AF-0920 Server', location: 'Rack B3', verified: false }
  ]);

  const handleVerify = (index) => {
    const updated = [...checklist];
    updated[index].verified = true;
    setChecklist(updated);
    addNotification('success', `Verified location checklist item: ${checklist[index].asset}`);
  };

  // Calculate discrepancy count
  const pendingCount = checklist.filter((item) => !item.verified).length;

  return (
    <div className="container-fluid p-0">
      {/* Unified Page Header Block */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1 text-dark">Audit & Compliance</h1>
          <p className="text-muted small mb-0">Verify corporate asset locations, hardware checklists, and discrepancy items</p>
        </div>
      </div>

      {/* Main Audit Scope Title Header */}
      <div className="wire-card p-3 mb-4">
        <h5 className="fw-semibold text-dark mb-1">H1 Audit Engineering dept - 1,202 items</h5>
        <span className="small text-muted font-medium">Audit scope: NY, Tokyo, London</span>
      </div>

      {/* Audit Verification Table */}
      <div className="wire-card p-0 overflow-hidden mb-4">
        <table className="wire-table mb-0">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Expected Location</th>
              <th>Verification</th>
            </tr>
          </thead>
          <tbody>
            {checklist.map((item, idx) => (
              <tr key={idx}>
                <td className="fw-semibold text-secondary">{item.asset}</td>
                <td><code>{item.location}</code></td>
                <td>
                  {item.verified ? (
                    <span className="badge bg-success px-2 py-1 rounded-pill">
                      <i className="bi bi-patch-check-fill me-1"></i> Verified
                    </span>
                  ) : (
                    <button 
                      className="btn-wire py-1 px-2 text-xs"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => handleVerify(idx)}
                    >
                      Verify Item
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Orange Alert Banner */}
      {pendingCount > 0 ? (
        <div className="wire-alert-orange shadow-sm">
          <i className="bi bi-shield-fill-exclamation"></i>
          <span>{pendingCount + 1} assets flagged - discrepancy report generated automatically</span>
        </div>
      ) : (
        <div className="wire-alert-orange bg-success border-success text-white shadow-sm">
          <i className="bi bi-shield-fill-check"></i>
          <span>All audit items verified. No discrepancies reported.</span>
        </div>
      )}
    </div>
  );
};

export default Audit;
