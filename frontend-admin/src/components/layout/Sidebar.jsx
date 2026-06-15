import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaTrashAlt, FaTimes, FaChartPie, FaBoxOpen, FaStar, FaTags } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:h-screen`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            EcoLoop Admin
          </h2>
          <button onClick={closeSidebar} className="md:hidden text-slate-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link 
            to="/dashboard" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/dashboard') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FaHome /> Dashboard
          </Link>
          <Link 
            to="/users" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/users') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FaUsers /> Users
          </Link>
          <Link 
            to="/waste-items" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/waste-items') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FaTrashAlt /> Waste Items
          </Link>
          <Link 
            to="/charts" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/charts') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FaChartPie /> Charts
          </Link>
          <Link 
            to="/reports" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/reports') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FaBoxOpen /> Reports
          </Link>
          <Link 
            to="/feedbacks" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/feedbacks') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FaStar /> Feedbacks
          </Link>
          <Link 
            to="/categories" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/categories') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FaTags /> Categories
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors font-medium"
          >
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
