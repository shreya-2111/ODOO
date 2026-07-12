import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OrganizationSetup from './pages/OrganizationSetup';
import AssetDirectory from './pages/AssetDirectory';
import AssetAllocation from './pages/AssetAllocation';
import ResourceBooking from './pages/ResourceBooking';
import Maintenance from './pages/Maintenance';
import Audit from './pages/Audit';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';

// Layout Component
import AppLayout from './components/layout/AppLayout';

// Protected Route Guard
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading session...</span>
          </div>
          <p className="mt-3 text-muted">Securing AssetFlow Connection...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Authenticated ERP Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </PrivateRoute>
            } />
            <Route path="/organization" element={
              <PrivateRoute>
                <AppLayout>
                  <OrganizationSetup />
                </AppLayout>
              </PrivateRoute>
            } />
            <Route path="/directory" element={
              <PrivateRoute>
                <AppLayout>
                  <AssetDirectory />
                </AppLayout>
              </PrivateRoute>
            } />
            <Route path="/allocation" element={
              <PrivateRoute>
                <AppLayout>
                  <AssetAllocation />
                </AppLayout>
              </PrivateRoute>
            } />
            <Route path="/booking" element={
              <PrivateRoute>
                <AppLayout>
                  <ResourceBooking />
                </AppLayout>
              </PrivateRoute>
            } />
            <Route path="/maintenance" element={
              <PrivateRoute>
                <AppLayout>
                  <Maintenance />
                </AppLayout>
              </PrivateRoute>
            } />
            <Route path="/audit" element={
              <PrivateRoute>
                <AppLayout>
                  <Audit />
                </AppLayout>
              </PrivateRoute>
            } />
            <Route path="/reports" element={
              <PrivateRoute>
                <AppLayout>
                  <Reports />
                </AppLayout>
              </PrivateRoute>
            } />
            <Route path="/notifications" element={
              <PrivateRoute>
                <AppLayout>
                  <Notifications />
                </AppLayout>
              </PrivateRoute>
            } />

            {/* Default Route Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
