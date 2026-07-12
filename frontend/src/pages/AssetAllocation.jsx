import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';

const AssetAllocation = () => {
  const { addNotification } = useApp();

  // Form states
  const [currentEmployee, setCurrentEmployee] = useState('Priya Shah (Engineering)');
  const [targetEmployee, setTargetEmployee] = useState('');
  const [reason, setReason] = useState('');
  const [employees, setEmployees] = useState([]);

  // Initial seed logs matching wireframe exactly
  const [transferLogs, setTransferLogs] = useState([
    { text: 'Mac book - allocated to Shreya Raval - IT Support', type: 'allocation' },
    { text: 'Car #3 - Returned by Arjen Dev - condition good', type: 'return' }
  ]);

  useEffect(() => {
    apiService.employees.list()
      .then(res => {
        setEmployees(res.data);
        if (res.data.length > 0) {
          // Set current assignee to the first database user dynamically
          const firstUser = res.data[0];
          setCurrentEmployee(`${firstUser.full_name} (${firstUser.role?.name || 'Employee'})`);
        }
      })
      .catch(err => console.error("Error loading employees:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetEmployee || !reason) return;

    const logText = `AF-0114 - transfer requested from ${currentEmployee.split(' ')[0]} to ${targetEmployee} - Reason: ${reason}`;
    
    // Add to history list
    setTransferLogs((prev) => [
      { text: logText, type: 'transfer' },
      ...prev
    ]);

    addNotification('success', `Transfer request submitted for asset AF-0114 to ${targetEmployee}`);
    
    // Reset form fields
    setTargetEmployee('');
    setReason('');
  };


  return (
    <div className="container-fluid p-0">
      {/* Unified Page Header Block */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1 text-dark">Allocation & Transfer</h1>
          <p className="text-muted small mb-0">Track and assign corporate asset handouts and departmental transfers</p>
        </div>
      </div>

      {/* Pink Alert Block */}
      <div className="wire-alert-pink mb-4 shadow-sm">
        <i className="bi bi-exclamation-octagon-fill"></i>
        <span>AF-0114 - Dell Laptop. Active. Allocated to Shreya Raval (IT Support). Asset reallocation is blocked - Submit a transfer request below.</span>
      </div>

      {/* Transfer Request Form */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8 col-12">
          <div className="wire-card">
            <h6 className="fw-bold mb-3 text-dark">Submit Transfer Request</h6>
            
            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6 col-12">
                  <label className="form-label small fw-semibold text-muted">Current Assignee</label>
                  <input 
                    type="text" 
                    className="form-control form-control-erp bg-light" 
                    value={currentEmployee}
                    disabled
                  />
                </div>
                
                <div className="col-md-6 col-12">
                  <label className="form-label small fw-semibold text-muted">Target Employee</label>
                  <select 
                    className="form-select form-control-erp" 
                    value={targetEmployee} 
                    onChange={(e) => setTargetEmployee(e.target.value)}
                    required
                  >
                    <option value="">Select Employee...</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.full_name}>
                        {emp.full_name} ({emp.role?.name || 'Employee'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Reason for reallocation transfer</label>
                <textarea 
                  className="form-control form-control-erp" 
                  rows="3" 
                  placeholder="Provide justification reason..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-wire py-2 px-3">
                Submit Request
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-4 col-12">
          <div className="wire-card bg-white h-100">
            <span className="fw-bold d-block mb-2 text-dark">Asset Reallocation Rules</span>
            <p className="small text-muted mb-0" style={{ lineHeight: '1.5' }}>
              To prevent compliance leaks, all primary inventory assets require formal approvals. Once submitted, requests are forwarded to the inventory manager's action panel for approval processing.
            </p>
          </div>
        </div>
      </div>

      {/* Reallocations History List */}
      <div className="wire-card">
        <h6 className="fw-bold mb-3 text-dark">Allocation History & Logs</h6>
        <div className="d-flex flex-column gap-2 text-muted" style={{ fontSize: '0.875rem' }}>
          {transferLogs.map((log, idx) => (
            <div key={idx} className="d-flex align-items-center gap-2 py-2 border-bottom border-light">
              <i className={`bi ${log.type === 'allocation' ? 'bi-box-arrow-in-right text-success' : log.type === 'return' ? 'bi-box-arrow-left text-primary' : 'bi-arrow-left-right text-warning'}`}></i>
              <span className="text-secondary">{log.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetAllocation;
