import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ReviewService from '../services/reviewService';
import ReviewCard from '../components/ReviewCard';
import useAuth from '../hooks/useAuth';
import { FaStar } from 'react-icons/fa';

const Reviews = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'given'
  const [receivedReviews, setReceivedReviews] = useState([]);
  const [givenReviews, setGivenReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        const [received, given, statsData] = await Promise.all([
          ReviewService.getReviews(user.id),
          ReviewService.getGivenReviews(user.id),
          ReviewService.getUserRating(user.id)
        ]);
        setReceivedReviews(received);
        setGivenReviews(given);
        setStats(statsData);
      } catch (error) {
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.id) {
      fetchReviewsData();
    }
  }, [user]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading reviews...</div>;
  }

  const averageRating = stats?.average_rating ? parseFloat(stats.average_rating).toFixed(1) : '0.0';
  const totalReviews = stats?.total_reviews || 0;

  const currentReviews = activeTab === 'received' ? receivedReviews : givenReviews;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--color-text-main)' }}>My Reviews</h1>
      
      {/* Overview Stats */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {averageRating} <FaStar style={{ color: '#f59e0b', fontSize: '2.5rem' }} />
          </div>
          <div style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
            Based on {totalReviews} review{totalReviews !== 1 && 's'} received
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('received')}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem',
            padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)',
            fontWeight: activeTab === 'received' ? 'bold' : 'normal',
            color: activeTab === 'received' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            backgroundColor: activeTab === 'received' ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
          }}
        >
          Reviews Received
        </button>
        <button 
          onClick={() => setActiveTab('given')}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem',
            padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)',
            fontWeight: activeTab === 'given' ? 'bold' : 'normal',
            color: activeTab === 'given' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            backgroundColor: activeTab === 'given' ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
          }}
        >
          Reviews Given
        </button>
      </div>

      {/* Review List */}
      <div>
        {currentReviews.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>
              {activeTab === 'received' ? "You haven't received any reviews yet." : "You haven't written any reviews yet."}
            </p>
          </div>
        ) : (
          currentReviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
