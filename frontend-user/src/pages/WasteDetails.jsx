import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaTag, FaInfoCircle, FaArrowLeft, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCreditCard, FaComment } from 'react-icons/fa';
import WasteService from '../services/wasteService';
import RequestService from '../services/requestService';
import useAuth from '../hooks/useAuth';

const WasteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await WasteService.getWasteById(id);
        setItem(data);
      } catch (error) {
        toast.error('Failed to load item details');
        navigate('/marketplace');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!message.trim()) return toast.error('Please add a message');
    
    setIsSubmitting(true);
    try {
      await RequestService.createRequest({ waste_id: id, message });
      toast.success('Request sent successfully! You will be notified when the owner responds.');
      navigate('/requests');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading details...</div>;
  if (!item) return null;

  const imageUrl = item.image_url 
    ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${item.image_url}` 
    : 'https://placehold.co/600x400?text=No+Image';

  const isOwner = item.user_id === user.id;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1rem' }}
      >
        <FaArrowLeft /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Left Side: Image */}
        <div className="glass-panel" style={{ overflow: 'hidden', height: 'fit-content' }}>
          <img src={imageUrl} alt={item.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
        </div>

        {/* Right Side: Details & Request Form */}
        <div>
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h1 style={{ fontSize: '2rem', color: 'var(--color-text-main)' }}>{item.title}</h1>
              <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: item.price == 0 ? 'var(--color-primary)' : 'inherit' }}>
                {item.price == 0 ? 'FREE' : `₹${item.price}`}
              </span>
            </div>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
              {item.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <span className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaTag style={{ color: 'var(--color-secondary)' }} /> {item.category}
              </span>
              <span className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaInfoCircle style={{ color: 'var(--color-secondary)' }} /> Condition: {item.item_condition}
              </span>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Listed By</h3>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {item.owner_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                    <FaUser /> {item.owner_name}
                  </div>
                  {/* Phone number is intentionally hidden until request is accepted in a real app, but shown here for demo */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                    <FaPhone /> {item.owner_phone || 'Hidden'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                    <FaEnvelope /> {item.owner_email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                    <FaMapMarkerAlt /> {item.owner_address || 'Address not provided'}
                  </div>
                  {item.price > 0 && item.owner_upi_id && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 'bold' }}>
                      <FaCreditCard /> UPI: {item.owner_upi_id}
                    </div>
                  )}

                  {!isOwner && (
                    <button 
                      className="btn" 
                      onClick={() => navigate('/chat', { state: { startConversationWith: { user_id: item.user_id, name: item.owner_name } } })}
                      style={{ marginTop: '1rem', padding: '0.5rem 1rem', width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)' }}
                    >
                      <FaComment /> Message Owner
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Request Form (Only if not owner and item is available) */}
          {!isOwner && item.status === 'available' && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Interested? Send a Request</h3>
              <form onSubmit={handleRequest}>
                <div className="form-group">
                  <textarea 
                    className="form-input" 
                    rows="3" 
                    placeholder="Hi, I would like to exchange/pick up this item..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </button>
              </form>
            </div>
          )}

          {!isOwner && item.status !== 'available' && (
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <p style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>This item is currently {item.status} and cannot be requested.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WasteDetails;
