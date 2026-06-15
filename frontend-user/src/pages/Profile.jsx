import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaEnvelope, FaMapMarkerAlt, FaPhone, FaLeaf } from 'react-icons/fa';
import UserService from '../services/userService';
import QRCodeCard from '../components/QRCodeCard';
import useAuth from '../hooks/useAuth';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const { updateUser } = useAuth();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await UserService.getProfile();
        setProfile(data);
        if (updateUser) updateUser(data); // Sync global context for Navbar
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [updateUser]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;
  }

  if (!profile) {
    return <div className="error-text" style={{ padding: '2rem', textAlign: 'center' }}>Failed to load profile.</div>;
  }

  // Construct absolute URL for profile image if it exists
  const profileImageUrl = profile.profile_image 
    ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${profile.profile_image}`
    : 'https://placehold.co/150x150?text=No+Image';

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header Profile Section */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <img 
          src={profileImageUrl} 
          alt="Profile" 
          style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--color-primary)' }} 
        />
        
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{profile.name}</h1>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaEnvelope /> {profile.email}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaPhone /> {profile.phone || 'No phone added'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaMapMarkerAlt /> {profile.address || 'No address added'}</span>
          </div>
        </div>

        <div>
          <Link to="/profile/edit" className="btn btn-primary" style={{ width: 'auto' }}>
            <FaEdit /> Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        
        {/* Green Points Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <FaLeaf style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{profile.points || 0}</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Green Points Earned</p>
        </div>

        {/* You can add more stats cards here later (e.g. Total Exchanges) */}
        
      </div>

      {/* QR Code Section */}
      <QRCodeCard upiId={profile.upi_id} />

    </div>
  );
};

export default Profile;
