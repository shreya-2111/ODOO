import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';

const OrganizationSetup = () => {
  const { addDepartment } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('Departments');
  const [showAddModal, setShowAddModal] = useState(false);

  // Stateful lists to allow dynamic table rows
  const [departmentsList, setDepartmentsList] = useState([
    { name: 'Engineering', description: 'with car', focus: 'Focus Dept', status: 'Active' },
    { name: 'Facilities', description: 'extra space', focus: '...', status: 'Active' },
    { name: 'Field ops (NY)', description: 'semi rigid', focus: 'Field ops', status: 'Active' }
  ]);

  const [categoriesList, setCategoriesList] = useState([
    { code: 'IT-HW', title: 'Electronics & IT Hardware', count: 12, status: 'Active' },
    { code: 'VEH-FLEET', title: 'Company Vehicles', count: 4, status: 'Active' },
    { code: 'FURN-OFFICE', title: 'Office Furniture', count: 18, status: 'Active' }
  ]);

  const [employeesList, setEmployeesList] = useState([
    { name: 'Priya Shah', department: 'Engineering', email: 'pshah@company.com', role: 'Employee' },
    { name: 'Arjen Dev', department: 'Engineering', email: 'adev@company.com', role: 'Employee' },
    { name: 'Sarah Jenkins', department: 'Engineering', email: 'sjenkins@company.com', role: 'Inventory Manager' }
  ]);

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
  const [empDept, setEmpDept] = useState('Engineering');
  const [empEmail, setEmpEmail] = useState('');
  const [empRole, setEmpRole] = useState('Employee');

  const handleAddSubmit = (e) => {
    e.preventDefault();

    if (activeSubTab === 'Departments') {
      if (!deptName) return;
      const newDept = {
        name: deptName,
        description: deptDesc || 'Standard department',
        focus: deptFocus || 'General Operations',
        status: 'Active' // Set to Active by default on creation
      };
      setDepartmentsList([...departmentsList, newDept]);
      addDepartment({ name: deptName, manager: deptFocus || 'Unassigned' });
      
      // Reset
      setDeptName('');
      setDeptDesc('');
      setDeptFocus('');
    } 
    
    else if (activeSubTab === 'Categories') {
      if (!catCode || !catTitle) return;
      const newCat = {
        code: catCode.toUpperCase(),
        title: catTitle,
        count: Number(catCount) || 0,
        status: 'Active' // Set to Active by default on creation
      };
      setCategoriesList([...categoriesList, newCat]);
      
      // Reset
      setCatCode('');
      setCatTitle('');
      setCatCount('0');
    } 
    
    else if (activeSubTab === 'Employee') {
      if (!empName || !empEmail) return;
      const newEmp = {
        name: empName,
        department: empDept,
        email: empEmail,
        role: empRole
      };
      setEmployeesList([...employeesList, newEmp]);
      
      // Reset
      setEmpName('');
      setEmpEmail('');
      setEmpDept('Engineering');
      setEmpRole('Employee');
    }

    setShowAddModal(false);
  };

  // Toggle status of departments between Active and Inactive
  const toggleDeptStatus = (index) => {
    const updated = [...departmentsList];
    updated[index].status = updated[index].status === 'Active' ? 'Inactive' : 'Active';
    setDepartmentsList(updated);
  };

  // Toggle status of categories between Active and Inactive
  const toggleCatStatus = (index) => {
    const updated = [...categoriesList];
    updated[index].status = updated[index].status === 'Active' ? 'Inactive' : 'Active';
    setCategoriesList(updated);
  };

  // Delete an employee from the directory list
  const deleteEmployee = (index) => {
    if (window.confirm(`Are you sure you want to remove ${employeesList[index].name}?`)) {
      const updated = employeesList.filter((_, idx) => idx !== index);
      setEmployeesList(updated);
    }
  };

  // Render sub-form dynamically in the Modal
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
              <label className="form-label small fw-semibold text-muted">Description / Tag</label>
              <input 
                type="text" 
                className="form-control form-control-erp" 
                placeholder="e.g. creative team" 
                value={deptDesc}
                onChange={(e) => setDeptDesc(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Focus Area / Manager</label>
              <input 
                type="text" 
                className="form-control form-control-erp" 
                placeholder="e.g. Brand Campaigns" 
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
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Initial Asset Count</label>
              <input 
                type="number" 
                className="form-control form-control-erp" 
                value={catCount}
                onChange={(e) => setCatCount(e.target.value)}
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
              <label className="form-label small fw-semibold text-muted">Primary Department</label>
              <select 
                className="form-select form-control-erp"
                value={empDept}
                onChange={(e) => setEmpDept(e.target.value)}
              >
                {departmentsList.map((d, idx) => (
                  <option key={idx} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Role Scope</label>
              <select 
                className="form-select form-control-erp"
                value={empRole}
                onChange={(e) => setEmpRole(e.target.value)}
              >
                <option value="Employee">Employee</option>
                <option value="Inventory Manager">Inventory Manager</option>
                <option value="Admin">Admin</option>
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
      {/* Unified Page Header Block */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1 text-dark">Organization Setup</h1>
          <p className="text-muted small mb-0">Configure company locations, departments, and roles</p>
        </div>
      </div>

      {/* Tab Header row */}
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

      {/* Tab Contents */}
      {activeSubTab === 'Departments' && (
        <div className="wire-card p-0 overflow-hidden shadow-sm">
          <table className="wire-table mb-0">
            <thead>
              <tr>
                <th>Department</th>
                <th>Description / Tag</th>
                <th>Focus / Role</th>
                <th>Status</th>
                <th style={{ width: '150px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {departmentsList.map((dept, idx) => (
                <tr key={idx}>
                  <td className="fw-semibold text-dark">{dept.name}</td>
                  <td>{dept.description}</td>
                  <td>{dept.focus}</td>
                  <td>
                    <span className={`badge ${dept.status === 'Active' ? 'bg-success' : 'bg-secondary'} px-2 py-1 rounded-pill`}>
                      {dept.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-wire py-1 px-2 text-xs" 
                      style={{ fontSize: '0.75rem', backgroundColor: dept.status === 'Active' ? 'var(--erp-primary)' : '#64748b', borderColor: dept.status === 'Active' ? 'var(--erp-primary)' : '#64748b' }} 
                      onClick={() => toggleDeptStatus(idx)}
                    >
                      {dept.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
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
                <th>Asset Count</th>
                <th>Status</th>
                <th style={{ width: '150px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {categoriesList.map((cat, idx) => (
                <tr key={idx}>
                  <td><code>{cat.code}</code></td>
                  <td className="fw-semibold text-dark">{cat.title}</td>
                  <td>{cat.count}</td>
                  <td>
                    <span className={`badge ${cat.status === 'Active' ? 'bg-success' : 'bg-secondary'} px-2 py-1 rounded-pill`}>
                      {cat.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-wire py-1 px-2 text-xs" 
                      style={{ fontSize: '0.75rem', backgroundColor: cat.status === 'Active' ? 'var(--erp-primary)' : '#64748b', borderColor: cat.status === 'Active' ? 'var(--erp-primary)' : '#64748b' }} 
                      onClick={() => toggleCatStatus(idx)}
                    >
                      {cat.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
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
                <th>Primary Department</th>
                <th>Email Profile</th>
                <th>Role Scope</th>
                <th style={{ width: '100px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {employeesList.map((emp, idx) => (
                <tr key={idx}>
                  <td className="fw-semibold text-dark">{emp.name}</td>
                  <td>{emp.department}</td>
                  <td>{emp.email}</td>
                  <td><span className="badge bg-light border text-secondary">{emp.role}</span></td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-danger py-1 px-2 text-xs" 
                      style={{ fontSize: '0.75rem' }} 
                      onClick={() => deleteEmployee(idx)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal switcher */}
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
