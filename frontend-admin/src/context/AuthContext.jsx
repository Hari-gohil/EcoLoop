import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();
const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.role === 'admin') {
            setAdmin(response.data);
          } else {
            // Not an admin
            localStorage.removeItem('adminToken');
          }
        } catch (error) {
          localStorage.removeItem('adminToken');
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      
      if (response.data.user.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        return false;
      }

      localStorage.setItem('adminToken', response.data.token);
      setAdmin(response.data.user);
      toast.success('Admin Login Successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const registerAdmin = async (name, email, password, adminSecret) => {
    try {
      const response = await axios.post(`${API_URL}/register-admin`, {
        name, email, password, adminSecret
      });
      localStorage.setItem('adminToken', response.data.token);
      setAdmin(response.data.user);
      toast.success('Admin Registration Successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, registerAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
