import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';

const AssetDirectory = () => {
  const { addAsset } = useApp();
  const [searchParams] = useSearchParams();
  
  // Search query state initialized from URL param and synced via useEffect
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [tagName, setTagName] = useState('');
  const [assetName, setAssetName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [status, setStatus] = useState('Available');
  const [location, setLocation] = useState('');

  // Initial Seed Data to match wireframe exactly
  const [assetsList, setAssetsList] = useState([
    { tag: 'AF-0012', name: 'Dell Laptop', category: 'Electronics', status: 'allocated', location: 'bangalore' },
    { tag: 'AF-0062', name: 'Projector', category: 'Electronics', status: 'maintenance', location: 'NY Office A' },
    { tag: 'AF-0220', name: 'Office chair', category: 'Furniture', status: 'Available', location: 'Warehouse' }
  ]);

  // Sync state if URL search param changes
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Search filter on stateful assets list
  const filteredAssets = assetsList.filter(item => 
    item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRegister = (e) => {
    e.preventDefault();
    if (!tagName || !assetName) return;

    const newAsset = {
      tag: tagName,
      name: assetName,
      category: category,
      status: status,
      location: location || 'Warehouse'
    };

    // Save exactly user-entered values directly to state
    setAssetsList([...assetsList, newAsset]);

    // Update context
    addAsset({
      name: assetName,
      code: tagName,
      category: category,
      serialNumber: tagName,
      purchaseDate: new Date().toISOString().split('T')[0],
      purchaseCost: 1000,
      branchId: 'BR-01',
      departmentId: 'DEP-01'
    });

    // Reset inputs
    setTagName('');
    setAssetName('');
    setLocation('');
    setStatus('Available');
    setCategory('Electronics');
    setShowAddModal(false);
  };

  const getStatusBadgeClass = (statusVal) => {
    const s = statusVal.toLowerCase();
    if (s === 'available') return 'bg-success';
    if (s === 'allocated') return 'bg-primary';
    if (s === 'maintenance') return 'bg-warning text-dark';
    return 'bg-secondary';
  };

  return (
    <div className="container-fluid p-0">
      {/* Unified Page Header Block */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1 text-dark">Assets Directory</h1>
          <p className="text-muted small mb-0">Manage registered enterprise physical assets and hardware items</p>
        </div>
      </div>

      {/* Sub-Header Actions */}
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-4">
        <div className="input-group" style={{ maxWidth: '380px' }}>
          <span className="input-group-text bg-white border-end-0 border-secondary-subtle">
            <i className="bi bi-search"></i>
          </span>
          <input 
            type="text" 
            className="form-control border-start-0 border-secondary-subtle" 
            placeholder="Search by Tag, serial, or IEP code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ fontSize: '0.875rem' }}
          />
        </div>

        <button className="btn-wire d-flex align-items-center gap-1" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-lg"></i>
          <span>Register Asset</span>
        </button>
      </div>

      {/* Directory Table Grid */}
      <div className="wire-card p-0 overflow-hidden">
        <table className="wire-table mb-0">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  No asset records found matching search query.
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset, idx) => (
                <tr key={idx}>
                  <td><code className="fw-semibold text-secondary">{asset.tag}</code></td>
                  <td className="fw-semibold text-dark">{asset.name}</td>
                  <td>{asset.category}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(asset.status)} px-2 py-1 rounded-pill`}>
                      {asset.status}
                    </span>
                  </td>
                  <td><span className="small text-muted">{asset.location}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Register Asset Modal */}
      <Modal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register Asset Record"
        footerActions={
          <>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="btn btn-sm btn-wire" onClick={handleRegister}>Save Asset</button>
          </>
        }
      >
        <form onSubmit={handleRegister} className="row g-3">
          <div className="col-md-6 col-12">
            <label className="form-label small fw-semibold text-muted">Tag / ID Code</label>
            <input 
              type="text" 
              className="form-control form-control-erp" 
              placeholder="e.g. AF-0112" 
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              required
            />
          </div>
          
          <div className="col-md-6 col-12">
            <label className="form-label small fw-semibold text-muted">Asset Title Name</label>
            <input 
              type="text" 
              className="form-control form-control-erp" 
              placeholder="e.g. Dell Monitor 27" 
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6 col-12">
            <label className="form-label small fw-semibold text-muted">Category Class</label>
            <select 
              className="form-select form-control-erp"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Facilities">Facilities</option>
            </select>
          </div>

          <div className="col-md-6 col-12">
            <label className="form-label small fw-semibold text-muted">Initial Status</label>
            <select 
              className="form-select form-control-erp"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Available">Available</option>
              <option value="allocated">Allocated</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>

          <div className="col-12">
            <label className="form-label small fw-semibold text-muted">Location / Branch Site</label>
            <input 
              type="text" 
              className="form-control form-control-erp" 
              placeholder="e.g. NY Office A or Warehouse" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AssetDirectory;
