import React from 'react';
import { Link } from 'react-router-dom';
import { FaTag, FaInfoCircle } from 'react-icons/fa';

const WasteCard = ({ item, isOwner = false, onDelete }) => {
  const imageUrl = item.image_url 
    ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${item.image_url}` 
    : 'https://placehold.co/300x300?text=No+Image';

  // Badge Color logic based on status
  const getStatusBadge = (status) => {
    switch(status) {
      case 'available': return <span style={{ background: 'var(--color-success)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem' }}>Available</span>;
      case 'pending': return <span style={{ background: '#f59e0b', color: 'white', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem' }}>Pending</span>;
      case 'exchanged': return <span style={{ background: 'var(--color-text-muted)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem' }}>Exchanged</span>;
      default: return null;
    }
  };

  return (
    <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <img 
        src={imageUrl} 
        alt={item.title} 
        style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
      />
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{item.title}</h3>
          {getStatusBadge(item.status)}
        </div>
        
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem', flex: 1 }}>
          {item.description.length > 80 ? `${item.description.substring(0, 80)}...` : item.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-secondary)' }}>
            <FaTag /> {item.category}
          </span>
          <span style={{ fontWeight: 'bold', color: item.price == 0 ? 'var(--color-primary)' : 'inherit' }}>
            {item.price == 0 ? 'FREE' : `₹${item.price}`}
          </span>
        </div>

        {/* Action Buttons */}
        {isOwner ? (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link to={`/waste/${item.id}`} className="btn" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem', background: 'var(--color-surface)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}>View</Link>
            <Link to={`/waste/edit/${item.id}`} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}>Edit</Link>
            <button onClick={() => onDelete(item.id)} className="btn" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem', background: 'var(--color-danger)', color: 'white' }}>Delete</button>
          </div>
        ) : (
          <Link to={`/waste/${item.id}`} className="btn btn-primary">
            <FaInfoCircle /> View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default WasteCard;
