import React, { createContext, useState, useContext } from 'react';
import {
  initialBranches,
  initialDepartments,
  initialAssets,
  initialAllocations,
  initialBookings,
  initialMaintenance,
  initialAudits,
  initialNotifications
} from '../services/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [branches, setBranches] = useState(initialBranches);
  const [departments, setDepartments] = useState(initialDepartments);
  const [assets, setAssets] = useState(initialAssets);
  const [allocations, setAllocations] = useState(initialAllocations);
  const [bookings, setBookings] = useState(initialBookings);
  const [maintenance, setMaintenance] = useState(initialMaintenance);
  const [audits, setAudits] = useState(initialAudits);
  const [notifications, setNotifications] = useState(initialNotifications);

  // Asset Actions
  const addAsset = (asset) => {
    const newAsset = {
      ...asset,
      id: `AST-${String(assets.length + 1).padStart(3, '0')}`,
      status: 'Available',
      assignedTo: ''
    };
    setAssets((prev) => [newAsset, ...prev]);
    addNotification('success', `New asset registered: ${newAsset.name} (${newAsset.code})`);
  };

  const updateAsset = (id, updatedFields) => {
    setAssets((prev) =>
      prev.map((asset) => (asset.id === id ? { ...asset, ...updatedFields } : asset))
    );
  };

  const deleteAsset = (id) => {
    const assetToDelete = assets.find((a) => a.id === id);
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
    if (assetToDelete) {
      addNotification('info', `Asset removed from registry: ${assetToDelete.name}`);
    }
  };

  // Allocation Actions
  const allocateAsset = (assetId, employeeName, departmentName, branchName) => {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return;

    // 1. Create allocation log
    const newAllocation = {
      id: `ALC-${String(allocations.length + 1).padStart(3, '0')}`,
      assetId,
      assetName: asset.name,
      assignedTo: employeeName,
      department: departmentName,
      branchName: branchName,
      allocationDate: new Date().toISOString().split('T')[0],
      returnDate: null,
      status: 'Active'
    };

    setAllocations((prev) => [newAllocation, ...prev]);

    // 2. Update asset status
    updateAsset(assetId, {
      status: 'Allocated',
      assignedTo: employeeName,
      departmentId: departments.find(d => d.name === departmentName)?.id || '',
      branchId: branches.find(b => b.name === branchName)?.id || ''
    });

    addNotification('success', `Assigned "${asset.name}" to ${employeeName} (${departmentName})`);
  };

  const returnAsset = (allocationId) => {
    const allocation = allocations.find((a) => a.id === allocationId);
    if (!allocation) return;

    // 1. Update allocation status
    setAllocations((prev) =>
      prev.map((a) =>
        a.id === allocationId
          ? { ...a, status: 'Returned', returnDate: new Date().toISOString().split('T')[0] }
          : a
      )
    );

    // 2. Update asset to Available
    updateAsset(allocation.assetId, { status: 'Available', assignedTo: '' });

    addNotification('info', `Asset returned: ${allocation.assetName} from ${allocation.assignedTo}`);
  };

  // Resource Booking Actions
  const createBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: `BKG-${String(bookings.length + 1).padStart(3, '0')}`,
      status: 'Confirmed'
    };
    setBookings((prev) => [newBooking, ...prev]);
    addNotification('success', `Booking confirmed: ${newBooking.resourceName} for ${newBooking.bookedBy}`);
  };

  // Maintenance Actions
  const addMaintenanceRequest = (request) => {
    const newRequest = {
      ...request,
      id: `MNT-${String(maintenance.length + 1).padStart(3, '0')}`,
      reportedDate: new Date().toISOString().split('T')[0],
      completedDate: null,
      status: 'Pending Approval'
    };
    setMaintenance((prev) => [newRequest, ...prev]);

    // Set asset status to maintenance if critical
    if (request.priority === 'Critical' || request.priority === 'High') {
      updateAsset(request.assetId, { status: 'Maintenance' });
    }

    addNotification('warning', `Maintenance requested for asset ID ${request.assetId}: ${request.issue}`);
  };

  const updateMaintenanceStatus = (id, newStatus, actualCost = 0) => {
    const ticket = maintenance.find((m) => m.id === id);
    if (!ticket) return;

    setMaintenance((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: newStatus,
              cost: actualCost || m.cost,
              completedDate: newStatus === 'Resolved' ? new Date().toISOString().split('T')[0] : null
            }
          : m
      )
    );

    // If resolved, set asset available again
    if (newStatus === 'Resolved') {
      updateAsset(ticket.assetId, { status: 'Available' });
      addNotification('success', `Maintenance ticket resolved for ${ticket.assetName}. Total cost: $${actualCost}`);
    } else if (newStatus === 'In Progress') {
      updateAsset(ticket.assetId, { status: 'Maintenance' });
    }
  };

  // Audit Actions
  const toggleAuditChecklistItem = (auditId, itemId) => {
    setAudits((prev) =>
      prev.map((audit) => {
        if (audit.id !== auditId) return audit;

        const updatedChecklist = audit.checklist.map((item) =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        );

        // Recalculate score based on checked items
        const checkedCount = updatedChecklist.filter((t) => t.checked).length;
        const totalCount = updatedChecklist.length;
        const complianceScore = Math.round((checkedCount / totalCount) * 100);

        return {
          ...audit,
          checklist: updatedChecklist,
          complianceScore: audit.status === 'Completed' ? audit.complianceScore : complianceScore
        };
      })
    );
  };

  const completeAudit = (auditId) => {
    setAudits((prev) =>
      prev.map((audit) => {
        if (audit.id !== auditId) return audit;

        // Calculate score
        const checkedCount = audit.checklist.filter((t) => t.checked).length;
        const totalCount = audit.checklist.length;
        const score = Math.round((checkedCount / totalCount) * 100);

        addNotification('success', `Compliance Audit "${audit.title}" completed. Score: ${score}%`);

        return {
          ...audit,
          status: 'Completed',
          complianceScore: score
        };
      })
    );
  };

  // Branch Setup Actions
  const addBranch = (branch) => {
    const newBranch = {
      ...branch,
      id: `BR-${String(branches.length + 1).padStart(2, '0')}`
    };
    setBranches((prev) => [...prev, newBranch]);
    addNotification('success', `Branch added: ${branch.name}`);
  };

  const addDepartment = (dept) => {
    const newDept = {
      ...dept,
      id: `DEP-${String(departments.length + 1).padStart(2, '0')}`
    };
    setDepartments((prev) => [...prev, newDept]);
    addNotification('success', `Department registered: ${dept.name}`);
  };

  // Notification Actions
  const addNotification = (type, message) => {
    const newNtf = {
      id: `NTF-${Date.now()}`,
      type,
      message,
      timestamp: 'Just now',
      read: false
    };
    setNotifications((prev) => [newNtf, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        branches,
        departments,
        assets,
        allocations,
        bookings,
        maintenance,
        audits,
        notifications,
        addAsset,
        updateAsset,
        deleteAsset,
        allocateAsset,
        returnAsset,
        createBooking,
        addMaintenanceRequest,
        updateMaintenanceStatus,
        toggleAuditChecklistItem,
        completeAudit,
        addBranch,
        addDepartment,
        addNotification,
        markNotificationRead,
        clearAllNotifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
