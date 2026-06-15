import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import Home from '../pages/Home';
import WasteListing from '../pages/WasteListing';
import MyListings from '../pages/MyListings';
import AddWaste from '../pages/AddWaste';
import WasteDetails from '../pages/WasteDetails';
import EditWaste from '../pages/EditWaste';
import Requests from '../pages/Requests';
import Reviews from '../pages/Reviews';
import Chat from '../pages/Chat';
import useAuth from '../hooks/useAuth';

// Protected Route Component to restrict access
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/marketplace" 
        element={
          <ProtectedRoute>
            <WasteListing />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-listings" 
        element={
          <ProtectedRoute>
            <MyListings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/add-waste" 
        element={
          <ProtectedRoute>
            <AddWaste />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/waste/edit/:id" 
        element={
          <ProtectedRoute>
            <EditWaste />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/waste/:id" 
        element={
          <ProtectedRoute>
            <WasteDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/requests" 
        element={
          <ProtectedRoute>
            <Requests />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reviews" 
        element={
          <ProtectedRoute>
            <Reviews />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile/edit" 
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback routing */}
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
