import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // State to toggle between Signup and Login (defaults to Sign Up first!)
  const [isSignUp, setIsSignUp] = useState(true);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee'); // Admin, Asset Manager, Department Head, Employee

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isSignUp) {
        // Register dynamically and login
        await signup(fullName, email, password, role);
      } else {
        // Sign in using standard credentials
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to load specific demo accounts
  const loadDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsSignUp(false); // Switch to sign-in view
    setError('');
  };

  return (
    <div className="login-bg-wire">
      <div className="login-card-wire bg-white" style={{ maxWidth: '420px', padding: '2.5rem' }}>
        
        {/* Logo Icon Header */}
        <div className="text-center mb-4">
          <div 
            className="text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold mb-3 shadow-sm" 
            style={{ width: '48px', height: '48px', backgroundColor: 'var(--erp-primary)', fontSize: '1.2rem' }}
          >
            AF
          </div>
          <h4 className="fw-bold text-dark mb-1">AssetFlow</h4>
          <p className="text-muted small">{isSignUp ? 'Create enterprise workspace profile' : 'Sign in to your ERP dashboard'}</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 small border-0 text-center mb-3" style={{ fontSize: '0.8rem', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Sign Up Fields only */}
          {isSignUp && (
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted mb-1">Full Name</label>
              <input 
                type="text" 
                className="form-control form-control-erp border" 
                placeholder="e.g. Arjen Dev" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted mb-1">Email Address</label>
            <input 
              type="email" 
              className="form-control form-control-erp border" 
              placeholder="e.g. employee@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted mb-1">Password</label>
            <input 
              type="password" 
              className="form-control form-control-erp border" 
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* User Role select dropdown (visible on Signup only) */}
          {isSignUp && (
            <div className="mb-4">
              <label className="form-label small fw-semibold text-muted mb-1">Select Role Profile</label>
              <select 
                className="form-select form-control-erp border"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Admin">Admin</option>
                <option value="Asset Manager">Asset Manager</option>
                <option value="Department Head">Department Head</option>
                <option value="Employee">Employee</option>
              </select>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-wire w-100 py-2 mb-3" 
            disabled={submitting}
          >
            {submitting ? 'Processing...' : isSignUp ? 'Create Account & Sign In' : 'Sign In'}
          </button>
        </form>

        {/* Form Toggle Options */}
        <div className="text-center mb-3">
          {isSignUp ? (
            <span className="small text-muted">
              Already have an account?{' '}
              <button 
                type="button" 
                className="btn btn-link btn-sm p-0 text-decoration-none fw-bold" 
                style={{ color: 'var(--erp-primary)' }}
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span className="small text-muted">
              Don't have an account?{' '}
              <button 
                type="button" 
                className="btn btn-link btn-sm p-0 text-decoration-none fw-bold" 
                style={{ color: 'var(--erp-primary)' }}
                onClick={() => setIsSignUp(true)}
              >
                Register / Sign Up
              </button>
            </span>
          )}
        </div>

        {/* Demo Account Credentials Quick Loader */}
        <div className="border-top pt-3">
          <span className="small text-muted d-block mb-2 text-center fw-semibold">Load Default Roles Credentials:</span>
          <div className="d-grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <button 
              type="button" 
              className="btn btn-xs btn-outline-secondary py-1 text-start" 
              style={{ fontSize: '0.725rem' }}
              onClick={() => loadDemoAccount('admin@company.com', 'admin123')}
            >
              <i className="bi bi-shield-lock me-1"></i> Admin
            </button>
            <button 
              type="button" 
              className="btn btn-xs btn-outline-secondary py-1 text-start" 
              style={{ fontSize: '0.725rem' }}
              onClick={() => loadDemoAccount('manager@company.com', 'manager123')}
            >
              <i className="bi bi-box me-1"></i> Asset Mgr
            </button>
            <button 
              type="button" 
              className="btn btn-xs btn-outline-secondary py-1 text-start" 
              style={{ fontSize: '0.725rem' }}
              onClick={() => loadDemoAccount('head@company.com', 'head123')}
            >
              <i className="bi bi-people me-1"></i> Dept Head
            </button>
            <button 
              type="button" 
              className="btn btn-xs btn-outline-secondary py-1 text-start" 
              style={{ fontSize: '0.725rem' }}
              onClick={() => loadDemoAccount('employee@company.com', 'employee123')}
            >
              <i className="bi bi-person me-1"></i> Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
