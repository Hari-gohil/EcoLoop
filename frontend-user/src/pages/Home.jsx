import React from 'react';
import { Link } from 'react-router-dom';
import { FaRecycle, FaBoxOpen, FaHandshake } from 'react-icons/fa';

const Home = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Hero Section */}
      <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Smart Waste Exchange & Management
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          Join the circular economy. Trade, donate, and recycle your waste materials to earn Green Points and save the planet.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/marketplace" className="btn btn-primary" style={{ width: 'auto' }}>Browse Marketplace</Link>
          <Link to="/add-waste" className="btn glass-panel" style={{ width: 'auto', background: 'rgba(255,255,255,0.05)' }}>List an Item</Link>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <FaRecycle style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Earn Green Points</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Every time you donate or exchange recyclable materials, you earn points towards your profile reputation.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <FaBoxOpen style={{ fontSize: '3rem', color: 'var(--color-secondary)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>List Your Waste</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Got old electronics, plastic bottles, or metal scraps? List them easily with a photo and connect with buyers.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <FaHandshake style={{ fontSize: '3rem', color: '#f59e0b', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Community Driven</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Chat directly with other users, exchange items safely, and build a sustainable local community.</p>
        </div>

      </div>

    </div>
  );
};

export default Home;
