import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../services/adminService';
import { toast } from 'react-hot-toast';
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await adminService.getProfile();
        setProfile(data);
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-emerald-500 text-center py-20">Loading Profile...</div>;
  }

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <FaUserCircle className="text-emerald-500" /> Admin Profile
        </h1>
        <Link 
          to="/edit-profile"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <FaEdit /> Edit Profile
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Cover & Avatar */}
        <div className="h-32 bg-gradient-to-r from-emerald-600 to-cyan-600 relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-full bg-slate-900 border-4 border-slate-900 flex items-center justify-center text-4xl text-white font-bold shadow-lg overflow-hidden">
            {profile.profile_image ? (
              <img src={`http://localhost:8000${profile.profile_image}`} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              profile.name.charAt(0).toUpperCase()
            )}
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <h2 className="text-2xl font-bold text-white mb-1">{profile.name}</h2>
          <p className="text-emerald-400 font-medium mb-6 uppercase tracking-wider text-sm">Administrator</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                <FaEnvelope className="text-slate-500" />
                <span className="font-medium">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                <FaPhone className="text-slate-500" />
                <span className="font-medium">{profile.phone || 'Not provided'}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-800 h-full">
                <FaMapMarkerAlt className="text-slate-500 mt-1" />
                <div className="font-medium">
                  {profile.address ? (
                    <span>{profile.address}</span>
                  ) : (
                    <span className="text-slate-500 italic">No address provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
