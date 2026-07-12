import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';
import apiService from '../services/api';

const OrganizationSetup = () => {
  const { addNotification } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('Departments');
  const [showAddModal, setShowAddModal] = useState(false);

  // Lists loaded from backend
  const [departmentsList, setDepartmentsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);

  // Form Fields - Departments
  const [deptName, setDeptName] = useState('');
  const [deptDesc, setDeptDesc] = useState('');
  const [deptFocus, setDeptFocus] = useState('');

  // Form Fields - Categories
  const [catCode, setCatCode] = useState('');
  const [catTitle, setCatTitle] = useState('');
  const [catCount, setCatCount] = useState('0');

  // Form Fields - Employees
  const [empName, setEmpName] = useState('');
  const [empDept, setEmpDept] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empRole, setEmpRole] = useState('Employee');

  const fetchAllData = () => {
    apiService.departments.list()
      .then(res => {
        setDepartmentsList(res.data);
        if (res.data.length > 0 && !empDept) {
          setEmpDept(res.data[0].name);
        }
      })
      .catch(err => console.error("Error loading departments:", err));

    apiService.categories.list()
      .then(res => setCategoriesList(res.data))
      .catch(err => console.error("Error loading categories:", err));

    apiService.employees.list()
      .then(res => setEmployeesList(res.data))
      .catch(err => console.error("Error loading employees:", err));
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddSubmit = (e) => {
    e.preventDefault();

    if (activeSubTab === 'Departments') {
      if (!deptName) return;
      apiService.departments.create({
        name: deptName,
        code: deptFocus || deptName.substring(0, 3).toUpperCase(),
        is_active: true
      })
      .then(() => {
        addNotification('success', `Department registered: ${deptName}`);
        fetchAllData();
      })
      .catch(() => addNotification('danger', 'Failed to register department'));
      
      setDeptName('');
      setDeptDesc('');
      setDeptFocus('');
    } 
    
    else if (activeSubTab === 'Categories') {
      if (!catCode || !catTitle) return;
      apiService.categories.create({
        name: catTitle,
        code: catCode.toUpperCase(),
        metadata_fields: "{}"
      })
      .then(() => {
        addNotification('success', `Category registered: ${catTitle}`);
        fetchAllData();
      })
      .catch(() => addNotification('danger', 'Failed to register category'));
      
      setCatCode('');
      setCatTitle('');
      setCatCount('0');
    } 
    
    else if (activeSubTab === 'Employee') {
      if (!empName || !empEmail) return;

      apiService.auth.signup({
        email: empEmail,
        password: "Password#123",
        full_name: empName,
        role: empRole
      })
      .then(() => {
        addNotification('success', `Employee registered: ${empName}`);
        fetchAllData();
      })
      .catch(() => addNotification('danger', 'Failed to register employee'));
      
      setEmpName('');
      setEmpEmail('');
      setEmpRole('Employee');
    }

    setShowAddModal(false);
  };

  const toggleDeptStatus = (id, currentStatus) => {
    if (currentStatus) {
      apiService.departments.deactivate(id)
        .then(() => {
          addNotification('warning', 'Department deactivated');
          fetchAllData();
        })
        .catch(() => addNotification('danger', 'Failed to deactivate department'));
    } else {
      apiService.departments.update(id, { is_active: true })
        .then(() => {
          addNotification('success', 'Department activated');
          fetchAllData();
        })
        .catch(() => addNotification('danger', 'Failed to activate department'));
    }
  };

  const deleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      apiService.categories.delete(id)
        .then(() => {
          addNotification('info', 'Category deleted');
          fetchAllData();
        })
        .catch(() => addNotification('danger', 'Failed to delete category'));
    }
  };

  const deactivateEmployee = (id) => {
    if (window.confirm("Are you sure you want to deactivate this employee?")) {
      apiService.employees.deactivate(id)
        .then(() => {
          addNotification('warning', 'Employee deactivated');
          fetchAllData();
        })
        .catch(() => addNotification('danger', 'Failed to deactivate employee'));
    }
  };

  const renderModalForm = () => {
    switch (activeSubTab) {
      case 'Departments':
        return (
          <>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Department Name</label>
              <input 
                type="text" 
                className="form-control form-control-erp" 
                placeholder="e.g. Marketing" 
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Department Code</label>
              <input 
                type="text" 
                className="form-control form-control-erp" 
                placeholder="e.g. MKT" 
                value={deptFocus}
                onChange={(e) => setDeptFocus(e.target.value)}
              />
            </div>
          </>
        );
      case 'Categories':
        return (
          <>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Category Code</label>
              <input 
                type="text" 
                className="form-control form-control-erp" 
                placeholder="e.g. IT-HW" 
                value={catCode}
                onChange={(e) => setCatCode(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Category Title</label>
              <input 
                type="text" 
                className="form-control form-control-erp" 
                placeholder="e.g. IT Electronics Hardware" 
                value={catTitle}
                onChange={(e) => setCatTitle(e.target.value)}
                required
              />
            </div>
          </>
        );
      case 'Employee':
        return (
          <>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Employee Name</label>
              <input 
                type="text" 
                className="form-control form-control-erp" 
                placeholder="e.g. Sarah Jenkins" 
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Email Address</label>
              <input 
                type="email" 
                className="form-control form-control-erp" 
                placeholder="e.g. sjenkins@company.com" 
                value={empEmail}
                onChange={(e) => setEmpEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Role Scope</label>
              <select 
                className="form-select form-control-erp"
                value={empRole}
                onChange={(e) => setEmpRole(e.target.value)}
              >
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
                <option value="Auditor">Auditor</option>
                <option value="Technician">Technician</option>
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1 text-dark">Organization Setup</h1>
          <p className="text-muted small mb-0">Configure company locations, departments, and roles</p>
        </div>
      </div>

      <div className="sub-tabs-bar">
        <div 
          className={`sub-tab-item ${activeSubTab === 'Departments' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('Departments')}
        >
          Departments
        </div>
        <div 
          className={`sub-tab-item ${activeSubTab === 'Categories' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('Categories')}
        >
          Categories
        </div>
        <div 
          className={`sub-tab-item ${activeSubTab === 'Employee' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('Employee')}
        >
          Employee
        </div>
        <div 
          className="sub-tab-item text-primary fw-semibold ms-auto d-flex align-items-center gap-1"
          onClick={() => setShowAddModal(true)}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <i className="bi bi-plus-lg"></i>
          <span>Add</span>
        </div>
      </div>

      {activeSubTab === 'Departments' && (
        <div className="wire-card p-0 overflow-hidden shadow-sm">
          <table className="wire-table mb-0">
            <thead>
              <tr>
                <th>Department</th>
                <th>Code</th>
                <th>Status</th>
                <th style={{ width: '150px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {departmentsList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-3 text-muted">No department records in database.</td>
                </tr>
              ) : (
                departmentsList.map((dept, idx) => (
                  <tr key={idx}>
                    <td className="fw-semibold text-dark">{dept.name}</td>
                    <td><code>{dept.code}</code></td>
                    <td>
                      <span className={`badge ${dept.is_active ? 'bg-success' : 'bg-secondary'} px-2 py-1 rounded-pill`}>
                        {dept.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-wire py-1 px-2 text-xs" 
                        style={{ fontSize: '0.75rem', backgroundColor: dept.is_active ? 'var(--erp-primary)' : '#64748b', borderColor: dept.is_active ? 'var(--erp-primary)' : '#64748b' }} 
                        onClick={() => toggleDeptStatus(dept.id, dept.is_active)}
                      >
                        {dept.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'Categories' && (
        <div className="wire-card p-0 overflow-hidden shadow-sm">
          <table className="wire-table mb-0">
            <thead>
              <tr>
                <th>Category Code</th>
                <th>Category Title</th>
                <th style={{ width: '150px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {categoriesList.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-3 text-muted">No category records in database.</td>
                </tr>
              ) : (
                categoriesList.map((cat, idx) => (
                  <tr key={idx}>
                    <td><code>{cat.code}</code></td>
                    <td className="fw-semibold text-dark">{cat.name}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-danger py-1 px-2"
                        style={{ fontSize: '0.75rem' }} 
                        onClick={() => deleteCategory(cat.id)}
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
      )}

      {activeSubTab === 'Employee' && (
        <div className="wire-card p-0 overflow-hidden shadow-sm">
          <table className="wire-table mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email Profile</th>
                <th>Role Scope</th>
                <th style={{ width: '100px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {employeesList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-3 text-muted">No employee records in database.</td>
                </tr>
              ) : (
                employeesList.map((emp, idx) => (
                  <tr key={idx}>
                    <td className="fw-semibold text-dark">{emp.full_name}</td>
                    <td>{emp.email}</td>
                    <td><span className="badge bg-light border text-secondary">{emp.role?.name}</span></td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-danger py-1 px-2 text-xs" 
                        style={{ fontSize: '0.75rem' }} 
                        onClick={() => deactivateEmployee(emp.id)}
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={`Add ${activeSubTab === 'Employee' ? 'Employee' : activeSubTab === 'Categories' ? 'Category' : 'Department'}`}
        footerActions={
          <>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="btn btn-sm btn-wire" onClick={handleAddSubmit}>Save Record</button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit}>
          {renderModalForm()}
        </form>
      </Modal>
    </div>
  );
};

export default OrganizationSetup;
