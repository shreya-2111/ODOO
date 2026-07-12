import axios from 'axios';

// Base Axios Configuration for future backend integrations
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.assetflow.internal/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor for appending Bearer Tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('assetflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for uniform error catching & auth redirections
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('AssetFlow API Error Logged:', error.response || error.message);
    
    // Simulate global handlers (e.g. redirect on 401 unauthorized)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('assetflow_token');
      localStorage.removeItem('assetflow_user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
