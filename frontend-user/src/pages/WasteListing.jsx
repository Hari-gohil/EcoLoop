import React, { useState, useEffect } from 'react';
import WasteService from '../services/wasteService';
import WasteCard from '../components/WasteCard';
import useAuth from '../hooks/useAuth';

const WasteListing = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await WasteService.getAllWaste();
        // Show only available items that don't belong to the current user
        const availableItems = data.filter(item => item.status === 'available' && item.user_id !== user.id);
        setItems(availableItems);
      } catch (error) {
        console.error('Failed to fetch waste items', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [user.id]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--color-text-main)' }}>Community Marketplace</h1>
      
      {loading ? (
        <p>Loading available items...</p>
      ) : items.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>No items available in the marketplace right now.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {items.map(item => (
            <WasteCard key={item.id} item={item} isOwner={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WasteListing;
