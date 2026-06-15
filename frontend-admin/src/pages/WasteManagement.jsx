import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import { toast } from 'react-hot-toast';
import { FaTrash, FaBan, FaCheckCircle, FaExchangeAlt, FaRecycle } from 'react-icons/fa';

const WasteManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await adminService.getAllWasteItems();
      setItems(data);
    } catch (error) {
      toast.error('Failed to load waste items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('CRITICAL: Are you sure you want to completely delete this item from the platform? This cannot be undone.')) return;

    try {
      await adminService.deleteWasteItem(itemId);
      toast.success('Item deleted successfully');
      fetchItems();
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full text-xs font-medium"><FaCheckCircle /> Available</span>;
      case 'exchanged':
        return <span className="flex items-center gap-1 bg-purple-500/10 text-purple-400 px-2 py-1 rounded-full text-xs font-medium"><FaExchangeAlt /> Exchanged</span>;
      case 'recycled':
        return <span className="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full text-xs font-medium"><FaRecycle /> Recycled</span>;
      default:
        return <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-xs font-medium capitalize">{status}</span>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Waste Items Management</h1>
        <div className="bg-slate-800 px-4 py-2 rounded-lg text-sm text-slate-300">
          Total Items: <span className="font-bold text-emerald-400">{items.length}</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-slate-400 text-sm border-b border-slate-800">
                <th className="p-4 font-medium w-16">Image</th>
                <th className="p-4 font-medium">Item Details</th>
                <th className="p-4 font-medium">Owner</th>
                <th className="p-4 font-medium text-center">Category</th>
                <th className="p-4 font-medium text-center">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500">Loading waste items...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500">No waste items found.</td></tr>
              ) : (
                items.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      {item.image_url ? (
                        <img 
                          src={`http://localhost:8000${item.image_url}`} 
                          alt={item.title} 
                          className="w-12 h-12 rounded object-cover border border-slate-700"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-700">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-white font-medium mb-1 truncate max-w-[200px]" title={item.title}>
                        {item.title}
                      </div>
                      <div className="text-emerald-400 font-bold text-sm">
                        ₹{item.price}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="text-slate-200 font-medium">{item.owner_name}</div>
                          <div className="text-xs text-slate-500">{item.owner_email}</div>
                        </div>
                        {item.is_blocked === 1 && (
                          <span className="text-xs bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded ml-2 flex items-center gap-1" title="Owner is blocked">
                            <FaBan size={10}/> Banned
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        {getStatusBadge(item.status)}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Item permanently"
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

export default WasteManagement;
