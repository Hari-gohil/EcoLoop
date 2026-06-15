import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import WasteService from '../services/wasteService';
import WasteCard from '../components/WasteCard';
import useAuth from '../hooks/useAuth';
import { FaPlus } from 'react-icons/fa';

const MyListings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchItems = async () => {
    try {
      const data = await WasteService.getAllWaste();
      // Filter to show ONLY current user's items
      const myItems = data.filter(item => item.user_id === user.id);
      setItems(myItems);
    } catch (error) {
      console.error('Failed to fetch my items', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user.id]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await WasteService.deleteWaste(id);
        toast.success('Listing deleted successfully');
        // Refresh items
        fetchItems();
      } catch (error) {
        toast.error('Failed to delete listing');
      }
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--color-text-main)' }}>My Waste Listings</h1>
        <Link to="/add-waste" className="btn btn-primary" style={{ width: 'auto' }}>
          <FaPlus /> Add New Item
        </Link>
      </div>
      
      {loading ? (
        <p>Loading your items...</p>
      ) : items.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '1rem' }}>You haven't listed any items yet.</p>
          <Link to="/add-waste" className="btn btn-primary" style={{ width: 'auto' }}>List an Item Now</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {items.map(item => (
            <WasteCard key={item.id} item={item} isOwner={true} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
