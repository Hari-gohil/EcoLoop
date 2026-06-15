import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaBan, FaTrash } from 'react-icons/fa';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      const data = await adminService.getUserDetails(id);
      setUser(data);
    } catch (error) {
      toast.error('Failed to load user details');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async () => {
    if (!window.confirm(`Are you sure you want to ${user.is_blocked ? 'unblock' : 'block'} this user?`)) return;
    try {
      await adminService.toggleBlockStatus(user.id, !user.is_blocked);
      toast.success(`User ${user.is_blocked ? 'unblocked' : 'blocked'} successfully`);
      fetchUserDetails(); // refresh data
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('CRITICAL: Are you sure you want to completely delete this user? This cannot be undone.')) return;
    try {
      await adminService.deleteUser(user.id);
      toast.success('User deleted successfully');
      navigate('/users');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  if (loading) return <div className="text-slate-500 text-center py-12">Loading detailed profile...</div>;
  if (!user) return null;

  return (
    <div>
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/users')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <FaArrowLeft /> Back to Users
        </button>

        {user.role !== 'admin' && (
          <div className="flex gap-3">
            <button 
              onClick={handleToggleBlock}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${user.is_blocked ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'}`}
            >
              <FaBan /> {user.is_blocked ? 'Unblock User' : 'Block User'}
            </button>
            <button 
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg font-medium transition-colors"
            >
              <FaTrash /> Delete Account
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-800">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl font-bold mb-4 relative">
                {user.name.charAt(0).toUpperCase()}
                {user.is_blocked && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-red-500 text-lg">
                    <FaBan />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
              <p className="text-slate-400 mb-3">{user.role}</p>
              <div className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-bold inline-flex items-center gap-2">
                {user.points} EcoPoints
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <div className="flex items-start gap-3 text-slate-300">
                <FaEnvelope className="mt-1 text-slate-500" />
                <div className="break-all">{user.email}</div>
              </div>
              <div className="flex items-start gap-3 text-slate-300">
                <FaPhoneAlt className="mt-1 text-slate-500" />
                <div>{user.phone || <span className="text-slate-600 italic">Not provided</span>}</div>
              </div>
              <div className="flex items-start gap-3 text-slate-300">
                <FaMapMarkerAlt className="mt-1 text-slate-500" />
                <div>{user.address || <span className="text-slate-600 italic">Not provided</span>}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Waste Items Grid */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm min-h-full">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-4">
              Listed Waste Items ({user.wasteItems?.length || 0})
            </h3>
            
            {user.wasteItems?.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                This user has not listed any items yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.wasteItems?.map(item => (
                  <div key={item.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white truncate pr-2">{item.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0
                        ${item.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' : 
                          item.status === 'exchanged' ? 'bg-purple-500/20 text-purple-400' : 
                          'bg-slate-700 text-slate-300'}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">
                      {item.description}
                    </p>
                    
                    <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-700/50">
                      <span className="text-slate-300 bg-slate-700/50 px-2 py-1 rounded">{item.category}</span>
                      <span className="font-bold text-emerald-400">₹{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
