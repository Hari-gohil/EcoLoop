import React from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewCard = ({ review }) => {
  // review expects: { reviewer_name, rating, comment, created_at }
  
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          style={{ color: i <= rating ? '#f59e0b' : 'rgba(255,255,255,0.2)' }} 
        />
      );
    }
    return stars;
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '50%', 
            background: 'var(--color-primary)', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', 
            fontWeight: 'bold', fontSize: '1.2rem' 
          }}>
            {review.reviewer_name ? review.reviewer_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h4 style={{ margin: 0 }}>{review.reviewer_name || 'User'}</h4>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {new Date(review.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          {renderStars(review.rating)}
        </div>
      </div>
      <p style={{ color: 'var(--color-text-main)', lineHeight: '1.5', margin: 0 }}>
        "{review.comment}"
      </p>
    </div>
  );
};

export default ReviewCard;
