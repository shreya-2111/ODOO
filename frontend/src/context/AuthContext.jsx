import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api';

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

  const login = async (email, password) => {
    try {
      const res = await apiService.auth.login({ email, password });
      const { access_token, user: dbUser } = res.data;
      
      const userData = {
        id: dbUser.id,
        username: dbUser.email.split('@')[0],
        fullName: dbUser.full_name,
        email: dbUser.email,
        role: dbUser.role.name,
        permissions: dbUser.role.name === 'Super Admin' || dbUser.role.name === 'Admin' ? ['all'] : ['read']
      };

      
      setUser(userData);
      localStorage.setItem('assetflow_user', JSON.stringify(userData));
      localStorage.setItem('assetflow_token', access_token);
      return { success: true };
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Incorrect email or password.');
    }
  };

  const signup = async (fullName, email, password, role) => {
    try {
      // 1. Post signup data to register in MySQL database
      await apiService.auth.signup({
        email,
        password,
        full_name: fullName,
        role
      });
      
      // 2. Perform login query to set authorization bearer headers
      return await login(email, password);
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Registration failed. Please check inputs.');
    }
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
