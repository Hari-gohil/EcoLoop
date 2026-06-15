import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import AuthService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Setup global axios interceptor synchronously
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          AuthService.logout();
          setUser(null);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        
        // If the object lacks a token, it's corrupted from the previous bug. Force logout!
        if (!parsed.token) {
          localStorage.removeItem('user');
          setUser(null);
          setLoading(false);
          window.location.href = '/login';
          return;
        }

        setUser(parsed.user || parsed); // Set initial cache
        
        // Fetch fresh data in background to sync green points & updates
        try {
          const { default: UserService } = await import('../services/userService');
          const freshUser = await UserService.getProfile();
          const updatedUser = { ...freshUser, token: parsed.token };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (e) {
          console.error('Failed to sync profile on load', e);
        }
      }
      setLoading(false);
    };
    checkUserLoggedIn();
  }, []);

  const login = async (userData) => {
    const data = await AuthService.login(userData);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await AuthService.register(userData);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const updateUser = (newUserData) => {
    const existing = JSON.parse(localStorage.getItem('user')) || {};
    const updatedUser = { ...newUserData, token: existing.token };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // The value provided to children
  const contextValue = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    setUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
