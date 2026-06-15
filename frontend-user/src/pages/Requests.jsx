import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaInbox, FaPaperPlane, FaCheck, FaTimes, FaStar, FaComment } from 'react-icons/fa';
import RequestService from '../services/requestService';
import ReviewService from '../services/reviewService';
import UserService from '../services/userService';
import useAuth from '../hooks/useAuth';

const Requests = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' or 'sent'
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // We will manage state manually
  const [tab, setTab] = useState('incoming');

  // Review state
  const [reviewingReq, setReviewingReq] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [incoming, sent] = await Promise.all([
        RequestService.getIncomingRequests(),
        RequestService.getMyRequests()
      ]);
      setIncomingRequests(incoming);
      setSentRequests(sent);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await RequestService.updateRequestStatus(id, status);
      toast.success(`Request ${status} successfully!`);
      fetchRequests(); // Refresh lists
      
      // Points are awarded upon completion, so we sync the global user context!
      if (status === 'completed' && updateUser) {
        const freshUser = await UserService.getProfile();
        updateUser(freshUser);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${status} request`);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewingReq) return;
    setSubmittingReview(true);
    try {
      // Determine reviewee (if I am the owner in 'incoming', reviewee is requester. if I am requester in 'sent', reviewee is owner)
      const isIncoming = tab === 'incoming';
      const reviewee_id = isIncoming ? reviewingReq.requester_id : reviewingReq.owner_id;

      await ReviewService.addReview({
        reviewee_id,
        waste_id: reviewingReq.waste_id,
        rating,
        comment
      });
      toast.success('Review submitted successfully!');
      setReviewingReq(null);
      setComment('');
      setRating(5);
      
      // Points are awarded for leaving a review, so sync context!
      if (updateUser) {
        const freshUser = await UserService.getProfile();
        updateUser(freshUser);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Pending</span>;
      case 'accepted': return <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>Accepted</span>;
      case 'rejected': return <span style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>Rejected</span>;
      case 'completed': return <span style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>Completed</span>;
      default: return <span>{status}</span>;
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--color-text-main)' }}>Manage Requests</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          onClick={() => setTab('incoming')}
          style={{ 
            background: 'none', border: 'none', padding: '1rem 2rem', fontSize: '1.1rem', cursor: 'pointer',
            color: tab === 'incoming' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: tab === 'incoming' ? '3px solid var(--color-primary)' : '3px solid transparent',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <FaInbox /> Received Requests
        </button>
        <button 
          onClick={() => setTab('sent')}
          style={{ 
            background: 'none', border: 'none', padding: '1rem 2rem', fontSize: '1.1rem', cursor: 'pointer',
            color: tab === 'sent' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: tab === 'sent' ? '3px solid var(--color-primary)' : '3px solid transparent',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <FaPaperPlane /> Sent Requests
        </button>
      </div>

      {loading ? (
        <p>Loading requests...</p>
      ) : (
        <div>
          {/* INCOMING REQUESTS TAB */}
          {tab === 'incoming' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              {incomingRequests.length === 0 ? (
                <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.2)' }}>
                  <FaInbox style={{ fontSize: '3rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>You have no incoming requests.</p>
                </div>
              ) : (
                incomingRequests.map(req => (
                  <div key={req.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-primary)' }}>{req.item_title}</h3>
                      <div style={{ fontSize: '0.9rem', padding: '0.3rem 0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '20px' }}>
                        {getStatusBadge(req.status)}
                      </div>
                    </div>
                    
                    <div style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
                      <div style={{ flex: '1 1 300px' }}>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Requested by <strong style={{ color: 'var(--color-text-main)' }}>{req.requester_name}</strong></p>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--color-secondary)' }}>
                          <p style={{ fontStyle: 'italic', fontSize: '0.95rem', margin: 0 }}>"{req.message}"</p>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', minWidth: '200px' }}>
                        {req.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleStatusUpdate(req.id, 'accepted')} className="btn btn-primary" style={{ flex: 1, padding: '0.6rem' }}>
                              <FaCheck /> Accept
                            </button>
                            <button onClick={() => handleStatusUpdate(req.id, 'rejected')} className="btn" style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', border: '1px solid rgba(239,68,68,0.3)', padding: '0.6rem' }}>
                              <FaTimes /> Reject
                            </button>
                          </div>
                        )}

                        {req.status === 'accepted' && (
                          <>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>Contact Phone</p>
                              <p style={{ fontWeight: 'bold', margin: '0.2rem 0 0 0' }}>{req.requester_phone}</p>
                            </div>
                            <button onClick={() => handleStatusUpdate(req.id, 'completed')} className="btn btn-primary" style={{ padding: '0.6rem' }}>
                              Mark as Completed
                            </button>
                          </>
                        )}

                        {req.status === 'completed' && (
                          <>
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid rgba(16,185,129,0.3)' }}>
                              <p style={{ fontSize: '0.85rem', color: 'var(--color-success)', margin: 0, fontWeight: 'bold' }}>Exchange Completed</p>
                              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>{req.requester_phone}</p>
                            </div>
                            <button onClick={() => setReviewingReq(req)} className="btn btn-primary" style={{ padding: '0.6rem' }}>
                              <FaStar /> Leave a Review
                            </button>
                          </>
                        )}

                        <button 
                          className="btn" 
                          onClick={() => navigate('/chat', { state: { startConversationWith: { user_id: req.requester_id, name: req.requester_name } } })}
                          style={{ padding: '0.6rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                          <FaComment /> Message Requester
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* SENT REQUESTS TAB */}
          {tab === 'sent' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              {sentRequests.length === 0 ? (
                <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.2)' }}>
                  <FaPaperPlane style={{ fontSize: '3rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>You haven't sent any requests.</p>
                </div>
              ) : (
                sentRequests.map(req => (
                  <div key={req.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-primary)' }}>{req.item_title}</h3>
                      <div style={{ fontSize: '0.9rem', padding: '0.3rem 0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '20px' }}>
                        {getStatusBadge(req.status)}
                      </div>
                    </div>
                    
                    <div style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
                      <div style={{ flex: '1 1 300px' }}>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Owner: <strong style={{ color: 'var(--color-text-main)' }}>{req.owner_name}</strong></p>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid rgba(255,255,255,0.2)' }}>
                          <p style={{ fontSize: '0.95rem', margin: 0, color: 'var(--color-text-muted)' }}>Your message: "{req.message}"</p>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', minWidth: '200px' }}>
                        {req.status === 'accepted' && (
                          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>Owner's Phone</p>
                            <p style={{ fontWeight: 'bold', margin: '0.2rem 0 0 0', color: 'var(--color-success)' }}>{req.owner_phone}</p>
                          </div>
                        )}

                        {req.status === 'completed' && (
                          <button onClick={() => setReviewingReq(req)} className="btn btn-primary" style={{ padding: '0.6rem' }}>
                            <FaStar /> Leave a Review
                          </button>
                        )}
                        
                        <button 
                          className="btn" 
                          onClick={() => navigate('/chat', { state: { startConversationWith: { user_id: req.owner_id, name: req.owner_name } } })}
                          style={{ padding: '0.6rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                          <FaComment /> Message Owner
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* REVIEW MODAL */}
      {reviewingReq && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem', backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaStar style={{ color: '#f59e0b' }} /> Leave a Review
            </h2>
            <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
              How was your experience with <strong style={{ color: 'var(--color-text-main)' }}>{tab === 'incoming' ? reviewingReq.requester_name : reviewingReq.owner_name}</strong>?
            </p>
            
            <form onSubmit={submitReview}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Rating</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <FaStar 
                      key={star} 
                      onClick={() => setRating(star)} 
                      style={{ 
                        cursor: 'pointer', 
                        fontSize: '2.5rem', 
                        color: star <= rating ? '#f59e0b' : 'rgba(255,255,255,0.1)',
                        transition: 'color 0.2s ease'
                      }} 
                    />
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Comment</label>
                <textarea 
                  className="form-input" 
                  rows="4" 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience (e.g., 'Very polite and on time!')"
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
                <button type="button" onClick={() => setReviewingReq(null)} className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
