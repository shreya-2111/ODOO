import axios from 'axios';

// Base Axios Configuration for FastAPI backend integrations
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor for appending JWT Bearer Tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('assetflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for uniform error catching & auth redirections
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('AssetFlow API Error Logged:', error.response || error.message);
    
    // Redirect to login on expired or unauthorized JWT sessions
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('assetflow_token');
      localStorage.removeItem('assetflow_user');
      // Prevent redirect loop if already on login/signup page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Individual Service Integrations for AssetFlow API
const apiService = {
  // === JWT Authentication APIs ===
  auth: {
    login: (credentials) => api.post('/api/auth/login', credentials),
    signup: (userDetails) => api.post('/api/auth/signup', userDetails)
  },

  // === Department Management APIs ===
  departments: {
    list: () => api.get('/api/departments'),
    create: (data) => api.post('/api/departments', data),
    update: (id, data) => api.put(`/api/departments/${id}`, data),
    deactivate: (id) => api.delete(`/api/departments/${id}`)
  },

  // === Employee Management APIs ===
  employees: {
    list: () => api.get('/api/employees'),
    create: (data) => api.post('/api/employees', data),
    update: (id, data) => api.put(`/api/employees/${id}`, data),
    deactivate: (id) => api.delete(`/api/employees/${id}`)
  },

  // === Asset Category Management APIs ===
  categories: {
    list: () => api.get('/api/categories'),
    create: (data) => api.post('/api/categories', data),
    update: (id, data) => api.put(`/api/categories/${id}`, data),
    delete: (id) => api.delete(`/api/categories/${id}`)
  },

  // === Physical Asset Management APIs ===
  assets: {
    list: (params) => api.get('/api/assets', { params }),
    get: (id) => api.get(`/api/assets/${id}`),
    create: (data) => api.post('/api/assets', data),
    update: (id, data) => api.put(`/api/assets/${id}`, data),
    delete: (id) => api.delete(`/api/assets/${id}`)
  },

  // === Asset Allocation / Returns APIs ===
  allocations: {
    list: () => api.get('/api/allocations'),
    allocate: (data) => api.post('/api/allocations', data),
    returnAsset: (id, data) => api.post(`/api/allocations/${id}/return`, data)
  },

  // === Transfer Workflow APIs ===
  transfers: {
    list: () => api.get('/api/transfers'),
    create: (data) => api.post('/api/transfers', data),
    approve: (id) => api.post(`/api/transfers/${id}/approve`)
  },

  // === Shared Resource Bookings APIs ===
  bookings: {
    list: () => api.get('/api/bookings'),
    get: (id) => api.get(`/api/bookings/${id}`),
    create: (data) => api.post('/api/bookings', data),
    updateStatus: (id, data) => api.put(`/api/bookings/${id}`, data)
  },

  // === Maintenance Management Tickets APIs ===
  maintenance: {
    list: () => api.get('/api/maintenance'),
    create: (data) => api.post('/api/maintenance', data),
    approve: (id) => api.post(`/api/maintenance/${id}/approve`),
    reject: (id) => api.post(`/api/maintenance/${id}/reject`),
    assign: (id, data) => api.post(`/api/maintenance/${id}/assign`, data),
    start: (id) => api.post(`/api/maintenance/${id}/start`),
    resolve: (id) => api.post(`/api/maintenance/${id}/resolve`)
  },

  // === Audit & Inventory Verifications APIs ===
  audits: {
    listCycles: () => api.get('/api/audit-cycles'),
    createCycle: (data) => api.post('/api/audit-cycles', data),
    listItems: (cycleId) => api.get(`/api/audit-cycles/${cycleId}/items`),
    verifyItem: (itemId, data) => api.post(`/api/audit-items/${itemId}/verify`, data),
    discrepancies: (cycleId) => api.get(`/api/audit-cycles/${cycleId}/discrepancies`),
    closeCycle: (cycleId) => api.post(`/api/audit-cycles/${cycleId}/close`)
  },

  // === Real-time Notifications APIs ===
  notifications: {
    list: () => api.get('/api/notifications'),
    read: (id) => api.post(`/api/notifications/${id}/read`)
  },

  // === Audit Trail System Activity Logs APIs ===
  activityLogs: {
    list: () => api.get('/api/activity-logs')
  },

  // === Dashboard Metrics & Advanced Analytics APIs ===
  dashboard: {
    getStats: () => api.get('/api/dashboard/stats'),
    getUtilization: () => api.get('/api/dashboard/analytics/utilization'),
    getDepartments: () => api.get('/api/dashboard/analytics/departments'),
    getMaintenance: () => api.get('/api/dashboard/analytics/maintenance'),
    getHeatmap: () => api.get('/api/dashboard/analytics/bookings-heatmap')
  }
};

export default apiService;
