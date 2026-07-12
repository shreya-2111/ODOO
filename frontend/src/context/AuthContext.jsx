import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if session exists in localStorage
    const savedUser = localStorage.getItem('assetflow_user');
    const savedToken = localStorage.getItem('assetflow_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const lowerUser = username.toLowerCase();
    
    // 1. Admin
    if (lowerUser === 'admin@company.com' || lowerUser === 'admin') {
      if (password !== 'admin123') throw new Error('Incorrect password.');
      const userData = {
        id: 'USR-01',
        username: 'admin',
        fullName: 'Sumit Administrator',
        email: 'admin@company.com',
        role: 'Admin',
        permissions: ['all']
      };
      setUser(userData);
      localStorage.setItem('assetflow_user', JSON.stringify(userData));
      localStorage.setItem('assetflow_token', 'mock-jwt-admin');
      return { success: true };
    }
    
    // 2. Asset Manager
    if (lowerUser === 'manager@company.com' || lowerUser === 'manager') {
      if (password !== 'manager123') throw new Error('Incorrect password.');
      const userData = {
        id: 'USR-02',
        username: 'manager',
        fullName: 'Sarah Jenkins',
        email: 'manager@company.com',
        role: 'Asset Manager',
        permissions: ['read', 'write', 'allocate', 'audit']
      };
      setUser(userData);
      localStorage.setItem('assetflow_user', JSON.stringify(userData));
      localStorage.setItem('assetflow_token', 'mock-jwt-manager');
      return { success: true };
    }
    
    // 3. Department Head
    if (lowerUser === 'head@company.com' || lowerUser === 'head') {
      if (password !== 'head123') throw new Error('Incorrect password.');
      const userData = {
        id: 'USR-03',
        username: 'head',
        fullName: 'Marcus Vance',
        email: 'head@company.com',
        role: 'Department Head',
        permissions: ['read', 'booking']
      };
      setUser(userData);
      localStorage.setItem('assetflow_user', JSON.stringify(userData));
      localStorage.setItem('assetflow_token', 'mock-jwt-head');
      return { success: true };
    }
    
    // 4. Employee
    if (lowerUser === 'employee@company.com' || lowerUser === 'employee') {
      if (password !== 'employee123') throw new Error('Incorrect password.');
      const userData = {
        id: 'USR-04',
        username: 'employee',
        fullName: 'Arjen Dev',
        email: 'employee@company.com',
        role: 'Employee',
        permissions: ['read', 'booking', 'maintenance']
      };
      setUser(userData);
      localStorage.setItem('assetflow_user', JSON.stringify(userData));
      localStorage.setItem('assetflow_token', 'mock-jwt-employee');
      return { success: true };
    }

    throw new Error('Invalid email or password. Select a demo account below.');
  };

  const signup = async (fullName, email, password, role) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Create session for signed up user
    const userData = {
      id: `USR-${Date.now()}`,
      username: email.split('@')[0],
      fullName: fullName,
      email: email,
      role: role, // Admin, Asset Manager, Department Head, Employee
      permissions: role === 'Admin' ? ['all'] : role === 'Asset Manager' ? ['read', 'write', 'allocate'] : ['read']
    };

    setUser(userData);
    localStorage.setItem('assetflow_user', JSON.stringify(userData));
    localStorage.setItem('assetflow_token', `mock-jwt-signup-${Date.now()}`);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('assetflow_user');
    localStorage.removeItem('assetflow_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
