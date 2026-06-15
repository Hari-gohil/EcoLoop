import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaStore, FaListUl, FaPlusSquare, FaUserAlt, FaEnvelope, FaBell, FaStar, FaTimes } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
    { name: 'Marketplace', path: '/marketplace', icon: <FaStore /> },
    { name: 'My Listings', path: '/my-listings', icon: <FaListUl /> },
    { name: 'Add Waste', path: '/add-waste', icon: <FaPlusSquare /> },
    { name: 'My Profile', path: '/profile', icon: <FaUserAlt /> },
    { name: 'Requests', path: '/requests', icon: <FaEnvelope /> },
    { name: 'My Reviews', path: '/reviews', icon: <FaStar /> },
    { name: 'Messages', path: '/chat', icon: <FaEnvelope /> },
  ];

  return (
    <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>EcoLoop</h2>
        {/* Close Button on Mobile */}
        <button 
          className="btn" 
          onClick={closeSidebar}
          style={{ background: 'transparent', color: 'var(--color-text-main)', padding: '0.5rem', width: 'auto' }}
          id="mobile-close-btn"
        >
          <FaTimes size={20} />
        </button>
        <style>{`
          @media (min-width: 769px) {
            #mobile-close-btn { display: none !important; }
          }
        `}</style>
      </div>
      <nav className="sidebar-nav">
        {navLinks.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              {link.icon} <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={logout} className="btn btn-primary" style={{ background: 'var(--color-surface)', color: 'var(--color-text-main)', border: '1px solid rgba(255,255,255,0.1)' }}>
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
