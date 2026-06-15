import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import { FaUsers, FaBoxOpen, FaExchangeAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    counters: { totalUsers: 0, activeItems: 0, exchangedItems: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getAnalytics();
        setStats(data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-emerald-500 flex justify-center items-center min-h-[50vh]">Loading Dashboard...</div>;
  }

  const { counters } = stats;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stat Card 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-sm font-medium mb-1">Total Users</div>
            <div className="text-3xl font-bold text-white">{counters.totalUsers}</div>
          </div>
          <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-2xl">
            <FaUsers />
          </div>
        </div>
        
        {/* Stat Card 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-sm font-medium mb-1">Active Waste Items</div>
            <div className="text-3xl font-bold text-white">{counters.activeItems}</div>
          </div>
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-2xl">
            <FaBoxOpen />
          </div>
        </div>
        
        {/* Stat Card 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-sm font-medium mb-1">Total Exchanges Completed</div>
            <div className="text-3xl font-bold text-white">{counters.exchangedItems}</div>
          </div>
          <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 text-2xl">
            <FaExchangeAlt />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
