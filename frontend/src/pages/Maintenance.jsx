import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';

const Maintenance = () => {
  const { addNotification } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [resolutionCost, setResolutionCost] = useState('');

  // Initial seed tickets matching wireframe exactly
  const [tickets, setTickets] = useState([
    { id: 'TKT-01', code: 'AF-0062', name: 'Projector bulb', desc: 'invoice attached, resolved $890', status: 'Resolved' },
    { id: 'TKT-02', code: 'AF-0176', name: 'Engine checkup', desc: 'Scheduled for Wed', status: 'In progress' },
    { id: 'TKT-03', code: 'AF-0210', name: 'Battery replacement', desc: 'invoice attached, resolved $70', status: 'Resolved' },
    { id: 'TKT-04', code: 'AF-0111', name: 'Screen repair', desc: 'invoice attached, resolved $120', status: 'Resolved' },
    { id: 'TKT-05', code: 'AF-1002', name: 'TV', desc: 'invoice attached, resolved $80', status: 'Resolved' }
  ]);

  // Form states for adding ticket
  const [assetCode, setAssetCode] = useState('');
  const [assetName, setAssetName] = useState('');
  const [issueDesc, setIssueDesc] = useState('');

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!assetCode || !assetName) return;

    const newTicket = {
      id: `TKT-${Date.now()}`,
      code: assetCode,
      name: assetName,
      desc: issueDesc || 'Pending diagnostics check',
      status: 'Pending'
    };

    setTickets((prev) => [...prev, newTicket]);
    addNotification('warning', `Maintenance ticket registered for ${assetCode}`);
    
    // Reset and close
    setAssetCode('');
    setAssetName('');
    setIssueDesc('');
    setShowAddModal(false);
  };

  const handleCardClick = (ticket) => {
    if (ticket.status === 'Pending') {
      updateTicketStatus(ticket.id, 'Approved');
      addNotification('info', `Ticket ${ticket.code} moved to Approved`);
    } else if (ticket.status === 'Approved') {
      updateTicketStatus(ticket.id, 'In progress');
      addNotification('info', `Ticket ${ticket.code} is now In Progress`);
    } else if (ticket.status === 'In progress') {
      setSelectedTicketId(ticket.id);
      setResolutionCost('120');
      setShowResolveModal(true);
    }
  };

  const updateTicketStatus = (id, newStatus, extraDesc = '') => {
    setTickets((prev) => 
      prev.map((t) => 
        t.id === id 
          ? { ...t, status: newStatus, desc: extraDesc || t.desc } 
          : t
      )
    );
  };

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    const ticket = tickets.find(t => t.id === selectedTicketId);
    if (!ticket || !resolutionCost) return;

    updateTicketStatus(selectedTicketId, 'Resolved', `invoice attached, resolved $${resolutionCost}`);
    addNotification('success', `Ticket ${ticket.code} resolved successfully. Cost: $${resolutionCost}`);
    setShowResolveModal(false);
  };

  // Group tickets by column status
  const pendingTickets = tickets.filter(t => t.status === 'Pending');
  const approvedTickets = tickets.filter(t => t.status === 'Approved');
  const inProgressTickets = tickets.filter(t => t.status === 'In progress');
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved');

  return (
    <div className="container-fluid p-0">
      {/* Unified Page Header Block */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1 text-dark">Maintenance</h1>
          <p className="text-muted small mb-0">Monitor service diagnostics, schedule operations, and review active tickets</p>
        </div>
        
        {/* Fixed: Removed duplicate plus character inside span */}
        <button className="btn-wire d-flex align-items-center gap-1" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-wrench"></i>
          <span>Report Issue</span>
        </button>
      </div>

      {/* Kanban Board Grid columns */}
      <div className="kanban-board">
        {/* Column Pending */}
        <div className="kanban-col">
          <div className="kanban-col-header text-muted">Pending ({pendingTickets.length})</div>
          {pendingTickets.map((t) => (
            <div key={t.id} className="kanban-wire-card" onClick={() => handleCardClick(t)}>
              <span className="fw-bold text-dark d-block mb-1">{t.code}</span>
              <span className="text-secondary d-block small mb-2">{t.name}</span>
              <small className="text-secondary-erp d-block">{t.desc}</small>
              <div className="text-end mt-2"><span className="badge bg-light border text-muted" style={{ fontSize: '0.65rem' }}>Approve →</span></div>
            </div>
          ))}
        </div>

        {/* Column Approved */}
        <div className="kanban-col">
          <div className="kanban-col-header text-primary">Approved ({approvedTickets.length})</div>
          {approvedTickets.map((t) => (
            <div key={t.id} className="kanban-wire-card" onClick={() => handleCardClick(t)}>
              <span className="fw-bold text-dark d-block mb-1">{t.code}</span>
              <span className="text-secondary d-block small mb-2">{t.name}</span>
              <small className="text-secondary-erp d-block">{t.desc}</small>
              <div className="text-end mt-2"><span className="badge bg-light border text-muted" style={{ fontSize: '0.65rem' }}>Start →</span></div>
            </div>
          ))}
        </div>

        {/* Column In progress */}
        <div className="kanban-col">
          <div className="kanban-col-header text-warning">In progress ({inProgressTickets.length})</div>
          {inProgressTickets.map((t) => (
            <div key={t.id} className="kanban-wire-card" onClick={() => handleCardClick(t)}>
              <span className="fw-bold text-dark d-block mb-1">{t.code}</span>
              <span className="text-secondary d-block small mb-2">{t.name}</span>
              <small className="text-secondary-erp d-block">{t.desc}</small>
              <div className="text-end mt-2">
                <button 
                  className="btn btn-xs btn-outline-primary py-0 px-2" 
                  style={{ fontSize: '0.7rem' }}
                  onClick={(e) => { e.stopPropagation(); handleCardClick(t); }}
                >
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Column Resolved */}
        <div className="kanban-col">
          <div className="kanban-col-header text-success">Resolved ({resolvedTickets.length})</div>
          {resolvedTickets.map((t) => (
            <div key={t.id} className="kanban-wire-card border-success-subtle" style={{ cursor: 'default' }}>
              <span className="fw-bold text-success d-block mb-1">{t.code}</span>
              <span className="text-secondary d-block small mb-2">{t.name}</span>
              <small className="text-muted d-block italic">{t.desc}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Explanatory notes below */}
      <div className="text-muted small mt-4">
        <i className="bi bi-info-circle me-1"></i>
        <span>Approving a card moves the asset status to "under maintenance", resolving returns it to "available"</span>
      </div>

      {/* Report Issue Modal */}
      <Modal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Report New Maintenance Issue"
        footerActions={
          <>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="btn btn-sm btn-wire" onClick={handleCreateTicket}>Submit Request</button>
          </>
        }
      >
        <form onSubmit={handleCreateTicket}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Asset Code</label>
            <input 
              type="text" 
              className="form-control form-control-erp" 
              placeholder="e.g. AF-0062" 
              value={assetCode}
              onChange={(e) => setAssetCode(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Asset Name</label>
            <input 
              type="text" 
              className="form-control form-control-erp" 
              placeholder="e.g. Projector lens swap" 
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Estimate / Fault Description</label>
            <input 
              type="text" 
              className="form-control form-control-erp" 
              placeholder="e.g. est cost: 80$" 
              value={issueDesc}
              onChange={(e) => setIssueDesc(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      {/* Resolve Cost Input Modal */}
      <Modal
        show={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        title="Resolve Ticket Invoice details"
        footerActions={
          <>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowResolveModal(false)}>Cancel</button>
            <button className="btn btn-sm btn-success" onClick={handleResolveSubmit}>Resolve Ticket</button>
          </>
        }
      >
        <form onSubmit={handleResolveSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Actual Invoiced Repair Cost ($)</label>
            <input 
              type="number" 
              className="form-control form-control-erp" 
              value={resolutionCost}
              onChange={(e) => setResolutionCost(e.target.value)}
              required
              autoFocus
            />
            <small className="text-muted d-block mt-2">Entering invoice logs returns the device back to available status pools.</small>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Maintenance;
