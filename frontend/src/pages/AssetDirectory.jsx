import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';
import apiService from '../services/api';

const AssetDirectory = () => {
  const { addNotification } = useApp();
  const [searchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [tagName, setTagName] = useState('');
  const [assetName, setAssetName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [status, setStatus] = useState('Available');
  const [location, setLocation] = useState('');
  const [cost, setCost] = useState('1000');
  const [isShared, setIsShared] = useState(false);

  // Lists loaded from backend
  const [assetsList, setAssetsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  const fetchAssetsAndCategories = () => {
    apiService.assets.list()
      .then(res => setAssetsList(res.data))
      .catch(err => console.error("Error loading assets:", err));

    apiService.categories.list()
      .then(res => {
        setCategoriesList(res.data);
        if (res.data.length > 0 && !selectedCategoryId) {
          setSelectedCategoryId(res.data[0].id);
        }
      })
      .catch(err => console.error("Error loading categories:", err));
  };

  useEffect(() => {
    fetchAssetsAndCategories();
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const filteredAssets = assetsList.filter(item => 
    item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRegister = (e) => {
    e.preventDefault();
    if (!tagName || !assetName || !selectedCategoryId) return;

    apiService.assets.create({
      name: assetName,
      serial_number: tagName,
      category_id: Number(selectedCategoryId),
      acquisition_date: new Date().toISOString().split('T')[0],
      cost: Number(cost) || 0.0,
      condition: "Good",
      status: status,
      location: location || 'Warehouse',
      is_shared_resource: isShared,
      custom_attributes: "{}"
    })
    .then((res) => {
      addNotification('success', `New asset registered: ${res.data.name} (${res.data.tag})`);
      fetchAssetsAndCategories();
    })
    .catch((err) => {
      addNotification('danger', err.response?.data?.detail || 'Failed to register asset');
    });

    // Reset inputs
    setTagName('');
    setAssetName('');
    setLocation('');
    setStatus('Available');
    setIsShared(false);
    setShowAddModal(false);
  };

  const handleDeleteAsset = (id) => {
    if (window.confirm("Are you sure you want to remove this asset registry line?")) {
      apiService.assets.delete(id)
        .then(() => {
          addNotification('info', 'Asset deleted successfully');
          fetchAssetsAndCategories();
        })
        .catch(() => addNotification('danger', 'Failed to delete asset'));
    }
  };

  const getStatusBadgeClass = (statusVal) => {
    const s = statusVal.toLowerCase();
    if (s === 'available') return 'bg-success';
    if (s === 'allocated') return 'bg-primary';
    if (s === 'maintenance' || s === 'under maintenance') return 'bg-warning text-dark';
    return 'bg-secondary';
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1 text-dark">Assets Directory</h1>
          <p className="text-muted small mb-0">Manage registered enterprise physical assets and hardware items</p>
        </div>
      </div>

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

      <div className="wire-card p-0 overflow-hidden">
        <table className="wire-table mb-0">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Location</th>
              <th style={{ width: '100px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  No asset records found matching search query.
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset, idx) => (
                <tr key={idx}>
                  <td><code className="fw-semibold text-secondary">{asset.tag}</code></td>
                  <td className="fw-semibold text-dark">{asset.name}</td>
                  <td>{asset.category?.name}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(asset.status)} px-2 py-1 rounded-pill`}>
                      {asset.status}
                    </span>
                  </td>
                  <td><span className="small text-muted">{asset.location}</span></td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-danger py-1 px-2 text-xs" 
                      style={{ fontSize: '0.75rem' }} 
                      onClick={() => handleDeleteAsset(asset.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
            <label className="form-label small fw-semibold text-muted">Serial Code / Number</label>
            <input 
              type="text" 
              className="form-control form-control-erp" 
              placeholder="e.g. SN-8842-12" 
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
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              {categoriesList.map((c, idx) => (
                <option key={idx} value={c.id}>{c.name}</option>
              ))}
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
              <option value="Allocated">Allocated</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>

          <div className="col-md-6 col-12">
            <label className="form-label small fw-semibold text-muted">Location / Branch Site</label>
            <input 
              type="text" 
              className="form-control form-control-erp" 
              placeholder="e.g. NY Office A or Warehouse" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6 col-12">
            <label className="form-label small fw-semibold text-muted">Purchase Cost ($)</label>
            <input 
              type="number" 
              className="form-control form-control-erp" 
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>

          <div className="col-12">
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="isSharedCheck"
                checked={isShared}
                onChange={(e) => setIsShared(e.target.checked)}
              />
              <label className="form-check-label small fw-semibold text-muted" htmlFor="isSharedCheck">
                Mark as Shared Bookable Resource (Rooms, Vehicles, Equipment)
              </label>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AssetDirectory;
