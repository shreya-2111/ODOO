// Realistic mock data representing the database of AssetFlow Enterprise ERP

export const initialBranches = [
  { id: 'BR-01', name: 'Global HQ (New York)', location: 'New York, USA', code: 'HQ-NY' },
  { id: 'BR-02', name: 'EMEA Hub (London)', location: 'London, UK', code: 'EMEA-LDN' },
  { id: 'BR-03', name: 'APAC Tech Center (Tokyo)', location: 'Tokyo, Japan', code: 'APAC-TKY' }
];

export const initialDepartments = [
  { id: 'DEP-01', name: 'Engineering & IT', manager: 'Sarah Jenkins' },
  { id: 'DEP-02', name: 'Human Resources', manager: 'David Miller' },
  { id: 'DEP-03', name: 'Finance & Accounting', manager: 'Elena Rostova' },
  { id: 'DEP-04', name: 'Operations & Facilities', manager: 'Marcus Vance' },
  { id: 'DEP-05', name: 'Marketing & Sales', manager: 'Chloe Zhao' }
];

export const initialRoles = [
  { id: 'R-01', name: 'Administrator', permissions: ['all'] },
  { id: 'R-02', name: 'Inventory Manager', permissions: ['read', 'write', 'allocate', 'audit'] },
  { id: 'R-03', name: 'Facility Coordinator', permissions: ['read', 'booking', 'maintenance'] },
  { id: 'R-04', name: 'Employee / Requester', permissions: ['read', 'request_maintenance', 'booking_request'] }
];

export const initialAssets = [
  {
    id: 'AST-001',
    name: 'MacBook Pro 16" M3 Max',
    code: 'AST-IT-2026-001',
    category: 'IT Hardware',
    status: 'Allocated',
    serialNumber: 'C02F87XYQ05D',
    purchaseDate: '2026-01-15',
    purchaseCost: 3499,
    branchId: 'BR-01',
    departmentId: 'DEP-01',
    assignedTo: 'Alex Mercer'
  },
  {
    id: 'AST-002',
    name: 'Dell XPS 15 9530',
    code: 'AST-IT-2026-002',
    category: 'IT Hardware',
    status: 'Available',
    serialNumber: 'H18FKL9201Z',
    purchaseDate: '2026-02-10',
    purchaseCost: 1999,
    branchId: 'BR-02',
    departmentId: 'DEP-01',
    assignedTo: ''
  },
  {
    id: 'AST-003',
    name: 'Toyota RAV4 Hybrid (2025)',
    code: 'AST-VEH-2025-012',
    category: 'Vehicles',
    status: 'Allocated',
    serialNumber: 'JT3DWRFFXQ29013',
    purchaseDate: '2025-11-20',
    purchaseCost: 38500,
    branchId: 'BR-01',
    departmentId: 'DEP-04',
    assignedTo: 'Marcus Vance'
  },
  {
    id: 'AST-004',
    name: 'Conference Room 4A Display (Sony 75" 4K)',
    code: 'AST-FAC-2026-088',
    category: 'Facility Equipment',
    status: 'Available',
    serialNumber: 'SNY75X90L-40912',
    purchaseDate: '2026-03-01',
    purchaseCost: 1250,
    branchId: 'BR-03',
    departmentId: 'DEP-04',
    assignedTo: ''
  },
  {
    id: 'AST-005',
    name: 'Herman Miller Aeron Chair (Size B)',
    code: 'AST-FURN-2026-512',
    category: 'Furniture',
    status: 'Allocated',
    serialNumber: 'HM-AERON-882190',
    purchaseDate: '2026-01-20',
    purchaseCost: 1450,
    branchId: 'BR-01',
    departmentId: 'DEP-02',
    assignedTo: 'Jane Sterling'
  },
  {
    id: 'AST-006',
    name: 'Precision Server Rack Dell R760',
    code: 'AST-IT-2026-003',
    category: 'IT Hardware',
    status: 'Maintenance',
    serialNumber: 'SV-DELL-R760-XYZ',
    purchaseDate: '2026-04-12',
    purchaseCost: 12800,
    branchId: 'BR-03',
    departmentId: 'DEP-01',
    assignedTo: 'Takahiro Sato'
  },
  {
    id: 'AST-007',
    name: 'Logitech Rally Bar Plus',
    code: 'AST-FAC-2026-092',
    category: 'Facility Equipment',
    status: 'Available',
    serialNumber: 'LOGI-RALLY-7718A',
    purchaseDate: '2026-05-18',
    purchaseCost: 2800,
    branchId: 'BR-02',
    departmentId: 'DEP-04',
    assignedTo: ''
  }
];

export const initialAllocations = [
  {
    id: 'ALC-001',
    assetId: 'AST-001',
    assetName: 'MacBook Pro 16" M3 Max',
    assignedTo: 'Alex Mercer',
    department: 'Engineering & IT',
    branchName: 'Global HQ (New York)',
    allocationDate: '2026-01-16',
    returnDate: null,
    status: 'Active'
  },
  {
    id: 'ALC-002',
    assetId: 'AST-005',
    assetName: 'Herman Miller Aeron Chair (Size B)',
    assignedTo: 'Jane Sterling',
    department: 'Human Resources',
    branchName: 'Global HQ (New York)',
    allocationDate: '2026-01-21',
    returnDate: null,
    status: 'Active'
  },
  {
    id: 'ALC-003',
    assetId: 'AST-003',
    assetName: 'Toyota RAV4 Hybrid (2025)',
    assignedTo: 'Marcus Vance',
    department: 'Operations & Facilities',
    branchName: 'Global HQ (New York)',
    allocationDate: '2025-11-21',
    returnDate: null,
    status: 'Active'
  },
  {
    id: 'ALC-004',
    assetId: 'AST-002',
    assetName: 'Dell XPS 15 9530',
    assignedTo: 'Liam Gallagher',
    department: 'Marketing & Sales',
    branchName: 'EMEA Hub (London)',
    allocationDate: '2026-03-01',
    returnDate: '2026-06-30',
    status: 'Returned'
  }
];

export const initialBookings = [
  {
    id: 'BKG-001',
    resourceName: 'Conference Room 4A (NY)',
    resourceType: 'Meeting Room',
    bookedBy: 'Sarah Jenkins',
    bookingDate: '2026-07-13',
    startTime: '10:00',
    endTime: '11:30',
    purpose: 'Sprint Planning Meeting',
    status: 'Confirmed'
  },
  {
    id: 'BKG-002',
    resourceName: 'Toyota RAV4 Hybrid (2025)',
    resourceType: 'Company Vehicle',
    bookedBy: 'David Miller',
    bookingDate: '2026-07-14',
    startTime: '09:00',
    endTime: '17:00',
    purpose: 'Client Site Visit & Recruiting',
    status: 'Confirmed'
  },
  {
    id: 'BKG-003',
    resourceName: 'London Boardroom 1',
    resourceType: 'Meeting Room',
    bookedBy: 'Chloe Zhao',
    bookingDate: '2026-07-12',
    startTime: '14:00',
    endTime: '15:30',
    purpose: 'Marketing Strategy Review',
    status: 'Checked-In'
  }
];

export const initialMaintenance = [
  {
    id: 'MNT-001',
    assetId: 'AST-006',
    assetName: 'Precision Server Rack Dell R760',
    issue: 'Overheating issues on core switch port slots. Fan replacement needed.',
    reportedBy: 'Takahiro Sato',
    reportedDate: '2026-07-08',
    scheduledDate: '2026-07-13',
    completedDate: null,
    cost: 450,
    priority: 'Critical',
    status: 'In Progress'
  },
  {
    id: 'MNT-002',
    assetId: 'AST-003',
    assetName: 'Toyota RAV4 Hybrid (2025)',
    issue: 'Routine 10,000-mile engine checkup and tire rotation.',
    reportedBy: 'Marcus Vance',
    reportedDate: '2026-07-10',
    scheduledDate: '2026-07-15',
    completedDate: null,
    cost: 180,
    priority: 'Low',
    status: 'Pending Approval'
  },
  {
    id: 'MNT-003',
    assetId: 'AST-001',
    assetName: 'MacBook Pro 16" M3 Max',
    issue: 'Defective trackpad behavior (unresponsive clicks). Covered under AppleCare.',
    reportedBy: 'Alex Mercer',
    reportedDate: '2026-05-10',
    scheduledDate: '2026-05-12',
    completedDate: '2026-05-14',
    cost: 0,
    priority: 'High',
    status: 'Resolved'
  }
];

export const initialAudits = [
  {
    id: 'AUD-001',
    title: 'Q2 2026 Global IT Hardware Audit',
    scheduledDate: '2026-06-20',
    auditor: 'CyberSecurity Group Ltd.',
    status: 'Completed',
    complianceScore: 98,
    notes: 'All items accounted for, minor label mismatches on server accessories.',
    checklist: [
      { id: 1, task: 'Verify all active MacBook Pro serial codes', checked: true },
      { id: 2, task: 'Confirm firewall status on server rack R760', checked: true },
      { id: 3, task: 'Verify employee receipt signatures for Q2 hardware handouts', checked: true },
      { id: 4, task: 'Physical check of reserve laptops in NY storage locker', checked: false }
    ]
  },
  {
    id: 'AUD-002',
    title: 'H1 2026 Fleet and Facilities Compliance',
    scheduledDate: '2026-07-15',
    auditor: 'Internal Facilities Committee',
    status: 'In Progress',
    complianceScore: null,
    notes: 'On-site vehicle and conference room inspection ongoing.',
    checklist: [
      { id: 1, task: 'Inspect emissions records for company vehicles', checked: true },
      { id: 2, task: 'Audit fire extinguisher tags in Tokyo & London offices', checked: true },
      { id: 3, task: 'Verify first-aid kit stocks in New York kitchen and facilities locker', checked: false },
      { id: 4, task: 'Audit building entry access logs for past 30 days', checked: false }
    ]
  }
];

export const initialNotifications = [
  {
    id: 'NTF-001',
    type: 'danger',
    message: 'Asset AST-IT-2026-003 (Dell R760 Server) is critical: Overheating - Urgent maintenance required.',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'NTF-002',
    type: 'warning',
    message: 'Fleet Audit (AUD-002) scheduled to start in 3 days. Prepare registration documents.',
    timestamp: '1 day ago',
    read: false
  },
  {
    id: 'NTF-003',
    type: 'success',
    message: 'Alex Mercer successfully signed for Laptop AST-001 (MacBook Pro).',
    timestamp: '2 days ago',
    read: true
  },
  {
    id: 'NTF-004',
    type: 'info',
    message: 'Branch Tokyo Center successfully set up by Admin.',
    timestamp: '5 days ago',
    read: true
  }
];

// utang
