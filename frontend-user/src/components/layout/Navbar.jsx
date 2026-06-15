import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaBars, FaSun, FaMoon } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar glass-panel">
      <div className="navbar-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Mobile Hamburger Menu */}
        <button 
          className="btn" 
          onClick={toggleSidebar}
          style={{ 
            background: 'transparent', color: 'var(--color-text-main)', 
            padding: '0.5rem', width: 'auto', display: 'none' // hidden by default, shown via media query normally, but we can do it inline or just let it show on mobile
          }}
          id="mobile-menu-btn"
        >
          <FaBars size={20} />
        </button>
        <style>{`
          @media (min-width: 769px) {
            #mobile-menu-btn { display: none !important; }
          }
          @media (max-width: 768px) {
            #mobile-menu-btn { display: flex !important; }
          }
        `}</style>
      </div>

      <div className="navbar-user">
        <button onClick={toggleTheme} className="btn" style={{ background: 'transparent', padding: '0.5rem', width: 'auto', color: 'var(--color-text-main)' }}>
          {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>

        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.15)', padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid rgba(16,185,129,0.3)', textDecoration: 'none', marginLeft: '1rem', transition: 'all 0.2s ease' }}>
          <FaLeaf style={{ color: '#10b981' }} />
          <span style={{ fontWeight: 'bold', color: '#10b981', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{user?.points || 0} Green Points</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--color-border)' }}>
          <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: '0.9rem' }}>{user?.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
