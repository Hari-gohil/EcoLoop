import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserDetails from './pages/UserDetails';
import WasteManagement from './pages/WasteManagement';
import Charts from './pages/Charts';
import Reports from './pages/Reports';
import Feedbacks from './pages/Feedbacks';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

import AdminLayout from './components/layout/AdminLayout';

// Protected Route Component
const AdminRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-emerald-500">Loading...</div>;
  if (!admin) return <Navigate to="/login" />;
  
  return <AdminLayout>{children}</AdminLayout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
      <Route path="/users/:id" element={<AdminRoute><UserDetails /></AdminRoute>} />
      <Route path="/waste-items" element={<AdminRoute><WasteManagement /></AdminRoute>} />
      <Route path="/charts" element={<AdminRoute><Charts /></AdminRoute>} />
      <Route path="/reports" element={<AdminRoute><Reports /></AdminRoute>} />
      <Route path="/feedbacks" element={<AdminRoute><Feedbacks /></AdminRoute>} />
      <Route path="/categories" element={<AdminRoute><Categories /></AdminRoute>} />
      <Route path="/profile" element={<AdminRoute><Profile /></AdminRoute>} />
      <Route path="/edit-profile" element={<AdminRoute><EditProfile /></AdminRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
