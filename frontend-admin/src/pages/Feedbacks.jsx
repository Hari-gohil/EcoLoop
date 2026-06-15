import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import { toast } from 'react-hot-toast';
import { FaTrash, FaStar, FaQuoteLeft, FaArrowRight } from 'react-icons/fa';

const Feedbacks = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await adminService.getAllReviews();
      setReviews(data);
    } catch (error) {
      toast.error('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('CRITICAL: Are you sure you want to completely delete this review?')) return;

    try {
      await adminService.deleteReview(id);
      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  // Helper for rendering star ratings
  const renderStars = (rating) => {
    return (
      <div className="flex items-center text-yellow-400 text-sm">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className={i < rating ? 'text-yellow-400' : 'text-slate-600'} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Platform Feedbacks & Reviews</h1>
        <div className="bg-slate-800 px-4 py-2 rounded-lg text-sm text-slate-300">
          Total Reviews: <span className="font-bold text-emerald-400">{reviews.length}</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-950/50 text-slate-400 text-sm border-b border-slate-800">
                <th className="p-4 font-medium w-1/4">Reviewer (Sender)</th>
                <th className="p-4 font-medium text-center w-10"></th>
                <th className="p-4 font-medium w-1/4">Reviewee (Receiver)</th>
                <th className="p-4 font-medium">Rating & Comment</th>
                <th className="p-4 font-medium text-right w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">Loading feedbacks...</td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">No feedbacks found.</td></tr>
              ) : (
                reviews.map(review => (
                  <tr key={review.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="text-slate-200 font-medium">{review.sender_name}</div>
                      <div className="text-xs text-slate-500">{review.sender_email}</div>
                    </td>
                    <td className="p-4 text-center text-slate-600">
                      <FaArrowRight className="inline" />
                    </td>
                    <td className="p-4">
                      <div className="text-slate-200 font-medium">{review.receiver_name}</div>
                      <div className="text-xs text-slate-500">{review.receiver_email}</div>
                      {review.waste_title && (
                         <div className="mt-1 text-xs text-emerald-500/80 line-clamp-1">Item: {review.waste_title}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="mb-2">{renderStars(review.rating)}</div>
                      <div className="text-sm text-slate-400 flex items-start gap-2">
                        <FaQuoteLeft className="text-slate-600 mt-1 shrink-0 text-xs" />
                        <span className="italic line-clamp-2" title={review.comment}>"{review.comment}"</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(review.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Review permanently"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Feedbacks;
