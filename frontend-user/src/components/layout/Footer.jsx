import React from 'react';

const Footer = () => {
  return (
    <footer style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: 'auto' }}>
      <p>&copy; {new Date().getFullYear()} EcoLoop - Smart Waste Exchange & Management System. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
