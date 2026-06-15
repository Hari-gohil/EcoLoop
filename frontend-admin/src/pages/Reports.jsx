import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import { toast } from 'react-hot-toast';
import { FaFileDownload, FaUsers, FaExchangeAlt } from 'react-icons/fa';

const Reports = () => {
  const [data, setData] = useState({ userGrowth: [], exchangeGrowth: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await adminService.getAnalytics();
        setData({
          userGrowth: response.userGrowth,
          exchangeGrowth: response.exchangeGrowth
        });
      } catch (error) {
        toast.error('Failed to load reports data');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="text-emerald-500 text-center py-20">Loading Reports...</div>;
  }

  // Helper to merge data by month for a combined view
  const getMergedData = () => {
    const map = new Map();
    
    data.userGrowth.forEach(item => {
      map.set(item.month, { month: item.month, users: item.count, exchanges: 0 });
    });
    
    data.exchangeGrowth.forEach(item => {
      if (map.has(item.month)) {
        map.get(item.month).exchanges = item.count;
      } else {
        map.set(item.month, { month: item.month, users: 0, exchanges: item.count });
      }
    });

    return Array.from(map.values());
  };

  const mergedData = getMergedData();

  const handleDownload = () => {
    // Basic CSV download implementation
    let csvContent = "data:text/csv;charset=utf-8,Month,New Users,Completed Exchanges\n";
    mergedData.forEach(row => {
      csvContent += `${row.month},${row.users},${row.exchanges}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ecoloop_monthly_report.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Monthly Reports</h1>
        <button 
          onClick={handleDownload}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg"
        >
          <FaFileDownload /> Export CSV
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-slate-400 text-sm border-b border-slate-800">
                <th className="p-4 font-medium">Month</th>
                <th className="p-4 font-medium text-center">New User Registrations</th>
                <th className="p-4 font-medium text-center">Completed Exchanges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mergedData.length === 0 ? (
                <tr><td colSpan="3" className="p-8 text-center text-slate-500">No report data available.</td></tr>
              ) : (
                mergedData.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-white font-medium">
                      {row.month}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 text-blue-400 font-bold">
                        <FaUsers className="text-blue-500/50" /> {row.users}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold">
                        <FaExchangeAlt className="text-emerald-500/50" /> {row.exchanges}
                      </div>
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

export default Reports;
